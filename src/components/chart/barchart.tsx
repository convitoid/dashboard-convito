// components/BarChart.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type BarChartProps = {
   statisticsData: any;
};

export const BarChart = ({ statisticsData }: BarChartProps) => {
   const data = {
      labels: [
         'January',
         'February',
         'March',
         'April',
         'May',
         'June',
         'July',
         'August',
         'September',
         'October',
         'November',
         'December',
      ],
      datasets: [
         {
            label: 'Clients',
            data: statisticsData,
            backgroundColor: 'rgba(28, 28, 28, 0.5)',
            borderColor: 'rgba(28, 28, 28, 1)',
            borderWidth: 1,
         },
      ],
   };

   const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
         legend: {
            position: 'top' as const,
         },
         title: {
            display: false,
            text: 'Clients statisics',
         },
      },
   };

   return (
      <div style={{ position: 'relative', height: '52vh', width: '100%' }}>
         <Bar data={data} options={options} />
      </div>
   );
};
