import React from 'react';
import { BarChart, Bar, XAxis, YAxis,  Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '00 a 25', colaboradores: 414 },
  { name: '26 a 35', colaboradores: 885 },
  { name: '36 a 45', colaboradores: 775 },
  { name: '46 a 55', colaboradores: 518 },
  { name: '55+', colaboradores: 387 },
];

const GraficoFaixaEtaria = () => {
  return (
    <div style={{ width: '100%', height: 250 }}>
      <h3 style={{ textAlign: 'center', marginBottom: '10px' , fontWeight:'bold',}}>Colaboradores por Faixa Etária</h3>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          barSize={20}
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 5,
          }}
        >
       
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name"  tickLine={false}/>
          <Tooltip />
          <Bar dataKey="colaboradores" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoFaixaEtaria;
