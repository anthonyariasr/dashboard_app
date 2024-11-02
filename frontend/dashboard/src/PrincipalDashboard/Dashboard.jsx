import React from "react";
import Sidebar from "../SideBar/Sidebar";
import Water from "../PrincipalDashboard/Water"
import Weight from "./Weight";
import Height from "./Height";
import CorporalComposition from "./CorporalComposition";
import BodyFatPercentaje from "./BodyFatPercentaje";
import Steps from "./Steps";
import ExcercisesList from "./ExcercisesList";
import './Dashborad.css'

const Dashboard =()=>{
    return(
        <div style={{display: 'flex'}}>
            <Sidebar/>
        <div>
        </div>
        <div className="dashboard">
            <Water/>
            <Weight/>
            <Height/>
            <CorporalComposition/>
            <BodyFatPercentaje/>
            <Steps/>
            <ExcercisesList/>
        </div>
        </div>
    );
}

export default Dashboard;