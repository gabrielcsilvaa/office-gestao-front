import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Ensino Médio Com.', colaboradores: 1.7 },
  { name: 'Superior Incompleto', colaboradores: 0.2 },
  { name: 'Superior Completo', colaboradores: 0.5 },
  { name: 'Mestrado', colaboradores: 0.0 },
  { name: 'Doutorado', colaboradores: 0.0 },
];

export const GraficoEscolaridade = () => {
  return (
    <div style={{ width: '100%', height: '250px'}}>
      <h3 style={{ textAlign: 'center', marginBottom: '10px' , fontWeight:'bold',}}>Colaboradores por Escolaridade</h3>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          barSize={20}
          margin={{
            top: 5,
            right: 30,
            left: 50,
            bottom: 5,
          }}
        >
           
          <XAxis type="number" hide/>
          <YAxis type="category" dataKey="name" tickLine={false}/>
          <Tooltip />
          <Bar dataKey="colaboradores" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
