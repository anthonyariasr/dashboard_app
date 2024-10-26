from pydantic import BaseModel
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
