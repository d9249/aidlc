from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./table_order.db"
    JWT_SECRET_KEY: str = "change-this-secret-key-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_HOURS: int = 16
    DEBUG: bool = False
    LOGIN_MAX_ATTEMPTS: int = 3
    LOGIN_LOCKOUT_MINUTES: int = 5
    BCRYPT_ROUNDS: int = 12
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10
    CORS_ORIGINS: str = "*"

    model_config = {"env_file": ".env"}


settings = Settings()
