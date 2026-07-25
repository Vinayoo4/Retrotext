import os
import faiss
import numpy as np
import httpx
import json
from typing import List, Dict, Any, Tuple
from app.config.settings import settings

class KnowledgeStore:
    def __init__(self):
        self.index_path = settings.INDEX_PATH
        self.metadata_path = os.path.join(settings.DATA_DIR, "db", "faiss_meta.json")
        self.dimension = 768  # nomic-embed-text typical dimension, adjust based on actual model
        self.index = None
        self.metadata: List[Dict[str, Any]] = []
        self.load_index()

    def load_index(self):
        if os.path.exists(self.index_path):
            self.index = faiss.read_index(self.index_path)
            if os.path.exists(self.metadata_path):
                with open(self.metadata_path, 'r', encoding='utf-8') as f:
                    self.metadata = json.load(f)
        else:
            self.index = faiss.IndexFlatL2(self.dimension)
            self.metadata = []

    def save_index(self):
        faiss.write_index(self.index, self.index_path)
        with open(self.metadata_path, 'w', encoding='utf-8') as f:
            json.dump(self.metadata, f)

    def get_embedding(self, text: str) -> np.ndarray:
        try:
            response = httpx.post(
                settings.EMBEDDING_API_BASE,
                json={"model": settings.EMBEDDING_MODEL, "prompt": text},
                timeout=10.0
            )
            response.raise_for_status()
            data = response.json()
            embedding = data.get("embedding", [])
            if not embedding:
                raise Exception("No embedding returned")
            return np.array(embedding, dtype=np.float32)
        except Exception as e:
            # Raise exception instead of silently breaking semantic search with random vectors
            raise Exception(f"Failed to generate embedding from provider ({settings.EMBEDDING_API_BASE}): {str(e)}")

    def add_texts(self, texts: List[str], metadatas: List[Dict[str, Any]]):
        embeddings = []
        for text in texts:
            emb = self.get_embedding(text)
            embeddings.append(emb)

        if not embeddings:
            return

        emb_matrix = np.vstack(embeddings)
        self.index.add(emb_matrix)
        self.metadata.extend(metadatas)
        self.save_index()

    def search(self, query: str, k: int = 5) -> List[Tuple[float, Dict[str, Any]]]:
        if self.index.ntotal == 0:
            return []

        query_emb = self.get_embedding(query).reshape(1, -1)
        distances, indices = self.index.search(query_emb, k)

        results = []
        for i, idx in enumerate(indices[0]):
            if idx != -1 and idx < len(self.metadata):
                results.append((float(distances[0][i]), self.metadata[idx]))

        return results

store = KnowledgeStore()
