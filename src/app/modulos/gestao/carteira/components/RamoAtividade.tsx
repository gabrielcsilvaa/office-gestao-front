import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const ramoData = [
    { name: "Comércio", value: 297 },
    { name: "Educação e Saúde", value: 112 },
    { name: "Desconhecido", value: 98 },
    { name: "Administração Pública e Serviços Diversos", value: 85 },
    { name: "Serviços Profissionais", value: 77 },
    { name: "Serviços Domésticos", value: 52 },
    { name: "Indústria", value: 51 },
    { name: "Construção", value: 39 },
    { name: "Outros", value: 32 },
    { name: "Informação e Comunicação", value: 30 },
    { name: "Hospedagem e Alimentação", value: 29 },
    { name: "Agropecuária", value: 14 },
];

export default function RamoAtividade() {
    return (
        <div className="bg-white rounded-sm shadow-md p-6 w-full h-full border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Empresas por Ramo de Atividade</h2>
            <div style={{ width: "100%", height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={ramoData}
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
