from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import Base, engine, get_db
from models import User, Weight  # Importa tus modelos según tu estructura
from datetime import datetime

app = FastAPI()

# Crea las tablas en la base de datos al inicio
Base.metadata.create_all(bind=engine)

# Ruta para crear un nuevo usuario
@app.post("/create_user/")
def create_user(email: str, username: str, password: str, birthday: str, gender: str, db: Session = Depends(get_db)):
    # Convierte la cadena de fecha en el formato d/m/aaaa a un objeto datetime.date
    birthday_date = datetime.strptime(birthday, "%d/%m/%Y").date()

    # Crea una instancia del modelo User
    new_user = User(
        email=email,
        username=username,
        password=password,  # Contraseña sin hash para este ejercicio
        birthday=birthday_date,
        gender=gender
    )
    db.add(new_user)
    db.commit()  # Confirma los cambios
    db.refresh(new_user)  # Actualiza la instancia con los datos del ID generado
    return {"message": "User created successfully", "user_id": new_user.id}

# Ruta para crear un nuevo peso para un usuario
@app.post("/create_weight/")
def create_weight(user_id: int, weight: float, date: str, db: Session = Depends(get_db)):
    # Convierte la cadena de fecha en el formato d/m/aaaa a un objeto datetime.date
    weight_date = datetime.strptime(date, "%d/%m/%Y").date()

    new_weight = Weight(
        user_id=user_id,
        weight=weight,
        date=weight_date  # Asegúrate de pasar un objeto date aquí
    )
    db.add(new_weight)
    db.commit()
    db.refresh(new_weight)
    return {"message": "Weight record created successfully", "date": new_weight.date}

# Ruta para obtener todos los usuarios
@app.get("/users/")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users
