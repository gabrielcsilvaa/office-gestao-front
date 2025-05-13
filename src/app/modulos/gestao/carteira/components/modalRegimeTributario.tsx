import { useState } from "react";

interface Empresa {
  id: number;
  nome_empresa: string;
  regime_tributario: string;
  cnpj: string;
  data_cadastro: string;
  responsavel_legal: string;
  data_inatividade: string;
}

interface ListaEmpresasRegimeTributarioProps {
  dados: Empresa[];
  onClose: () => void;
}

const formatCNPJ = (cnpj: string | null | undefined) => {
  if (!cnpj) return "";
  const onlyDigits = cnpj.replace(/\D/g, "");
  if (onlyDigits.length === 11) {
    return onlyDigits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (onlyDigits.length === 14) {
    return onlyDigits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }
  return cnpj;
};

export default function ListaEmpresasRegimeTributario({ dados, onClose }: ListaEmpresasRegimeTributarioProps) {
  const [regimeSelecionado, setRegimeSelecionado] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
    key: "nome_empresa",
    direction: "asc",
  });

  const filtrarEmpresas = () => {
    // Primeiro filtra empresas inativas
    let filteredEmpresas = dados.filter((empresa) => empresa.data_inatividade === null);

    // Depois filtra por regime tributário se houver seleção
    if (regimeSelecionado) {
      filteredEmpresas = filteredEmpresas.filter(
        (empresa) => empresa.regime_tributario === regimeSelecionado
      );
    }

    // Por fim, aplica a pesquisa unificada
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      const cnpjQuery = searchQuery.replace(/\D/g, "");

      filteredEmpresas = filteredEmpresas.filter((empresa) => {
        // Tratamento seguro para nome da empresa
        const nomeEmpresa = empresa.nome_empresa?.toLowerCase() || "";
        const nomeMatch = nomeEmpresa.includes(query);

        // Tratamento seguro para CNPJ
        const cnpjEmpresa = empresa.cnpj?.replace(/\D/g, "") || "";
        const cnpjMatch = cnpjQuery ? cnpjEmpresa.includes(cnpjQuery) : false;

        return nomeMatch || cnpjMatch;
      });
    }

    return filteredEmpresas;
  };

  const sortEmpresas = (empresas: Empresa[]) => {
    return empresas.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Empresa];
      const bValue = b[sortConfig.key as keyof Empresa];
      
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const renderSortArrow = (key: string) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "";
  };

  const empresasFiltradas = filtrarEmpresas();

  return (
    <div className="flex flex-col gap-4 overflow-x-auto max-h-[700px] w-full">
      <div className="flex items-center justify-between p-4 bg-white shadow rounded-md mb-4">
        <h1 className="text-2xl font-bold font-cairo text-gray-800">Empresas por Regime Tributário</h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Pesquisar por nome ou CNPJ..."
            className="border border-gray-300 rounded-md p-2 w-96 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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

      <div className="flex flex-wrap gap-2 p-4 bg-white shadow rounded-md mb-4">
        {[
          "Todos",
          "Simples Nacional",
          "Lucro Presumido",
          "Lucro Real",
          "Doméstica",
          "Isenta de IRPJ",
          "Regime Especial de Tributação",
          "Imune do IRPJ",
          "MEI",
          "N/D",
        ].map((regime) => (
          <button
            key={regime}
            className={`px-4 py-2 rounded-md shadow-md ${
              regimeSelecionado === regime || (regime === "Todos" && !regimeSelecionado)
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-500 hover:text-white transition`}
            onClick={() => setRegimeSelecionado(regime === "Todos" ? null : regime)}
          >
            {regime}
          </button>
        ))}
      </div>

      <table className="w-full border border-gray-300 text-sm font-cairo">
        <thead>
          <tr className="bg-gray-200 border-b border-gray-400">
            <th className="px-4 py-2 border-r">#</th>
            <th 
              className="px-4 py-2 border-r cursor-pointer"
              onClick={() => requestSort("nome_empresa")}
            >
              Nome Empresa {renderSortArrow("nome_empresa")}
            </th>
            <th 
              className="px-4 py-2 border-r cursor-pointer"
              onClick={() => requestSort("regime_tributario")}
            >
              Regime {renderSortArrow("regime_tributario")}
            </th>
            <th 
              className="px-4 py-2 border-r cursor-pointer"
              onClick={() => requestSort("cnpj")}
            >
              CNPJ {renderSortArrow("cnpj")}
            </th>
            <th 
              className="px-4 py-2 cursor-pointer"
              onClick={() => requestSort("responsavel_legal")}
            >
              Responsável Legal {renderSortArrow("responsavel_legal")}
            </th>
          </tr>
        </thead>
        <tbody className="text-center">
          {sortEmpresas(empresasFiltradas).map((empresa, index) => (
            <tr
              key={empresa.id}
              className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} border-b border-gray-300`}
            >
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{empresa.nome_empresa}</td>
              <td className="px-4 py-2">{empresa.regime_tributario}</td>
              <td className="px-4 py-2">{formatCNPJ(empresa.cnpj)}</td>
              <td className="px-4 py-2">{empresa.responsavel_legal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
