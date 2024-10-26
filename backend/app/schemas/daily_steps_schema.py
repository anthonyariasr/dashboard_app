from pydantic import BaseModel
from datetime import DateTime

# Esquema para la creación de registros de pasos diarios
class DailyStepsCreate(BaseModel):
    date: str  # Formato d/m/aaaa HH:MM:SS
    steps_amount: int

# Esquema para la respuesta de registros de pasos diarios
class DailyStepsOut(BaseModel):
    date: DateTime
    steps_amount: int

    class Config:
        orm_mode = True