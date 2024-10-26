from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from schemas import UserCreate, UserOut
from typing import List

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

# Ruta para crear un nuevo usuario
@router.post("/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(
        email=user.email,
        username=user.username,
        password=user.password,  # Para este ejercicio, no se encripta
        birthday=user.birthday,
        gender=user.gender
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Ruta para obtener todos los usuarios
@router.get("/", response_model=List[UserOut])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()
