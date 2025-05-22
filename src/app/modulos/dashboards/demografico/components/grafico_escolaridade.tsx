import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Ensino Médio Com.', colaboradores: 1.7 },
  { name: 'Superior Incompleto', colaboradores: 0.2 },
  { name: 'Superior Completo', colaboradores: 0.5 },
  { name: 'Mestrado', colaboradores: 0.0 },
  { name: 'Doutorado', colaboradores: 0.0 },
];

export const GraficoEscolaridade: React.FC = () => { // Exportação nomeada
  return (
    <div style={{ width: '100%', height: 250 }}>
      <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Colaboradores por Escolaridade</h3>
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