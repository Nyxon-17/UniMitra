import io
import logging
import re
import unicodedata
from typing import Any, Dict, List, Tuple
from app.services.embedding_service import normalize_assamese_unicode

logger = logging.getLogger("unimitra.document_parser")

CLAUSE_REGEX = re.compile(
    r"(?:clause|section|rule|article|অধ্যায়|অনুচ্ছেদ|বিধি|দফা)\s*[:.-]?\s*([0-9]+(?:\.[0-9]+)*)",
    re.IGNORECASE,
)


def extract_clause_reference(text: str, fallback_page: int) -> str:
    """Extract statutory clause/section identifier from text chunk if present."""
    match = CLAUSE_REGEX.search(text)
    if match:
        return match.group(0).strip()
    return f"Page {fallback_page} Regulation"


class DocumentParser:
    @staticmethod
    def parse_pdf(file_bytes: bytes) -> Tuple[List[Dict[str, Any]], bool]:
        """
        Extracts pages, text, and tables from PDF bytes.
        Prioritizes pymupdf (PyMuPDF) for high-fidelity text and native table extraction
        (topper lists, results, rankings), with resilient fallbacks to pdfplumber, pypdfium2, and PyPDF2.
        Returns: (list_of_pages, is_scanned_flag)
        """
        pages = []
        is_scanned = True
        total_chars = 0

        # Method 1: PyMuPDF (pymupdf) - high-performance standard in virtualenv with native table support
        try:
            import pymupdf
            doc = pymupdf.open(stream=file_bytes, filetype="pdf")
            pages = []
            total_chars = 0
            for page_idx in range(len(doc)):
                page = doc[page_idx]
                raw_text = page.get_text("text") or ""

                # Extract tables (e.g. topper lists, rank tables, student results)
                try:
                    tabs = page.find_tables()
                    table_blocks = []
                    for tab in tabs:
                        extracted = tab.extract()
                        rows = []
                        for r in extracted:
                            cells = [str(c or "").strip() for c in r if c is not None]
                            if any(cells):
                                rows.append(" | ".join(cells))
                        if rows:
                            table_blocks.append("\n".join(rows))
                    if table_blocks:
                        raw_text += "\n\n[Structured Table / Merit Data]:\n" + "\n\n".join(table_blocks)
                except Exception as te:
                    logger.debug(f"PyMuPDF table extraction notice: {te}")

                cleaned_text = normalize_assamese_unicode(raw_text)
                char_count = len(cleaned_text.strip())
                total_chars += char_count

                pages.append({
                    "page_number": page_idx + 1,
                    "text": cleaned_text,
                    "char_count": char_count,
                })
            doc.close()

            if len(pages) > 0 and (total_chars / len(pages)) > 50:
                is_scanned = False
            if pages and total_chars > 0:
                logger.info(f"PyMuPDF parsed {len(pages)} pages ({total_chars} chars, scanned={is_scanned})")
                return pages, is_scanned
        except Exception as e:
            logger.debug(f"PyMuPDF parser notice: {e}. Attempting fallback parsers.")

        # Method 2: pdfplumber fallback (if installed)
        if not pages or total_chars == 0:
            try:
                import pdfplumber
                with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                    pages = []
                    total_chars = 0
                    for page_idx, page in enumerate(pdf.pages):
                        raw_text = page.extract_text() or ""
                        try:
                            tables = page.extract_tables() or []
                            table_blocks = []
                            for tbl in tables:
                                rows = []
                                for r in tbl:
                                    cells = [str(c or "").strip() for c in r if c is not None]
                                    if any(cells):
                                        rows.append(" | ".join(cells))
                                if rows:
                                    table_blocks.append("\n".join(rows))
                            if table_blocks:
                                raw_text += "\n\n[Structured Table / Merit Data]:\n" + "\n\n".join(table_blocks)
                        except Exception as te:
                            logger.debug(f"Table extraction notice: {te}")

                        cleaned_text = normalize_assamese_unicode(raw_text)
                        char_count = len(cleaned_text.strip())
                        total_chars += char_count

                        pages.append({
                            "page_number": page_idx + 1,
                            "text": cleaned_text,
                            "char_count": char_count,
                        })

                    if len(pages) > 0 and (total_chars / len(pages)) > 50:
                        is_scanned = False
                    if pages and total_chars > 0:
                        logger.info(f"pdfplumber parsed {len(pages)} pages ({total_chars} chars, scanned={is_scanned})")
                        return pages, is_scanned
            except Exception as e:
                logger.debug(f"pdfplumber parser notice: {e}")

        # Method 3: pypdfium2 fallback
        if not pages or total_chars == 0:
            try:
                import pypdfium2
                doc = pypdfium2.PdfDocument(file_bytes)
                pages = []
                total_chars = 0
                for page_idx in range(len(doc)):
                    page = doc[page_idx]
                    textpage = page.get_textpage()
                    raw_text = textpage.get_text_range() or ""
                    cleaned_text = normalize_assamese_unicode(raw_text)
                    char_count = len(cleaned_text.strip())
                    total_chars += char_count

                    pages.append({
                        "page_number": page_idx + 1,
                        "text": cleaned_text,
                        "char_count": char_count,
                    })
                if len(pages) > 0 and (total_chars / len(pages)) > 50:
                    is_scanned = False
                if pages and total_chars > 0:
                    logger.info(f"pypdfium2 parsed {len(pages)} pages ({total_chars} chars, scanned={is_scanned})")
                    return pages, is_scanned
            except Exception as e:
                logger.debug(f"pypdfium2 parser notice: {e}")

        # Method 4: PyPDF2 fallback
        if not pages or total_chars == 0:
            try:
                import PyPDF2
                reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
                pages = []
                total_chars = 0
                for page_idx, page in enumerate(reader.pages):
                    raw_text = page.extract_text() or ""
                    cleaned_text = normalize_assamese_unicode(raw_text)
                    char_count = len(cleaned_text.strip())
                    total_chars += char_count

                    pages.append({
                        "page_number": page_idx + 1,
                        "text": cleaned_text,
                        "char_count": char_count,
                    })
                if len(pages) > 0 and (total_chars / len(pages)) > 50:
                    is_scanned = False
                if pages and total_chars > 0:
                    logger.info(f"PyPDF2 parsed {len(pages)} pages ({total_chars} chars, scanned={is_scanned})")
                    return pages, is_scanned
            except Exception as e:
                logger.debug(f"PyPDF2 parser notice: {e}")

        return pages, is_scanned

    @staticmethod
    def chunk_document(
        pages: List[Dict[str, Any]],
        target_chunk_size: int = 512,
        chunk_overlap: int = 64,
    ) -> List[Dict[str, Any]]:
        """
        Chunks pages into overlapping statutory chunks (512 tokens with 64-token overlap).
        Attaches page number and extracted clause identifier.
        """
        chunks = []
        chunk_index = 0

        for page in pages:
            page_num = page["page_number"]
            page_text = page["text"].strip()
            if not page_text:
                continue

            # Split by double newlines or clause boundaries
            paragraphs = [p.strip() for p in re.split(r"\n\s*\n", page_text) if p.strip()]

            current_chunk = ""
            current_clause = None

            for p in paragraphs:
                if not current_clause:
                    current_clause = extract_clause_reference(p, page_num)

                candidate = f"{current_chunk}\n\n{p}" if current_chunk else p
                approx_tokens = len(candidate.split())

                if approx_tokens <= target_chunk_size:
                    current_chunk = candidate
                else:
                    if current_chunk:
                        clause_ref = extract_clause_reference(current_chunk, page_num)
                        chunks.append({
                            "chunk_index": chunk_index,
                            "page_number": page_num,
                            "clause_reference": clause_ref,
                            "content": current_chunk.strip(),
                            "token_count": len(current_chunk.split()),
                            "language": "as" if re.search(r"[\u0980-\u09FF]", current_chunk) else "en",
                        })
                        chunk_index += 1

                    # Seed new chunk with overlap from previous
                    overlap_words = current_chunk.split()[-chunk_overlap:] if current_chunk else []
                    current_chunk = " ".join(overlap_words) + f"\n\n{p}" if overlap_words else p
                    current_clause = extract_clause_reference(p, page_num)

            # Flush remaining chunk on this page
            if current_chunk.strip():
                clause_ref = extract_clause_reference(current_chunk, page_num)
                chunks.append({
                    "chunk_index": chunk_index,
                    "page_number": page_num,
                    "clause_reference": clause_ref,
                    "content": current_chunk.strip(),
                    "token_count": len(current_chunk.split()),
                    "language": "as" if re.search(r"[\u0980-\u09FF]", current_chunk) else "en",
                })
                chunk_index += 1

        return chunks


document_parser = DocumentParser()
