import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
      <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Colaboradores por Faixa Etária</h3>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <Tooltip />
          <Bar dataKey="colaboradores" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoFaixaEtaria;
