import React, {useEffect, useState} from "react";

export default function CorporalComposition(){
    const [height, setheight] = useState('');
    const [weight, setweight] = useState('');
    useEffect(() => {
        // Obtén el nombre de usuario del localStorage
        const storedHeight = localStorage.getItem('height');
        if (storedHeight) {
            setheight(storedHeight);
        }
    }, []);

    useEffect(() => {
        // Obtén el nombre de usuario del localStorage
        const storedWeight = localStorage.getItem('weight');
        if (storedWeight) {
            setweight(storedWeight);
        }
    }, []);

    return(
        <div>
            <h3>Actual Corporal Composition</h3>
            <ul>
                <li>Total Weight: {weight} kg</li>
                <li>Proportion of fat: </li>
                <li>Muscle: </li>
                <li>Water: </li>
            </ul>
        </div>
    );
}