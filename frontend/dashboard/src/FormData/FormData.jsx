import React, { useState } from 'react';
import Sidebar from '../SideBar/Sidebar';

function UploadSensorData() {
  
  const [file, setFile] = useState(null);
  const [typeSensor, setTypeSensor] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!file || !typeSensor) {
      setErrorMessage('Por favor completa todos los campos y selecciona un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const userId = localStorage.getItem("id");

    try {
      const url = `http://127.0.0.1:8000/data/add-sensor?type_sensor=${encodeURIComponent(typeSensor)}&userId=${encodeURIComponent(userId)}`;

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setSuccessMessage('Archivo subido con éxito');
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      setErrorMessage('Error al subir el archivo. Verifica el formato e inténtalo nuevamente.');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex flex-col justify-center items-center w-full sm:w-3/4 p-4 sm:p-8" style={{ marginLeft: 'auto' }}>
        <form onSubmit={handleSubmit} className="w-full max-w-md p-6 border rounded-lg shadow-lg bg-white">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-700 mb-6">Ingresar datos de sensores</h2>
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-400 rounded">
              {successMessage}
            </div>
          )}
          
          <label className="block text-sm font-medium text-gray-600">Tipo de sensor</label>
          <select 
            value={typeSensor} 
            onChange={(e) => setTypeSensor(e.target.value)} 
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Selecciona tipo de sensor</option>
            <option value="weight">Peso</option>
            <option value="water_consumption">Consumo de Agua</option>
            <option value="height">Altura</option>
            <option value="exercise">Ejercicio</option>
            <option value="daily_step">Pasos Diarios</option>
            <option value="body_fat_percentage">Porcentaje de Grasa Corporal</option>
            <option value="body_composition">Composición Corporal</option>
          </select>
          <br />
          
          <label className="block text-sm font-medium text-gray-600">Subir Archivo CSV:</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <br />
          
          <button 
            type="submit" 
            className="w-full text-white p-3 rounded-lg transition duration-200 bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            Subir
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadSensorData;
