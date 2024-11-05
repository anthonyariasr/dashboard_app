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
                <Water values={data.total_water_consumption} />
                <Weight weight={data.weight} />
                <Height height={data.height} />
                <CorporalComposition 
                    weight={data.weight} 
                    fat={data.body_composition?.fat || "N/A"} 
                    muscle={data.body_composition?.muscle || "N/A"} 
                    water={data.body_composition?.water || "N/A"} 
                />
                <BodyFatPercentaje value={parseInt(data.body_fat_percentage)} />
                <Steps value={data.total_daily_steps} />
                <ExcercisesList exercises={data.exercises} />
            </div>
        </div>
    );
};

export default Dashboard;
