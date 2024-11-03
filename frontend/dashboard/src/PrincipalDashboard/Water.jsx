import * as React from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import './Dashborad.css';

export default function ChartsOverviewDemo() {
  const settings = {
    width: 200,
    height: 200,
    value: 0,
  };
  return (
    <div>
      <h3>Water</h3>
      <Gauge
  {...settings}
  cornerRadius="50%"
  sx={(theme) => ({
    [`& .${gaugeClasses.valueText}`]: {
      fontSize: 40,
    },
    [`& .${gaugeClasses.valueArc}`]: {
      fill: '#ADD8E6',
    },
    [`& .${gaugeClasses.referenceArc}`]: {
      fill: theme.palette.text.disabled,
    },
  })}
/>
    </div>
  );
}
