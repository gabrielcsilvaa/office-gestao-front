import { useEffect, useState } from "react";
import { UserList } from "../interfaces/interface";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

interface Usuario {
  id: number;
  NOME: string;
  status: string;
}

// Definindo o tipo correto para as props
interface ListaUsuarioProps {
  mostrarMensagem: boolean;
  fecharMensagem: () => void;
  dados: UserList | null;
}

export default function ListaUsuario({
  mostrarMensagem,
  fecharMensagem,
  dados,
}: ListaUsuarioProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<
    "ativo" | "inativo" | "todos"
  >("todos");
  const [filtroTexto, setFiltroTexto] = useState("");

  useEffect(() => {
    const dadosSimulados: Usuario[] = [
      {
        id: 0,
        NOME: "Sem Dados",
        status: "Sem Dados",
      },
    ];

    if (dados) {
      const usuariosMapeados = dados.usuarios.map((usuario) => ({
        id: usuario.id_usuario,
        NOME: usuario.usuario,
        status: usuario.situacao === 1 ? "Ativo" : "Inativo",
      }));
      setUsuarios(usuariosMapeados);
    } else {
      if (mostrarMensagem) {
        setUsuarios(dadosSimulados);
      }
    }
  }, [mostrarMensagem, dados]);

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
    // filtro por texto (case insensitive)
    if (
      filtroTexto.trim() !== "" &&
      !usuario.NOME.toLowerCase().includes(filtroTexto.toLowerCase())
    )
      return false;

    // filtro por status
    if (filtroStatus === "ativo") return usuario.status === "Ativo";
    if (filtroStatus === "inativo") return usuario.status !== "Ativo";

    

    // Se não houver filtro de status ou texto, retorna todos os usuários
    return true;
  });

  return (
    <>
      {mostrarMensagem && (
        <div
          className={`${cairo.className} fixed inset-0  z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm overflow-auto `}
          onClick={() => fecharMensagem()}
        >
          <div
            className="bg-white w-full h-full flex flex-col gap-4 items-center p-6 rounded-2xl shadow-lg animate-fade-fast relative max-w-[80vw] max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                fecharMensagem();
                setFiltroStatus("todos"); // resetando o filtro
              }}
              className="absolute top-4 right-4 text-gray-800 font-bold text-2xl hover:text-gray-600 transition cursor-pointer"
              aria-label="Fechar"
            >
              &times;
            </button>
            {/* Topo com título e botões */}
            <div className="w-full p-6 flex animate-fade-fast">
              <h2 className="text-3xl font-bold text-gray-800 flex-1">
                Lista de Usuários
              </h2>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => setFiltroStatus("todos")}
                  className={` px-4 py-2 rounded transition  ${
                    filtroStatus === "todos"
                      ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                      : "cursor-pointer bg-gray-400 text-gray-700 opacity-70 hover:opacity-100"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFiltroStatus("ativo")}
                  className={`px-4 py-2 rounded-md shadow-md transition ${
                    filtroStatus === "ativo"
                      ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                      : "cursor-pointer bg-gray-400 text-gray-700 opacity-70 hover:opacity-100"
                  }`}
                >
                  Ativo
                </button>
                <button
                  onClick={() => setFiltroStatus("inativo")}
                  className={`px-4 py-2 rounded-md shadow-md transition ${
                    filtroStatus === "inativo"
                      ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                      : "cursor-pointer bg-gray-400 text-gray-700 opacity-70 hover:opacity-100"
                  }`}
                >
                  Inativo
                </button>
                <input
                  type="text"
                  id="inputText"
                  value={filtroTexto}
                  onChange={(e) => setFiltroTexto(e.target.value)}
                  className={`${cairo.className} bg-white border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400`}
                  placeholder="Buscar Usuário"
                />
              </div>
            </div>

            {/* Tabela com rolagem se necessário */}
            <div className="overflow-auto flex-1 w-full">
              <table className="min-w-full table-auto border border-gray-300 text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">Nome</th>
                    <th className="border px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id}>
                      <td className="border px-4 py-2">{usuario.id}</td>
                      <td className="border px-4 py-2">{usuario.NOME}</td>
                      <td className="border px-4 py-2">
                        {usuario.status === "Ativo" ? "Ativo" : "Inativo"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 mb-2"></div>
          </div>

          {/* Botão "Fechar" */}
        </div>
      )}
    </>
  );
}
