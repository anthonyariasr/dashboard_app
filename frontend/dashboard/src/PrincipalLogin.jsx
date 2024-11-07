import React from "react";
import logo from '../src/images/Logo.png';
import LoginForm from "./Register/LoginForm";

export default function PrincipalLogin (){
    return(
        <div className="background mt-0 flex">
            <br />
            <br />
            <br />
            <img src={logo} alt="" className="ml-[200px] mb-[80px]"/>
            <LoginForm/>
        </div>
    )
}