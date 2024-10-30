from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from schemas.user_schema import UserCreate, UserOut, UserUpdate
from typing import List
from datetime import datetime

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


# Ruta para crear un nuevo usuario
@router.post("/create", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Convertir el string de 'birthday' a un objeto 'date' de Python con formato d-m-aaaa
    try:
        birthday_date = datetime.strptime(user.birthday, "%d-%m-%Y").date()  # Ajustado a d-m-aaaa
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use DD-MM-YYYY.")
    
    new_user = User(
        email=user.email,
        username=user.username,
        password=user.password,
        birthday=birthday_date,
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

# Ruta para obtener un usuario específico por ID
@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

# Ruta para actualizar un usuario por ID
@router.put("/update/{user_id}", response_model=UserOut)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Actualizar los campos opcionales que se envíen
    if user_update.email is not None:
        user.email = user_update.email
    if user_update.username is not None:
        user.username = user_update.username
    if user_update.password is not None:
        user.password = user_update.password
    if user_update.birthday is not None:
        # Convertir el string de 'birthday' a un objeto 'date' de Python con formato d-m-aaaa
        try:
            user.birthday = datetime.strptime(user_update.birthday, "%d-%m-%Y").date()  # Ajustado a d-m-aaaa
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use DD-MM-YYYY.")
    if user_update.gender is not None:
        user.gender = user_update.gender

    db.commit()
    db.refresh(user)
    return user