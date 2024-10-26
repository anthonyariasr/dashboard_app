from pydantic import BaseModel
from datetime import datetime

# Esquema para la creación de registros de consumo de agua
class WaterConsumptionCreate(BaseModel):
    date: str  # Formato d/m/aaaa HH:MM:SS
    water_amount: float

# Esquema para la respuesta de registros de consumo de agua
class WaterConsumptionOut(BaseModel):
    date: datetime
    water_amount: float

    class Config:
        orm_mode = True
