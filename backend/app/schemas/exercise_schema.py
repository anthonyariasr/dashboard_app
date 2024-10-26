from pydantic import BaseModel
from datetime import DateTime

# Esquema para la creación de registros de ejercicio
class ExerciseCreate(BaseModel):
    date: str  # Formato d/m/aaaa HH:MM:SS
    exercise_name: str
    duration: float

# Esquema para la respuesta de registros de ejercicio
class ExerciseOut(BaseModel):
    date: DateTime
    exercise_name: str
    duration: float

    class Config:
        orm_mode = True
