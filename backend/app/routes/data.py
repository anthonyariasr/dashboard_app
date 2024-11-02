from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Weight, WaterConsumption, Height, Exercise, DailyStep, BodyFatPercentage, BodyComposition
from database import get_db
from typing import Any
import csv
from io import StringIO
from starlette import status
from datetime import datetime

router = APIRouter(
    prefix="/data",
    tags=["data"]
)

#Ruta para subir los archivos .csv
sensor_mapping = {
    "weight": (Weight, {"weight": float}),
    "water_consumption": (WaterConsumption, {"water_amount": float}),
    "height": (Height, {"height": float}),
    "exercise": (Exercise, {"exercise_name": str, "duration": float}),
    "daily_step": (DailyStep, {"steps_amount": int}),
    "body_fat_percentage": (BodyFatPercentage, {"fat_percentage": float}),
    "body_composition": (BodyComposition, {"fat": float, "muscle": float, "water": float})
}

@router.post("/add-sensor", response_model=Any)
def add_sensor(type_sensor: str, userId: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        contents = file.file.read().decode("utf-8")
        csv_reader = csv.DictReader(StringIO(contents))
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid CSV format")

    if type_sensor not in sensor_mapping:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid type_sensor provided")
    
    model_class, field_types = sensor_mapping[type_sensor]

    for row in csv_reader:
        try:
            row_date = datetime.strptime(row["date"], "%Y-%m-%d %H:%M:%S")
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid date format. Use YYYY-MM-DD HH:MM:SS")
        
        # Crea el diccionario de datos con los valores convertidos
        data = {"date": row_date, "user_id": userId}
        for field, field_type in field_types.items():
            try:
                data[field] = field_type(row[field])
            except (ValueError, KeyError):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid or missing data for {field}")
        
        data_entry = model_class(**data)
        db.add(data_entry)

    db.commit()
    return {"status": "Data successfully added"}




"""
AGREGAR ENDPOINT DE GET DATA
FALTA REVISAR EL TEMA DE LOS QUERYS
"""