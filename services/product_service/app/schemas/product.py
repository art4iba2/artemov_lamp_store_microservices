import uuid
from datetime import date, datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field

class DictionaryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
class DictionaryRead(DictionaryCreate):
    id: uuid.UUID
    model_config = ConfigDict(from_attributes=True)

class ImageCreate(BaseModel):
    url: str
class ImageRead(ImageCreate):
    id: uuid.UUID
    product_id: uuid.UUID
    model_config = ConfigDict(from_attributes=True)
class ReviewRead(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    author_name: str
    rating: int
    text: str | None = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ProductBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    price: Decimal = Field(ge=0)
    brightness: int | None = Field(default=None, ge=0)
    stock: int = Field(default=0, ge=0)
    is_archived: bool = False
    expected_arrival: date | None = None
    category_id: uuid.UUID | None = None
    type_id: uuid.UUID | None = None
    shape_id: uuid.UUID | None = None
    base_id: uuid.UUID | None = None
    supplier_id: uuid.UUID | None = None

class ProductCreate(ProductBase):
    images: list[ImageCreate] = []
class ProductUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    price: Decimal | None = Field(default=None, ge=0)
    brightness: int | None = Field(default=None, ge=0)
    stock: int | None = Field(default=None, ge=0)
    is_archived: bool | None = None
    expected_arrival: date | None = None
    category_id: uuid.UUID | None = None
    type_id: uuid.UUID | None = None
    shape_id: uuid.UUID | None = None
    base_id: uuid.UUID | None = None
    supplier_id: uuid.UUID | None = None

class ProductRead(ProductBase):
    id: uuid.UUID
    created_at: datetime
    images: list[ImageRead] = []
    reviews: list[ReviewRead] = []
    model_config = ConfigDict(from_attributes=True)
class ProductList(BaseModel):
    items: list[ProductRead]
    total: int
    page: int
    page_size: int
