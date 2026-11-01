from fastapi import Header, HTTPException, status
from app.config import settings


async def verify_internal_secret(
    x_internal_secret: str = Header(None, alias="X-Internal-Secret")
):
    """
    Validates service-to-service authentication header.
    Rejects requests missing or having mismatched secret keys.
    """
    if not x_internal_secret or x_internal_secret.strip() != settings.AI_SERVICE_SECRET.strip():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "code": "UNAUTHORIZED_SERVICE",
                "message": "Invalid or missing X-Internal-Secret authorization header.",
            },
        )
    return True

