import logging

logger = logging.getLogger(__name__)

# Load the model lazily
_embedding_model = None

def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        logger.info("Loading sentence-transformers model 'all-MiniLM-L6-v2'...")
        from sentence_transformers import SentenceTransformer
        _embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    return _embedding_model

def get_embedding(text: str):
    """
    Returns a dense vector embedding for the input text.
    """
    model = get_embedding_model()
    return model.encode(text, convert_to_numpy=True)
