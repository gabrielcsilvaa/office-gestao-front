import { useState } from "react";

interface Parceria {
  codi_emp: number;
  nome: string;
  cnpj: string;
  data_cadastro: string;
  data_inicio_atividades: string;
}

interface AniversariantesParceirosProps {
  dados: Parceria[];
  onClose: () => void;
}

export default function AniversariantesParceiros({
  dados,
  onClose,
}: AniversariantesParceirosProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Parceria;
    direction: "asc" | "desc";
  }>({
    key: "nome",
    direction: "asc",
  });

  const [searchQuery, setSearchQuery] = useState<string>("");

  // Função para formatar a data com tratamento de segurança
  const formatDateBr = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const ano = date.getFullYear();

    return `${dia}/${mes}/${ano}`;
  };

  // Filtrando clientes que estão no mês atual
  const filteredClientes = dados.filter((empresa) => {
    const dataCadastro = new Date(empresa.data_cadastro);
    const hoje = new Date();

    // Verifica se o mês e o dia são do mês atual
    return (
      dataCadastro.getMonth() === hoje.getMonth() &&
      empresa.nome.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  });

  // Ordenação dos dados
  const sortedClientes = filteredClientes.sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.key === "data_cadastro" || sortConfig.key === "data_inicio_atividades") {
      const aDate = new Date(aValue as string);
      const bDate = new Date(bValue as string);
      return sortConfig.direction === "asc"
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  return (
    <div className="flex flex-col gap-4 overflow-x-auto max-h-[700px] w-full">
      <div className="flex items-center justify-between p-4 bg-white shadow rounded-md mb-4">
        <h1 className="text-2xl font-bold font-cairo text-gray-800">
          Aniversário de Parceria
        </h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Pesquisar por nome..."
            className="border border-gray-300 rounded-md p-2 w-96 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fechar modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <table className="w-full border border-gray-300 text-sm font-cairo">
        <thead>
          <tr className="bg-gray-200 border-b-[1px] border-gray-400">
            <th className="px-4 py-2 border-r">#</th>
            <th
              className="px-4 py-2 cursor-pointer border-r"
              onClick={() => setSortConfig({ key: "nome", direction: sortConfig.direction === "asc" ? "desc" : "asc" })}
            >
              Empresa{" "}
              {sortConfig.key === "nome" &&
                (sortConfig.direction === "asc" ? " ↑" : " ↓")}
            </th>
            <th className="px-4 py-2 border-r">CNPJ</th>
            <th className="px-4 py-2 border-r">Data de Cadastro</th>
            <th className="px-4 py-2 border-r">Data de Início de Atividades</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {sortedClientes.map((empresa, index) => (
            <tr key={empresa.codi_emp} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{empresa.nome}</td>
              <td className="px-4 py-2">{empresa.cnpj}</td>
              <td className="px-4 py-2">{formatDateBr(empresa.data_cadastro)}</td>
              <td className="px-4 py-2">{formatDateBr(empresa.data_inicio_atividades)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
