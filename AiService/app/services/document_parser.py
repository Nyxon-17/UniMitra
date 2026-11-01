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
        Extracts pages and text using PyMuPDF (fitz).
        Detects if document is a scanned image-only PDF.
        Returns: (list_of_pages, ocr_needed_flag)
        """
        try:
            import fitz  # PyMuPDF
        except ImportError:
            logger.error("PyMuPDF (fitz) is not installed.")
            return [], False

        pages = []
        is_scanned = True
        total_chars = 0

        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page_idx in range(len(doc)):
                page = doc[page_idx]
                raw_text = page.get_text("text") or ""
                cleaned_text = normalize_assamese_unicode(raw_text)

                char_count = len(cleaned_text.strip())
                total_chars += char_count

                pages.append({
                    "page_number": page_idx + 1,
                    "text": cleaned_text,
                    "char_count": char_count,
                })

            # If average chars per page is > 60, document has native text layer
            if pages and (total_chars / len(pages)) > 60:
                is_scanned = False

            doc.close()
            return pages, is_scanned
        except Exception as e:
            logger.error(f"Error reading PDF with PyMuPDF: {e}")
            return [], False

    @classmethod
    def chunk_document(
        cls,
        pages: List[Dict[str, Any]],
        chunk_size: int = 400,
        chunk_overlap: int = 50,
    ) -> List[Dict[str, Any]]:
        """
        Splits extracted pages into statutory chunks with metadata.
        Preserves page numbers, clause references, and Assamese Unicode integrity.
        """
        chunks = []
        chunk_index = 0

        for page in pages:
            page_num = page["page_number"]
            page_text = page["text"].strip()
            if not page_text:
                continue

            # Split by double newlines or paragraph breaks
            paragraphs = [p.strip() for p in page_text.split("\n\n") if p.strip()]
            current_chunk = []
            current_len = 0

            for para in paragraphs:
                words = para.split()
                if not words:
                    continue

                if current_len + len(words) <= chunk_size:
                    current_chunk.append(para)
                    current_len += len(words)
                else:
                    if current_chunk:
                        chunk_content = "\n\n".join(current_chunk)
                        clause_ref = extract_clause_reference(chunk_content, page_num)
                        chunks.append({
                            "chunk_index": chunk_index,
                            "page_number": page_num,
                            "clause_reference": clause_ref,
                            "content": chunk_content,
                            "token_count": current_len,
                        })
                        chunk_index += 1

                    # Start next chunk with overlap
                    current_chunk = [para]
                    current_len = len(words)

            if current_chunk:
                chunk_content = "\n\n".join(current_chunk)
                clause_ref = extract_clause_reference(chunk_content, page_num)
                chunks.append({
                    "chunk_index": chunk_index,
                    "page_number": page_num,
                    "clause_reference": clause_ref,
                    "content": chunk_content,
                    "token_count": current_len,
                })
                chunk_index += 1

        return chunks


document_parser = DocumentParser()

