import React, { useState } from 'react';


function UserProfile() {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        birthDate: '',
        gender: '',
    });


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log('Profile data submitted:', formData);
    };

    const handleLogout = () => {
        
        console.log('User logged out');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="max-w-md w-full p-8 border rounded-lg shadow-lg bg-white">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Perfil de Usuario</h2>
             
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600">Correo electrónico</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-600">Nombre de usuario</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-600">Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-600">Fecha de nacimiento</label>
                    <input
                        type="date"
                        name="birthDate"
                        id="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-600">Género</label>
                    <select
                        name="gender"
                        id="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="" disabled >Seleccione</option>
                        <option value="male">Masculino</option>
                        <option value="female">Femenino</option>
                     
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200 mb-4"
                >
                    Actualizar Perfil
                </button>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-200"
                >
                    Cerrar Sesión
                </button>
            </form>
        </div>
    );
}

export default UserProfile;
