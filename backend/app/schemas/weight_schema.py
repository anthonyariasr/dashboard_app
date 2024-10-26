from pydantic import BaseModel
from datetime import datetime

# Esquema para la creación de registros de peso
class WeightCreate(BaseModel):
    date: str  # Formato d/m/aaaa HH:MM:SS
    weight: float

# Esquema para la respuesta de registros de peso
class WeightOut(BaseModel):
    date: datetime
    weight: float

    class Config:
        orm_mode = True
