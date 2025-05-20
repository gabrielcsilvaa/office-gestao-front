import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { AtividadesPorMes } from "../interfaces/interface";
import { arredondarMaximo } from "@/utils/formatadores";

interface CustomLabelProps {
  x?: number;
  y?: number;
  value?: number | string;
}

const CustomLabel = (props: CustomLabelProps) => {
  const { x = 0, y = 0, value } = props;
  const offsetX = 10; // move para direita
  const offsetY = -10; // move para cima
  const rotation = -45; // ângulo -45 graus (pode ajustar)

  return (
    <text
      x={x + offsetX}
      y={y + offsetY}
      fill="#000"
      fontSize={13}
      textAnchor="start" // ajusta ancoragem para o início do texto
      transform={`rotate(${rotation}, ${x + offsetX}, ${y + offsetY})`}
    >
      {typeof value === "number" ? value.toLocaleString() : value}
    </text>
  );
};

interface UserChartProps {
  dados: AtividadesPorMes;
}

export default function UserChart({ dados }: UserChartProps) {
  const maxValor = Math.max(...dados.map((item) => item.valor));
  const valorYcalculado = Math.ceil(maxValor * 1.5);
  const maxYAxis = arredondarMaximo(valorYcalculado); // arredonda para cima para o próximo múltiplo de 10
  return (
    <div className="w-full h-[300px] p-3">
      <div className="w-full h-full bg-white">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dados}
            margin={{ top: 20, right: 50, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-10}
              textAnchor="end"
              height={10}
              interval={0}
              tickMargin={10}
              tick={{ fontSize: 13 }}
            />

            <YAxis domain={[0, maxYAxis]} />
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString()} h`}
            />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#4a90e2"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                dataKey="valor"
                position="top"
                formatter={(value: number) => value.toLocaleString()}
                content={<CustomLabel />}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
