// import { useState, useEffect } from "react";

// export default function AtividadesModulos({
//   mostrarMensagem,
//   fecharMensagem,
// }: {
//   mostrarMensagem: boolean;
//   fecharMensagem: () => void;
// }) {
//   const [dados, setDados] = useState<{ modulo: string; valor: number }[]>([]);
//   const [carregando, setCarregando] = useState(true);

//   useEffect(() => {
//     if (!mostrarMensagem) return;

//     const fetchDados = async () => {
//       try {
//         const resposta = await fetch("/api/atividades/modulos"); // 👈 Ajuste o endpoint conforme o seu backend
//         const resultado = await resposta.json();
//         setDados(resultado);
//       } catch (erro) {
//         console.error("Erro ao buscar dados:", erro);
//       } finally {
//         setCarregando(false);
//       }
//     };

//     fetchDados();
//   }, [mostrarMensagem]);

//   if (!mostrarMensagem) return null;

//   if (carregando) {
//     return (
//       <div className="fixed inset-0 bg-white z-50 p-6 flex justify-center items-center">
//         <span className="text-gray-600">Carregando dados...</span>
//       </div>
//     );
//   }

//   const valorMaximo = Math.max(...dados.map((item) => item.valor || 1));

//   return (
//     <div className="fixed inset-0 bg-white z-50 p-6 overflow-auto flex flex-col items-center">
//       <h2 className="text-2xl font-bold text-center mb-8">ATIVIDADES POR MÓDULO</h2>

//       <div className="space-y-6 w-full max-w-3xl mx-auto">
//         {dados.map((item, i) => (
//           <div key={i} className="w-full">
//             <div className="flex justify-between items-center mb-1">
//               <span>{item.modulo}</span>
//               <span className="text-sm text-gray-700 font-medium">
//                 {item.valor.toLocaleString()}
//               </span>
//             </div>
//             <div className="w-full h-4 bg-gray-200 rounded overflow-hidden">
//               <div
//                 className={`h-full rounded bg-green-${i === 0 ? "400" : "200"}`}
//                 style={{
//                   width: `${(item.valor / valorMaximo) * 100}%`,
//                 }}
//               ></div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-10 w-full max-w-3xl mx-auto">
//         <table className="min-w-full border border-gray-300 mt-4 text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border px-4 py-2 text-left">Módulo</th>
//               <th className="border px-4 py-2 text-left">Valor Selecionado</th>
//             </tr>
//           </thead>
//           <tbody>
//             {dados.map((item, i) => (
//               <tr key={i}>
//                 <td className="border px-4 py-2">{item.modulo}</td>
//                 <td className="border px-4 py-2">
//                   {item.valor.toLocaleString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="mt-12">
//         <button
//           onClick={fecharMensagem}
//           className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition"
//         >
//           Fechar
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";

const meses = [
  "jan/2025",
  "fev/2025",
  "mar/2025",
  "abr/2025",
  "mai/2025",
  "jun/2025",
  "jul/2025",
  "ago/2025",
  "set/2025",
  "out/2025",
  "nov/2025",
  "dez/2025",
];

type Props = {
  mostrarMensagem: boolean;
  fecharMensagem: () => void;
};

export default function AtividadeModulo({
  mostrarMensagem,
  fecharMensagem,
}: Props) {
  const [usuarioExpandido, setUsuarioExpandido] = useState<string | null>(null);

  const toggleExpandir = (usuario: string) => {
    setUsuarioExpandido((prev) => (prev === usuario ? null : usuario));
  };

  const usuarios = [
    {
      nome: "Usuário Exemplo",
      empresas: ["Empresa A", "Empresa B"],
    },
    {
      nome: "Outro Usuário",
      empresas: ["Empresa C"],
    },
  ];

  if (!mostrarMensagem) return null;

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
          Atividades por Módulo
        </h2>

        <div className="overflow-auto flex-1 w-full">
          <table className="min-w-full table-auto border border-gray-300 text-sm text-left">
            <thead className="bg-gray-100 text-xs">
              <tr>
                <th rowSpan={2} className="border px-4 py-2 text-center">
                  Mês / Ano
                </th>
                {meses.map((mes) => (
                  <th
                    key={mes}
                    colSpan={4}
                    className="border px-4 py-2 text-center"
                  >
                    {mes}
                  </th>
                ))}
              </tr>
              <tr>
                {meses.map((mes) => (
                  <React.Fragment key={`sub-${mes}`}>
                    <th className="border px-2 py-1 text-center">Horas</th>
                    <th className="border px-2 py-1 text-center">Importados</th>
                    <th className="border px-2 py-1 text-center">Módulos</th>
                    <th className="border px-2 py-1 text-center">Total</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <React.Fragment key={usuario.nome}>
                  <tr
                    className="bg-white font-semibold cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleExpandir(usuario.nome)}
                  >
                    <td className="border px-2 py-1 font-bold text-gray-800">
                      ▶ {usuario.nome}
                    </td>
                    <td
                      className="border px-2 py-1 text-center text-gray-600"
                      colSpan={meses.length * 4}
                    >
                      Clique para ver empresas
                    </td>
                  </tr>

                  {usuarioExpandido === usuario.nome &&
                    usuario.empresas.map((empresa) => (
                      <tr key={empresa} className="bg-white">
                        <td className="border px-2 py-1 pl-6 text-gray-700">
                          {empresa}
                        </td>
                        {meses.map((mes) => (
                          <React.Fragment key={`${empresa}-${mes}`}>
                            <td className="border px-2 py-1 text-right">-</td>
                            <td className="border px-2 py-1 text-right">-</td>
                            <td className="border px-2 py-1 text-right">-</td>
                            <td className="border px-2 py-1 text-right">-</td>
                          </React.Fragment>
                        ))}
                      </tr>
                    ))}
                </React.Fragment>
              ))}
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
