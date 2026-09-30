from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration from environment variables."""

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@db:5432/weigh2go"
    
    # Security
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173"]
    
    # App
    DEBUG: bool = True
    
    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()