import { useState } from "react";

interface Empresa {
  id: number;
  nome_empresa: string;
  regime_tributario: string;
  cnpj: string;
}

const dadosEmpresas: Empresa[] = [
  { id: 1, nome_empresa: "MARIA JULIA RORIZ COUTO PINHEIRO", regime_tributario: "N/D", cnpj: "04411948346" },
  { id: 2, nome_empresa: "FRANCISCA PAULA NONATA LOPES", regime_tributario: "N/D", cnpj: "21761943300107" },
  { id: 3, nome_empresa: "2WV CONSTRUÇÕES E REFORMAS LTDA", regime_tributario: "Lucro Presumido", cnpj: "30599448000134" },
  { id: 4, nome_empresa: "39.727.753 ERIKA SIMOES DANTAS", regime_tributario: "Simples Nacional", cnpj: "39727753000100" },
  { id: 5, nome_empresa: "3D INDUSTRIA E COMERCIO DE CONFECCOES LT", regime_tributario: "Lucro Real", cnpj: "12434748000181" },
  { id: 6, nome_empresa: "4R CONECT - SOLUCOES EM INFRAESTRUTURA LTDA", regime_tributario: "Simples Nacional", cnpj: "39644814000146" },
  { id: 7, nome_empresa: "A C IMAGEM E COMUNICACAO S/S LTDA", regime_tributario: "Simples Nacional", cnpj: "57056271000171" },
  { id: 8, nome_empresa: "A M GONDIM DE AQUINO TORRES", regime_tributario: "Simples Nacional", cnpj: "42365408000140" }
];

const formatCNPJ = (cnpj: string) => {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

export default function ListaEmpresasRegimeTributario() {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Empresa; direction: "asc" | "desc" }>({
    key: "nome_empresa",
    direction: "asc",
  });

  const sortData = (key: keyof Empresa) => {
    const direction = sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const sortedEmpresas = [...dadosEmpresas].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    return 0;
  });

  return (
    <div className="flex flex-col gap-4 overflow-x-auto max-h-[700px] w-full">
      <table className="w-full border border-gray-300 text-sm font-cairo">
        <thead>
          <tr className="bg-gray-200 border-b border-gray-400">
            <th className="px-4 py-2 border-r">#</th>
            <th className="px-4 py-2 cursor-pointer border-r" onClick={() => sortData("nome_empresa")}>
              Nome {sortConfig.key === "nome_empresa" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
            </th>
            <th className="px-4 py-2 cursor-pointer border-r" onClick={() => sortData("regime_tributario")}>
              Regime {sortConfig.key === "regime_tributario" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
            </th>
            <th className="px-4 py-2">CNPJ</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {sortedEmpresas.map((empresa, index) => (
            <tr key={empresa.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} border-b border-gray-300`}>
              <td className="px-4 py-2">{empresa.id}</td>
              <td className="px-4 py-2">{empresa.nome_empresa}</td>
              <td className="px-4 py-2">{empresa.regime_tributario}</td>
              <td className="px-4 py-2">{formatCNPJ(empresa.cnpj)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
