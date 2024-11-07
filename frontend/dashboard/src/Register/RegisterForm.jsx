import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function RegisterForm() {
    const navigate = useNavigate();
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

    // Función para obtener la fecha en el formato DD/MM/AAAA HH:MM:SS
    const getFormattedDate = () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };

        const dataToSend = {
            user: {
                email: formData.email,
                username: formData.username,
                password: formData.password,
                birthday: formatDate(formData.birthday),
                gender: formData.gender
            },
            height: {
                date: getFormattedDate(),
                height: parseFloat(formData.height)
            },
            weight: {
                date: getFormattedDate(),
                weight: parseFloat(formData.weight)
            }
        };

        console.log(dataToSend);
        try {
            const response = await axios.post('http://localhost:8000/users/create', dataToSend);

            if (response && response.data) {
                console.log("User created:", response.data);
                navigate('/LoginForm');
            } else {
                console.log("No data in response");
            }
        } catch (error) {
            console.error("Error during submission:", error);
            if (error.response) {
                console.error("Server responded with error:", error.response.data);
            } else {
                console.error("Network or other error:", error.message);
            }
        }
    };

    return (
        <div className="justify-center items-center mt-[30px] sm:ml-[10px] flex">
            <form onSubmit={handleSubmit} className="max-w-md w-full p-8 border rounded-lg shadow-lg bg-white sm:ml-[10px]">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Registro de Usuario</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {['email', 'username', 'password', 'weight', 'height'].map((field, index) => (
                            <div key={field} className={`mb-4 ${index % 2 === 0 ? 'col-span-2 sm:col-span-1' : ''}`}>
                                <label htmlFor={field} className="block text-sm font-medium text-gray-600">
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                </label>
                                <input
                                    type={field === 'password' ? 'password' : 'text'}
                                    name={field}
                                    id={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        ))}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="birthday" className="block text-sm font-medium text-gray-600">
                            Fecha de Nacimiento
                        </label>
                        <input
                            type="date"
                            name="birthday"
                            id="birthday"
                            value={formData.birthday}
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
                            <option value="">Selecciona tu género</option>
                            <option value="male">Masculino</option>
                            <option value="female">Femenino</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200" style={{backgroundColor: '#67a0ae'}}>
                        Registrarse
                    </button>
                    <p className="text-center text-sm text-gray-600 mt-4">
                    ¿Ya tienes una cuenta? <Link to="/PrincipalLogin" className=" hover:underline" style={{color: '#67a0ae'}}>Iniciar sesión</Link>
                    </p>
            </form>
        </div>
    );
}

export default RegisterForm;
