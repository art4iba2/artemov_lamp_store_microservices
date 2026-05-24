from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Product Service"
    database_url: str
    frontend_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    admin_username: str = "admin"
    admin_password: str = "admin123"
    jwt_secret_key: str = "change-me-in-production"
    jwt_expires_minutes: int = 120

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
