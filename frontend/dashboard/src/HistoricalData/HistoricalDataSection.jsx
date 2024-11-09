import Sidebar from "../SideBar/Sidebar";
import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

function ChartDisplay({ type, chartData }) {
    const chartTitle = {
        weight: 'Histórico del Peso',
        muscle: 'Histórico del Músculo',
        fat: 'Histórico del Porcentaje de Grasa Corporal',
        water: 'Histórico de Agua',
        steps: 'Histórico de Pasos',
        exercise: 'Histórico de Ejercicio',
        body_composition: 'Histórico de Composición Corporal'
    };

    return (
        <div className="w-full h-72 sm:h-96 p-4 bg-white rounded-lg shadow-lg">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{chartTitle[type]}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={type === 'exercises' ? null : chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" type="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {type === 'body_composition' ? (
                        <>
                            <Line type="monotone" dataKey="fat" name="Grasa Corporal (%)" stroke="#FF0000" />
                            <Line type="monotone" dataKey="muscle" name="Músculo (%)" stroke="#00FF00" />
                            <Line type="monotone" dataKey="water" name="Agua (%)" stroke="#0000FF" />
                        </>
                    ) : type === 'exercises' ? (
                        Object.keys(chartData).map((exerciseName, index) => (
                            <Line 
                                key={exerciseName} 
                                type="monotone" 
                                data={chartData[exerciseName]} 
                                dataKey="total_duration" 
                                name={exerciseName} 
                                stroke={`hsl(${index * 60}, 70%, 50%)`} // Diferentes colores para cada ejercicio
                                connectNulls={true} // Conecta puntos faltantes en las líneas
                                activeDot={{ r: 8 }} 
                            />
                        ))
                    ) : (
                        <Line type="monotone" dataKey="value" stroke="#3b82f6" activeDot={{ r: 8 }} />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

function HistoricalDataSection() {
    const [data, setData] = useState({
        weight: [],
        height: [],
        body_composition: [],
        body_fat_percentage: [],
        total_water_consumption: [],
        total_daily_steps: [],
        exercises: {}
    });
    const [selectedData, setSelectedData] = useState('weight');
    const [selectedTimeframe, setSelectedTimeframe] = useState('1w');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem("id");
                const timePeriods = {
                    "1w": "1_week",
                    "1m": "1_month",
                    "3m": "3_months",
                    "6m": "6_months",
                    "1y": "1_year"
                };

                const response = await axios.get(`http://127.0.0.1:8000/data/historical-data`, {
                    params: {
                        userId: userId,
                        time_period: timePeriods[selectedTimeframe]
                    }
                });

                const rawData = response.data;

                // Formateo de datos para cada tipo
                const formattedData = {
                    weight: rawData.weight.map(entry => ({ date: entry.date, value: entry.average_weight })),
                    height: rawData.height.map(entry => ({ date: entry.date, value: entry.average_height })),
                    body_composition: rawData.body_composition.map(entry => ({
                        date: entry.date,
                        fat: parseFloat(entry.average_fat),
                        muscle: parseFloat(entry.average_muscle),
                        water: parseFloat(entry.average_water)
                    })),
                    body_fat_percentage: rawData.body_fat_percentage.map(entry => ({ date: entry.date, value: parseFloat(entry.average_fat_percentage) })),
                    total_water_consumption: rawData.total_water_consumption.map(entry => ({ date: entry.date, value: entry.total_water })),
                    total_daily_steps: rawData.total_daily_steps.map(entry => ({ date: entry.date, value: entry.total_steps })),
                    exercises: rawData.exercises.reduce((acc, entry) => {
                        const exerciseType = entry.exercise_name;
                        if (!acc[exerciseType]) acc[exerciseType] = [];
                        acc[exerciseType].push({ date: entry.date, total_duration: entry.total_duration });
                        return acc;
                    }, {})
                };

                setData(formattedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [selectedTimeframe]);

    const handleDataChange = (type) => {
        setSelectedData(type);
    };

    const handleTimeframeChange = (event) => {
        setSelectedTimeframe(event.target.value);
    };

    return (
        <div className="bg-gray-100 w-full flex flex-col sm:flex-row">
            <Sidebar />
            <div className="flex-grow p-4 sm:p-6 bg-gray-100 rounded-lg shadow-md sm:ml-[16.5%]">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Histórico de Datos</h2>
                <label htmlFor="timeRange" className="block mb-2 text-md sm:text-lg">Selecciona el período:</label>
                <select 
                    id="timeRange" 
                    value={selectedTimeframe} 
                    onChange={handleTimeframeChange} 
                    className="mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 w-full sm:w-auto"
                >
                    <option value="1w">1 semana</option>
                    <option value="1m">1 mes</option>
                    <option value="3m">3 meses</option>
                    <option value="6m">6 meses</option>
                    <option value="1y">1 año</option>
                </select>

                <Tabs>
                    <TabList className="flex flex-wrap space-x-4 mb-4 border-b-2 border-gray-300">
                        {['weight', 'height', 'body_composition', 'body_fat_percentage', 'total_water_consumption', 'total_daily_steps', 'exercises'].map((type) => (
                            <Tab 
                                key={type} 
                                onClick={() => handleDataChange(type)} 
                                className={`py-2 px-4 cursor-pointer rounded-md ${selectedData === type ? 'border-b-2 border-blue-500 font-semibold text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ')}
                            </Tab>
                        ))}
                    </TabList>

                    {['weight', 'height', 'body_composition', 'body_fat_percentage', 'total_water_consumption', 'total_daily_steps', 'exercises'].map((type) => (
                        <TabPanel key={type}>
                            {type === selectedData && <ChartDisplay type={type} chartData={type === 'exercises' ? data.exercises : data[type]} />}
                        </TabPanel>
                    ))}
                </Tabs>
            </div>
        </div>
    );
}

export default HistoricalDataSection;