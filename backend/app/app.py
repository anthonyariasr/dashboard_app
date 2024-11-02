from fastapi import FastAPI
from database import Base, engine
from routes import *
from fastapi.middleware.cors import CORSMiddleware

# Crear la instancia de FastAPI
app = FastAPI()

origins = [
    "http://localhost:3000",
    # Add other origins if needed
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Incluir los routers para organizar las rutas
app.include_router(users.router)
app.include_router(auth.router)
#app.include_router(data.router)

