import React from "react";
import logo from '../src/images/Logo.png';
import RegisterForm from "./Register/RegisterForm";

export default function Principal (){
    return(
        <div className="background mt-0 flex">
            <br />
            <br />
            <br />
            <img src={logo} alt="" className="ml-[200px] mb-[80px]"/>
            <div className="register">
            <RegisterForm/>
            </div>
        </div>
    )
}