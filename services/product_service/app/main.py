from fastapi import FastAPI
from app.api.dictionaries import router as dictionaries_router
from app.api.products import router as products_router
from app.core.config import settings

app = FastAPI(title=settings.app_name, version="0.1.0")
app.include_router(products_router)
app.include_router(dictionaries_router)

@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok", "service": settings.app_name}
