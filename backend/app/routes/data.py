from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_
from models import Weight, WaterConsumption, Height, Exercise, DailyStep, BodyFatPercentage, BodyComposition
from io import StringIO
from starlette import status
from datetime import datetime, timedelta
from database import get_db
from typing import Any
import pandas as pd
from schemas import ExerciseOut

router = APIRouter(
    prefix="/data",
    tags=["data"]
)

# Mapeo de tipos de sensores y sus campos
sensor_mapping = {
    "weight": (Weight, {"weight": float}),
    "water_consumption": (WaterConsumption, {"water_amount": float}),
    "height": (Height, {"height": float}),
    "exercise": (Exercise, {"exercise_name": str, "duration": float}),
    "daily_step": (DailyStep, {"steps_amount": int}),
    "body_fat_percentage": (BodyFatPercentage, {"fat_percentage": float}),
    "body_composition": (BodyComposition, {"fat": float, "muscle": float, "water": float})
}

# Mapeo de nombres de columnas del CSV a los nombres en los modelos
csv_to_model_fields = {
    "weight": {"weight": "weight"},
    "water_consumption": {"waterAmount": "water_amount"},
    "height": {"height": "height"},
    "exercise": {"exerciseName": "exercise_name", "duration": "duration"},
    "daily_step": {"stepsAmount": "steps_amount"},
    "body_fat_percentage": {"fatPercentage": "fat_percentage"},
    "body_composition": {"fat": "fat", "muscle": "muscle", "water": "water"}
}

@router.post("/add-sensor", response_model=Any)
def add_sensor(type_sensor: str, userId: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    if type_sensor not in sensor_mapping:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid type_sensor provided")
    
    model_class, field_types = sensor_mapping[type_sensor]
    field_mappings = csv_to_model_fields.get(type_sensor, {})

    try:
        # Leer el archivo CSV con pandas
        contents = file.file.read().decode("utf-8")
        df = pd.read_csv(StringIO(contents))

        # Renombrar las columnas del DataFrame para que coincidan con los campos del modelo
        df = df.rename(columns=field_mappings)

        # Convertir la columna de fecha y validar el formato
        df['date'] = pd.to_datetime(df['date'], format="%Y-%m-%d %H:%M:%S", errors='raise')
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid date format. Use YYYY-MM-DD HH:MM:SS")
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid CSV format")

    # Recorrer cada fila y agregar al modelo
    for _, row in df.iterrows():
        # Validar si ya existe una entrada con la misma fecha y hora exacta
        existing_entry = db.query(model_class).filter(
            and_(model_class.date == row["date"], model_class.user_id == userId)
        ).first()

        if existing_entry:
            # Si existe un registro con la misma fecha y hora exacta, omitir o manejar según la lógica deseada
            continue  # Saltar a la siguiente fila o puedes agregar lógica personalizada aquí

        data = {"date": row["date"], "user_id": userId}
        for field, field_type in field_types.items():
            try:
                data[field] = field_type(row[field])
            except KeyError:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Missing data for {field}")
        
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