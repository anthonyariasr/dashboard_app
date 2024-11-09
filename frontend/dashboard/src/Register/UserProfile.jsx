import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Sidebar from '../SideBar/Sidebar';
import axios from 'axios';

const UserProfile = () => {
  const userId = localStorage.getItem('id');
  const [data, setData] = useState({
    id: '',
    email: '',
    username: '',
    birthday: '',
    gender: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/users/${userId}`);
        console.log(response);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar siempre visible */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Contenedor principal completamente centrado en dispositivos móviles */}
      <div className="flex-1 flex flex-col items-center bg-white p-6 rounded-lg max-w-4xl mx-auto mt-16 lg:mt-0">
        {/* Línea de color y Título */}
        <div className="border-b-4 mb-4 text-center w-full" style={{ borderColor: '#76c7c0' }}>
          <h2 className="my-2 text-2xl font-semibold text-gray-800 pt-2">Información Personal</h2>
        </div>

        {/* Contenido principal */}
        <div className="flex flex-col items-center mt-4">
          {/* Ícono de Usuario centrado */}
          <FaUserCircle style={{ color: '#76c7c0' }} className="text-9xl mb-4" />

          {/* Información del Usuario */}
          <div className="space-y-4 text-gray-700 text-left w-full max-w-md">
            <div className="flex">
              <span className="font-medium w-24">Nombre:</span>
              <span className="ml-1">{data.username}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-24">Email:</span>
              <span className="ml-1">{data.email}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-24">Cumpleaños:</span>
              <span className="ml-2">{data.birthday}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-24">Género:</span>
              <span className="ml-1">{data.gender}</span>
            </div>
          </div>
        </div>

        {/* Botón centrado */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
            style={{ backgroundColor: '#67a0ae' }}
          >
            Actualizar Perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
