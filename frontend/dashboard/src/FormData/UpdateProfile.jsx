import React from "react";
import Sidebar from "../SideBar/Sidebar";

export default function(){
    return(
        
        <div className="bg-gray-100 w-full items-center flex ">
            <Sidebar/>
            <div className='flex justify-center items-center min-h-screen w-[30%] ml-[20%]'>
                <form className="p-8 border rounded-lg shadow-lg bg-white w-[100%]">
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Actualizar perfil</h2>
                    <label htmlFor="" className="block text-sm font-medium text-gray-600">Username</label>
                    <input type="text" className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <label htmlFor="" className="block text-sm font-medium text-gray-600">Email</label>
                    <input type="text" className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <label htmlFor="" className="block text-sm font-medium text-gray-600">Password</label>
                    <input type="password" className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <label htmlFor="" className="block text-sm font-medium text-gray-600">Birthday</label>
                    <input type="date" className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <div className="mb-4">
                    <label htmlFor="" className="block text-sm font-medium text-gray-600">Gender</label>
                    <select
                    name="gender"
                    id="gender"
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    >
                    <option value="">Selecciona tu género</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200">Actualizar</button>
                </form>
            </div>
        </div>
    )
}