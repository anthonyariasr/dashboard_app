from pydantic import BaseModel
from datetime import datetime

# Esquema para la creación de registros de altura
class HeightCreate(BaseModel):
    date: str  # Formato d/m/aaaa HH:MM:SS
    height: float

# Esquema para la respuesta de registros de altura
class HeightOut(BaseModel):
    date: datetime
    height: float

    class Config:
        orm_mode = True
