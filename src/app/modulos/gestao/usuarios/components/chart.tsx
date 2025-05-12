import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export default function UserChart() {
  return (
   
      <div className=" w-full h-[300px] p-3">
        <div className="w-full h-full bg-white">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: "Jan", valor: 81.87 },
                { name: "Fev", valor: 74.91 },
                { name: "Mar", valor: 28.02 },
                { name: "Abr", valor: 72.81 },
                { name: "Mai", valor: 49.64 },
                { name: "Jun", valor: 14.22 },
                { name: "Jul", valor: 11.87 },
                { name: "Ago", valor: 45.58 },
                { name: "Set", valor: 77.97 },
                { name: "Out", valor: 47.09 },
                { name: "Nov", valor: 86.52 },
                { name: "Dez", valor: 43.64 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="valor" fill="#8884d8" opacity={0.6}>
                <LabelList
                  dataKey="valor"
                  position="top"
                  formatter={(value: number) => value.toFixed(2)}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    
  );
}
