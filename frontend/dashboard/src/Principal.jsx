import React from "react";
import logo from '../src/images/Logo.png';
import RegisterForm from "./Register/RegisterForm";

export default function Principal (){
    return(
        <div className="mt-0 flex justify-center items-center min-h-screen overflow-auto">
            <RegisterForm/>
        </div>
    )
}