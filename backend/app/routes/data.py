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

#Ruta para añadir los archivos CSV
@router.post("/add-sensor", response_model=Any)
def add_sensor(type_sensor: str, userId: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    if type_sensor not in sensor_mapping:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid type_sensor provided")
    
    model_class, field_types = sensor_mapping[type_sensor]
    field_mappings = csv_to_model_fields.get(type_sensor, {})

    try:
        # Lee archivo CSV con pandas
        contents = file.file.read().decode("utf-8")
        df = pd.read_csv(StringIO(contents))

        # Renombrar las columnas del DataFrame para que coincidan con los campos del modelo
        df = df.rename(columns=field_mappings)

        # Convertierte la columna de fecha y valida el formato
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
            # Falta la lógica para reemplazar datos 
            continue  

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

#Ruta para obtener los datos del día actual
@router.get("/generalView", response_model=Any)
def generalView(userId: int, db: Session = Depends(get_db)):
    #fecha de hoy
    today = datetime.now().date()

    # weight del día o último registro
    weight = db.query(Weight).filter(Weight.user_id == userId).filter(
        Weight.date >= today, Weight.date < today + timedelta(days=1)
    ).order_by(desc(Weight.date)).first() or db.query(Weight).filter(Weight.user_id == userId).order_by(desc(Weight.date)).first()
    weight_value = weight.weight if weight else "No data"

    # height del día o último registro
    height = db.query(Height).filter(Height.user_id == userId).filter(
        Height.date >= today, Height.date < today + timedelta(days=1)
    ).order_by(desc(Height.date)).first() or db.query(Height).filter(Height.user_id == userId).order_by(desc(Height.date)).first()
    height_value = height.height if height else "No data"

    #BodyComposition del día o último registro
    body_composition = db.query(BodyComposition).filter(BodyComposition.user_id == userId).filter(
        BodyComposition.date >= today, BodyComposition.date < today + timedelta(days=1)
    ).order_by(desc(BodyComposition.date)).first() or db.query(BodyComposition).filter(BodyComposition.user_id == userId).order_by(desc(BodyComposition.date)).first()
    body_composition_value = {
        "fat": body_composition.fat if body_composition else "0%",
        "muscle": body_composition.muscle if body_composition else "0%",
        "water": body_composition.water if body_composition else "0%"
    }

    #BodyFatPercentage del día o último registro
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
    exercises = db.query(Exercise).filter(
        Exercise.user_id == userId,
        Exercise.date >= today,
        Exercise.date < today + timedelta(days=1)
    ).order_by(desc(Exercise.date)).all()
    if not exercises:
        exercises = db.query(Exercise).filter(
            Exercise.user_id == userId
        ).order_by(desc(Exercise.date)).all()
    
    

    # Preparar el resultado
    result = {
        "weight": weight_value,
        "height": height_value,
        "body_composition": body_composition_value,
        "body_fat_percentage": body_fat_percentage_value,
        "total_water_consumption": total_water_consumption,
        "total_daily_steps": total_daily_steps,
        "exercises": [ExerciseOut.from_orm(exercise) for exercise in exercises]
    }

    return result

#Ruta para obtener el historico de datos
@router.get("/historical-data")
def get_historical_data(
    userId: int,
    time_period: str,
    db: Session = Depends(get_db)
):
    # Calcular la fecha de inicio basada en el período de tiempo
    end_date = datetime.now()
    
    if time_period == "1_week":
        start_date = end_date - timedelta(weeks=1)
    elif time_period == "1_month":
        start_date = end_date - timedelta(days=30)
    elif time_period == "3_months":
        start_date = end_date - timedelta(days=90)
    elif time_period == "6_months":
        start_date = end_date - timedelta(days=180)
    elif time_period == "1_year":
        start_date = end_date - timedelta(days=365)
    else:
        raise HTTPException(status_code=400, detail="Invalid time_period provided")

    # Promedio, máximo y mínimo de weight en el período de tiempo
    weight = db.query(func.avg(Weight.weight).label("average_weight"), func.min(Weight.weight).label("min_weight"), func.max(Weight.weight).label("max_weight")).filter(
        Weight.user_id == userId,
        Weight.date >= start_date,
        Weight.date <= end_date
    ).first()
    weight_data = {
        "average": weight.average_weight or "No data",
        "min": weight.min_weight or "No data",
        "max": weight.max_weight or "No data"
    }

    # Promedio, máximo y mínimo de height en el período de tiempo
    height = db.query(func.avg(Height.height).label("average_height"), func.min(Height.height).label("min_height"), func.max(Height.height).label("max_height")).filter(
        Height.user_id == userId,
        Height.date >= start_date,
        Height.date <= end_date
    ).first()
    height_data = {
        "average": height.average_height or "No data",
        "min": height.min_height or "No data",
        "max": height.max_height or "No data"
    }

    # Promedio de BodyComposition en el período de tiempo
    body_composition = db.query(
        func.avg(BodyComposition.fat).label("average_fat"),
        func.avg(BodyComposition.muscle).label("average_muscle"),
        func.avg(BodyComposition.water).label("average_water")
    ).filter(
        BodyComposition.user_id == userId,
        BodyComposition.date >= start_date,
        BodyComposition.date <= end_date
    ).first()
    body_composition_data = {
        "average_fat": f"{body_composition.average_fat:.2f}%" if body_composition.average_fat else "0%",
        "average_muscle": f"{body_composition.average_muscle:.2f}%" if body_composition.average_muscle else "0%",
        "average_water": f"{body_composition.average_water:.2f}%" if body_composition.average_water else "0%"
    }

    # Promedio de BodyFatPercentage en el período de tiempo
    body_fat_percentage = db.query(func.avg(BodyFatPercentage.fat_percentage).label("average_fat_percentage")).filter(
        BodyFatPercentage.user_id == userId,
        BodyFatPercentage.date >= start_date,
        BodyFatPercentage.date <= end_date
    ).first()
    body_fat_percentage_data = f"{body_fat_percentage.average_fat_percentage:.2f}%" if body_fat_percentage.average_fat_percentage else "0%"

    # Sumar el consumo total de agua (WaterConsumption) en el período de tiempo
    total_water_consumption = db.query(func.sum(WaterConsumption.water_amount).label("total_water")).filter(
        WaterConsumption.user_id == userId,
        WaterConsumption.date >= start_date,
        WaterConsumption.date <= end_date
    ).scalar() or 0

    # Sumar todos los pasos (DailyStep) en el período de tiempo
    total_daily_steps = db.query(func.sum(DailyStep.steps_amount).label("total_steps")).filter(
        DailyStep.user_id == userId,
        DailyStep.date >= start_date,
        DailyStep.date <= end_date
    ).scalar() or 0

    # Agrupar ejercicios por nombre y sumar la duración total por tipo de ejercicio en el período de tiempo
    exercises = db.query(
        Exercise.exercise_name,
        func.sum(Exercise.duration).label("total_duration")
    ).filter(
        Exercise.user_id == userId,
        Exercise.date >= start_date,
        Exercise.date <= end_date
    ).group_by(Exercise.exercise_name).all()
    exercises_data = [
        {
            "exercise_name": exercise.exercise_name,
            "total_duration": exercise.total_duration
        } for exercise in exercises
    ]

    # Resultado de los datos 
    result = {
        "weight": weight_data,
        "height": height_data,
        "body_composition": body_composition_data,
        "body_fat_percentage": body_fat_percentage_data,
        "total_water_consumption": total_water_consumption,
        "total_daily_steps": total_daily_steps,
        "exercises": exercises_data
    }

    return result