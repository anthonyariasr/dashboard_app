from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_, extract
from models import Weight, WaterConsumption, Height, Exercise, DailyStep, BodyFatPercentage, BodyComposition
from io import StringIO
from starlette import status
from datetime import datetime, timedelta
from database import get_db
from typing import Any
import pandas as pd
from schemas import ExerciseOut
from fastapi.encoders import jsonable_encoder

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

    # Recorrer cada fila y agrega la información al modelo
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
    
    

    # Resultado
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
    end_date = datetime.now()
    group_by_period = "day"

    if time_period == "1_week":
        start_date = end_date - timedelta(weeks=1)
        group_by_period = "day"
    elif time_period == "1_month":
        start_date = end_date - timedelta(days=30)
        group_by_period = "day"
    elif time_period == "3_months":
        start_date = end_date - timedelta(days=90)
        group_by_period = "week"
    elif time_period == "6_months":
        start_date = end_date - timedelta(days=180)
        group_by_period = "week"
    elif time_period == "1_year":
        start_date = end_date - timedelta(days=365)
        group_by_period = "month"
    else:
        raise HTTPException(status_code=400, detail="Invalid time_period provided")

    def group_by_time_period(query, model):
        if group_by_period == "day":
            return query.group_by(extract('year', model.date), extract('month', model.date), extract('day', model.date))
        elif group_by_period == "week":
            return query.group_by(extract('year', model.date), extract('week', model.date))
        elif group_by_period == "month":
            return query.group_by(extract('year', model.date), extract('month', model.date))

    # Peso
    weight_query = db.query(
        func.avg(Weight.weight).label("average_weight"),
        func.min(Weight.weight).label("min_weight"),
        func.max(Weight.weight).label("max_weight"),
        Weight.date
    ).filter(
        Weight.user_id == userId,
        Weight.date >= start_date,
        Weight.date <= end_date
    )
    weight_data = group_by_time_period(weight_query, Weight).all()
    weight_data_serialized = [
        {
            "average_weight": w.average_weight or 0,
            "min_weight": w.min_weight or 0,
            "max_weight": w.max_weight or 0,
            "date": w.date.date()  # Convierte a solo fecha
        }
        for w in weight_data
    ] or [{"average_weight": 0, "min_weight": 0, "max_weight": 0, "date": None}]

    # Altura
    height_query = db.query(
        func.avg(Height.height).label("average_height"),
        func.min(Height.height).label("min_height"),
        func.max(Height.height).label("max_height"),
        Height.date
    ).filter(
        Height.user_id == userId,
        Height.date >= start_date,
        Height.date <= end_date
    )
    height_data = group_by_time_period(height_query, Height).all()
    height_data_serialized = [
        {
            "average_height": h.average_height or 0,
            "min_height": h.min_height or 0,
            "max_height": h.max_height or 0,
            "date": h.date.date()  # Convierte a solo fecha
        }
        for h in height_data
    ] or [{"average_height": 0, "min_height": 0, "max_height": 0, "date": None}]

    # Composición Corporal
    body_composition_query = db.query(
        func.avg(BodyComposition.fat).label("average_fat"),
        func.avg(BodyComposition.muscle).label("average_muscle"),
        func.avg(BodyComposition.water).label("average_water"),
        BodyComposition.date
    ).filter(
        BodyComposition.user_id == userId,
        BodyComposition.date >= start_date,
        BodyComposition.date <= end_date
    )
    body_composition_data = group_by_time_period(body_composition_query, BodyComposition).all()
    body_composition_data_serialized = [
        {
            "average_fat": f"{bc.average_fat:.2f}%" if bc.average_fat else "0%",
            "average_muscle": f"{bc.average_muscle:.2f}%" if bc.average_muscle else "0%",
            "average_water": f"{bc.average_water:.2f}%" if bc.average_water else "0%",
            "date": bc.date.date()
        }
        for bc in body_composition_data
    ] or [{"average_fat": "0%", "average_muscle": "0%", "average_water": "0%", "date": None}]

    # Porcentaje de Grasa Corporal
    body_fat_percentage_query = db.query(
        func.avg(BodyFatPercentage.fat_percentage).label("average_fat_percentage"),
        BodyFatPercentage.date
    ).filter(
        BodyFatPercentage.user_id == userId,
        BodyFatPercentage.date >= start_date,
        BodyFatPercentage.date <= end_date
    )
    body_fat_percentage_data = group_by_time_period(body_fat_percentage_query, BodyFatPercentage).all()
    body_fat_percentage_data_serialized = [
        {
            "average_fat_percentage": f"{bfp.average_fat_percentage:.2f}%" if bfp.average_fat_percentage else "0%",
            "date": bfp.date.date()
        }
        for bfp in body_fat_percentage_data
    ] or [{"average_fat_percentage": "0%", "date": None}]

    # Consumo de Agua
    water_consumption_query = db.query(
        func.sum(WaterConsumption.water_amount).label("total_water"),
        WaterConsumption.date
    ).filter(
        WaterConsumption.user_id == userId,
        WaterConsumption.date >= start_date,
        WaterConsumption.date <= end_date
    )
    total_water_consumption = group_by_time_period(water_consumption_query, WaterConsumption).all()
    total_water_consumption_serialized = [
        {"total_water": wc.total_water or 0, "date": wc.date.date()} for wc in total_water_consumption
    ] or [{"total_water": 0, "date": None}]

    # Pasos Diarios
    daily_steps_query = db.query(
        func.sum(DailyStep.steps_amount).label("total_steps"),
        DailyStep.date
    ).filter(
        DailyStep.user_id == userId,
        DailyStep.date >= start_date,
        DailyStep.date <= end_date
    )
    total_daily_steps = group_by_time_period(daily_steps_query, DailyStep).all()
    total_daily_steps_serialized = [
        {"total_steps": ds.total_steps or 0, "date": ds.date.date()} for ds in total_daily_steps
    ] or [{"total_steps": 0, "date": None}]

    # Ejercicios
    exercises_query = db.query(
        Exercise.exercise_name,
        func.sum(Exercise.duration).label("total_duration"),
        Exercise.date
    ).filter(
        Exercise.user_id == userId,
        Exercise.date >= start_date,
        Exercise.date <= end_date
    ).group_by(Exercise.exercise_name)
    exercises_data = group_by_time_period(exercises_query, Exercise).all()
    exercises_data_serialized = [
        {
            "exercise_name": ex.exercise_name,
            "total_duration": ex.total_duration or 0,
            "date": ex.date.date()
        }
        for ex in exercises_data
    ] or [{"exercise_name": None, "total_duration": 0, "date": None}]

    # Preparar el resultado
    result = {
        "weight": weight_data_serialized,
        "height": height_data_serialized,
        "body_composition": body_composition_data_serialized,
        "body_fat_percentage": body_fat_percentage_data_serialized,
        "total_water_consumption": total_water_consumption_serialized,
        "total_daily_steps": total_daily_steps_serialized,
        "exercises": exercises_data_serialized
    }

    return jsonable_encoder(result)