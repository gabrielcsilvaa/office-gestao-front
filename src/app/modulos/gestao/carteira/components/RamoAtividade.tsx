import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface RamoAtividadeProps {
    data: Array<{
        name: string;
        value: number;
    }>;
}

export default function RamoAtividade({ data }: RamoAtividadeProps) {
    return (
        <div className="bg-white rounded-sm shadow-md p-6 w-full h-full border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Empresas por Ramo de Atividade</h2>
            <div style={{ width: "100%", height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
                        barSize={20}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis type="number" hide />
                        <YAxis
                            type="category"
                            dataKey="name"
                            width={200}
                            tick={{ fontSize: 14, fill: "#374151", fontWeight: 500 }}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: "#f9fafb" }}
                            contentStyle={{
                                borderRadius: "8px",
                                borderColor: "#d1d5db",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                            }}
                        />
                        <Bar dataKey="value" fill="#3b82f6" radius={[0,0,0,0,]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
