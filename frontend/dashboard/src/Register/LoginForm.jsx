import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/auth/login', formData);
            console.log('Login successful:', response.data);
            navigate('/Dashboard')
        } catch (error) {
            setError('Login failed. Please check your credentials and try again.');
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="max-w-md w-full p-8 border rounded-lg shadow-lg bg-white">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Iniciar Sesión</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
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
                <div className="mb-6">
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
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
}

export default LoginForm;
