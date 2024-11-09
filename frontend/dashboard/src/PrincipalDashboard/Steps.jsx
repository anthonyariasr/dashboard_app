import * as React from 'react';

export default function StepCounter({ value }) {
  // Limitar el valor de steps a un máximo de 10,000
  const maxSteps = 10000;
  const normalizedSteps = Math.min(value, maxSteps);

  // Calcular el porcentaje de la barra que debe llenarse
  const percentage = (normalizedSteps / maxSteps) * 100;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h3>Pasos</h3>
      {/* Eliminar el estilo en línea y aplicar el centrado con Tailwind */}
      <svg width="200" height="30" className="mt-2">
        {/* Fondo de la barra */}
        <rect x="0" y="5" width="200" height="20" fill="#e0e0e0" rx="10" />
        {/* Barra de progreso */}
        <rect x="0" y="5" width={(percentage * 200) / 100} height="20" fill="#76c7c0" rx="10" />
      </svg>
      <p className="mt-2">{normalizedSteps} / {maxSteps} pasos</p>
    </div>
  );
}
