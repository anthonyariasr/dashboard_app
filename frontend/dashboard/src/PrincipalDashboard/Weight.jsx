import React, {useState, useEffect} from "react";

export default function Weight (){
    const [weight, setweight] = useState('');

    useEffect(() => {
        // Obtén el nombre de usuario del localStorage
        const storedWeight = localStorage.getItem('weight');
        if (storedWeight) {
            setweight(storedWeight);
        }
    }, []);
    return(
        <div>
            <h3>Actual Weight</h3>
            <p style={{fontSize: '40px', marginTop: '40px'}}>{weight}kg</p>
        </div>
    );
}