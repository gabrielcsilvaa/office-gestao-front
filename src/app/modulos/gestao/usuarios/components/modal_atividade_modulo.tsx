import { useState, useEffect } from "react";

export default function AtividadesModulos({
  mostrarMensagem,
  fecharMensagem,
}: {
  mostrarMensagem: boolean;
  fecharMensagem: () => void;
}) {
  const [dados, setDados] = useState<{ modulo: string; valor: number }[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!mostrarMensagem) return;

    const fetchDados = async () => {
      try {
        const resposta = await fetch("/api/atividades/modulos"); // 👈 Ajuste o endpoint conforme o seu backend
        const resultado = await resposta.json();
        setDados(resultado);
      } catch (erro) {
        console.error("Erro ao buscar dados:", erro);
      } finally {
        setCarregando(false);
      }
    };

    fetchDados();
  }, [mostrarMensagem]);

  if (!mostrarMensagem) return null;

  if (carregando) {
    return (
      <div className="fixed inset-0 bg-white z-50 p-6 flex justify-center items-center">
        <span className="text-gray-600">Carregando dados...</span>
      </div>
    );
  }

  const valorMaximo = Math.max(...dados.map((item) => item.valor || 1));

  return (
    <div className="fixed inset-0 bg-white z-50 p-6 overflow-auto flex flex-col items-center">
      <h2 className="text-2xl font-bold text-center mb-8">ATIVIDADES POR MÓDULO</h2>

      <div className="space-y-6 w-full max-w-3xl mx-auto">
        {dados.map((item, i) => (
          <div key={i} className="w-full">
            <div className="flex justify-between items-center mb-1">
              <span>{item.modulo}</span>
              <span className="text-sm text-gray-700 font-medium">
                {item.valor.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded overflow-hidden">
              <div
                className={`h-full rounded bg-green-${i === 0 ? "400" : "200"}`}
                style={{
                  width: `${(item.valor / valorMaximo) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 w-full max-w-3xl mx-auto">
        <table className="min-w-full border border-gray-300 mt-4 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Módulo</th>
              <th className="border px-4 py-2 text-left">Valor Selecionado</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((item, i) => (
              <tr key={i}>
                <td className="border px-4 py-2">{item.modulo}</td>
                <td className="border px-4 py-2">
                  {item.valor.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12">
        <button
          onClick={fecharMensagem}
          className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}


