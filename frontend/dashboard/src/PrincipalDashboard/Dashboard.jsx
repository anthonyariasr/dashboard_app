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

const Dashboard = () => {
  const [data, setData] = useState({
    weight: "Loading...",
    height: "Loading...",
    body_composition: {
      fat: "Loading...",
      muscle: "Loading...",
      water: "Loading...",
    },
    body_fat_percentage: "Loading...",
    total_water_consumption: "Loading...",
    total_daily_steps: "Loading...",
    exercises: { name: "Loading...", duration: "Loading.." },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("id");
        console.log(userId);
        const response = await axios.get(
          `http://127.0.0.1:8000/data/generalView?userId=${userId}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex max-w-full">
      <div className="md:w-64">
        {/* Ancho fijo para el Sidebar */}
        <Sidebar />
      </div>
      <div className="flex-1 p-4 grid gap-6 lg:grid-cols-2">
        {/* Cards con ajuste de tamaño y mayor ancho en versión web */}
        <div className="card p-4 w-full h-auto bg-white rounded-lg shadow-md flex flex-col justify-center items-center">
          <Weight weight={data.weight} />
        </div>
        <div className="card p-4 w-full h-auto bg-white rounded-lg shadow-md flex flex-col justify-center items-center">
          <Height height={data.height} />
        </div>
        <div className="card p-4 w-full h-auto bg-white rounded-lg shadow-md flex flex-col justify-center items-center">
          <Water values={data.total_water_consumption} />
        </div>
        <div className="card p-4 w-full h-auto bg-white rounded-lg shadow-md flex flex-col justify-center items-center">
          <CorporalComposition
            weight={data.weight}
            fat={data.body_composition?.fat || "N/A"}
            muscle={data.body_composition?.muscle || "N/A"}
            water={data.body_composition?.water || "N/A"}
          />
        </div>
        <div className="card p-4 w-full h-auto bg-white rounded-lg shadow-md flex flex-col justify-center items-center">
          <BodyFatPercentaje value={parseInt(data.body_fat_percentage)} />
        </div>
        <div className="card p-4 w-full h-auto bg-white rounded-lg shadow-md flex flex-col justify-center items-center">
          <Steps value={data.total_daily_steps} />
        </div>
        <div className="card p-4 w-full h-auto bg-white rounded-lg shadow-md flex flex-col justify-center items-center">
          <ExcercisesList exercises={data.exercises} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
