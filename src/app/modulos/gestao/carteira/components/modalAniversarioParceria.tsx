import { useState } from "react";

interface Empresa {
  codi_emp: number;
  nome: string;
  cnpj: string;
  data_cadastro: string;
  data_inicio_atividades: string;
}

interface AniversariantesParceirosProps {
  dados: Empresa[];
}

export default function AniversariantesParceiros({ dados }: AniversariantesParceirosProps) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Empresa; direction: "asc" | "desc" }>({
    key: "nome",
    direction: "asc",
  });

  const sortData = (key: keyof Empresa) => {
    const direction = sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const sortedClientes = Array.isArray(dados) ? [...dados].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    return 0;
  }) : [];

  const formatDateBr = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const calculateYears = (dateString: string) => {
    const startDate = new Date(dateString);
    const today = new Date();
    const years = today.getFullYear() - startDate.getFullYear();
    const months = today.getMonth() - startDate.getMonth();
    const isCompleteYear = months < 0 || (months === 0 && today.getDate() < startDate.getDate());
    return isCompleteYear ? years - 1 : years;
  };

  return (
    <div className="flex flex-col gap-4 overflow-x-auto max-h-[700px] w-full">
      <table className="w-full border border-gray-300 text-sm font-cairo">
        <thead>
          <tr className="bg-gray-200 border-b border-gray-400">
            <th className="px-4 py-2 border-r">#</th>
            <th className="px-4 py-2 cursor-pointer border-r" onClick={() => sortData("nome")}>Empresa {sortConfig.key === "nome" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}</th>
            <th className="px-4 py-2 border-r">CNPJ</th>
            <th className="px-4 py-2 cursor-pointer border-r" onClick={() => sortData("data_cadastro")}>Data de Cadastro {sortConfig.key === "data_cadastro" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}</th>
            <th className="px-4 py-2">Anos de Parceria</th>
            <th className="px-4 py-2 cursor-pointer border-r" onClick={() => sortData("data_inicio_atividades")}>Data de Início de Atividades {sortConfig.key === "data_inicio_atividades" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}</th>
            <th className="px-4 py-2">Anos de Atividade</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {sortedClientes.map((empresa, index) => {
            const isBirthday = new Date().getDate() === new Date(empresa.data_cadastro).getDate() && new Date().getMonth() === new Date(empresa.data_cadastro).getMonth();
            const rowClass = isBirthday ? "bg-green-100 text-green-700 font-semibold" : index % 2 === 0 ? "bg-white" : "bg-gray-100";
            return (
              <tr key={empresa.codi_emp} className={`${rowClass} border-b border-gray-300`}>
                <td className="px-4 py-2">{empresa.codi_emp}</td>
                <td className="px-4 py-2">{empresa.nome}</td>
                <td className="px-4 py-2">{empresa.cnpj}</td>
                <td className="px-4 py-2">{formatDateBr(empresa.data_cadastro)}</td>
                <td className="px-4 py-2">{calculateYears(empresa.data_cadastro)} anos</td>
                <td className="px-4 py-2">{formatDateBr(empresa.data_inicio_atividades)}</td>
                <td className="px-4 py-2">{calculateYears(empresa.data_inicio_atividades)} anos</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
