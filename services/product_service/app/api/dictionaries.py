from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_session
from app.models.product import BaseType, Category, LampType, Shape, Supplier
from app.schemas.product import DictionaryCreate, DictionaryRead

router = APIRouter(prefix="/api", tags=["dictionaries"])
MODELS = {"categories": Category, "lamp-types": LampType, "shapes": Shape, "base-types": BaseType, "suppliers": Supplier}

def _model(name: str):
    model = MODELS.get(name)
    if model is None:
        raise HTTPException(status_code=404, detail="Dictionary not found")
    return model

@router.post("/{dictionary_name}", response_model=DictionaryRead, status_code=status.HTTP_201_CREATED)
async def create_dictionary_item(dictionary_name: str, payload: DictionaryCreate, session: AsyncSession = Depends(get_session)):
    item = _model(dictionary_name)(name=payload.name)
    session.add(item)
    await session.commit()
    await session.refresh(item)
    return item

@router.get("/{dictionary_name}", response_model=list[DictionaryRead])
async def list_dictionary_items(dictionary_name: str, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(_model(dictionary_name)).order_by(_model(dictionary_name).name))
    return list(result.scalars())
