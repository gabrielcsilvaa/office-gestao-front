import { useEffect, useState } from "react";
import { UserList } from "../interfaces/interface";
import { Cairo } from "next/font/google";
import Image from "next/image";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

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
  const [filtroTabela, setFiltroTabela] = useState<{
    campo: "id" | "nome" | "status";
    direcao: "asc" | "desc";
  }>({ campo: "id", direcao: "asc" });

  const handleFiltroTabela = (campo: "id" | "nome" | "status") => {
    setFiltroTabela((prev) => {
      // Se clicar no mesmo campo, inverte a direção
      if (prev.campo === campo) {
        return { ...prev, direcao: prev.direcao === "asc" ? "desc" : "asc" };
      }
      // Se clicar em campo diferente, ordena ascendente por padrão
      return { campo, direcao: "asc" };
    });
  };

  const exportToPDF = (data: Usuario[] | null, fileName: string) => {
    if (!data) return;

    // Configurações iniciais do PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Cabeçalho
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório Lista de Usuários", pageWidth / 2, 15, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Configurações da tabela
    const columns = [
      { header: "ID", dataKey: "id" },
      { header: "NOME", dataKey: "nome" },
      { header: "STATUS", dataKey: "status" },
    ];

    // Converte os dados para o formato aceito pelo autoTable
    const rows = data.map((item) => ({
      id: item.id,
      nome: item.NOME,
      status: item.status,
    }));

    // Adiciona a tabela ao PDF
    autoTable(doc, {
      head: [columns.map((col) => col.header)],
      body: rows.map((row) => [row.id, row.nome, row.status]),
      startY: 20, // Posição inicial Y
      margin: { top: 20, left: 10, right: 10 }, // Margens laterais para melhor adaptação
      styles: {
        font: "helvetica", // Fonte limpa e profissional
        fontSize: 10, // Tamanho de fonte equilibrado
        cellPadding: 3, // Aumentado para melhor espaçamento interno
        textColor: [33, 33, 33], // Cor de texto escura para contraste
        overflow: "linebreak", // Quebra de linha para textos longos
        halign: "center", // Centraliza o texto nas células
        valign: "middle", // Alinhamento vertical no centro
        lineWidth: 0.2, // Linhas finas para um visual mais leve
        lineColor: [150, 150, 150], // Cinza suave para bordas
      },
      headStyles: {
        fillColor: [41, 128, 185], // Azul profissional para o cabeçalho
        textColor: [255, 255, 255], // Texto branco no cabeçalho
        fontSize: 11, // Cabeçalho um pouco maior
        fontStyle: "bold", // Negrito para destacar
        halign: "center", // Centraliza o cabeçalho
        cellPadding: 5, // Maior espaçamento no cabeçalho
      },
      alternateRowStyles: {
        fillColor: [230, 230, 230], // Cor de fundo alternada para linhas (cinza claro)
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 20 }, // Coluna ID alinhada à esquerda
        1: { halign: "center", cellWidth: "auto" }, // Coluna Nome com largura automática
        2: { halign: "center", cellWidth: 40 }, // Coluna Status com largura fixa
      },
      tableWidth: "auto", // Tabela se ajusta à largura da página (com margens)
      theme: "grid", // Tema com bordas visíveis
    });

    // Salva o PDF
    doc.save(fileName);
  };

  // Função para exportar em Excel
  const exportToExcel = (data: Usuario[] | null, fileName: string) => {
    if (!data) return;

    // Define as colunas da tabela
    const columns = [
      { header: "ID", dataKey: "id", width: 10 },
      { header: "NOME", dataKey: "nome", width: 30 },
      { header: "STATUS", dataKey: "status", width: 15 },
    ];

    // Converte os dados para o formato aceito pelo XLSX
    const rows = data.map((item) => ({
      id: item.id,
      nome: item.NOME,
      status: item.status,
    }));

    // Cria uma nova planilha
    const worksheetData = [
      // Cabeçalho
      columns.map((col) => col.header),
      // Linhas de dados
      ...rows.map((row) => [row.id, row.nome, row.status]),
    ];

    // Cria a planilha
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Estiliza o cabeçalho
    worksheet["!cols"] = columns.map((col) => ({ wch: col.width })); // Define a largura das colunas

    // Aplica formatação ao cabeçalho (estilo básico)
    const headerRange = XLSX.utils.decode_range(worksheet["!ref"] || "A1:C1");
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } }, // Fonte em negrito, branca
        fill: { fgColor: { rgb: "2980B9" } }, // Fundo azul, similar ao PDF
        alignment: { horizontal: "center", vertical: "center" }, // Centralizado
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    }

    // Aplica formatação às linhas de dados (estilo alternado e bordas)
    for (let row = 1; row <= rows.length; row++) {
      for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
          font: { sz: 10, color: { rgb: "212121" } }, // Texto escuro
          fill: { fgColor: { rgb: row % 2 === 0 ? "E6E6E6" : "FFFFFF" } }, // Linhas alternadas
          alignment: { horizontal: "center", vertical: "center" }, // Centralizado
          border: {
            top: { style: "thin", color: { rgb: "969696" } },
            bottom: { style: "thin", color: { rgb: "969696" } },
            left: { style: "thin", color: { rgb: "969696" } },
            right: { style: "thin", color: { rgb: "969696" } },
          },
        };
      }
    }

    // Cria o workbook e adiciona a planilha
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório de Usuários");

    // Exporta o arquivo
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
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

  const usuariosFiltradosEOrdenados = [...usuariosFiltrados].sort((a, b) => {
    let resultado = 0;

    // Comparação com base no campo selecionado
    switch (filtroTabela.campo) {
      case "nome":
        resultado = a.NOME.localeCompare(b.NOME);
        break;
      case "status":
        resultado = a.status.localeCompare(b.status);
        break;
      case "id":
      default:
        resultado = a.id - b.id;
    }

    // Aplica a direção (asc ou desc)
    return filtroTabela.direcao === "asc" ? resultado : -resultado;
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
              <h2 className="items-end text-3xl font-bold text-gray-800 flex">
                Lista de Usuários
              </h2>
              <div className="flex gap-2 ml-4">
                <input
                  type="text"
                  id="inputText"
                  value={filtroTexto}
                  onChange={(e) => setFiltroTexto(e.target.value)}
                  className={`${cairo.className}  bg-white border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400`}
                  placeholder="Buscar Usuário"
                />
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
              </div>
              <div className="flex gap-4 ml-auto">
                <button
                  onClick={() =>
                    exportToPDF(usuariosFiltrados, "Lista_usuarios")
                  }
                  className="p-1 rounded border border-gray-300 cursor-pointer bg-white  hover:bg-green-100 mt-auto"
                  style={{ width: 36, height: 36 }}
                >
                  <Image
                    src="/assets/icons/pdf.svg"
                    alt="Ícone PDF"
                    width={24}
                    height={24}
                    draggable={false}
                  />
                </button>

                <button
                  onClick={() =>
                    exportToExcel(usuariosFiltrados, "Lista_usuarios")
                  }
                  className="p-1 rounded border border-gray-300 cursor-pointer bg-white  hover:bg-green-100 mt-auto"
                  style={{ width: 36, height: 36 }}
                >
                  <Image
                    src="/assets/icons/excel.svg"
                    alt="Ícone Excel"
                    width={24}
                    height={24}
                    draggable={false}
                  />
                </button>
              </div>
            </div>

            {/* Tabela com rolagem se necessário */}
            <div className="overflow-auto flex-1 w-full">
              <table className="min-w-full table-auto border border-gray-300 text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      onClick={() => handleFiltroTabela("id")}
                      className="border w-[5vw] py-2 cursor-pointer text-center"
                    >
                      ID{" "}
                      {filtroTabela.campo === "id" &&
                        (filtroTabela.direcao === "asc" ? "" : "↓")}
                    </th>
                    <th
                      onClick={() => handleFiltroTabela("nome")}
                      className="border px-4 py-2 cursor-pointer text-center"
                    >
                      Nome{" "}
                      {filtroTabela.campo === "nome" &&
                        (filtroTabela.direcao === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      onClick={() => handleFiltroTabela("status")}
                      className="border px-4 py-2 cursor-pointer text-center"
                    >
                      Status{" "}
                      {filtroTabela.campo === "status" &&
                        (filtroTabela.direcao === "asc" ? "↑" : "↓")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltradosEOrdenados.map((usuario) => (
                    <tr key={usuario.id}>
                      <td
                        className={`border px-4 py-2 ${cairo.className} font-[700] text-center`}
                      >
                        {usuario.id}
                      </td>
                      <td
                        className={`border px-4 py-2 ${cairo.className} font-[700] text-center`}
                      >
                        {usuario.NOME}
                      </td>
                      <td
                        className={`border px-4 py-2 ${cairo.className} font-[500] text-center`}
                      >
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
