from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.dictionaries import router as dictionaries_router
from app.api.products import router as products_router
from app.core.config import settings

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

app.include_router(auth_router)
app.include_router(products_router)
app.include_router(dictionaries_router)


@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok", "service": settings.app_name}
