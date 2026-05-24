from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "Order Service"
    database_url: str
    product_service_url: str = "http://localhost:8001"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
