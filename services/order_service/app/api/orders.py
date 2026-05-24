import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.clients.product_client import decrease_product_stock, increase_product_stock
from app.core.security import require_admin_or_service
from app.db.session import get_session
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate, OrderList, OrderRead, OrderStatusUpdate

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
async def create_order(
    payload: OrderCreate,
    session: AsyncSession = Depends(get_session),
):
    order = Order(email=str(payload.email), phone=payload.phone)
    decreased_items: list[tuple[uuid.UUID, int]] = []

    try:
        for item in payload.items:
            product = await decrease_product_stock(item.product_id, item.quantity)
            decreased_items.append((item.product_id, item.quantity))

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

    except Exception:
        await session.rollback()

        for product_id, quantity in reversed(decreased_items):
            try:
                await increase_product_stock(product_id, quantity)
            except HTTPException:
                pass

        raise


@router.get(
    "/{order_id}",
    response_model=OrderRead,
    dependencies=[Depends(require_admin_or_service)],
)
async def get_order(
    order_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
):
    return await _get_order_or_404(order_id, session)


@router.get(
    "",
    response_model=OrderList,
    dependencies=[Depends(require_admin_or_service)],
)
async def list_orders(
    session: AsyncSession = Depends(get_session),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    total = await session.scalar(select(func.count(Order.id)))
    result = await session.execute(
        select(Order)
        .options(selectinload(Order.items))
        .order_by(Order.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )

    return OrderList(
        items=list(result.scalars().unique()),
        total=total or 0,
        page=page,
        page_size=page_size,
    )


@router.patch(
    "/{order_id}/status",
    response_model=OrderRead,
    dependencies=[Depends(require_admin_or_service)],
)
async def update_order_status(
    order_id: uuid.UUID,
    payload: OrderStatusUpdate,
    session: AsyncSession = Depends(get_session),
):
    order = await _get_order_or_404(order_id, session)
    order.status = payload.status
    await session.commit()
    return await _get_order_or_404(order_id, session)


async def _get_order_or_404(
    order_id: uuid.UUID,
    session: AsyncSession,
) -> Order:
    result = await session.execute(
        select(Order)
        .where(Order.id == order_id)
        .options(selectinload(Order.items))
    )
    order = result.scalar_one_or_none()

    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")

    return order
