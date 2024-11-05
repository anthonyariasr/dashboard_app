import Sidebar from "../SideBar/Sidebar";
import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = {
    weight: {
        '1w': [
            { date: '2023-10-28', value: 70 },
            { date: '2023-10-29', value: 71 },
            { date: '2023-10-30', value: 70 },
            { date: '2023-10-31', value: 69 },
            { date: '2023-11-01', value: 70 },
            { date: '2023-11-02', value: 71 },
            { date: '2023-11-03', value: 72 },
        ],
        '1m': [
            { date: '2023-10-01', value: 72 },
            { date: '2023-10-08', value: 71 },
            { date: '2023-10-15', value: 70 },
            { date: '2023-10-22', value: 71 },
            { date: '2023-10-29', value: 70 },
        ],
        '3m': [
            { date: '2023-08-01', value: 75 },
            { date: '2023-09-01', value: 74 },
            { date: '2023-09-15', value: 73 },
            { date: '2023-09-30', value: 72 },
            { date: '2023-10-15', value: 71 },
            { date: '2023-10-30', value: 70 },
        ],
        '6m': [
            { date: '2023-05-01', value: 78 },
            { date: '2023-06-01', value: 77 },
            { date: '2023-07-01', value: 76 },
            { date: '2023-08-01', value: 75 },
            { date: '2023-09-01', value: 74 },
            { date: '2023-10-01', value: 72 },
        ],
        '1y': [
            { date: '2023-01-01', value: 82 },
            { date: '2023-04-01', value: 79 },
            { date: '2023-07-01', value: 77 },
            { date: '2023-10-01', value: 72 },
        ],
    },
    muscle: {
        '1w': [
            { date: '2023-10-28', value: 30 },
            { date: '2023-10-29', value: 31 },
            { date: '2023-10-30', value: 30 },
            { date: '2023-10-31', value: 32 },
            { date: '2023-11-01', value: 31 },
            { date: '2023-11-02', value: 32 },
            { date: '2023-11-03', value: 33 },
        ],
        '1m': [
            { date: '2023-10-01', value: 30 },
            { date: '2023-10-08', value: 31 },
            { date: '2023-10-15', value: 32 },
            { date: '2023-10-22', value: 32 },
            { date: '2023-10-29', value: 33 },
        ],
        '3m': [
            { date: '2023-08-01', value: 29 },
            { date: '2023-09-01', value: 30 },
            { date: '2023-09-15', value: 31 },
            { date: '2023-09-30', value: 32 },
            { date: '2023-10-15', value: 32 },
            { date: '2023-10-30', value: 33 },
        ],
        '6m': [
            { date: '2023-05-01', value: 28 },
            { date: '2023-06-01', value: 29 },
            { date: '2023-07-01', value: 30 },
            { date: '2023-08-01', value: 31 },
            { date: '2023-09-01', value: 32 },
            { date: '2023-10-01', value: 33 },
        ],
        '1y': [
            { date: '2023-01-01', value: 27 },
            { date: '2023-04-01', value: 28 },
            { date: '2023-07-01', value: 29 },
            { date: '2023-10-01', value: 30 },
        ],
    },
    fat: {
        '1w': [
            { date: '2023-10-28', value: 20 },
            { date: '2023-10-29', value: 19 },
            { date: '2023-10-30', value: 20 },
            { date: '2023-10-31', value: 21 },
            { date: '2023-11-01', value: 20 },
            { date: '2023-11-02', value: 19 },
            { date: '2023-11-03', value: 18 },
        ],
        '1m': [
            { date: '2023-10-01', value: 20 },
            { date: '2023-10-08', value: 21 },
            { date: '2023-10-15', value: 22 },
            { date: '2023-10-22', value: 21 },
            { date: '2023-10-29', value: 20 },
        ],
        '3m': [
            { date: '2023-08-01', value: 22 },
            { date: '2023-09-01', value: 21 },
            { date: '2023-09-15', value: 20 },
            { date: '2023-09-30', value: 19 },
            { date: '2023-10-15', value: 20 },
            { date: '2023-10-30', value: 21 },
        ],
        '6m': [
            { date: '2023-05-01', value: 23 },
            { date: '2023-06-01', value: 22 },
            { date: '2023-07-01', value: 21 },
            { date: '2023-08-01', value: 20 },
            { date: '2023-09-01', value: 19 },
            { date: '2023-10-01', value: 18 },
        ],
        '1y': [
            { date: '2023-01-01', value: 25 },
            { date: '2023-04-01', value: 24 },
            { date: '2023-07-01', value: 23 },
            { date: '2023-10-01', value: 22 },
        ],
    },
    water: {
        '1w': [
            { date: '2023-10-28', value: 2 },
            { date: '2023-10-29', value: 2.5 },
            { date: '2023-10-30', value: 2.4 },
            { date: '2023-10-31', value: 2.3 },
            { date: '2023-11-01', value: 2.6 },
            { date: '2023-11-02', value: 2.5 },
            { date: '2023-11-03', value: 2.7 },
        ],
        '1m': [
            { date: '2023-10-01', value: 2.5 },
            { date: '2023-10-08', value: 2.4 },
            { date: '2023-10-15', value: 2.6 },
            { date: '2023-10-22', value: 2.3 },
            { date: '2023-10-29', value: 2.5 },
        ],
        '3m': [
            { date: '2023-08-01', value: 2.7 },
            { date: '2023-09-01', value: 2.6 },
            { date: '2023-09-15', value: 2.5 },
            { date: '2023-09-30', value: 2.4 },
            { date: '2023-10-15', value: 2.5 },
            { date: '2023-10-30', value: 2.6 },
        ],
        '6m': [
            { date: '2023-05-01', value: 2.8 },
            { date: '2023-06-01', value: 2.7 },
            { date: '2023-07-01', value: 2.6 },
            { date: '2023-08-01', value: 2.5 },
            { date: '2023-09-01', value: 2.4 },
            { date: '2023-10-01', value: 2.3 },
        ],
        '1y': [
            { date: '2023-01-01', value: 3 },
            { date: '2023-04-01', value: 2.9 },
            { date: '2023-07-01', value: 2.8 },
            { date: '2023-10-01', value: 2.7 },
        ],
    },
    steps: {
        '1w': [
            { date: '2023-10-28', value: 10000 },
            { date: '2023-10-29', value: 12000 },
            { date: '2023-10-30', value: 11000 },
            { date: '2023-10-31', value: 13000 },
            { date: '2023-11-01', value: 12500 },
            { date: '2023-11-02', value: 14000 },
            { date: '2023-11-03', value: 15000 },
        ],
        '1m': [
            { date: '2023-10-01', value: 11000 },
            { date: '2023-10-08', value: 12000 },
            { date: '2023-10-15', value: 13000 },
            { date: '2023-10-22', value: 14000 },
            { date: '2023-10-29', value: 15000 },
        ],
        '3m': [
            { date: '2023-08-01', value: 9000 },
            { date: '2023-09-01', value: 9500 },
            { date: '2023-09-15', value: 10000 },
            { date: '2023-09-30', value: 10500 },
            { date: '2023-10-15', value: 11000 },
            { date: '2023-10-30', value: 12000 },
        ],
        '6m': [
            { date: '2023-05-01', value: 8000 },
            { date: '2023-06-01', value: 8500 },
            { date: '2023-07-01', value: 9000 },
            { date: '2023-08-01', value: 9500 },
            { date: '2023-09-01', value: 10000 },
            { date: '2023-10-01', value: 11000 },
        ],
        '1y': [
            { date: '2023-01-01', value: 7000 },
            { date: '2023-04-01', value: 7500 },
            { date: '2023-07-01', value: 8000 },
            { date: '2023-10-01', value: 8500 },
        ],
    },
    exercise: {
        '1w': [
            { date: '2023-10-28', value: 30 }, // minutos
            { date: '2023-10-29', value: 40 },
            { date: '2023-10-30', value: 35 },
            { date: '2023-10-31', value: 50 },
            { date: '2023-11-01', value: 45 },
            { date: '2023-11-02', value: 60 },
            { date: '2023-11-03', value: 55 },
        ],
        '1m': [
            { date: '2023-10-01', value: 40 },
            { date: '2023-10-08', value: 45 },
            { date: '2023-10-15', value: 50 },
            { date: '2023-10-22', value: 55 },
            { date: '2023-10-29', value: 60 },
        ],
        '3m': [
            { date: '2023-08-01', value: 30 },
            { date: '2023-09-01', value: 35 },
            { date: '2023-09-15', value: 40 },
            { date: '2023-09-30', value: 45 },
            { date: '2023-10-15', value: 50 },
            { date: '2023-10-30', value: 55 },
        ],
        '6m': [
            { date: '2023-05-01', value: 25 },
            { date: '2023-06-01', value: 30 },
            { date: '2023-07-01', value: 35 },
            { date: '2023-08-01', value: 40 },
            { date: '2023-09-01', value: 45 },
            { date: '2023-10-01', value: 50 },
        ],
        '1y': [
            { date: '2023-01-01', value: 20 },
            { date: '2023-04-01', value: 25 },
            { date: '2023-07-01', value: 30 },
            { date: '2023-10-01', value: 35 },
        ],
    },
};

function ChartDisplay({ type, timeRange }) {
    const chartData = data[type][timeRange] || []; // Accede a los datos según el tipo y el rango de tiempo

    const chartTitle = {
        weight: 'Histórico del Peso',
        muscle: 'Histórico del Músculo',
        fat: 'Histórico del Porcentaje de Grasa Corporal',
        water: 'Histórico de Agua',
        steps: 'Histórico de Pasos',
        exercise: 'Histórico de Ejercicio',
    };

    return (
        <div className="w-full h-72 p-4 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">{chartTitle[type]}</h3>
            <ResponsiveContainer>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

function HistoricalDataSection() {
    const [selectedData, setSelectedData] = useState('weight');
    const [selectedTimeframe, setSelectedTimeframe] = useState('1m');

    const handleDataChange = (dataType) => {
        setSelectedData(dataType);
    };

    const handleTimeframeChange = (event) => {
        setSelectedTimeframe(event.target.value);
    };

    return (
        <div className="bg-gray-100 w-full flex">
    <Sidebar />
    <div className="flex-grow p-6 bg-gray-100 rounded-lg shadow-md ml-[16.5%]">  {/* Agregado flex-grow aquí */}
        <h2 className="text-3xl font-bold mb-4 text-center">Histórico de Datos</h2>
        <label htmlFor="timeRange" className="block mb-2 text-lg">Selecciona el período:</label>
        <select 
            id="timeRange" 
            value={selectedTimeframe} 
            onChange={handleTimeframeChange} 
            className="mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        >
            <option value="1w">1 semana</option>
            <option value="1m">1 mes</option>
            <option value="3m">3 meses</option>
            <option value="6m">6 meses</option>
            <option value="1y">1 año</option>
        </select>

        <Tabs>
            <TabList className="flex space-x-4 mb-4 border-b-2 border-gray-300">
                {['weight', 'muscle', 'fat', 'water', 'steps', 'exercise'].map((type) => (
                    <Tab 
                        key={type} 
                        onClick={() => handleDataChange(type)} 
                        className={`py-2 px-4 cursor-pointer rounded-md ${selectedData === type ? 'border-b-2 border-blue-500 font-semibold text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Tab>
                ))}
            </TabList>

            {['weight', 'muscle', 'fat', 'water', 'steps', 'exercise'].map((type) => (
                <TabPanel key={type}>
                    {type === selectedData && <ChartDisplay type={type} timeRange={selectedTimeframe} />}
                </TabPanel>
            ))}
        </Tabs>
    </div>
</div>

    );
}

export default HistoricalDataSection;