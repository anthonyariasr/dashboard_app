import React from "react";
import { BarChart } from '@mui/x-charts/BarChart';

export default function CorporalComposition({weight, fat, muscle, water}){


    return(
        <div className="">
            <h3 style={{justifyContent: 'center', textAlign: 'center'}}>Composición corporal</h3>
             <BarChart
                xAxis={[{ scaleType: 'band', data: ['Fat', 'Muscle', 'Water'] }]}
                series={[{ data: [fat, muscle, water] }]}
                width={500}
                height={300}
                barLabel="value"
    />
        </div>
    );
}