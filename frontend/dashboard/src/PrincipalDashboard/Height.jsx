import React, {useState, useEffect} from "react";

export default function Height(){
    const [height, setheight] = useState('');

    useEffect(() => {
        // Obtén el nombre de usuario del localStorage
        const storedHeight = localStorage.getItem('height');
        if (storedHeight) {
            setheight(storedHeight);
        }
    }, []);
    return(
        <div>
            <h3>Actual Height</h3>
            <p style={{fontSize: '40px', marginTop: '40px'}}>{height} cm</p>
        </div>
    );
}