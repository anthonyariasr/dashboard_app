import * as React from 'react';
import Stack from '@mui/material/Stack';
import { Gauge } from '@mui/x-charts/Gauge';

export default function BasicGauges() {
  return (
        <div>
            <h3>Steps</h3>
            <Gauge width={100} height={100} value={60} startAngle={-90} endAngle={90} />
        </div>
  );
}