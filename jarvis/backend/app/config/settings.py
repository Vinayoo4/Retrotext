import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "SALTEDHASH JARVIS Core"
    APP_VERSION: str = "1.0.0"

    # Model configuration
    # Default to local Ollama compatible endpoint
    LLM_API_BASE: str = os.getenv("LLM_API_BASE", "http://localhost:11434/v1")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "local")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "llama3")

    EMBEDDING_API_BASE: str = os.getenv("EMBEDDING_API_BASE", "http://localhost:11434/api/embeddings")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "nomic-embed-text")

    # Database and Data directories
    DATA_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
    DB_PATH: str = os.path.join(DATA_DIR, "db", "jarvis.sqlite")
    KNOWLEDGE_DIR: str = os.path.join(DATA_DIR, "knowledge")
    INDEX_PATH: str = os.path.join(DATA_DIR, "db", "faiss.index")

    # Security
    ALLOWED_TOOL_PATHS: list[str] = [
        os.path.abspath(os.path.join(DATA_DIR, "seeds")),
        os.path.abspath(KNOWLEDGE_DIR),
        os.path.abspath("/tmp/jarvis_sandbox")
    ]
    REQUIRE_CONFIRMATION_FOR_DESTRUCTIVE: bool = True

    class Config:
        env_file = ".env"

settings = Settings()

# Ensure directories exist
os.makedirs(os.path.join(settings.DATA_DIR, "db"), exist_ok=True)
os.makedirs(settings.KNOWLEDGE_DIR, exist_ok=True)
os.makedirs(os.path.join(settings.DATA_DIR, "logs"), exist_ok=True)
os.makedirs(os.path.join(settings.DATA_DIR, "seeds"), exist_ok=True)
os.makedirs("/tmp/jarvis_sandbox", exist_ok=True)
