import * as React from 'react';
import './Dashborad.css';

export default function Water({ values }) {
  // Limitar el valor a un máximo de 10 vasos
  const adjustedValues = Math.min(values, 10);

  // Calcular el porcentaje de llenado en base a 10 vasos
  const percentage = (adjustedValues / 10) * 100;

  // Configuración del círculo
  const radius = 100;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="dashboard-container">
      <h3 className='mb-[10px]'>Consumo de agua</h3>

      {/* Círculo SVG que se llena según el valor de 'percentage' */}
      <svg width="220" height="220" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
        {/* Círculo de fondo */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="#B0BEC5"
          strokeWidth="20"
        />
        
        {/* Círculo que representa el progreso de agua */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="#76c7c0" // Color celeste del agua
          strokeWidth="20"
          strokeDasharray={`${circumference} ${circumference}`} // Circunferencia completa
          strokeDashoffset={circumference - (percentage / 100) * circumference} // Desfase según el porcentaje
          transform="rotate(-90 110 110)" // Iniciar desde la parte superior
        />
        
        {/* Texto en el centro que muestra la cantidad actual / meta */}
        <text
          x="110"
          y="110"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="24"
          fill="#333"
        >
          {adjustedValues}/10
        </text>

        {/* Texto en la parte inferior que indica el objetivo en letra pequeña */}
        <text
          x="110"
          y="140"
          textAnchor="middle"
          fontSize="12"
          fill="#666"
        >
          Meta: 10 vasos
        </text>
      </svg>

      {/* Mostrar el porcentaje de agua consumida */}
      <div className="percentage">
        Haz completado el {percentage.toFixed(0)}% de tu meta diaria
      </div>
    </div>
  );
}
