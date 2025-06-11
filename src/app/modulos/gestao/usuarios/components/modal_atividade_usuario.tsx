import { useEffect, useState } from "react";
import { dadosUsuarios } from "../interfaces/interface";
import { Cairo } from "next/font/google";
import { formatadorSegParaHor } from "@/utils/formatadores";
import Image from "next/image";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

interface AtividadeMes {
  horas: number;
  importacoes: number;
  lancamentos: number;
  lancamentosManuais: number;
}

interface TotalAtividades {
  total_tempo_gasto: number;
  total_importacoes: number;
  total_lancamentos: number;
  total_lancamentos_manuais: number;
}

interface AtividadesUsuario
  extends Record<string, AtividadeMes | TotalAtividades> {
  total: TotalAtividades;
}

interface Usuario {
  id: number | string;
  NOME: string;
  atividades: AtividadesUsuario;
}

interface ListaUsuarioProps {
  mostrarMensagem: boolean;
  fecharMensagem: () => void;
  dados: dadosUsuarios | null;
  meses: string[];
}

export default function ListaUsuario({
  mostrarMensagem,
  fecharMensagem,
  dados,
  meses,
}: ListaUsuarioProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtroTexto, setFiltroTexto] = useState("");

  // Interface para os dados
  interface Atividade {
    tempo_gasto: number;
    importacoes: number;
    lancamentos: number;
    lancamentos_manuais: number;
  }

  // Função para converter segundos em HH:MM:SS
  const secondsToHHMMSS = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const exportToExcel = (data: dadosUsuarios | null, fileName: string) => {
    if (!data || !data.analises.length) return;

    // Extrai todos os meses únicos dos dados
    const meses: string[] = [];
    data.analises.forEach((analise) => {
      analise.empresas.forEach((empresa) => {
        Object.keys(empresa.atividades).forEach((mes) => {
          if (!meses.includes(mes)) meses.push(mes);
        });
      });
    });
    meses.sort(); // Ordena os meses (opcional, ajustar conforme necessário)

    // Define as colunas
    const subHeaders = ["Horas", "Importações", "Lançamentos", "L. Manuais"];
    const headers = [
      "Usuários",
      ...meses.flatMap((mes) => [
        `${mes} ${subHeaders[0]}`,
        `${mes} ${subHeaders[1]}`,
        `${mes} ${subHeaders[2]}`,
        `${mes} ${subHeaders[3]}`,
      ]),
      ...subHeaders.map((sub) => `Total ${sub}`),
    ];

    // Agrupa dados por usuário
    const usuariosMap = new Map<string, { [mes: string]: Atividade }>();
    data.analises.forEach((analise) => {
      const usuario = analise.nome_usuario;
      if (!usuariosMap.has(usuario)) {
        usuariosMap.set(usuario, {});
      }
      const usuarioData = usuariosMap.get(usuario)!;
      analise.empresas.forEach((empresa) => {
        Object.entries(empresa.atividades).forEach(([mes, atividade]) => {
          if (!usuarioData[mes]) {
            usuarioData[mes] = {
              tempo_gasto: 0,
              importacoes: 0,
              lancamentos: 0,
              lancamentos_manuais: 0,
            };
          }
          usuarioData[mes].tempo_gasto += atividade.tempo_gasto;
          usuarioData[mes].importacoes += atividade.importacoes;
          usuarioData[mes].lancamentos += atividade.lancamentos;
          usuarioData[mes].lancamentos_manuais += atividade.lancamentos_manuais;
        });
      });
    });

    // Prepara os dados da planilha
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const worksheetData: any[] = [
     
      // Cabeçalho principal
      headers,
      // Subcabeçalhos
      ["", ...meses.flatMap(() => subHeaders), ...subHeaders],
    ];

    // Adiciona linhas de usuários
    usuariosMap.forEach((usuarioData, usuario) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const row: any[] = [usuario];
      let totalHoras = 0;
      let totalImportacoes = 0;
      let totalLancamentos = 0;
      let totalLancamentosManuais = 0;

      // Dados por mês
      meses.forEach((mes) => {
        const atividade = usuarioData[mes] || {
          tempo_gasto: 0,
          importacoes: 0,
          lancamentos: 0,
          lancamentos_manuais: 0,
        };
        row.push(secondsToHHMMSS(atividade.tempo_gasto));
        row.push(atividade.importacoes);
        row.push(atividade.lancamentos);
        row.push(atividade.lancamentos_manuais);
        totalHoras += atividade.tempo_gasto;
        totalImportacoes += atividade.importacoes;
        totalLancamentos += atividade.lancamentos;
        totalLancamentosManuais += atividade.lancamentos_manuais;
      });

      // Totais
      row.push(secondsToHHMMSS(totalHoras));
      row.push(totalImportacoes);
      row.push(totalLancamentos);
      row.push(totalLancamentosManuais);

      worksheetData.push(row);
    });

    // Cria a planilha
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Define larguras das colunas
    worksheet["!cols"] = [
      { wch: 15 }, // Usuários
      ...meses.flatMap(() => [
        { wch: 12 }, // Horas
        { wch: 10 }, // Importações
        { wch: 10 }, // Lançamentos
        { wch: 10 }, // L. Manuais
      ]),
      { wch: 12 }, // Total Horas
      { wch: 10 }, // Total Importações
      { wch: 10 }, // Total Lançamentos
      { wch: 10 }, // Total L. Manuais
    ];

    // Aplica formatação
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:Z2");
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
          font: {
            bold: true,
            sz: row === 0 ? 12 : 10,
            color: { rgb: "FFFFFF" },
          },
          fill: { fgColor: { rgb: "2980B9" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }
    }

    // Formata linhas de dados
    for (let row = 2; row < worksheetData.length; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
          font: { sz: 10, color: { rgb: "212121" } },
          fill: { fgColor: { rgb: row % 2 === 0 ? "E6E6E6" : "FFFFFF" } },
          alignment: {
            horizontal: col === 0 ? "left" : "center",
            vertical: "center",
          },
          border: {
            top: { style: "thin", color: { rgb: "969696" } },
            bottom: { style: "thin", color: { rgb: "969696" } },
            left: { style: "thin", color: { rgb: "969696" } },
            right: { style: "thin", color: { rgb: "969696" } },
          },
        };
      }
    }

    // Mescla células do cabeçalho para "Usuários" e "Total"
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // Usuários
      ...meses.map((_, i) => ({
        s: { r: 0, c: 1 + i * 4 },
        e: { r: 0, c: 4 + i * 4 },
      })), // Meses
      {
        s: { r: 0, c: 1 + meses.length * 4 },
        e: { r: 0, c: 4 + meses.length * 4 },
      }, // Total
    ];

    // Cria o workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Relatório de Atividades"
    );

    // Exporta o arquivo
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  //Função para exportar o pdf

  const exportToPDF = (data: dadosUsuarios | null, fileName: string) => {
    if (!data || !data.analises.length) return;

    // Inicializa o documento PDF
    const doc = new jsPDF({
      orientation: "landscape", // Mantém orientação horizontal
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Define as colunas
    const columns = [
      { header: "Usuários", dataKey: "usuario" as const },
      { header: "Total Horas", dataKey: "total_horas" as const },
      { header: "Total Importações", dataKey: "total_importacoes" as const },
      { header: "Total Lançamentos", dataKey: "total_lancamentos" as const },
      {
        header: "Total L. Manuais",
        dataKey: "total_lancamentos_manuais" as const,
      },
    ];

    // Agrupa totais por usuário
    const usuariosMap = new Map<
      string,
      {
        total_horas: number;
        total_importacoes: number;
        total_lancamentos: number;
        total_lancamentos_manuais: number;
      }
    >();
    data.analises.forEach((analise) => {
      const usuario = analise.nome_usuario;
      if (!usuariosMap.has(usuario)) {
        usuariosMap.set(usuario, {
          total_horas: 0,
          total_importacoes: 0,
          total_lancamentos: 0,
          total_lancamentos_manuais: 0,
        });
      }
      const usuarioData = usuariosMap.get(usuario)!;
      analise.empresas.forEach((empresa) => {
        Object.values(empresa.atividades).forEach((atividade) => {
          usuarioData.total_horas += atividade.tempo_gasto;
          usuarioData.total_importacoes += atividade.importacoes;
          usuarioData.total_lancamentos += atividade.lancamentos;
          usuarioData.total_lancamentos_manuais +=
            atividade.lancamentos_manuais;
        });
      });
    });

    // Prepara os dados da tabela
    const rows = Array.from(usuariosMap.entries()).map(([usuario, totals]) => ({
      usuario,
      total_horas: secondsToHHMMSS(totals.total_horas),
      total_importacoes: totals.total_importacoes,
      total_lancamentos: totals.total_lancamentos,
      total_lancamentos_manuais: totals.total_lancamentos_manuais,
    }));

    // Calcula a largura total disponível
    const totalColumns = columns.length; // 5 colunas
    const marginLeft = 10;
    const marginRight = 10;
    const maxTableWidth = pageWidth - (marginLeft + marginRight); // Largura disponível
    const minColumnWidth = 20; // Largura mínima para legibilidade
    const baseWidth = Math.max(minColumnWidth, maxTableWidth / totalColumns); // Largura base proporcional

    // Ajusta as larguras das colunas para caber exatamente na página
    const totalDesiredWidth = baseWidth * 1.5 + baseWidth * 1.2 + baseWidth * 3; // Usuários (1.5x) + Horas (1.2x) + 3 outras (1x)
    const scaleFactor = Math.min(1, maxTableWidth / totalDesiredWidth); // Fator de escala para ajustar à página
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columnStyles: { [key: number]: any } = {
      0: { halign: "left", cellWidth: baseWidth * 1.5 * scaleFactor }, // Usuários
      1: { cellWidth: baseWidth * 1.2 * scaleFactor }, // Total Horas
      2: { cellWidth: baseWidth * scaleFactor }, // Total Importações
      3: { cellWidth: baseWidth * scaleFactor }, // Total Lançamentos
      4: { cellWidth: baseWidth * scaleFactor }, // Total L. Manuais
    };

    // Adiciona o título
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Atividades - Totais", pageWidth / 2, 10, {
      align: "center",
    });

    // Configura a tabela
    autoTable(doc, {
      head: [columns.map((col) => col.header)],
      body: rows.map((row) => columns.map((col) => row[col.dataKey] ?? "")),
      startY: 20,
      margin: { top: 20, left: marginLeft, right: marginRight, bottom: 20 },
      styles: {
        font: "helvetica",
        fontSize: 8, // Reduzido para compactar
        cellPadding: 2, // Reduzido para economizar espaço
        textColor: [33, 33, 33],
        overflow: "linebreak",
        halign: "center",
        valign: "middle",
        lineWidth: 0.1,
        lineColor: [150, 150, 150],
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: "bold",
        halign: "center",
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [230, 230, 230],
      },
      columnStyles,
      tableWidth: "wrap", // Ajusta à largura da página
      theme: "grid",
      pageBreak: "auto", // Quebras de página automáticas
      didDrawPage: (data) => {
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(
          `Página ${data.pageNumber}`,
          data.settings.margin.left,
          pageHeight - 10
        );
      },
    });

    // Salva o PDF
    doc.save(`${fileName}.pdf`);
  };

  useEffect(() => {
    const dadosSimulados: Usuario[] = [
      {
        id: 0,
        NOME: "Sem Dados",
        atividades: {
          total: {
            total_tempo_gasto: 0,
            total_importacoes: 0,
            total_lancamentos: 0,
            total_lancamentos_manuais: 0,
          },
          ...meses.reduce(
            (acc, mes) => {
              acc[mes] = {
                horas: 0,
                importacoes: 0,
                lancamentos: 0,
                lancamentosManuais: 0,
              };
              return acc;
            },
            {} as Record<string, AtividadeMes>
          ),
        },
      },
    ];

    if (dados) {
      const usuariosMapeados: Usuario[] = [];

      for (const usuario of dados.analises) {
        const atividades: AtividadesUsuario = {
          total: {
            total_tempo_gasto: 0,
            total_importacoes: 0,
            total_lancamentos: 0,
            total_lancamentos_manuais: 0,
          },
          ...meses.reduce(
            (acc, mes) => {
              acc[mes] = {
                horas: 0,
                importacoes: 0,
                lancamentos: 0,
                lancamentosManuais: 0,
              };
              return acc;
            },
            {} as Record<string, AtividadeMes>
          ),
        };

        for (const empresa of usuario.empresas) {
          for (const mesAno of meses) {
            const dadosMes = empresa.atividades[mesAno];
            if (dadosMes) {
              const atividadeMes = atividades[mesAno] as AtividadeMes;

              atividadeMes.horas += dadosMes.tempo_gasto || 0;
              atividadeMes.importacoes += dadosMes.importacoes || 0;
              atividadeMes.lancamentos += dadosMes.lancamentos || 0;
              atividadeMes.lancamentosManuais +=
                dadosMes.lancamentos_manuais || 0;
            }
          }

          atividades.total.total_tempo_gasto += empresa.total_tempo_gasto || 0;
          atividades.total.total_importacoes += empresa.total_importacoes || 0;
          atividades.total.total_lancamentos += empresa.total_lancamentos || 0;
          atividades.total.total_lancamentos_manuais +=
            empresa.total_lancamentos_manuais || 0;
        }

        usuariosMapeados.push({
          id: usuario.usuario_id,
          NOME: usuario.nome_usuario,
          atividades,
        });
      }

      setUsuarios(usuariosMapeados);
    } else if (mostrarMensagem) {
      setUsuarios(dadosSimulados);
    }
  }, [mostrarMensagem, dados, meses]);

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

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.NOME.toLowerCase().includes(filtroTexto.toLowerCase())
  );

  const subColunas = [
    { label: "Horas", key: "horas" },
    { label: "Importações", key: "importacoes" },
    { label: "Lançamentos", key: "lancamentos" },
    { label: "L. Manuais", key: "lancamentosManuais" },
  ];

  const subColunasTotais = [
    { label: "Horas", key: "total_tempo_gasto" },
    { label: "Importações", key: "total_importacoes" },
    { label: "Lançamentos", key: "total_lancamentos" },
    { label: "L. Manuais", key: "total_lancamentos_manuais" },
  ];
  return (
    <>
      {mostrarMensagem && (
        <div
          className={`${cairo.className} fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm overflow-auto`}
          onClick={() => fecharMensagem()}
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

            <div className="w-full p-6 flex animate-fade-fast">
              <h2 className="items-end text-3xl font-bold text-gray-800 flex">
                Atividades por Usuário
              </h2>
              <div className="flex gap-2 ml-4">
                <input
                  type="text"
                  id="inputText"
                  value={filtroTexto}
                  onChange={(e) => setFiltroTexto(e.target.value)}
                  className={`${cairo.className} bg-white border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400`}
                  placeholder="Buscar Usuário"
                />
              </div>
              <div className="flex gap-4 ml-auto">
                <button
                  onClick={() => exportToPDF(dados, "Atividades_usuario")}
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
                  onClick={() => exportToExcel(dados, "Atividades_usuario")}
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

            <div className="overflow-auto flex-1 w-full">
              <table className="min-w-full table-auto border border-gray-300 text-sm text-center">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2" rowSpan={2}>
                      Usuários
                    </th>
                    {meses.map((mes) => (
                      <th
                        key={mes}
                        className="border px-4 py-2 text-center"
                        colSpan={subColunas.length}
                      >
                        {mes}
                      </th>
                    ))}
                    <th
                      className="border px-4 py-2 text-center"
                      colSpan={subColunas.length}
                    >
                      Total
                    </th>
                  </tr>
                  <tr>
                    {meses.map((mes) =>
                      subColunas.map(({ label }) => (
                        <th
                          key={`${mes}-${label}`}
                          className="border px-4 py-2 whitespace-nowrap"
                        >
                          {label}
                        </th>
                      ))
                    )}
                    {subColunasTotais.map(({ label }) => (
                      <th
                        key={`total-${label}`}
                        className="border px-4 py-2 whitespace-nowrap"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id}>
                      <td className="border px-4 py-2 font-bold text-black text-center  ">
                        {usuario.NOME}
                      </td>
                      {meses.map((mes) =>
                        subColunas.map(({ key }) => {
                          const atividade = usuario.atividades[mes];
                          const valor =
                            atividade && "horas" in atividade
                              ? (atividade as AtividadeMes)[
                                  key as keyof AtividadeMes
                                ]
                              : "-";

                          return (
                            <td
                              key={`${usuario.id}-${mes}-${key}`}
                              className="text-center border px-4 py-2 whitespace-nowrap"
                            >
                              {key === "horas" && typeof valor === "number"
                                ? formatadorSegParaHor(valor)
                                : (valor ?? "-")}
                            </td>
                          );
                        })
                      )}
                      {subColunasTotais.map(({ key }) => {
                        const valorTotal =
                          usuario.atividades.total[
                            key as keyof TotalAtividades
                          ];
                        return (
                          <td
                            key={`${usuario.id}-total-${key}`}
                            className="border px-4 py-2 whitespace-nowrap font-semibold"
                          >
                            {key === "total_tempo_gasto" &&
                            typeof valorTotal === "number"
                              ? formatadorSegParaHor(valorTotal)
                              : (valorTotal ?? "-")}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 mb-2"></div>
          </div>
        </div>
      )}
    </>
  );
}
