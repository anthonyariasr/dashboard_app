import React, { useState } from 'react';

const Sidebar = ({ userName, onUpdateProfile, onLogout }) => {
  const [showAddDataOptions, setShowAddDataOptions] = useState(false);

  const toggleAddDataOptions = () => {
    setShowAddDataOptions(!showAddDataOptions);
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex-col">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold">Hola, {userName}</h2>
      </div>
      <ul className="flex-grow p-4 space-y-4">
        <li>
          <button
            onClick={onUpdateProfile}
            className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded-md"
          >
            Actualizar perfil
          </button>
        </li>
        <li>
          <button
            onClick={toggleAddDataOptions}
            className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded-md"
          >
            Añadir datos
          </button>
          {showAddDataOptions && (
            <ul className="ml-4 mt-2 space-y-2">
              <li>
                <button className="w-full text-left py-1 px-4 hover:bg-gray-700 rounded-md">
                  Añadir peso
                </button>
              </li>
              <li>
                <button className="w-full text-left py-1 px-4 hover:bg-gray-700 rounded-md">
                  Añadir altura
                </button>
              </li>
              <li>
                <button className="w-full text-left py-1 px-4 hover:bg-gray-700 rounded-md">
                  Añadir composición corporal
                </button>
              </li>
              <li>
                <button className="w-full text-left py-1 px-4 hover:bg-gray-700 rounded-md">
                  Añadir porcentaje de grasa corporal
                </button>
              </li>
              <li>
                <button className="w-full text-left py-1 px-4 hover:bg-gray-700 rounded-md">
                  Añadir cantidad de vasos de agua
                </button>
              </li>
              <li>
                <button className="w-full text-left py-1 px-4 hover:bg-gray-700 rounded-md">
                  Añadir pasos diarios
                </button>
              </li>
              <li>
                <button className="w-full text-left py-1 px-4 hover:bg-gray-700 rounded-md">
                  Añadir ejercicios realizados
                </button>
              </li>
            </ul>
          )}
        </li>
        <li>
          <button
            onClick={onLogout}
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
