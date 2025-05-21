import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Image from "next/image";

interface RamoAtividadeProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  onClick: () => void; // função para fechar o modal
}

export default function RamoAtividade({ data, onClick }: RamoAtividadeProps) {
  return (
    <div className="bg-white rounded-sm shadow-md p-5 w-full h-full border border-gray-200 flex flex-col">
      {/* Cabeçalho com título e seta */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold">Empresas por Ramo de Atividade</h2>
        <div onClick={onClick} className="cursor-pointer p-1.5">
          <Image
            src="/assets/icons/Vector 1275.svg"
            width={12}
            height={13.33}
            alt="Fechar"
          />
        </div>
      </div>

      {/* Wrapper com scroll vertical */}
      <div className="w-full overflow-y-auto" style={{ maxHeight: 300 }}>
        <ResponsiveContainer width="100%" height={data.length * 35}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
            barSize={20}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={250}
              tick={{ fontSize: 14, fill: "#374151", fontWeight: 500 }}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "#f9fafb" }}
              contentStyle={{
                borderRadius: "8px",
                borderColor: "#d1d5db",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[0, 0, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

