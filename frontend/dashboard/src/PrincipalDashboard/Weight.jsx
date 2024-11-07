import React from "react";
import { FaWeight } from 'react-icons/fa'; // Importa el ícono de peso

export default function Weight({ weight }) {
    return (
        <div style={{}}>
            <h3 style={{marginLeft: '10px'}}><FaWeight style={{ color:'#67a0ae', justifyContent: 'center', top: '0', left: '0', fontSize: '30px', textAlign: 'center', marginLeft: '30px'}} /> Peso actual</h3>
            <p style={{ fontSize: '40px', marginTop: '40px' }}>{weight} kg</p>
        </div>
    );
}
