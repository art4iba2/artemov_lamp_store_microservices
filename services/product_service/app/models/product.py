import uuid
from datetime import date, datetime
from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class DictionaryBase:
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), unique=True, index=True)

class Category(DictionaryBase, Base): __tablename__ = "categories"
class LampType(DictionaryBase, Base): __tablename__ = "lamp_types"
class Shape(DictionaryBase, Base): __tablename__ = "shapes"
class BaseType(DictionaryBase, Base): __tablename__ = "base_types"
class Supplier(DictionaryBase, Base): __tablename__ = "suppliers"

class Product(Base):
    __tablename__ = "products"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), index=True)
    description: Mapped[str | None] = mapped_column(Text)
    price: Mapped[float] = mapped_column(Numeric(10, 2))
    brightness: Mapped[int | None] = mapped_column(Integer)
    stock: Mapped[int] = mapped_column(Integer, default=0)
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    expected_arrival: Mapped[date | None] = mapped_column(Date)
    category_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("categories.id"))
    type_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("lamp_types.id"))
    shape_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("shapes.id"))
    base_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("base_types.id"))
    supplier_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("suppliers.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    images: Mapped[list["Image"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    reviews: Mapped[list["Review"]] = relationship(back_populates="product", cascade="all, delete-orphan")

class Image(Base):
    __tablename__ = "images"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), index=True)
    url: Mapped[str] = mapped_column(String(1000))
    product: Mapped[Product] = relationship(back_populates="images")

class Promotion(Base):
    __tablename__ = "promotions"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    starts_at: Mapped[date | None] = mapped_column(Date)
    ends_at: Mapped[date | None] = mapped_column(Date)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

class Review(Base):
    __tablename__ = "reviews"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), index=True)
    author_name: Mapped[str] = mapped_column(String(255))
    rating: Mapped[int] = mapped_column(Integer)
    text: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    product: Mapped[Product] = relationship(back_populates="reviews")
