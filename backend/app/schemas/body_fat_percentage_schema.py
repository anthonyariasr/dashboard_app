from pydantic import BaseModel
from datetime import datetime

# Esquema para la creación de registros de porcentaje de grasa corporal
class BodyFatPercentageCreate(BaseModel):
    date: str  # Formato d/m/aaaa HH:MM:SS
    fat_percentage: float

# Esquema para la respuesta de registros de porcentaje de grasa corporal
class BodyFatPercentageOut(BaseModel):
    date: datetime
    fat_percentage: float

    class Config:
        orm_mode = True
