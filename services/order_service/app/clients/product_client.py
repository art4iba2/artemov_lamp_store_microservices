import uuid
from decimal import Decimal
import httpx
from fastapi import HTTPException
from app.core.config import settings


async def get_product_for_order(product_id: uuid.UUID) -> dict:
    url = f"{settings.product_service_url}/api/products/{product_id}"

    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.get(url)

    if response.status_code == 404:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "PRODUCT_NOT_FOUND",
                "message": "Product not found",
                "product_id": str(product_id),
            },
        )

    try:
        response.raise_for_status()
    except httpx.HTTPStatusError:
        raise HTTPException(
            status_code=502,
            detail={
                "code": "PRODUCT_SERVICE_ERROR",
                "message": "Product service is unavailable or returned an error",
                "product_id": str(product_id),
            },
        )

    data = response.json()

    if data.get("is_archived"):
        raise HTTPException(
            status_code=400,
            detail={
                "code": "PRODUCT_ARCHIVED",
                "message": "Product is archived",
                "product_id": str(product_id),
            },
        )

    return {
        "id": product_id,
        "price": Decimal(str(data["price"])),
        "stock": int(data.get("stock", 0)),
    }