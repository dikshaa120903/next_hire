import numpy as np
import logging
from utils.embedding import get_embedding

logger = logging.getLogger(__name__)

class FaissJobIndex:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(FaissJobIndex, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self.index = None
        self.job_data = [] # Maps index to job dict
        self.dimension = 384  # MiniLM-L6-v2 dimension
        self._initialized = True

    def build_index(self, jobs_catalog: list):
        """Builds the FAISS index from a list of job dicts."""
        if not jobs_catalog:
            return
        
        import faiss
        
        logger.info(f"Building FAISS index for {len(jobs_catalog)} jobs...")
        self.job_data = []
        embeddings = []
        
        for job in jobs_catalog:
            # We encode the description and required skills
            skills_str = " ".join(job.get("required_skills", []))
            text_to_encode = f"{job['title']} {job['description']} {skills_str}"
            emb = get_embedding(text_to_encode)
            embeddings.append(emb)
            self.job_data.append(job)
        
        embeddings_matrix = np.vstack(embeddings).astype('float32')
        # Normalize for cosine similarity simulation with L2
        faiss.normalize_L2(embeddings_matrix)

        self.index = faiss.IndexFlatIP(self.dimension) # Inner Product on normalized vectors = Cosine Sim
        self.index.add(embeddings_matrix)
        logger.info("FAISS index built successfully.")

    def search(self, query_text: str, top_k: int = 5):
        """Searches the index for the query text and returns matching jobs with distances."""
        if self.index is None or self.index.ntotal == 0:
            logger.warning("FAISS index is empty or not built.")
            return []
            
        import faiss
            
        emb = get_embedding(query_text)
        emb_matrix = np.array([emb]).astype('float32')
        faiss.normalize_L2(emb_matrix)
        
        distances, indices = self.index.search(emb_matrix, top_k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx == -1: # FAISS returns -1 if there aren't enough items
                continue
            # distances from IndexFlatIP are similarities (Cosine if L2 normalized)
            # Clip between 0 and 1 just in case of float imprecision
            score = float(distances[0][i])
            score = max(0.0, min(1.0, score))
            
            results.append({
                "job": self.job_data[idx],
                "score": score
            })
            
        return results

# Singleton instance
job_index = FaissJobIndex()
