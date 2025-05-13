import { useState } from "react";

interface Socio {
  id: number;
  nome: string;
  data_nascimento: string;
  idade: number;
}

const dadosSocios: Socio[] = [
  { id: 1, nome: "FRANCISCO ORLANDO SILVEIRA PEREIRA", data_nascimento: "27/06/1969", idade: 54 },
  { id: 2, nome: "ROBERTO PAIVA DE OLIVEIRA", data_nascimento: "02/05/1954", idade: 71 },
  { id: 3, nome: "FREDERICO CAMARGO OLIVEIRA POMBO", data_nascimento: "24/09/1964", idade: 59 },
  { id: 23, nome: "JULIANA BERNARDES GONÇALVES", data_nascimento: "13/05/1979", idade: 44 },
  { id: 30, nome: "LUIANA MEGHALES PINHEIRO", data_nascimento: "02/06/1984", idade: 41 },
  { id: 31, nome: "IARA FREITAS SANTIAGO", data_nascimento: "09/06/1984", idade: 41 }
];

export default function AniversariantesSocios() {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Socio; direction: "asc" | "desc" }>({
    key: "nome",
    direction: "asc",
  });

  const sortData = (key: keyof Socio) => {
    const direction = sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const sortedSocios = [...dadosSocios].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    // Verifica se é ordenação por idade (número) ou string (nome, data_nascimento)
    if (sortConfig.key === "idade") {
      return sortConfig.direction === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    return 0;
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
            <th className="px-4 py-2 cursor-pointer border-r" onClick={() => sortData("nome")}>Sócio {sortConfig.key === "nome" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}</th>
            <th className="px-4 py-2 cursor-pointer border-r" onClick={() => sortData("data_nascimento")}>Data de Nascimento {sortConfig.key === "data_nascimento" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}</th>
            <th className="px-4 py-2 cursor-pointer">Idade {sortConfig.key === "idade" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {sortedSocios.map((socio, index) => {
            const isBirthday = new Date().getDate() === new Date(socio.data_nascimento).getDate() && new Date().getMonth() === new Date(socio.data_nascimento).getMonth();
            const rowClass = isBirthday ? "bg-green-100 text-green-700 font-semibold" : index % 2 === 0 ? "bg-white" : "bg-gray-100";
            return (
              <tr key={socio.id} className={`${rowClass} border-b border-gray-300`}>
                <td className="px-4 py-2">{socio.id}</td>
                <td className="px-4 py-2">{socio.nome}</td>
                <td className="px-4 py-2">{formatDateBr(socio.data_nascimento)}</td>
                <td className="px-4 py-2">{socio.idade} anos</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
