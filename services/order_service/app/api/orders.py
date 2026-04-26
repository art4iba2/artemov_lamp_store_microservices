import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.clients.product_client import get_product_for_order
from app.db.session import get_session
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate, OrderList, OrderRead

router = APIRouter(prefix="/api/orders", tags=["orders"])

@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
async def create_order(payload: OrderCreate, session: AsyncSession = Depends(get_session)):
    order = Order(email=str(payload.email), phone=payload.phone)

    for item in payload.items:
        product = await get_product_for_order(item.product_id)

        if item.quantity > product["stock"]:
            raise HTTPException(
                status_code=400,
                detail={
                    "code": "NOT_ENOUGH_STOCK",
                    "message": "Not enough product in stock",
                    "product_id": str(item.product_id),
                    "requested_quantity": item.quantity,
                    "available_quantity": product["stock"],
                },
            )

        order.items.append(
            OrderItem(
                product_id=item.product_id,
                quantity=item.quantity,
                price=product["price"],
            )
        )

    session.add(order)
    await session.commit()
    return await _get_order_or_404(order.id, session)

@router.get("/{order_id}", response_model=OrderRead)
async def get_order(order_id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    return await _get_order_or_404(order_id, session)

@router.get("", response_model=OrderList)
async def list_orders(session: AsyncSession = Depends(get_session), page: int = Query(1, ge=1),
                      page_size: int = Query(20, ge=1, le=100)):
    total = await session.scalar(select(func.count(Order.id)))
    result = await session.execute(select(Order).options(selectinload(Order.items))
        .order_by(Order.created_at.desc()).offset((page - 1) * page_size).limit(page_size))
    return OrderList(items=list(result.scalars().unique()), total=total or 0, page=page, page_size=page_size)

async def _get_order_or_404(order_id: uuid.UUID, session: AsyncSession) -> Order:
    result = await session.execute(select(Order).where(Order.id == order_id).options(selectinload(Order.items)))
    order = result.scalar_one_or_none()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
