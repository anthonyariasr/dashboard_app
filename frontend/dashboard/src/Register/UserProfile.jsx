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
        gender: ''
    })
    
    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const response = await axios.get(`http://127.0.0.1:8000/users/${userId}`)
                console.log(response)
                setData(response.data);
            }catch(error){
                console.error("Error fetching data:", error);
            }
        
        }
        fetchData();
    }, []);

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex flex-col bg-white p-6 rounded-lg border border-gray-300 ml-[300px] mt-[20px]  w-[70%] max-w-none">
                
                {/* Línea de color y Título */}
                <div className="border-b-4 mb-4" style={{ borderColor: '#76c7c0' }}>
                    <h2 className="text-2xl font-semibold text-gray-800 pt-2">Información Personal</h2>
                </div>

                {/* Contenido principal */}
                <div className="flex items-start mt-4">
                    
                    {/* Ícono de Usuario */}
                    <FaUserCircle style={{ color: '#76c7c0' }} className="text-9xl mr-8" />

                    {/* Información del Usuario */}
                    <div className="space-y-4 text-gray-700">
                        <div className="flex">
                            <span className="font-medium w-24">Nombre:</span>
                            <span className='ml-1'>{data.username}</span>
                        </div>
                        <div className="flex">
                            <span className="font-medium w-24">Email:</span>
                            <span className='ml-1'>{data.email}</span>
                        </div>
                        <div className="flex">
                            <span className="font-medium w-24">Cumpleaños:  </span>
                            <span className='ml-2'> {data.birthday}</span>
                        </div>
                        <div className="flex">
                            <span className="font-medium w-24">Género:</span>
                            <span className='ml-1'>{data.gender}</span>
                        </div>
                    </div>
                        <br />
                    <div className='ml-[3%]'>
                    <button
                            type="submit"
                            className=" text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200 mt-[200%] "
                            style={{backgroundColor: '#67a0ae'}}
                        >
                        Actualizar Perfil
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
