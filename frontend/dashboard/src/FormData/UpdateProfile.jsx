import React, { useState } from "react";
import Sidebar from "../SideBar/Sidebar";

export default function UpdateUserForm() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        birthday: "",
        gender: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        const userId = localStorage.getItem("id");
        if (!userId) {
            setErrorMessage("No se encontró el ID de usuario en el local storage");
            return;
        }

        const formattedData = {
            ...formData,
            birthday: formData.birthday ? formatDate(formData.birthday) : ""
        };

        const endpoint = `http://127.0.0.1:8000/users/update/${userId}`;

        try {
            const response = await fetch(endpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formattedData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Error updating user");
            }

            const data = await response.json();
            console.log("User updated successfully:", data);
            const userName = data.username;
            localStorage.setItem('userName', userName);
            setSuccessMessage("Perfil actualizado con éxito");

            window.location.reload();
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("Error al actualizar el perfil: " + error.message);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row bg-gray-100 min-h-screen">
            <Sidebar />
            <div className="flex flex-col justify-center items-center w-full sm:w-3/4 p-4 sm:p-8">
                <form className="w-full max-w-md p-6 border rounded-lg shadow-lg bg-white" onSubmit={handleSubmit}>
                    <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-700 mb-6">Actualizar perfil</h2>

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

                    <label className="block text-sm font-medium text-gray-600">Username</label>
                    <input 
                        type="text" 
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <input 
                        type="text" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <label className="block text-sm font-medium text-gray-600">Password</label>
                    <input 
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <label className="block text-sm font-medium text-gray-600">Birthday</label>
                    <input 
                        type="date" 
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600">Gender</label>
                        <select
                            name="gender"
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

                    <button 
                        type="submit" 
                        className="w-full text-white p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-200 focus:outline-none"
                    >
                        Actualizar
                    </button>
                </form>
            </div>
        </div>
    );
}
