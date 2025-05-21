import { useState } from "react";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

interface empresaRamoAtividade {
  id: number;
  nome_empresa: string;
  ramo_atividade: string;
  cnpj: string;
  data_cadastro: string;
  responsavel_legal: string;
  data_inatividade: string | null;
}

interface ListaEmpresasRamoAtividadeProps {
  dados: empresaRamoAtividade[];
  onClose: () => void;
}

const formatCNPJ = (cnpj: string | null | undefined) => {
  if (!cnpj) return "";
  const onlyDigits = cnpj.replace(/\D/g, "");
  if (onlyDigits.length === 11) {
    return onlyDigits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (onlyDigits.length === 14) {
    return onlyDigits.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }
  return cnpj;
};

export default function ListaEmpresasRamoAtividade({
  dados,
  onClose,
}: ListaEmpresasRamoAtividadeProps) {
  const [ramoSelecionado, setRamoSelecionado] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "nome_empresa",
    direction: "asc",
  });

  const filtrarEmpresas = () => {
    // Filtra empresas ativas (sem data_inatividade)
    let filteredEmpresas = dados.filter(
      (empresa) => empresa.data_inatividade === null
    );

    const empresasExcluidas = [
        "EMPRESA EXEMPLO REAL LTDA",
        "EMPRESA EXEMPLO PRESUMIDO LTDA",
        "EMPRESA EXEMPLO SIMPLES NACIONAL LTDA",
        "EMPRESA DESONERAÇÃO DA EMPRESA DESONERAÇÃO DA",
        "EMPRESA DESONERAÇÃO DA FOLHA",
        "EMPRESA DOMÉSTICO",
        "EMPRESA MODELO - EVENTOS E-SOCIAL",
        "EMPRESA MODELO CONTÁBIL SPED",
        "EMPRESA MODELO PLANO DE CONTAS CONTABIL", 
        "SILVEIRA FONTENELE - EMPRESA MODELO",
        "EMPRESA SIMPLES - COMERCIO",
        "EMPRESA SIMPLES - COMERCIO E SERVIÇO",
        "EMPRESA SIMPLES - COMERCIO E IND",
        "EMPRESA SIMPLES - COMERCIO, SERV E IND",
        "EMPRESA SIMPLES - INDUSTRIA",
        "EMPRESA SIMPLES - MEI",
        "EMPRESA SIMPLES - SERVIÇO", 
        "LUCRO PRESUMIDO - COM, SERV E IND", 
        "LUCRO PRESUMIDO - COMERCIO",
        "LUCRO PRESUMIDO - COMERCIO E INDUSTRIA",
        "LUCRO PRESUMIDO - COMERCIO E SERVIÇO",
        "LUCRO PRESUMIDO - INDUSTRIA",
        "LUCRO PRESUMIDO - POSTO DE COMBUSTIVEL",
        "LUCRO PRESUMIDO - SERVIÇO",
        "LUCRO PRESUMIDO - TRANSPORTADORA",
        "LUCRO REAL - COM, SERV E IND",
        "LUCRO REAL - INDUSTRIA",
        "LUCRO REAL - SERVIÇO",
        "LUCRO REAL - TRANSPORTADORA",
        "LUCRO REAL- COMERCIO",
        "MODELO LUCRO PRESUMIDO - COM SERV",
        "MODELO LUCRO PRESUMIDO - SERVIÇO",
        "MODELO SIMPLES NACIONAL - COM SERV",
        "MODELO SIMPLES NACIONAL - COM SERV IND",
        "MODELO SIMPLES NACIONAL - COMERCIO",
        "MODELO SIMPLES NACIONAL - SERVIÇO",
      ];
      filteredEmpresas = filteredEmpresas.filter(
        (empresa) => !empresasExcluidas.includes(empresa.nome_empresa)
      );

    if (ramoSelecionado && ramoSelecionado !== "Todos") {
      filteredEmpresas = filteredEmpresas.filter(
        (empresa) => empresa.ramo_atividade === ramoSelecionado
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      const cnpjQuery = searchQuery.replace(/\D/g, "");

      filteredEmpresas = filteredEmpresas.filter((empresa) => {
        const nomeEmpresa = empresa.nome_empresa?.toLowerCase() || "";
        const nomeMatch = nomeEmpresa.includes(query);

        const cnpjEmpresa = empresa.cnpj?.replace(/\D/g, "") || "";
        const cnpjMatch = cnpjQuery ? cnpjEmpresa.includes(cnpjQuery) : false;

        return nomeMatch || cnpjMatch;
      });
    }

    return filteredEmpresas;
  };

  const sortEmpresas = (empresas: empresaRamoAtividade[]) => {
    return empresas.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof empresaRamoAtividade];
      const bValue = b[sortConfig.key as keyof empresaRamoAtividade];
  
      const aValueSafe = aValue ?? "";
      const bValueSafe = bValue ?? "";
  
      if (aValueSafe < bValueSafe) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValueSafe > bValueSafe) {
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

  const ramos = [
  ];

  const empresasFiltradas = filtrarEmpresas();

  return (
    <div className="flex flex-col gap-4 overflow-x-auto max-h-[700px] w-full">
      <div className="flex items-center justify-between p-4 bg-white shadow rounded-md mb-4">
        <h1 className={`text-2xl font-bold ${cairo.className} text-gray-800`}>
          Empresas por Ramo de Atividade
        </h1>
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

      <div className="flex flex-wrap gap-2 p-4 bg-white shadow rounded-md mb-4">
        {ramos.map((ramo) => (
          <button
            key={ramo}
            className={`px-4 py-2 rounded-md shadow-md ${
              ramoSelecionado === ramo || (ramo === "Todos" && !ramoSelecionado)
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-500 hover:text-white transition`}
            onClick={() => setRamoSelecionado(ramo === "Todos" ? null : ramo)}
          >
            {ramo}
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
              onClick={() => requestSort("ramo_atividade")}
            >
              Ramo {renderSortArrow("ramo_atividade")}
            </th>
            <th className="px-4 py-2 border-r">CNPJ</th>
            <th className="px-4 py-2">Responsável Legal</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {sortEmpresas(empresasFiltradas).map((empresa, index) => (
            <tr
              key={empresa.id}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-100"
              } border-b border-gray-300`}
            >
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{empresa.nome_empresa}</td>
              <td className="px-4 py-2">{empresa.ramo_atividade}</td>
              <td className="px-4 py-2">{formatCNPJ(empresa.cnpj)}</td>
              <td className="px-4 py-2">
                {empresa.responsavel_legal && empresa.responsavel_legal.trim() !== ""
                  ? empresa.responsavel_legal
                  : "Sem Responsável Legal"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
