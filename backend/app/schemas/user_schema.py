from pydantic import BaseModel
from typing import Optional
from datetime import date

# Esquema para la creación de un usuario
class UserCreate(BaseModel):
    email: str
    username: str
    password: str  # Incluye la contraseña en la creación
    birthday: str  # Formato d/m/aaaa
    gender: str

# Esquema para la respuesta de usuario (excluye la contraseña)
class UserOut(BaseModel):
    id: int
    email: str
    username: str
    birthday: date
    gender: str

    class Config:
        orm_mode = True

# Esquema para el login del usuario
class UserLogin(BaseModel):
    username: str
    password: str


# Esquema para la actualización de un usuario
class UserUpdate(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    birthday: Optional[str] = None
    gender: Optional[str] = None
