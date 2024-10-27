from fastapi import FastAPI
from database import Base, engine
from routes import *

# Crear la instancia de FastAPI
app = FastAPI()

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Incluir los routers para organizar las rutas
app.include_router(users.router)
app.include_router(auth.router)
#app.include_router(data.router)

