import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.db.session import get_session
from app.models.product import Image, Product
from app.schemas.product import ProductCreate, ProductList, ProductRead, ProductUpdate

router = APIRouter(prefix="/api/products", tags=["products"])

@router.post("", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
async def create_product(payload: ProductCreate, session: AsyncSession = Depends(get_session)):
    data = payload.model_dump(exclude={"images"})
    product = Product(**data)
    product.images = [Image(url=image.url) for image in payload.images]
    session.add(product)
    await session.commit()
    return await _get_product_or_404(product.id, session)

@router.get("", response_model=ProductList)
async def list_products(session: AsyncSession = Depends(get_session), page: int = Query(1, ge=1),
                        page_size: int = Query(20, ge=1, le=100), q: str | None = None,
                        min_price: float | None = Query(None, ge=0), max_price: float | None = Query(None, ge=0),
                        include_archived: bool = False):
    filters = []
    if not include_archived:
        filters.append(Product.is_archived.is_(False))
    if q:
        filters.append(or_(Product.title.ilike(f"%{q}%"), Product.description.ilike(f"%{q}%")))
    if min_price is not None:
        filters.append(Product.price >= min_price)
    if max_price is not None:
        filters.append(Product.price <= max_price)
    total = await session.scalar(select(func.count(Product.id)).where(*filters))
    result = await session.execute(select(Product).where(*filters)
        .options(selectinload(Product.images), selectinload(Product.reviews))
        .order_by(Product.created_at.desc()).offset((page - 1) * page_size).limit(page_size))
    return ProductList(items=list(result.scalars().unique()), total=total or 0, page=page, page_size=page_size)

@router.get("/{product_id}", response_model=ProductRead)
async def get_product(product_id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    return await _get_product_or_404(product_id, session)

@router.patch("/{product_id}", response_model=ProductRead)
async def update_product(product_id: uuid.UUID, payload: ProductUpdate, session: AsyncSession = Depends(get_session)):
    product = await _get_product_or_404(product_id, session)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, key, value)
    await session.commit()
    return await _get_product_or_404(product_id, session)

@router.patch("/{product_id}/archive", response_model=ProductRead)
async def archive_product(product_id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    product = await _get_product_or_404(product_id, session)
    product.is_archived = True
    await session.commit()
    return await _get_product_or_404(product_id, session)

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(product_id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    product = await _get_product_or_404(product_id, session)
    await session.delete(product)
    await session.commit()

async def _get_product_or_404(product_id: uuid.UUID, session: AsyncSession) -> Product:
    result = await session.execute(select(Product).where(Product.id == product_id)
        .options(selectinload(Product.images), selectinload(Product.reviews)))
    product = result.scalar_one_or_none()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
