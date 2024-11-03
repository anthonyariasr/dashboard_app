import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Sidebar = ({ onUpdateProfile, onLogout }) => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Obtén el nombre de usuario del localStorage
        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userName');
        localStorage.removeItem('access_token');
        localStorage.removeItem('height');
        localStorage.removeItem('weight');
        navigate('/LoginForm')
    };

    const handleForm =()=>{
        navigate('/FormData')
    }

    const handleDashboard=()=>{
        navigate('/Dashboard')
    }

    const handleUpdateProfile =()=>{
        navigate('/UpdateForm')
    }    
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex-col">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold">Hola, {userName}</h2>
      </div>
      <ul className="flex-grow p-4 space-y-4">
        <li>
          <button
            onClick={handleDashboard}
            className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded-md"
          >
            Dashboard
          </button>
        </li>
        <li>
          <button
            onClick={handleUpdateProfile}
            className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded-md"
          >
            Actualizar perfil
          </button>
        </li>
        <li>
          <button 
          onClick={handleForm}
          className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded-md"> 
            Añadir datos
          </button>
          </li>
        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 px-4 hover:bg-red-600 rounded-md"
          >
            Cerrar sesión
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
