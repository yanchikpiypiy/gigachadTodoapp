import os
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.db import models
from app.schemas.Users import UsersDTO,Token
from app.db.connection import get_db, SessionLocal
from app.core.config import settings
from typing import Annotated
router = APIRouter(
    prefix='/auth',
    tags=['auth']
)
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = 'HS256'
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
auth_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")

def populate_db():
    with SessionLocal() as session:
        password = bcrypt_context.hash("admin")
        new_obj = models.Users(email="yanchik@gmail.com", username="admin", password=password)
        session.add(new_obj)
        session.commit()
        session.refresh(new_obj)  
def authanticate_user(username:str, password:str,db):
        user = db.query(models.Users).filter(models.Users.username == username).first()
        if not user:
            return False
        if not bcrypt_context.verify(password, user.password):
            return False
        return user

def create_access_token(username:str, user_id: int, expires_delta: timedelta):
    
    encode = {'sub': username, 'id': user_id}
    expires = datetime.utcnow() + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token:str = Depends(auth_bearer)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        return {"username": username, "id": user_id}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="culd not validate user")
@router.post("/")
def add_user(user: UsersDTO, db:Session = Depends(get_db)):
    existing_user = db.query(models.Users).filter(models.Users.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")

    hashed_password = bcrypt_context.hash(user.password)
    new_user = models.Users(username=user.username, email=user.email, password=hashed_password)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/token", response_model=Token)
def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):

    user = authanticate_user(form_data.username, form_data.password, db)
    if not user:
        return "Failed authentication"
    token = create_access_token(user.username, user.id, timedelta(minutes=20))

    return {'access_token': token, 'token_type': 'bearer'}

