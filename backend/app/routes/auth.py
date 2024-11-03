from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.height import Height
from models.weight import Weight
from schemas.user_schema import UserLogin

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

# Variable simulada para almacenar una "session"
session_token = None

# Endpoint de Login
@router.post("/login")
def login(user: UserLogin, response: Response, db: Session = Depends(get_db)):
    # Verificar si el usuario existe
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    # Obtener el peso y la altura del usuario
    user_weight = db.query(Weight).filter(Weight.user_id == db_user.id).first()
    user_height = db.query(Height).filter(Height.user_id == db_user.id).first()

    # Crear un token de sesión simple (sin cifrado)
    global session_token
    session_token = f"session_{db_user.username}"

    # Configurar el token de sesión como una cookie
    response.set_cookie(key="session_token", value=session_token, httponly=True)

    return {
        "message": "Login successful",
        "User id": db_user.id,
        "weight": user_weight.weight,  # Asegúrate de que el campo es el correcto
        "height": user_height.height  # Asegúrate de que el campo es el correcto
    }
# Endpoint de Logout
@router.post("/signout")
def signout(response: Response):
    global session_token
    session_token = None  # Eliminar el token de sesión en el servidor

    # Eliminar la cookie de sesión en el cliente
    response.delete_cookie(key="session_token")
    return {"message": "Logout successful"}
