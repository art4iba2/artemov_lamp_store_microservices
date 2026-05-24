from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, status

from app.core.config import settings
from app.core.security import create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginPayload(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginPayload):
    if (
        payload.username != settings.admin_username
        or payload.password != settings.admin_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    return TokenResponse(
        access_token=create_access_token(payload.username, role="admin"),
    )
