import { DadosModulo } from "../interfaces/interface";
import { Cairo } from "next/font/google";
import {
  formatadorNumeroComPontos,
  formatadorSegParaHor,
} from "@/utils/formatadores";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import Image from "next/image";

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

  const exportToPDF = (data: DadosModulo | null, fileName: string) => {
    if (!data) return;

    // Inicializa o documento PDF
    const doc = new jsPDF({
      orientation: "landscape",
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Configura margens
    const marginLeft = 15;
    const marginRight = 15;
    const marginTop = 15;
    let currentY = marginTop;

    // Adiciona título geral (apenas uma vez)
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Relatório de Atividades - Totais por Sistema",
      pageWidth / 2,
      currentY,
      { align: "center" }
    );
    currentY += 10;

    // Adiciona data do relatório
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(
      `Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`,
      marginLeft,
      currentY
    );
    currentY += 10;

    // Itera sobre cada sistema
    Object.entries(data).forEach(
      ([sistema, { usuarios, total_sistema }], index) => {
        // Verifica se há espaço suficiente para a tabela
        const estimatedTableHeight = usuarios.length * 6 + 30; // Aproximadamente 6mm por linha + cabeçalho + margens
        if (currentY + estimatedTableHeight > pageHeight - 20) {
          doc.addPage();
          currentY = marginTop;
        }

        // Adiciona título do sistema
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(33, 33, 33);
        doc.text(sistema, marginLeft, currentY);
        currentY += 8;

        // Define as colunas
        const columns = [
          { header: "Usuário", dataKey: "usuario" },
          { header: "Total Horas", dataKey: "total_horas" },
        ];

        // Prepara os dados da tabela
        const rows = usuarios.map((user) => ({
          usuario: user.usuario,
          total_horas: formatadorSegParaHor(user.total_usuario),
        }));

        // Adiciona linha de total do sistema
        rows.push({
          usuario: "Total Sistema",
          total_horas: formatadorSegParaHor(total_sistema),
        });

        // Configura a tabela
        autoTable(doc, {
          head: [columns.map((col) => col.header)],
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: dynamic key
          body: rows.map((row) => columns.map((col) => row[col.dataKey] ?? "")),
          startY: currentY,
          margin: {
            top: marginTop,
            left: marginLeft,
            right: marginRight,
            bottom: 20,
          },
          styles: {
            font: "helvetica",
            fontSize: 9,
            cellPadding: 2,
            textColor: [0, 0, 0],
            overflow: "linebreak",
            halign: "center",
            valign: "middle",
            lineWidth: 0.1,
            lineColor: [200, 200, 200],
          },
          headStyles: {
            fillColor: [21, 93, 252],
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: "bold",
            halign: "center",
            cellPadding: 3,
          },
          columnStyles: {
            0: {
              halign: "left",
              cellWidth: pageWidth - marginLeft - marginRight - 40,
            }, // Usuário ocupa espaço maior
            1: { halign: "center", cellWidth: 40 }, // Total Horas fixo em 40mm
          },
          tableWidth: pageWidth - marginLeft - marginRight,
          theme: "plain", // Sem grid, apenas bordas definidas
          pageBreak: "auto",
          didDrawPage: (data) => {
            // Adiciona número da página no rodapé
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.setFont("helvetica ", "normal");
            doc.text(
              `Página ${data.pageNumber}`,
              pageWidth - marginRight - 10,
              pageHeight - 10,
              { align: "right" }
            );
          },
        });

        // Atualiza a posição Y para o próximo sistema
        // eslint-disable-next-line
        currentY = (doc as any).lastAutoTable.finalY + 10;

        // Adiciona espaço extra entre sistemas, mas não no último
        if (index < Object.keys(data).length - 1) {
          currentY += 5;
        }
      }
    );

    // Salva o PDF
    doc.save(`${fileName}.pdf`);
  };

  const exportToExcel = (data: DadosModulo | null, fileName: string) => {
    if (!data) return;

    // Cria o workbook
    const wb = XLSX.utils.book_new();

    // Itera sobre cada sistema
    Object.entries(data).forEach(([sistema, { usuarios, total_sistema }]) => {
      // Prepara os dados da tabela
      const rows = usuarios.map((user) => ({
        usuario: user.usuario,
        ...meses.reduce(
          (acc, mes) => ({
            ...acc,
            [mes]: formatadorSegParaHor(user.atividades[mes] || 0),
          }),
          {}
        ),
        total_horas: formatadorSegParaHor(user.total_usuario),
      }));

      // Adiciona linha de total do sistema
      rows.push({
        usuario: "Total Sistema",
        ...meses.reduce(
          (acc, mes) => ({
            ...acc,
            [mes]: formatadorSegParaHor(
              usuarios.reduce(
                (sum, user) => sum + (user.atividades[mes] || 0),
                0
              )
            ),
          }),
          {}
        ),
        total_horas: formatadorSegParaHor(total_sistema),
      });

      // Cria a planilha
      const ws_data = [
        // Cabeçalho
        ["Usuário", ...meses, "Total Horas"],
        // Dados
        ...rows.map((row) => [
          row.usuario,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: dynamic key

          ...meses.map((mes) => row[mes]),
          row.total_horas,
        ]),
      ];

      const ws = XLSX.utils.aoa_to_sheet(ws_data);

      // Ajusta a formatação
      const range = XLSX.utils.decode_range(ws["!ref"]!);
      for (let R = 0; R <= range.e.r; R++) {
        for (let C = 0; C <= range.e.c; C++) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cellAddress]) ws[cellAddress] = { v: "" };
          ws[cellAddress].s = {
            font: { name: "Calibri", sz: 11 },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          };
          if (R === 0) {
            ws[cellAddress].s.fill = {
              fgColor: { rgb: "2978B9" },
            };
            ws[cellAddress].s.font = { color: { rgb: "FFFFFF" }, bold: true };
          }
          if (R > 0 && C === 0) {
            ws[cellAddress].s.alignment = { horizontal: "left" };
          }
        }
      }

      // Define larguras das colunas
      ws["!cols"] = [
        { wch: 20 }, // Usuário
        ...meses.map(() => ({ wch: 12 })), // Meses
        { wch: 12 }, // Total Horas
      ];

      // Adiciona a planilha ao workbook
      XLSX.utils.book_append_sheet(wb, ws, sistema.slice(0, 31)); // Limita nome da aba a 31 caracteres
    });

    // Salva o Excel
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

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
        <div className="flex gap-2 ml-4 w-full items-center mr-8">
          <h2
            className={` ${cairo.className} text-3xl font-bold text-gray-800 p-6`}
          >
            Atividades por Módulo
          </h2>
          <div className="flex gap-4 ml-auto">
            <button
              onClick={() => exportToPDF(dados, "Atividades_modulo")}
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
              onClick={() => exportToExcel(dados, "Atividades_modulo")}
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
