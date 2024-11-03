from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from models import Weight, WaterConsumption, Height, Exercise, DailyStep, BodyFatPercentage, BodyComposition
from io import StringIO
from starlette import status
from datetime import datetime, timedelta
from database import get_db
from typing import Any
import csv

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

@router.get("/generalView", response_model=Any)
def generalView(userId: int, db: Session = Depends(get_db)):
    #fecha de hoy
    today = datetime.now().date()

    # weight
    weight = db.query(Weight).filter(Weight.user_id == userId).filter(
        Weight.date >= today, Weight.date < today + timedelta(days=1)
    ).order_by(desc(Weight.date)).first() or db.query(Weight).filter(Weight.user_id == userId).order_by(desc(Weight.date)).first()
    weight_value = weight.weight if weight else "No data"

    # height
    height = db.query(Height).filter(Height.user_id == userId).filter(
        Height.date >= today, Height.date < today + timedelta(days=1)
    ).order_by(desc(Height.date)).first() or db.query(Height).filter(Height.user_id == userId).order_by(desc(Height.date)).first()
    height_value = height.height if height else "No data"

    #BodyComposition
    body_composition = db.query(BodyComposition).filter(BodyComposition.user_id == userId).filter(
        BodyComposition.date >= today, BodyComposition.date < today + timedelta(days=1)
    ).order_by(desc(BodyComposition.date)).first() or db.query(BodyComposition).filter(BodyComposition.user_id == userId).order_by(desc(BodyComposition.date)).first()
    body_composition_value = {
        "fat": body_composition.fat if body_composition else "0%",
        "muscle": body_composition.muscle if body_composition else "0%",
        "water": body_composition.water if body_composition else "0%"
    }

    #BodyFatPercentage
    body_fat_percentage = db.query(BodyFatPercentage).filter(BodyFatPercentage.user_id == userId).filter(
        BodyFatPercentage.date >= today, BodyFatPercentage.date < today + timedelta(days=1)
    ).order_by(desc(BodyFatPercentage.date)).first() or db.query(BodyFatPercentage).filter(BodyFatPercentage.user_id == userId).order_by(desc(BodyFatPercentage.date)).first()
    body_fat_percentage_value = f"{body_fat_percentage.fat_percentage}%" if body_fat_percentage else "0%"

    # WaterConsumption del día o último registro
    total_water_consumption = db.query(func.sum(WaterConsumption.water_amount)).filter(
        WaterConsumption.user_id == userId,
        WaterConsumption.date >= today,
        WaterConsumption.date < today + timedelta(days=1)
    ).scalar()
    if total_water_consumption is None:  # Si no hay consumo de agua hoy, buscar el último registro disponible
        total_water_consumption = db.query(func.sum(WaterConsumption.water_amount)).filter(
            WaterConsumption.user_id == userId
        ).scalar() or 0

    # DailyStep del día o último registro
    total_daily_steps = db.query(func.sum(DailyStep.steps_amount)).filter(
        DailyStep.user_id == userId,
        DailyStep.date >= today,
        DailyStep.date < today + timedelta(days=1)
    ).scalar()
    if total_daily_steps is None:  # Si no hay pasos hoy, buscar el último registro disponible
        total_daily_steps = db.query(func.sum(DailyStep.steps_amount)).filter(
            DailyStep.user_id == userId
        ).scalar() or 0

    # Todos los exercises del día o último registro
    exercises = db.query(Exercise).filter(Exercise.user_id == userId).filter(
        Exercise.date >= today, Exercise.date < today + timedelta(days=1)
    ).order_by(desc(Exercise.date)).all()
    if not exercises:  # Si no hay ejercicios hoy, buscar el último conjunto de ejercicios
        exercises = db.query(Exercise).filter(Exercise.user_id == userId).order_by(desc(Exercise.date)).all() or "No exercises available"

    # Preparar el resultado
    result = {
        "weight": weight_value,
        "height": height_value,
        "body_composition": body_composition_value,
        "body_fat_percentage": body_fat_percentage_value,
        "total_water_consumption": total_water_consumption,
        "total_daily_steps": total_daily_steps,
        "exercises": exercises
    }

    return result

"""
AGREGAR ENDPOINT DE GET DATA
FALTA REVISAR EL TEMA DE LOS QUERYS
"""