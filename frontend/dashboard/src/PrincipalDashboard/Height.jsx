import React from "react";

export default function Height({height}){
    
    return(
        <div>
            <h3>Actual Height</h3>
            <p style={{fontSize: '40px', marginTop: '40px'}}>{height} cm</p>
        </div>
    );
}