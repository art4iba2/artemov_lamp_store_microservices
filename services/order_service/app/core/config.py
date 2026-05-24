from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Order Service"
    database_url: str
    product_service_url: str = "http://localhost:8001"
    frontend_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    jwt_secret_key: str = "change-me-in-production"
    jwt_expires_minutes: int = 120

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
