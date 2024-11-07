import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../SideBar/Sidebar";
import Water from "../PrincipalDashboard/Water";
import Weight from "./Weight";
import Height from "./Height";
import CorporalComposition from "./CorporalComposition";
import BodyFatPercentaje from "./BodyFatPercentaje";
import Steps from "./Steps";
import ExcercisesList from "./ExcercisesList";
import './Dashborad.css';

const Dashboard = () => {
    
    const [data, setData] = useState({
        weight: "Loading...",
        height: "Loading...",
        body_composition: { fat: "Loading...", muscle: "Loading...", water: "Loading..." },
        body_fat_percentage: "Loading...",
        total_water_consumption: "Loading...",
        total_daily_steps: "Loading...",
        exercises: {name:"Loading...", duration: "Loading.."}
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem("id");
                console.log(userId)
                const response = await axios.get(`http://127.0.0.1:8000/data/generalView?userId=${userId}`);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div className="dashboard">
                <div className="Weight card">
                    <Weight weight={data.weight} className="Weight"/>
                </div>
                <div className="Height card">
                    <Height height={data.height} className="Height"/>
                </div>
                <div className="Water card">
                    <Water values={data.total_water_consumption}/>
                </div>
                <div className="CorporalComposition card">
                <CorporalComposition 
                    weight={data.weight} 
                    fat={data.body_composition?.fat || "N/A"} 
                    muscle={data.body_composition?.muscle || "N/A"} 
                    water={data.body_composition?.water || "N/A"} 
                    className="CorporalComposition"/>
                </div>
                <div className="BodyFatPercentaje card">
                <BodyFatPercentaje value={parseInt(data.body_fat_percentage)} className="BodyFatPercentage"/>
                </div>
                <div className="Steps card">
                <Steps value={data.total_daily_steps} className="Steps"/>
                </div>
                <div className="ExcercisesList card">
                <ExcercisesList exercises={data.exercises} className="ExercisesList"/>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
