
# Proyecto de Dashboard - Instrucciones de Despliegue

Este proyecto consta de un *frontend* y un *backend* para un sistema de Dashboard interactivo. Sigue las instrucciones a continuación para desplegar cada parte de la aplicación.

---

## Requisitos Previos

Asegúrate de tener instalados:

- *Python 3.7+* para el backend.
- *Node.js y npm* para el frontend.

---

## Despliegue del Backend

1. Navega al directorio del backend:

   ```bash
   cd backend
   ```

2. Crea un entorno virtual para gestionar las dependencias de Python:

   ```bash
   python -m venv venv
   ```

3. Activa el entorno virtual:

   - En Windows:
     ```bash
     venv\Scripts\activate
     ```
   - En macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Instala las dependencias necesarias:

   ```bash
   pip install "fastapi[standard]"
   pip install sqlalchemy pandas
   ```

5. Inicia el servidor de FastAPI en modo de desarrollo:

   ```bash
   fastapi dev .\app\app.py
   ```

---

## Despliegue del Frontend

1. Navega al directorio del frontend y luego al subdirectorio `dashboard`:

   ```bash
   cd frontend
   cd dashboard
   ```

2. Instala las dependencias de Node.js:

   ```bash
   npm install
   ```

3. Inicia la aplicación de React en modo de desarrollo:

   ```bash
   npm start
   ```
