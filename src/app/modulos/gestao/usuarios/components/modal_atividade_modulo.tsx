import { DadosModulo } from "../interfaces/interface";
import { Cairo } from "next/font/google";
import { formatadorNumeroComPontos } from "@/utils/formatadores";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

type Props = {
  mostrarMensagem: boolean;
  fecharMensagem: () => void;
  meses: string[];
  dados: DadosModulo | null;
};

export default function AtividadeModulo({
  mostrarMensagem,
  fecharMensagem,
  meses,
  dados,
}: Props) {
  if (!mostrarMensagem) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-auto`}
      onClick={fecharMensagem}
    >
      <div
        className="bg-white w-full h-full flex flex-col gap-4 items-center p-6 rounded-2xl shadow-lg animate-fade-fast relative max-w-[80vw] max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={fecharMensagem}
          className="absolute top-4 right-4 text-gray-800 font-bold text-2xl hover:text-gray-600 transition cursor-pointer"
          aria-label="Fechar"
        >
          &times;
        </button>

        <h2
          className={` ${cairo.className} text-3xl font-bold text-gray-800 p-6`}
        >
          Atividades por Módulo
        </h2>

        <div className="shadow-lg overflow-auto flex-1 w-full">
          <table className="min-w-full table-auto border border-gray-300 text-sm text-left">
            <thead className="bg-gray-100 text-xs">
              <tr className={`${cairo.className} font-bold text-sm`}>
                <th className="border px-4 py-2 text-center">Módulo</th>
                {meses.map((mes) => (
                  <th key={mes} className="border px-4 py-2 text-center">
                    {mes}
                  </th>
                ))}
                <th className="border px-4 py-2 text-center">Total</th>
              </tr>
              <tr></tr>
            </thead>
            <tbody>
              {dados &&
                Object.entries(dados).map(([chave]) => (
                  <tr
                    key={chave}
                    className={`${cairo.className} bg-white font-semibold cursor-pointer hover:bg-gray-100`}
                  >
                    <td className="text-center whitespace-nowrap border px-2 py-3 font-bold text-black">
                      {chave}
                    </td>
                    {meses.map((mes) => {
                      let tempo = 0;
                      for (const usuario of dados[chave].usuarios) {
                        tempo += usuario.atividades[mes] || 0;
                      }
                      return (
                        <td key={mes} className="border px-2 py-1 text-center">
                          {`${formatadorNumeroComPontos(tempo / 3600)}h`}
                        </td>
                      );
                    })}
                    <td className="border px-2 py-1 text-center">
                      {`${formatadorNumeroComPontos(dados[chave].total_sistema / 3600)}h`}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
