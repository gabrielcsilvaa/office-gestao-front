import { useState } from "react";

interface Empresa {
  id: number;
  nome: string;
  data_parceria: string;
  anos_parceria: string;
  data_atividades: string;
  anos_atividades: string;
}

const dadosEmpresas: Empresa[] = [
  { id: 1, nome: "A.K.F.G SERVICOS EDUCACIONAIS LTDA", data_parceria: "11/05/2023", anos_parceria: "2 anos", data_atividades: "11/05/2023", anos_atividades: "2 anos" },
  { id: 2, nome: "ANGELA MARIA DO VALE SALES", data_parceria: "30/04/2005", anos_parceria: "20 anos", data_atividades: "28/02/2005", anos_atividades: "20 anos" },
  { id: 3, nome: "ANTONIO CAVALCANTE PINTO NETO LTDA", data_parceria: "31/05/2024", anos_parceria: "1 ano", data_atividades: "27/11/2018", anos_atividades: "7 anos" },
  { id: 4, nome: "AZEVEDO PIRES INVESTIMENTOS LTDA", data_parceria: "12/05/2022", anos_parceria: "3 anos", data_atividades: "15/03/2022", anos_atividades: "3 anos" },
  { id: 5, nome: "BRENDA MAIA RIBEIRO", data_parceria: "19/05/2024", anos_parceria: "1 ano", data_atividades: "30/04/2024", anos_atividades: "1 ano" },
  { id: 6, nome: "C P GESTAO DE RECEBIVEIS LTDA", data_parceria: "28/04/2024", anos_parceria: "1 ano", data_atividades: "28/04/2024", anos_atividades: "1 ano" },
  { id: 7, nome: "CAPACITA POLITICAS PUBLICAS LTDA", data_parceria: "29/04/2024", anos_parceria: "1 ano", data_atividades: "29/04/2024", anos_atividades: "4 anos" }
];

export default function AniversariantesParceiros() {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Empresa; direction: "asc" | "desc" }>({
    key: "nome",
    direction: "asc",
  });

  const sortData = (key: keyof Empresa) => {
    const direction = sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const sortedClientes = [...dadosEmpresas].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    const aDate = new Date(aValue as string);
    const bDate = new Date(bValue as string);
    return sortConfig.direction === "asc" ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
  });

  const formatDateBr = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <div className="flex flex-col gap-4 overflow-x-auto max-h-[700px] w-full">
      <table className="w-full border border-gray-300 text-sm font-cairo">
        <thead>
          <tr className="bg-gray-200 border-b border-gray-400">
            <th className="px-4 py-2 border-r">#</th>
            <th className="px-4 py-2 cursor-pointer border-r" onClick={() => sortData("nome")}>Empresa {sortConfig.key === "nome" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}</th>
            <th className="px-4 py-2 cursor-pointer border-r" onClick={() => sortData("data_parceria")}>Data de Início de Parceria {sortConfig.key === "data_parceria" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}</th>
            <th className="px-4 py-2 border-r">Anos de Parceria</th>
            <th className="px-4 py-2 cursor-pointer border-r" onClick={() => sortData("data_atividades")}>Data de Início de Atividades {sortConfig.key === "data_atividades" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}</th>
            <th className="px-4 py-2">Anos de Atividade</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {sortedClientes.map((empresa, index) => {
            const isBirthday = new Date().getDate() === new Date(empresa.data_parceria).getDate() && new Date().getMonth() === new Date(empresa.data_parceria).getMonth();
            const rowClass = isBirthday ? "bg-green-100 text-green-700 font-semibold" : index % 2 === 0 ? "bg-white" : "bg-gray-100";
            return (
              <tr key={empresa.id} className={`${rowClass} border-b border-gray-300`}>
                <td className="px-4 py-2">{empresa.id}</td>
                <td className="px-4 py-2">{empresa.nome}</td>
                <td className="px-4 py-2">{formatDateBr(empresa.data_parceria)}</td>
                <td className="px-4 py-2">{empresa.anos_parceria}</td>
                <td className="px-4 py-2">{formatDateBr(empresa.data_atividades)}</td>
                <td className="px-4 py-2">{empresa.anos_atividades}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
