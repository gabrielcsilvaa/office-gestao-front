import { useState, useEffect } from "react";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

interface Empresa {
  id: number;
  nome_empresa: string;
  situacao: string;
  cnpj: string;
  data_cadastro: string;
  responsavel_legal: string;
  data_inatividade: string | null;
  motivo_inatividade: number;
  regime_tributario: string;
}


interface ModalEmpresasCardProps {
  dados: Empresa[];
  dadosNovos: Empresa[];
  onClose: () => void;
  filtrosIniciais?: string[];
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

export default function ModalEmpresasCard({
  dados,
  dadosNovos,
  onClose,
  filtrosIniciais = [],
}: ModalEmpresasCardProps) {
  const [selectedFiltros, setSelectedFiltros] = useState<string[]>(filtrosIniciais);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Atualiza os filtros iniciais ao abrir o modal
  useEffect(() => {
    setSelectedFiltros(filtrosIniciais);
  }, [filtrosIniciais]);

  // Função para alternar filtros múltiplos
  const toggleFiltro = (filtro: string) => {
    setSelectedFiltros((prevFiltros) =>
      prevFiltros.includes(filtro)
        ? prevFiltros.filter((f) => f !== filtro)
        : [...prevFiltros, filtro]
    );
  };

// Função para filtrar empresas com base nos filtros selecionados e na barra de pesquisa
  const filtrarEmpresas = () => {
    // Combina os dados gerais e os novos
    let allEmpresas = [...dados];

    if (selectedFiltros.includes("novos-clientes")) {
      allEmpresas = [...allEmpresas, ...dadosNovos];
    }

    // Filtra pelas opções de status selecionadas
    if (selectedFiltros.length > 0) {
      allEmpresas = allEmpresas.filter((empresa) => {
        const isAtivo = selectedFiltros.includes("A") && empresa.situacao === "A";
        const isInativo = selectedFiltros.includes("I") && empresa.situacao === "I";
        const isBaixado = selectedFiltros.includes("baixados") && empresa.motivo_inatividade === 2 && empresa.situacao != "A";
        const isTransferido = selectedFiltros.includes("transferidas") && empresa.motivo_inatividade === 3 && empresa.situacao != "A";
        const isNovoCliente = selectedFiltros.includes("novos-clientes") && dadosNovos.includes(empresa);
        return isAtivo || isInativo || isBaixado || isTransferido || isNovoCliente;
      });
    }

    const empresasExcluidas = [
      "EMPRESA EXEMPLO REAL LTDA",
      "EMPRESA EXEMPLO PRESUMIDO LTDA",
      "EMPRESA EXEMPLO SIMPLES NACIONAL LTDA",
    ];

    allEmpresas = allEmpresas.filter(
      (empresa) => !empresasExcluidas.includes(empresa.nome_empresa)
    );
      
    // Filtra pelo campo de pesquisa
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      const cnpjQuery = searchQuery.replace(/\D/g, "");

      allEmpresas = allEmpresas.filter((empresa) => {
        const nomeEmpresa = empresa.nome_empresa?.toLowerCase() || "";
        const nomeMatch = nomeEmpresa.includes(query);

        const cnpjEmpresa = empresa.cnpj?.replace(/\D/g, "") || "";
        const cnpjMatch = cnpjQuery ? cnpjEmpresa.includes(cnpjQuery) : false;

        return nomeMatch || cnpjMatch;
      });
    }

    return allEmpresas;
  };
  return (
    <div className="flex flex-col gap-4 overflow-x-auto max-h-[700px] w-full">
      <div className="flex items-center justify-between p-4 bg-white shadow rounded-md mb-4">
        <h1 className={`text-2xl font-bold ${cairo.className} text-gray-800`}>
          Empresas por Situação
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
            { label: "Clientes Ativos", filtro: "A" },
            { label: "Novos Clientes", filtro: "novos-clientes" },
            { label: "Clientes Inativos", filtro: "I" },
            { label: "Baixados", filtro: "baixados" },
            { label: "Bloqueados", filtro: "transferidas" },
        ].map(({ label, filtro }) => (
            <button
            key={filtro}
            className={`px-4 py-2 rounded-md shadow-md ${
                selectedFiltros.includes(filtro)
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-500 hover:text-white transition`}
            onClick={() => toggleFiltro(filtro)}
            >
            {label}
            </button>
        ))}
        </div>
        <table className="w-full border border-gray-300 text-sm font-cairo">
        <thead>
            <tr className="bg-gray-200 border-b border-gray-400">
            <th className="px-4 py-2 border-r">#</th>
            <th className="px-4 py-2 border-r">Nome Empresa</th>
            <th className="px-4 py-2 border-r">Situação</th>
            <th className="px-4 py-2 border-r">CNPJ</th>
            <th className="px-4 py-2">Responsável Legal</th>
            </tr>
        </thead>
        <tbody className="text-center">
            {filtrarEmpresas().map((empresa, index) => (
            <tr
                key={empresa.id}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} border-b border-gray-300`}
            >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{empresa.nome_empresa}</td>
                <td className="px-4 py-2">{empresa.situacao}</td>
                <td className="px-4 py-2">{formatCNPJ(empresa.cnpj)}</td>
                <td className="px-4 py-2">
                {empresa.responsavel_legal?.trim() || "Sem Responsável Legal"}
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
  );
}
