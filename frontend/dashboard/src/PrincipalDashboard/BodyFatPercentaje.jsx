import * as React from 'react';
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from '@mui/x-charts/Gauge';
import { Tooltip } from '@mui/material';

function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) {
    return null;
  }

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };

  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="pink" />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke="pink"
        strokeWidth={3}
      />
    </g>
  );
}

export default function CompositionExample({ value }) {
  // Determinar el color de la zona según el valor del IMC
  let gaugeColor;
  if (value < 18.5) {
    gaugeColor = '#FF6347'; // rojo (bajo peso)
  } else if (value >= 18.5 && value < 25) {
    gaugeColor = '#3CB371'; // verde (normal)
  } else if (value >= 25 && value < 30) {
    gaugeColor = '#FFA500'; // naranja (sobrepeso)
  } else {
    gaugeColor = '#FF0000'; // rojo intenso (obesidad)
  }

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h3>Índice de Masa Corporal (IMC)</h3>
      <GaugeContainer
        width={250}
        height={250}
        startAngle={-110}
        endAngle={110}
        value={value}
      >
        <GaugeReferenceArc />
        <GaugeValueArc color={gaugeColor} />
        <GaugePointer />
      </GaugeContainer>
      <div>
        <p style={{ fontSize: '16px', margin: '10px 0' }}>
          Valor del IMC: <strong>{value}</strong>
        </p>
        <Tooltip title="IMC según la clasificación de la OMS" arrow>
          <p>
            <strong>Clasificación:</strong>
            <br />
            {value < 18.5 && 'Peso inferior al normal (Menos de 18.5)'}
            {value >= 18.5 && value < 25 && 'Normal (18.5 – 24.9)'}
            {value >= 25 && value < 30 && 'Peso superior al normal (25.0 – 29.9)'}
            {value >= 30 && 'Obesidad (Más de 30.0)'}
          </p>
        </Tooltip>
      </div>
    </div>
  );
}
