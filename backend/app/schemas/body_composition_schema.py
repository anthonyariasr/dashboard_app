from pydantic import BaseModel
from datetime import datetime

# Esquema para la creación de registros de composición corporal
class BodyCompositionCreate(BaseModel):
    date: str  # Formato d/m/aaaa HH:MM:SS
    fat: float
    muscle: float
    water: float

# Esquema para la respuesta de registros de composición corporal
class BodyCompositionOut(BaseModel):
    date: datetime
    fat: float
    muscle: float
    water: float

    class Config:
        orm_mode = True
