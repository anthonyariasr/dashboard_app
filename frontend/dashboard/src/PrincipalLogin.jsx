import React from "react";
import logo from '../src/images/Logo.png';
import LoginForm from "./Register/LoginForm";

export default function PrincipalLogin (){
    return(
        <div className="mt-0 flex justify-center items-center min-h-screen overflow-auto">
            <LoginForm/>
        </div>
    )
}