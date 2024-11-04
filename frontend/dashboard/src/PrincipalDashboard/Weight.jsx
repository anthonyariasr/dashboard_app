import React from "react";

export default function Weight ({weight}){
    
    return(
        <div>
            <h3>Actual Weight</h3>
            <p style={{fontSize: '40px', marginTop: '40px'}}>{weight}kg</p>
        </div>
    );
}