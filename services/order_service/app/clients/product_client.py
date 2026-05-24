import uuid
from decimal import Decimal
from typing import Any

import httpx
from fastapi import HTTPException

from app.core.config import settings
from app.core.security import create_access_token


def _service_headers() -> dict[str, str]:
    return {"Authorization": f"Bearer {create_access_token('order-service')}"}


async def _request_product_service(
    method: str,
    path: str,
    *,
    json: dict[str, Any] | None = None,
) -> dict[str, Any]:
    url = f"{settings.product_service_url}{path}"

    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.request(
            method,
            url,
            json=json,
            headers=_service_headers(),
        )

    if response.status_code in {400, 404}:
        detail = response.json().get("detail", response.text)
        raise HTTPException(status_code=400, detail=detail)

    try:
        response.raise_for_status()
    except httpx.HTTPStatusError:
        raise HTTPException(
            status_code=502,
            detail={
                "code": "PRODUCT_SERVICE_ERROR",
                "message": "Product service is unavailable or returned an error",
            },
        )

    return response.json()


async def get_product_for_order(product_id: uuid.UUID) -> dict[str, Any]:
    data = await _request_product_service("GET", f"/api/products/{product_id}")

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


async def decrease_product_stock(product_id: uuid.UUID, quantity: int) -> dict[str, Any]:
    data = await _request_product_service(
        "PATCH",
        f"/api/products/{product_id}/stock/decrease",
        json={"quantity": quantity},
    )

    return {
        "id": product_id,
        "price": Decimal(str(data["price"])),
        "stock": int(data.get("stock", 0)),
    }


async def increase_product_stock(product_id: uuid.UUID, quantity: int) -> None:
    await _request_product_service(
        "PATCH",
        f"/api/products/{product_id}/stock/increase",
        json={"quantity": quantity},
    )
