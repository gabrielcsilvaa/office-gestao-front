import { useState } from "react";

interface Socio {
  id: number;
  nome: string;
  data_nascimento: string;
  idade?: number; // Tornando idade opcional já que vamos calculá-la
}

interface AniversariantesSociosProps {
  dados: Socio[];
  onClose: () => void;
}

export default function AniversariantesSocios({
  dados,
  onClose,
}: AniversariantesSociosProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Socio;
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

  // Função para calcular a idade com tratamento de segurança
  const calcularIdade = (dataNascimento: string): number => {
    if (!dataNascimento) return 0;

    const hoje = new Date();
    const nascimento = new Date(dataNascimento);

    if (isNaN(nascimento.getTime())) return 0;

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();

    if (
      mesAtual < mesNascimento ||
      (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())
    ) {
      idade--;
    }

    return idade;
  };

  // funçao filtrar socios do mes atual
  const FiltrarAnivesariantesDoMes = (socios: Socio[]) => {
    const mesAtual = new Date().getMonth();
    return socios.filter((socios) => {
      const data = new Date(socios.data_nascimento);
      return data.getMonth() === mesAtual
    })
  }

  // Função para verificar se é aniversário hoje
  const isAniversarioHoje = (dataNascimento: string): boolean => {
    if (!dataNascimento) return false;

    const hoje = new Date();
    const nascimento = new Date(dataNascimento);

    if (isNaN(nascimento.getTime())) return false;

    return (
      hoje.getDate() === nascimento.getDate() &&
      hoje.getMonth() === nascimento.getMonth()
    );
  };

  // Filtrar sócios com base na pesquisa
  const filtrarSocios = () => {
    const query = searchQuery.toLowerCase().trim();

    // 1 - só os do mês atual
    const sociosDoMes = FiltrarAnivesariantesDoMes(dados);

    // 2 - filtro de busca em cima dos sócios do mês atual
    return sociosDoMes.filter((socio) => {
      const nomeMatch = socio.nome.toLowerCase().includes(query);
      const dataNascimentoMatch = formatDateBr(socio.data_nascimento).includes(query);

      return nomeMatch || dataNascimentoMatch;
    });
  };

  // Função para ordenar os dados
  const sortData = (key: keyof Socio) => {
    const direction = sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  // Ordenação dos dados com tratamento de tipos
  const sortedSocios = filtrarSocios().sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.key === "idade") {
      const aIdade = calcularIdade(a.data_nascimento);
      const bIdade = calcularIdade(b.data_nascimento);
      return sortConfig.direction === "asc" ? aIdade - bIdade : bIdade - aIdade;
    }

    if (sortConfig.key === "data_nascimento") {
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
          Sócios Aniversariantes
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
          <tr className="bg-gray-200 border-b border-gray-400">
            <th className="px-4 py-2 border-r">#</th>
            <th
              className="px-4 py-2 cursor-pointer border-r"
              onClick={() => sortData("nome")}
            >
              Sócio {sortConfig.key === "nome" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
            </th>
            <th className="px-4 py-2 cursor-pointer border-r">
              Data de Nascimento
            </th>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => sortData("idade")}
            >
              Idade {sortConfig.key === "idade" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
            </th>
          </tr>
        </thead>
        <tbody className="text-center">
          {sortedSocios.map((socio, index) => {
            const isBirthday = isAniversarioHoje(socio.data_nascimento);
            const idade = calcularIdade(socio.data_nascimento);
            const rowClass = isBirthday
              ? "bg-green-100 text-green-700 font-semibold"
              : index % 2 === 0
                ? "bg-white"
                : "bg-gray-100";

            return (
              <tr
                key={socio.id}
                className={`${rowClass} border-b border-gray-300`}
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{socio.nome.toUpperCase()}</td>
                <td className="px-4 py-2">{formatDateBr(socio.data_nascimento)}</td>
                <td className="px-4 py-2">{idade} anos</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
