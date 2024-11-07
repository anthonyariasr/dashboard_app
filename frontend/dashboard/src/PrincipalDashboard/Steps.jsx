import * as React from 'react';

export default function StepCounter({ value }) {
  // Limitar el valor de steps a un máximo de 10,000
  const maxSteps = 10000;
  const normalizedSteps = Math.min(value, maxSteps);

  // Calcular el porcentaje de la barra que debe llenarse
  const percentage = (normalizedSteps / maxSteps) * 100;

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <h3>Pasos</h3>
      <svg width="200" height="30" className='justify-center items-center' style={{textAlign: 'center', marginLeft: '180px'}}>
        {/* Fondo de la barra */}
        <rect x="0" y="5" width="200" height="20" fill="#e0e0e0" rx="10"/>
        {/* Barra de progreso */}
        <rect x="0" y="5" width={(percentage * 200) / 100} height="20" fill="#76c7c0" rx="10" />
      </svg>
      <p>{normalizedSteps} / {maxSteps} pasos</p>
    </div>
  );
}
