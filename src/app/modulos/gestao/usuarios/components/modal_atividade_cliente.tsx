import { useEffect, useState } from "react";
import { dadosUsuarios, EmpresasResponse } from "../interfaces/interface";
import { Cairo } from "next/font/google";
import { formatadorSegParaHor } from "@/utils/formatadores";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Image from "next/image";
import * as XLSX from "xlsx";

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

interface AtividadesEmpresa
  extends Record<string, AtividadeMes | TotalAtividades> {
  total: TotalAtividades;
}

interface Empresa {
  id: number | string;
  atividades: AtividadesEmpresa;
  nome: string;
}

interface ListaEmpresaProps {
  mostrarMensagem: boolean;
  fecharMensagem: () => void;
  dados: dadosUsuarios | null;
  meses: string[];
  infoEmpresas: EmpresasResponse | null;
}
interface Atividade {
  tempo_gasto: number;
  importacoes: number;
  lancamentos: number;
  lancamentos_manuais: number;
}

interface ExcelRow {
  codi_emp: string;
  razao_social: string;
  total_horas: string;
  total_importacoes: number;
  total_lancamentos: number;
  total_lancamentos_manuais: number;
  [
    key: `${string}_${"horas" | "importacoes" | "lancamentos" | "lancamentos_manuais"}`
  ]: string | number;
}

type SortDirection = "asc" | "desc";
type SortKey =
  | "id"
  | "nome"
  | `${string}_${"horas" | "importacoes" | "lancamentos" | "lancamentosManuais"}`
  | `total_${"tempo_gasto" | "importacoes" | "lancamentos" | "lancamentos_manuais"}`;

export default function AtividadeCliente({
  mostrarMensagem,
  fecharMensagem,
  dados,
  infoEmpresas,
  meses,
}: ListaEmpresaProps) {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Função para alternar ordenação
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Função para ordenar empresas
  const getSortedEmpresas = () => {
    const sorted = [...empresasFiltradas];
    sorted.sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let aValue: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let bValue: any;

      if (sortKey === "id") {
        aValue = a.id;
        bValue = b.id;
      } else if (sortKey === "nome") {
        aValue = a.nome ?? "";
        bValue = b.nome ?? "";
      } else if (sortKey.startsWith("total_")) {
        const key = sortKey.replace("total_", "") as keyof TotalAtividades;
        aValue = a.atividades.total[key];
        bValue = b.atividades.total[key];
      } else {
        // Meses
        const [mes, subKey] = sortKey.split("_");

        const atividadeA = a.atividades[mes];
        const atividadeB = b.atividades[mes];

        function isAtividadeMes(obj: unknown): obj is AtividadeMes {
          return (
            obj !== undefined &&
            obj !== null &&
            typeof obj === "object" &&
            "horas" in obj &&
            "importacoes" in obj &&
            "lancamentos" in obj &&
            "lancamentosManuais" in obj
          );
        }

        aValue = isAtividadeMes(atividadeA)
          ? atividadeA[subKey as keyof AtividadeMes]
          : undefined;
        bValue = isAtividadeMes(atividadeB)
          ? atividadeB[subKey as keyof AtividadeMes]
          : undefined;
      }

      // Se for horas, comparar como número
      if (sortKey.endsWith("horas") || sortKey === "total_tempo_gasto") {
        aValue = typeof aValue === "number" ? aValue : 0;
        bValue = typeof bValue === "number" ? bValue : 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        if (sortDirection === "asc") {
          return aValue.localeCompare(bValue, "pt-BR", { numeric: true });
        } else {
          return bValue.localeCompare(aValue, "pt-BR", { numeric: true });
        }
      } else {
        if (sortDirection === "asc") {
          return (aValue ?? 0) - (bValue ?? 0);
        } else {
          return (bValue ?? 0) - (aValue ?? 0);
        }
      }
    });
    return sorted;
  };

  const exportToPDF = (data: dadosUsuarios | null, fileName: string) => {
    if (!data || !data.analises.length) return;

    const doc = new jsPDF({
      orientation: "landscape",
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const columns = [
      { header: "ID", dataKey: "codi_emp" as const },
      { header: "Razão Social", dataKey: "razao_social" as const },
      { header: "Total Horas", dataKey: "total_horas" as const },
      { header: "Total Importações", dataKey: "total_importacoes" as const },
      { header: "Total Lançamentos", dataKey: "total_lancamentos" as const },
      {
        header: "Total L. Manuais",
        dataKey: "total_lancamentos_manuais" as const,
      },
    ];

    const empresasMap = new Map<
      number,
      {
        razao_social: string;
        total_horas: number;
        total_importacoes: number;
        total_lancamentos: number;
        total_lancamentos_manuais: number;
      }
    >();
    data.analises.forEach((analise) => {
      analise.empresas.forEach((empresa) => {
        const codi_emp = empresa.codi_emp;
        if (infoEmpresas) {
          const infoEmpresa = infoEmpresas.Empresas.find(
            (emp) => emp.codigo_empresa === codi_emp
          );
          if (!empresasMap.has(codi_emp)) {
            empresasMap.set(codi_emp, {
              razao_social: infoEmpresa
                ? infoEmpresa.razao_social
                : `Empresa ${codi_emp}`,
              total_horas: 0,
              total_importacoes: 0,
              total_lancamentos: 0,
              total_lancamentos_manuais: 0,
            });
          }
        }
        const empresaData = empresasMap.get(codi_emp)!;
        Object.values(empresa.atividades).forEach((atividade) => {
          empresaData.total_horas += atividade.tempo_gasto;
          empresaData.total_importacoes += atividade.importacoes;
          empresaData.total_lancamentos += atividade.lancamentos;
          empresaData.total_lancamentos_manuais +=
            atividade.lancamentos_manuais;
        });
      });
    });

    const rows = Array.from(empresasMap.entries()).map(
      ([codi_emp, totals]) => ({
        codi_emp: codi_emp.toString(),
        razao_social: totals.razao_social,
        total_horas: formatadorSegParaHor(totals.total_horas),
        total_importacoes: totals.total_importacoes,
        total_lancamentos: totals.total_lancamentos,
        total_lancamentos_manuais: totals.total_lancamentos_manuais,
      })
    );

    const marginLeft = 10;
    const marginRight = 10;
    const maxTableWidth = pageWidth - (marginLeft + marginRight);
    const baseWidth = maxTableWidth / (1 + 2 + 1 + 1 + 1 + 1);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columnStyles: { [key: number]: any } = {
      0: { halign: "center", cellWidth: baseWidth },
      1: { halign: "left", cellWidth: baseWidth * 2 },
      2: { halign: "center", cellWidth: baseWidth },
      3: { halign: "center", cellWidth: baseWidth },
      4: { halign: "center", cellWidth: baseWidth },
      5: { halign: "center", cellWidth: baseWidth },
    };

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Relatório de Atividades - Totais por Empresa",
      pageWidth / 2,
      10,
      { align: "center" }
    );

    autoTable(doc, {
      head: [columns.map((col) => col.header)],
      body: rows.map((row) => columns.map((col) => row[col.dataKey] ?? "")),
      startY: 20,
      margin: { top: 20, left: marginLeft, right: marginRight, bottom: 20 },
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 3,
        textColor: [33, 33, 33],
        overflow: "linebreak",
        halign: "center",
        valign: "middle",
        lineWidth: 0.2,
        lineColor: [150, 150, 150],
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: "bold",
        halign: "center",
        cellPadding: 5,
      },
      alternateRowStyles: {
        fillColor: [230, 230, 230],
      },
      columnStyles,
      tableWidth: "wrap",
      theme: "grid",
      pageBreak: "auto",
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

    doc.save(`${fileName}.pdf`);
  };

  const exportToExcel = (data: dadosUsuarios | null, fileName: string) => {
    if (!data || !data.analises.length) return;

    const empresasMap = new Map<
      number,
      {
        razao_social: string;
        atividades: { [mes: string]: Atividade };
        total_horas: number;
        total_importacoes: number;
        total_lancamentos: number;
        total_lancamentos_manuais: number;
      }
    >();

    data.analises.forEach((analise) => {
      analise.empresas.forEach((empresa) => {
        const codi_emp = empresa.codi_emp;
        if (infoEmpresas) {
          const infoEmpresa = infoEmpresas.Empresas.find(
            (emp) => emp.codigo_empresa === codi_emp
          );
          if (!empresasMap.has(codi_emp)) {
            empresasMap.set(codi_emp, {
              razao_social: infoEmpresa
                ? infoEmpresa.razao_social
                : `Empresa ${codi_emp}`,
              atividades: {},
              total_horas: 0,
              total_importacoes: 0,
              total_lancamentos: 0,
              total_lancamentos_manuais: 0,
            });
          }
        }
        const empresaData = empresasMap.get(codi_emp);
        if (!empresaData) return;

        Object.entries(empresa.atividades).forEach(([mes, atividade]) => {
          if (!empresaData.atividades[mes]) {
            empresaData.atividades[mes] = {
              tempo_gasto: 0,
              importacoes: 0,
              lancamentos: 0,
              lancamentos_manuais: 0,
            };
          }

          empresaData.atividades[mes].tempo_gasto += atividade.tempo_gasto;
          empresaData.atividades[mes].importacoes += atividade.importacoes;
          empresaData.atividades[mes].lancamentos += atividade.lancamentos;
          empresaData.atividades[mes].lancamentos_manuais +=
            atividade.lancamentos_manuais;

          empresaData.total_horas += atividade.tempo_gasto;
          empresaData.total_importacoes += atividade.importacoes;
          empresaData.total_lancamentos += atividade.lancamentos;
          empresaData.total_lancamentos_manuais +=
            atividade.lancamentos_manuais;
        });
      });
    });

    const meses = Object.keys(
      empresasMap.values().next().value?.atividades || {}
    );

    const rows: ExcelRow[] = Array.from(empresasMap.entries()).map(
      ([codi_emp, empresaData]) => ({
        codi_emp: codi_emp.toString(),
        razao_social: empresaData.razao_social,
        ...meses.reduce(
          (acc, mes) => ({
            ...acc,
            [`${mes}_horas`]: formatadorSegParaHor(
              empresaData.atividades[mes]?.tempo_gasto ?? 0
            ),
            [`${mes}_importacoes`]:
              empresaData.atividades[mes]?.importacoes ?? 0,
            [`${mes}_lancamentos`]:
              empresaData.atividades[mes]?.lancamentos ?? 0,
            [`${mes}_lancamentos_manuais`]:
              empresaData.atividades[mes]?.lancamentos_manuais ?? 0,
          }),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {} as Record<string, any>
        ),
        total_horas: formatadorSegParaHor(empresaData.total_horas),
        total_importacoes: empresaData.total_importacoes,
        total_lancamentos: empresaData.total_lancamentos,
        total_lancamentos_manuais: empresaData.total_lancamentos_manuais,
      })
    );

    const ws_data = [
      [
        "ID",
        "Razão Social",
        ...meses.flatMap((mes) => [mes, "", "", ""]),
        "Total",
        "",
        "",
        "",
      ],
      [
        "",
        "",
        ...meses.flatMap(() => [
          "Horas",
          "Importações",
          "Lançamentos",
          "L. Manuais",
        ]),
        "Horas",
        "Importações",
        "Lançamentos",
        "L. Manuais",
      ],
      ...rows.map((row) => [
        row.codi_emp,
        row.razao_social,
        ...meses.flatMap((mes) => [
          row[`${mes}_horas`],
          row[`${mes}_importacoes`],
          row[`${mes}_lancamentos`],
          row[`${mes}_lancamentos_manuais`],
        ]),
        row.total_horas,
        row.total_importacoes,
        row.total_lancamentos,
        row.total_lancamentos_manuais,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
      { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } },
      ...meses.map((_, i) => ({
        s: { r: 0, c: 2 + i * 4 },
        e: { r: 0, c: 2 + i * 4 + 3 },
      })),
      {
        s: { r: 0, c: 2 + meses.length * 4 },
        e: { r: 0, c: 2 + meses.length * 4 + 3 },
      },
    ];

    const range = XLSX.utils.decode_range(ws["!ref"]!);
    for (let R = 0; R <= range.e.r; R++) {
      for (let C = 0; C <= range.e.c; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellAddress]) ws[cellAddress] = { v: "" };

        const cellStyle = {
          font: { name: "Calibri", sz: 11 },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };

        if (R < 2) {
          cellStyle.font = {
            ...cellStyle.font,
          };
        }

        if (R >= 2 && C === 1) {
          cellStyle.alignment = { ...cellStyle.alignment, horizontal: "left" };
        }

        ws[cellAddress].s = cellStyle;
      }
    }

    ws["!cols"] = [
      { wch: 10 },
      { wch: 40 },
      ...meses.flatMap(() => [
        { wch: 12 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
      ]),
      { wch: 12 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatório");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  useEffect(() => {
    if (!dados) {
      if (mostrarMensagem) {
        setEmpresas([]);
      }
      return;
    }

    const empresasMap: Record<
      number | string,
      {
        id: number | string;
        atividades: AtividadesEmpresa;
        nome: string;
      }
    > = {};

    for (const usuario of dados.analises) {
      for (const empresa of usuario.empresas) {
        if (!empresasMap[empresa.codi_emp]) {
          for (const empresaInfo of infoEmpresas?.Empresas || []) {
            if (empresaInfo.codigo_empresa === empresa.codi_emp) {
              empresasMap[empresa.codi_emp] = {
                id: empresa.codi_emp,
                nome: empresaInfo.nome_empresa,
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
              };
            }
          }
        }

        const atividadesEmpresa = empresasMap[empresa.codi_emp].atividades;

        for (const mesAno of meses) {
          const dadosMes = empresa.atividades[mesAno];
          if (dadosMes) {
            const atividadeMes = atividadesEmpresa[mesAno] as AtividadeMes;

            atividadeMes.horas += dadosMes.tempo_gasto || 0;
            atividadeMes.importacoes += dadosMes.importacoes || 0;
            atividadeMes.lancamentos += dadosMes.lancamentos || 0;
            atividadeMes.lancamentosManuais +=
              dadosMes.lancamentos_manuais || 0;
          }
        }

        atividadesEmpresa.total.total_tempo_gasto +=
          empresa.total_tempo_gasto || 0;
        atividadesEmpresa.total.total_importacoes +=
          empresa.total_importacoes || 0;
        atividadesEmpresa.total.total_lancamentos +=
          empresa.total_lancamentos || 0;
        atividadesEmpresa.total.total_lancamentos_manuais +=
          empresa.total_lancamentos_manuais || 0;
      }
    }

    setEmpresas(Object.values(empresasMap));
    // eslint-disable-next-line
  }, [dados, meses, mostrarMensagem]);

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

  const empresasFiltradas = empresas.filter((empresa) => {
    const filtro = filtroTexto.toLowerCase();
    const idString = empresa.id.toString().toLowerCase();
    const nomeString = (empresa.nome ?? "").toLowerCase();

    return idString.includes(filtro) || nomeString.includes(filtro);
  });

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

  const sortedEmpresas = getSortedEmpresas();

  // Helper para mostrar seta de ordenação
  const renderSortArrow = (key: SortKey) => {
    if (sortKey !== key) return null;
    return <span className="ml-1">{sortDirection === "asc" ? "▲" : "▼"}</span>;
  };

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
                Atividades por Cliente
              </h2>
              <div className="flex gap-2 ml-4">
                <input
                  type="text"
                  id="inputText"
                  value={filtroTexto}
                  onChange={(e) => setFiltroTexto(e.target.value)}
                  className={`${cairo.className} bg-white border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400`}
                  placeholder="Buscar Empresa"
                />
              </div>
              <div className="flex gap-4 ml-auto">
                <button
                  onClick={() => exportToPDF(dados, "Atividades_cliente")}
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
                  onClick={() => exportToExcel(dados, "Atividades_cliente")}
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
              <table className="min-w-full table-auto border border-gray-300 text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      className="border px-4 py-2 whitespace-nowrap text-center align-middle cursor-pointer select-none"
                      rowSpan={2}
                      onClick={() => handleSort("id")}
                    >
                      ID{renderSortArrow("id")}
                    </th>
                    <th
                      className="border px-4 py-2 whitespace-nowrap text-center align-middle cursor-pointer select-none"
                      rowSpan={2}
                      onClick={() => handleSort("nome")}
                    >
                      Razão Social{renderSortArrow("nome")}
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
                      subColunas.map(({ label, key }) => (
                        <th
                          key={`${mes}-${label}`}
                          className="border px-4 py-2 whitespace-nowrap cursor-pointer select-none"
                          onClick={() => handleSort(`${mes}_${key}` as SortKey)}
                        >
                          {label}
                          {renderSortArrow(`${mes}_${key}` as SortKey)}
                        </th>
                      ))
                    )}
                    {subColunasTotais.map(({ label, key }) => (
                      <th
                        key={`total-${label}`}
                        className="border px-4 py-2 whitespace-nowrap cursor-pointer select-none"
                        onClick={() => handleSort(`total_${key}` as SortKey)}
                      >
                        {label}
                        {renderSortArrow(`total_${key}` as SortKey)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedEmpresas.map((empresa) => (
                    <tr key={empresa.id}>
                      <td className="border px-4 py-2 font-bold text-blackwhitespace-nowrap text-center align-middle">
                        {empresa.id}
                      </td>
                      <td className="border px-4 py-2 font-bold text-black whitespace-nowrap text-center align-middle">
                        {empresa.nome}
                      </td>
                      {meses.map((mes) =>
                        subColunas.map(({ key }) => {
                          const atividade = empresa.atividades[mes];
                          const valor =
                            atividade && "horas" in atividade
                              ? (atividade as AtividadeMes)[
                                  key as keyof AtividadeMes
                                ]
                              : "-";

                          return (
                            <td
                              key={`${empresa.id}-${mes}-${key}`}
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
                          empresa.atividades.total[
                            key as keyof TotalAtividades
                          ];
                        return (
                          <td
                            key={`${empresa.id}-total-${key}`}
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
