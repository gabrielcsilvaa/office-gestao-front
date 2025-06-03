import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Empregado", colaboradores: 2275 },
  { name: "Diretor", colaboradores: 441 },
  { name: "Estagiário", colaboradores: 48 },
  { name: "Empregado Domés...", colaboradores: 35 },
  { name: "Trabalhador Autôno...", colaboradores: 33 },
];

const GraficoCategoria = () => {
  return (
    <div style={{ width: "100%", height: 250 }}>
      <h3
        style={{
          textAlign: "center",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        Colaboradores por Categoria
      </h3>
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
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" tickLine={false}/>
          <Tooltip />
          <Bar dataKey="colaboradores" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoCategoria;
