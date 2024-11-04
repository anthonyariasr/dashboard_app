import React from "react";

export default function CorporalComposition({weight, fat, muscle, water}){


    return(
        <div>
            <h3>Actual Corporal Composition</h3>
            <ul>
                <li>Total Weight: {weight} kg</li>
                <li>Proportion of fat: {fat} </li>
                <li>Muscle: {muscle}</li>
                <li>Water: {water}</li>
            </ul>
        </div>
    );
}