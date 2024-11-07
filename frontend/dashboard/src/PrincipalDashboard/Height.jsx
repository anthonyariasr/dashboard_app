import React from "react";
import { FaRulerVertical } from 'react-icons/fa'; // Importa el ícono de altura

export default function Height({ height }) {
    return (
        <div>
            <h3  style={{justifyContent: 'center', marginLeft:'30px'}}><FaRulerVertical style={{color:'#67a0ae', justifyContent: 'center', top: '0', left: '0', fontSize: '30px', textAlign: 'center', marginLeft: '30px'}}/> Altura actual</h3>
            <p style={{ fontSize: '40px', marginTop: '40px'}}>{height} cm</p>
        </div>
    );
}
