from fastapi import FastAPI
from app.api.orders import router as orders_router
from app.core.config import settings

app = FastAPI(title=settings.app_name, version="0.1.0")
app.include_router(orders_router)

@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok", "service": settings.app_name}
