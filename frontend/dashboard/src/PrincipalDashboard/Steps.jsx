import * as React from 'react';
import { Gauge } from '@mui/x-charts/Gauge';

export default function BasicGauges({value}) {
  return (
        <div>
            <h3>Steps</h3>
            <Gauge width={100} height={100} value={value} startAngle={-90} endAngle={90} />
        </div>
  );
}