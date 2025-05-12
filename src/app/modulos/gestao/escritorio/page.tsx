export default function Escritorio() {
    const data = [
        {
            metric: "Quantidade de Clientes",
            values: ["564", "554", "564", "564", "564", "565"],
        },
        {
            metric: "Faturamento da Empresa",
            values: ["R$ 318.700,24", "R$ 267.346,45", "R$ 286.290,78", "R$ 513.989,65", "R$ 390.507,66", "R$ 329.600,90"],
        },
        {
            metric: "Variação de Faturamento",
            values: ["2,5%", "-16,1%", "7,1%", "79,5%", "79,5%", "-15,6%"],
        },
        {
            metric: "Tempo Ativo no Sistema",
            values: ["63:55:39", "39:14:09", "58:13:41", "65:57:56", "44:32:24", "67:41:05"],
        },
        {
            metric: "Lançamentos",
            values: ["394", "55", "613", "374", "363", "347"],
        },
        {
            metric: "% de Lançamentos Manuais",
            values: ["17,8%", "3,6%", "32,1%", "39,0%", "7,4%", "23,3%"],
        },
        {
            metric: "Vínculos de Folhas Ativos",
            values: ["53", "54", "64", "64", "64", "65"],
        },
        {
            metric: "Notas Fiscais Emitidas",
            values: ["33", "32", "56", "77", "79", "44"],
        },
        {
            metric: "Total de Notas Fiscais Movimentadas",
            values: ["66", "91", "96", "142", "184", "85"],
        },
        {
            metric: "Faturamento do Escritório",
            values: ["R$ 1.850,00", "R$ 1.850,00", "R$ 1.850,00", "R$ 1.850,00", "R$ 1.850,00", "R$ 1.850,00"],
        },
        {
            metric: "Rentabilidade Operacional",
            values: ["R$ 1.850,00", "R$ 1.800,00", "R$ 1.900,00", "R$ 1.750,00", "R$ 1.950,00", "R$ 1.820,00"],
        },
    ];

    const headers = ["Jan/2024", "Fev/2024", "Mar/2024", "Abr/2024", "Mai/2024", "Jun/2024"];

    const thStyle = "px-4 py-2 text-left text-sm font-semibold bg-gray-100 border-b border-gray-300 capitalize text-[#373A40]";
    const tdStyle = "px-4 py-2 text-sm border-b border-gray-300 text-[#373A40]";
    const tdMetricStyle = `${tdStyle} font-semibold`;


    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <div className="overflow-x-auto p-4 bg-white shadow-lg rounded-lg w-max min-w-full shadow-gray-600">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className={`${thStyle} w-1/4`}></th>
                            {headers.map((header) => (
                                <th key={header} className={thStyle}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={row.metric} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className={tdMetricStyle}>{row.metric}</td>
                                {row.values.map((value, index) => (
                                    <td key={`${row.metric}-${index}`} className={tdStyle}>
                                        {value}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}