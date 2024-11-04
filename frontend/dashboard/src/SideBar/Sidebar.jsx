import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa'; // Icono para el botón del menú

const Sidebar = ({ onUpdateProfile, onLogout }) => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [isOpen, setIsOpen] = useState(false); // Estado para manejar el sidebar

    useEffect(() => {
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
        navigate('/LoginForm');
    };

    const handleForm = () => {
        navigate('/FormData');
    };

    const handleDashboard = () => {
        navigate('/Dashboard');
    };

    const handleUpdateProfile = () => {
        navigate('/UpdateForm');
    };

    // Función para alternar el sidebar
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex">
            {/* Botón de menú para dispositivos móviles */}
            <button
                onClick={toggleSidebar}
                className="p-4 text-white bg-gray-800 md:hidden"
            >
                <FaBars size={24} />
            </button>

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 transform ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 md:static md:flex md:w-64 h-screen bg-gray-800 text-white flex-col transition-transform duration-200 ease-in-out`}
            >
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
                            className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded-md"
                        >
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

            {/* Overlay para cerrar el sidebar al hacer clic fuera de él en pantallas pequeñas */}
            {isOpen && (
                <div
                    onClick={toggleSidebar}
                    className="fixed inset-0 bg-black opacity-50 md:hidden"
                />
            )}
        </div>
    );
};

export default Sidebar;
