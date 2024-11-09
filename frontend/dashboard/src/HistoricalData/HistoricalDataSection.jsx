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
        <div className="w-full h-72 sm:h-96 p-6 bg-white rounded-xl shadow-lg transition duration-300 transform hover:scale-105">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-700">{chartTitle[type]}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={type === 'exercises' ? null : chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" type="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {type === 'body_composition' ? (
                        <>
                            <Line type="monotone" dataKey="fat" name="Grasa Corporal (%)" stroke="#FF6361" />
                            <Line type="monotone" dataKey="muscle" name="Músculo (%)" stroke="#FFA600" />
                            <Line type="monotone" dataKey="water" name="Agua (%)" stroke="#003f5c" />
                        </>
                    ) : type === 'exercises' ? (
                        Object.keys(chartData).map((exerciseName, index) => (
                            <Line 
                                key={exerciseName} 
                                type="monotone" 
                                data={chartData[exerciseName]} 
                                dataKey="total_duration" 
                                name={exerciseName} 
                                stroke={`hsl(${index * 60}, 70%, 50%)`} 
                                connectNulls={true} 
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
            <div className="flex-grow p-6 sm:p-8 bg-white rounded-lg shadow-md sm:ml-[16.5%]">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">Histórico de Datos</h2>
                
                <label htmlFor="timeRange" className="block mb-2 text-md sm:text-lg font-medium text-gray-700">Selecciona el período:</label>
                <select 
                    id="timeRange" 
                    value={selectedTimeframe} 
                    onChange={handleTimeframeChange} 
                    className="mb-6 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto transition"
                >
                    <option value="1w">1 semana</option>
                    <option value="1m">1 mes</option>
                    <option value="3m">3 meses</option>
                    <option value="6m">6 meses</option>
                    <option value="1y">1 año</option>
                </select>

                <Tabs>
                    <TabList className="flex flex-wrap gap-2 sm:gap-4 mb-6 border-b-2 border-gray-300">
                        {['weight', 'height', 'body_composition', 'body_fat_percentage', 'total_water_consumption', 'total_daily_steps', 'exercises'].map((type) => (
                            <Tab 
                                key={type} 
                                onClick={() => handleDataChange(type)} 
                                className={`py-2 px-4 cursor-pointer rounded-md transition duration-200 ${
                                    selectedData === type 
                                    ? 'border-b-4 border-blue-500 font-semibold text-blue-500 bg-blue-100'
                                    : 'text-gray-600 hover:text-blue-500 hover:bg-gray-200'
                                }`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ')}
                            </Tab>
                        ))}
                    </TabList>

                    {['weight', 'height', 'body_composition', 'body_fat_percentage', 'total_water_consumption', 'total_daily_steps', 'exercises'].map((type) => (
                        <TabPanel key={type} className="transition-opacity duration-300 ease-in-out">
                            {type === selectedData && <ChartDisplay type={type} chartData={type === 'exercises' ? data.exercises : data[type]} />}
                        </TabPanel>
                    ))}
                </Tabs>
            </div>
        </div>
    );
}

export default HistoricalDataSection;
