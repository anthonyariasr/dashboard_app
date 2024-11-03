import React, { useState } from 'react';
import Sidebar from '../SideBar/Sidebar';

function UploadSensorData() {
  const [file, setFile] = useState(null);
  const [typeSensor, setTypeSensor] = useState('');
  const [userId, setUserId] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file || !typeSensor || !userId) {
      alert('Please fill out all fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Construir la URL con los parámetros de tipo de sensor y userId
      const url = `http://127.0.0.1:8000/data/add-sensor?type_sensor=${encodeURIComponent(typeSensor)}&userId=${encodeURIComponent(userId)}`;

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      alert(result.status || 'File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading the file:', error);
      alert('Failed to upload the file. Please check the format and try again.');
    }
  };

  return (
    
    <div style={{display:'flex'}} className='bg-gray-100'>
        <Sidebar/>
    <div className='flex justify-center items-center min-h-screen' style={{ marginLeft: '25%' }}>
    <form onSubmit={handleSubmit} className="max-w-md w-full p-8 border rounded-lg shadow-lg bg-white">
    <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Ingresar datos de sensores</h2>
      <label className="block text-sm font-medium text-gray-600">Tipo de sensor</label>
        <select value={typeSensor} onChange={(e) => setTypeSensor(e.target.value)} className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select sensor type</option>
          <option value="weight">Weight</option>
          <option value="water_consumption">Water Consumption</option>
          <option value="height">Height</option>
          <option value="exercise">Exercise</option>
          <option value="daily_step">Daily Step</option>
          <option value="body_fat_percentage">Body Fat Percentage</option>
          <option value="body_composition">Body Composition</option>
        </select>
      <br />
      <label className="block text-sm font-medium text-gray-600">User ID:</label>
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      <br />
      <label></label>
        Upload CSV File:
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          required
          className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      <br />
      <button type="submit"  className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200">Upload</button>
    </form>
    </div>
    </div>
  );
}

export default UploadSensorData;
