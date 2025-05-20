import { useEffect, useState } from "react";

interface Usuario {
  id: number;
  NOME: string;
  funcao: string;
  status: string;
  SITUACAO: number;
}

// Definindo o tipo correto para as props
interface ListaUsuarioProps {
  mostrarMensagem: boolean;
  fecharMensagem: () => void;
}

export default function ListaUsuario({
  mostrarMensagem,
  fecharMensagem,
}: ListaUsuarioProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<
    "ativo" | "inativo" | "todos"
  >("todos");

  useEffect(() => {
    const dadosSimulados: Usuario[] = [
      {
        id: 1,
        NOME: "João",
        funcao: "Desenvolvedor",
        status: "Ativo",
        SITUACAO: 1,
      },
      {
        id: 2,
        NOME: "Maria",
        funcao: "Designer",
        status: "Inativo",
        SITUACAO: 0,
      },
      { id: 3, NOME: "Pedro", funcao: "Gerente", status: "Ativo", SITUACAO: 1 },
    ];

    if (mostrarMensagem) {
      setUsuarios(dadosSimulados);
    }
    //     if (mostrarMensagem) {
    //       const carregarUsuarios = async () => {
    //         try {
    //           const dados = await ();
    //           setUsuarios(dados.usuarios);
    //         } catch (error) {
    //           console.error("Erro ao carregar usuários:", error);
    //         }
    //       };

    //       carregarUsuarios();
    // }
  }, [mostrarMensagem]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        fecharMensagem();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [fecharMensagem]);

  if (!mostrarMensagem) return null;

  const usuariosFiltrados = usuarios.filter((usuario) => {
    if (filtroStatus === "ativo") return usuario.SITUACAO === 1;
    if (filtroStatus === "inativo") return usuario.SITUACAO !== 1;
    return true;
  });

  return (
    <>
      {mostrarMensagem && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm overflow-auto "
          onClick={() => fecharMensagem()}
        >
          <div
            className="bg-white w-[1000px] h-[1000px] flex flex-col gap-4 items-center p-6 rounded-2xl shadow-lg animate-fade-fast relative 2xl:h-[600px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Topo com título e botões */}
            <div className="bg-white flex justify-center p-6 rounded-2xl shadow-lg animate-fade-fast relative">
              <h2 className="text-3xl font-bold text-gray-800 text-center flex-1">
                Lista de Usuários Cadastrados no Sistema
              </h2>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => setFiltroStatus("todos")}
                  className={` px-4 py-2 rounded transition  ${
                    filtroStatus === "todos"
                      ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                      : "bg-gray-400 text-gray-700 opacity-70 hover:opacity-100"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFiltroStatus("ativo")}
                  className={`px-4 py-2 rounded-md shadow-md transition ${
                    filtroStatus === "ativo"
                      ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                      : "bg-gray-400 text-gray-700 opacity-70 hover:opacity-100"
                  }`}
                >
                  Ativo
                </button>
                <button
                  onClick={() => setFiltroStatus("inativo")}
                  className={`px-4 py-2 rounded-md shadow-md transition ${
                    filtroStatus === "inativo"
                      ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                      : "bg-gray-400 text-gray-700 opacity-70 hover:opacity-100"
                  }`}
                >
                  Inativo
                </button>
              </div>
            </div>
            {/* Tabela com rolagem se necessário */}
            <div className="overflow-auto flex-1 w-full">
              <table className="min-w-full table-auto border border-gray-300 text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2">#</th>
                    <th className="border px-4 py-2">Nome</th>
                    <th className="border px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map((usuario, index) => (
                    <tr key={usuario.id}>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{usuario.NOME}</td>
                      <td className="border px-4 py-2">
                        {usuario.SITUACAO === 1 ? "Ativo" : "Inativo"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 mb-2">
              <button
                onClick={() => {
                  fecharMensagem();
                  setFiltroStatus("todos"); // <-- resetando o filtro
                }}
                className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition"
              >
                Fechar
              </button>
            </div>
          </div>

          {/* Botão "Fechar" */}
        </div>
      )}
    </>
  );
}


