import React, { useState } from 'react';
import axios from 'axios';

function RegisterForm() {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        weight: '',
        height: '',
        birthday: '',
        gender: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/users/create', formData);

            if (response && response.data) {
                console.log("User created:", response.data);
                // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
            } else {
                console.log("No data in response");
            }
        } catch (error) {
            console.error("Error during submission:", error);
            if (error.response) {
                // Maneja errores específicos de la respuesta del servidor (por ejemplo, error 400 o 500)
                console.error("Server responded with error:", error.response.data);
            } else {
                console.error("Network or other error:", error.message);
            }
        }
    };



    return (
       <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="max-w-md w-full p-8 border rounded-lg shadow-lg bg-white">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Registro de Usuario</h2>
                {['email', 'username', 'password', 'weight', 'height', 'birthday'].map((field) => (
                    <div key={field} className="mb-4">
                        <label htmlFor={field} className="block text-sm font-medium text-gray-600">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                            type={field === 'password' ? 'password' : field === 'birthday' ? 'date' : 'text'}
                            name={field}
                            id={field}
                            value={formData[field]}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                ))}
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
                        <option value="">Selecciona tu género</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                    </select>
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200">Registrarse</button>
            </form>
        </div>
    );
}

export default RegisterForm;
