import logging
import re
from typing import Any, Dict, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
from app.config import settings

logger = logging.getLogger("unimitra.database")


def parse_connection_params(url: str) -> Optional[Dict[str, Any]]:
    """
    Parses PostgreSQL connection URL handling special characters (like @ or !) in passwords.
    """
    if not url:
        return None
    # Matches: postgresql://[user]:[password]@[host]:[port]/[database]
    # Uses greedy matching for password up to the last @ before host
    pattern = r"^postgres(?:ql)?://([^:]+):(.*)@([^@/:]+)(?::(\d+))?/([^?]+)"
    match = re.match(pattern, url.strip())
    if match:
        user = match.group(1)
        pwd = match.group(2)
        host = match.group(3)
        port = int(match.group(4) or 5432)
        dbname = match.group(5)
        return {
            "user": user,
            "password": pwd,
            "host": host,
            "port": port,
            "dbname": dbname,
        }
    return None


def get_db_connection():
    """
    Returns a live psycopg2 connection to Supabase PostgreSQL.
    Tries DIRECT_URL first, then DATABASE_URL pooler.
    """
    urls_to_try = [settings.DIRECT_URL, settings.DATABASE_URL]

    for url in urls_to_try:
        if not url:
            continue
        params = parse_connection_params(url)
        if params:
            try:
                conn = psycopg2.connect(
                    user=params["user"],
                    password=params["password"],
                    host=params["host"],
                    port=params["port"],
                    dbname=params["dbname"],
                    connect_timeout=8,
                    sslmode="require",
                )
                conn.autocommit = True
                return conn
            except Exception as e:
                logger.warning(f"Connection attempt to {params.get('host')} notice: {e}")

    # Fallback to direct raw connection string
    fallback_url = re.sub(r"\?pgbouncer=true.*", "", settings.DIRECT_URL or settings.DATABASE_URL)
    conn = psycopg2.connect(fallback_url, connect_timeout=8)
    conn.autocommit = True
    return conn


def execute_query(sql: str, params: Optional[tuple] = None) -> List[Dict[str, Any]]:
    """Execute read query and return list of dictionary records."""
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(sql, params or ())
            records = cur.fetchall()
            return [dict(r) for r in records]
    except Exception as err:
        logger.error(f"Database execute_query error: {err}")
        return []
    finally:
        if conn:
            conn.close()


def execute_mutation(sql: str, params: Optional[tuple] = None) -> bool:
    """Execute an INSERT/UPDATE/DELETE mutation."""
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute(sql, params or ())
        return True
    except Exception as err:
        logger.error(f"Database execute_mutation error: {err}")
        return False
    finally:
        if conn:
            conn.close()
