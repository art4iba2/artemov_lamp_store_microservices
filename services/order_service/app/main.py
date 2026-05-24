from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.orders import router as orders_router
from app.core.config import settings
from app.db.session import engine

app = FastAPI(title=settings.app_name, version="0.1.0")

origins = [
    origin.strip()
    for origin in settings.frontend_origins.split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(orders_router)


@app.on_event("startup")
async def ensure_order_status_column():
    async with engine.begin() as connection:
        await connection.execute(
            text(
                "ALTER TABLE IF EXISTS orders "
                "ADD COLUMN IF NOT EXISTS status VARCHAR(30) NOT NULL DEFAULT 'new'"
            )
        )


@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok", "service": settings.app_name}
