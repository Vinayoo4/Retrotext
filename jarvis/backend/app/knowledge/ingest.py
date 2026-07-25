import os
import hashlib
import time
from typing import List, Dict, Any
import fitz  # PyMuPDF
from app.knowledge.store import store
from app.memory.database import get_connection, log_audit

def compute_checksum(file_path: str) -> str:
    sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        for block in iter(lambda: f.read(65536), b""):
            sha256.update(block)
    return sha256.hexdigest()

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    chunks = []
    start = 0
    text_len = len(text)
    while start < text_len:
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks

def extract_text_from_pdf(file_path: str) -> str:
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def ingest_file(file_path: str) -> Dict[str, Any]:
    if not os.path.exists(file_path):
        return {"status": "error", "message": f"File not found: {file_path}"}

    try:
        checksum = compute_checksum(file_path)

        # Check if already ingested
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM knowledge_metadata WHERE checksum = ?", (checksum,))
        row = cursor.fetchone()

        if row:
            conn.close()
            return {"status": "info", "message": "File already ingested", "file_path": file_path}

        ext = file_path.lower().split('.')[-1]
        text = ""

        if ext in ['txt', 'md', 'py', 'json', 'ts', 'js']:
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()
        elif ext == 'pdf':
            text = extract_text_from_pdf(file_path)
        else:
            conn.close()
            return {"status": "error", "message": f"Unsupported file type: {ext}"}

        chunks = chunk_text(text)

        # Prepare metadata and vectors
        metadatas = [
            {"file_path": file_path, "chunk_index": i, "text": chunk}
            for i, chunk in enumerate(chunks)
        ]

        store.add_texts(chunks, metadatas)

        import uuid
        meta_id = str(uuid.uuid4())
        cursor.execute(
            "INSERT INTO knowledge_metadata (id, file_path, file_type, checksum, chunk_count, ingest_time, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (meta_id, file_path, ext, checksum, len(chunks), time.time(), "completed")
        )
        conn.commit()
        conn.close()

        log_audit("ingest_knowledge", {"file_path": file_path, "chunks": len(chunks)})

        return {"status": "success", "message": f"Ingested {len(chunks)} chunks from {file_path}"}

    except Exception as e:
        log_audit("ingest_knowledge", {"file_path": file_path}, status="error", error=str(e))
        return {"status": "error", "message": str(e)}
