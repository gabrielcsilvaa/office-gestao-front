

const meses = [
  "jan", "fev", "mar", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

const colunas = ["Horas", "Importados", "Manuais", "Módulo", "Total"];

type DadosUsuario = {
  nome: string;
  cod_empresa?: string;
  dados: {
    [mes: string]: [string, string, string, string, string];
  };
};

type Props = {
  mostrarMensagem: boolean;
  fecharMensagem: () => void;
  startDate: Date | null;
  endDate: Date | null;
};

export default function AtividadeUsuario({
  mostrarMensagem,
  fecharMensagem,
  startDate,
  endDate,
}: Props) {
  if (!mostrarMensagem) return null;

  const ano = startDate ? startDate.getFullYear() : "----";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm overflow-auto"
      onClick={fecharMensagem}
    >
      <div
        className="bg-white w-[1000px] h-[1000px] flex flex-col gap-4 items-center p-6 rounded-2xl shadow-lg animate-fade-fast relative 2xl:h-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center p-6">
          Atividades por Usuário
        </h2>

        <div className="overflow-auto flex-1 w-full">
          <table className="min-w-full table-auto border border-gray-300 text-sm text-left">
            <thead className="bg-gray-100 text-xs">
              <tr>
                <th rowSpan={2} className="border px-4 py-2">Usuários</th>
                {meses.map((mes) => (
                  <th key={mes} colSpan={5} className="border px-4 py-2 text-center">
                    {mes}/{ano}
                  </th>
                ))}
              </tr>
              <tr>
                {meses.map((mes) =>
                  colunas.map((col) => (
                    <th key={`${mes}-${col}`} className="border px-2 py-1">
                      {col}
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {/* Removi a lógica de usuários aqui */}
              <tr>
                <td className="border px-2 py-1 font-semibold">Usuário Exemplo</td>
                {meses.map((mes) =>
                  colunas.map((_, i) => (
                    <td key={`${mes}-${i}`} className="border px-2 py-1">
                      -
                    </td>
                  ))
                )}
              </tr>
            </tbody>
          </table>
        </div>

        <button
          onClick={fecharMensagem}
          className="mt-6 mb-2 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
