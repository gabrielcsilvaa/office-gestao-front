"use client";
import { Cairo } from "next/font/google";
import { useState, useEffect, useMemo } from "react";
import SecaoFiltros from "./components/SecaoFiltros";
import KpiCardsGrid from "./components/KpiCardsGrid";
import EvolucaoCard from "./components/EvolucaoCard";
import ValorPorGrupoCard from "./components/ValorPorGrupoCard";
import AtestadosTable from "./components/AtestadosTable";
import AfastamentosTable from "./components/AfastamentosTable";
import ContratosTable from "./components/ContratosTable";
import FeriasDetalheCard from "./components/FeriasDetalheCard";
import AlteracoesSalariaisDetalheCard from "./components/AlteracoesSalariaisDetalheCard";
import Modal from "../organizacional/components/Modal";
import DetalhesModal, { ExportConfig } from "./components/DetalhesModal";
import EvolucaoChart from "./components/EvolucaoChart";
import ValorPorGrupoChart from "./components/ValorPorGrupoChart";
import Calendar from "@/components/calendar";
import Loading from "@/app/loading";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { EmpresaFicha, FeriasPorEmpresa, AlteracoesPorEmpresa, FormattedFerias, FormattedAlteracao, Afastamento, Exame, Contrato } from "@/types/fichaPessoal.types";
import { formatDate, formatDateToBR, parseCurrency } from "@/utils/formatters";
import { useFichaPessoalData } from "@/hooks/useFichaPessoalData";

// Importe os novos componentes de tabela para o modal
import FeriasModalTable from "./components/FeriasModalTable";
import AtestadosModalTable from "./components/AtestadosModalTable";
import AfastamentosModalTable from "./components/AfastamentosModalTable";
import ContratosModalTable from "./components/ContratosModalTable";
import AlteracoesSalariaisModalTable from "./components/AlteracoesSalariaisModalTable";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cairo",
});

const rawChartDataEntriesFicha = [
  "Jan/2024: R$ 1.896,58",
  "Fev/2024: R$ 2.200,00",
  "Mar/2024: R$ 2.050,75",
  "Abr/2024: R$ 2.350,00",
  "Mai/2024: R$ 2.100,50",
  "Jun/2024: R$ 2.600,00",
  "Jul/2024: R$ 2.450,25",
  "Ago/2024: R$ 2.850,00",
  "Set/2024: R$ 2.700,80",
  "Out/2024: R$ 3.000,00", 
  "Nov/2024: R$ 2.900,90", 
  "Dez/2024: R$ 3.134,66",
];

const sectionIconsFicha = [
  { src: "/assets/icons/icon-lay-down.svg", alt: "Lay Down", adjustSize: true },
  { src: "/assets/icons/icon-lay-up.svg", alt: "Lay Up", adjustSize: true },
  { src: "/assets/icons/icon-hierarchy.svg", alt: "Hierarchy" },
  { src: "/assets/icons/icon-filter-layers.svg", alt: "Filter Layers" },
  { src: "/assets/icons/icon-maximize.svg", alt: "Maximize" },
  { src: "/assets/icons/icon-more-options.svg", alt: "More Options" },
];

const tableHeaderIcons = sectionIconsFicha.slice(-3);

const valorPorGrupoDataFicha = [
  { name: "Salário Base", value: 5000.00 },
  { name: "Horas Extras (50%)", value: 350.75 },
  { name: "Adicional Noturno", value: 120.20 },
  { name: "Comissões", value: 850.00 },
  { name: "DSR sobre Horas Extras", value: 70.15 },
  { name: "DSR sobre Comissões", value: 170.00 },
  { name: "Gratificação de Função", value: 600.00 },
  { name: "Ajuda de Custo - Alimentação", value: 450.00 },
  { name: "Ajuda de Custo - Transporte", value: 180.00 },
  { name: "Prêmio por Desempenho", value: 1200.00 },
  { name: "Participação nos Lucros (PLR)", value: 2500.00 },
  { name: "Abono Pecuniário de Férias", value: 1666.67 },
  { name: "1/3 Constitucional de Férias", value: 555.56 },
  { name: "Salário Família", value: 90.78 },
  { name: "Adicional de Insalubridade", value: 282.40 },
  { name: "Adicional de Periculosidade", value: 1500.00 },
  { name: "Quebra de Caixa", value: 150.00 },
  { name: "INSS (Desconto)", value: -550.00 },
  { name: "IRRF (Desconto)", value: -320.50 },
  { name: "Contribuição Sindical (Desconto)", value: -50.00 },
  { name: "Vale Transporte (Desconto)", value: -90.00 },
  { name: "Vale Refeição (Desconto)", value: -70.00 },
  { name: "Plano de Saúde (Desconto)", value: -250.00 },
  { name: "Pensão Alimentícia (Desconto)", value: -750.00 },
  { name: "Faltas e Atrasos (Desconto)", value: -120.00 },
  { name: "Empréstimo Consignado (Desconto)", value: -400.00 },
];

// Helper function to add a common header to PDF documents
const addHeaderToPDF = (
  doc: jsPDF,
  reportTitle: string,
  empresaFilter: string,
  startDateFilter: string | null,
  endDateFilter: string | null
): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10; // Page margin for header content
  let currentY = 15; // Initial Y position for the header

  // Report Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(reportTitle, pageWidth / 2, currentY, { align: 'center' });
  currentY += 8; // Space after title

  // Filter Info & Generation Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  // Line 1: Empresa (left) and Generated At (right)
  if (empresaFilter) {
    doc.text(`Empresa: ${empresaFilter}`, margin, currentY);
  }
  const now = new Date();
  const generatedAt = `Gerado em: ${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR')}`;
  const generatedAtWidth = doc.getTextWidth(generatedAt);
  doc.text(generatedAt, pageWidth - margin - generatedAtWidth, currentY);
  currentY += 6; // Space for next line

  // Line 2: Período (left)
  if (startDateFilter && endDateFilter) {
    doc.text(`Período: ${formatDateToBR(startDateFilter)} - ${formatDateToBR(endDateFilter)}`, margin, currentY);
  }
  currentY += 8; // Space before table starts

  return currentY; // Return the Y position for the autoTable to start
};


export default function FichaPessoalPage() {
  // 🎛️ Estados de filtros e controle da UI
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>("");
  const [selectedColaborador, setSelectedColaborador] = useState<string>("");
  
  // 🔄 Sistema de modais tipado
  type ModalType = 'exames' | 'afastamentos' | 'contratos' | 'ferias' | 'alteracoes' | 'evolucao' | 'valorPorGrupo' | null;
  const [modalAberto, setModalAberto] = useState<ModalType>(null);
  const handleCloseModal = () => setModalAberto(null);

  // 📅 Estados de data
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  
  // 📊 Estados de dados brutos da API
  const [dados, setDados] = useState<EmpresaFicha[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [empresaOptions, setEmpresaOptions] = useState<string[]>([]);
  const [feriasRaw, setFeriasRaw] = useState<FeriasPorEmpresa[]>([]);
  const [alteracoesRaw, setAlteracoesRaw] = useState<AlteracoesPorEmpresa[]>([]);

  // 🧠 Hook customizado - Cérebro de dados processados
  const {
    kpiCardData,
    contratosData,
    examesData,
    afastamentosData,
    feriasData,
    alteracoesData,
    colaboradorOptions,
    empresaOptionsData,
  } = useFichaPessoalData({
    dados,
    feriasRaw,
    alteracoesRaw,
    selectedEmpresa,
    selectedColaborador,
  });

  // 📅 Handlers para mudanças de data
  const handleStartDateChange = (date: string | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: string | null) => {
    setEndDate(date);
  };

  // 🌐 useEffect para buscar dados da API
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        setError(null);
        setEmpresaOptions([]);
        setSelectedColaborador("");

        if (!startDate || !endDate) {
          setDados(null);
          return;
        }

        const formattedStartDate = formatDate(new Date(startDate));
        const formattedEndDate = formatDate(new Date(endDate));

        const body = {
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        };

        const response = await fetch("/api/dashboard-ficha", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);

        const result = (await response.json()) as {
          dados?: EmpresaFicha[];
          alteracao_salario?: AlteracoesPorEmpresa[];
          ferias?: FeriasPorEmpresa[];
        };

        console.log("Dados recebidos:", result);

        // Dados brutos da API
        const rawDados: EmpresaFicha[] = Array.isArray(result.dados) ? result.dados : [];
        setDados(rawDados);

        // Console.log para exibir funcionários com exames não vazios
        if (rawDados.length > 0) {
          const funcionariosComExames = rawDados.flatMap(empresa => 
            empresa.funcionarios?.filter(funcionario => 
              funcionario.exames && funcionario.exames.length > 0
            ) || []
          );
          
          if (funcionariosComExames.length > 0) {
            console.log("Funcionários com exames:", funcionariosComExames);
          } else {
            console.log("Nenhum funcionário possui exames registrados");
          }
        }

        // Lista de empresas para o select
        if (rawDados.length > 0) {
          const uniqueEmpresas: string[] = Array.from(
            new Set(rawDados.map((item) => item.nome_empresa.trim()))
          ).sort();
          setEmpresaOptions(uniqueEmpresas);
        } else {
          setEmpresaOptions([]);
        }

        // Dados de férias e alterações salariais
        setFeriasRaw(Array.isArray(result.ferias) ? result.ferias : []);
        setAlteracoesRaw(Array.isArray(result.alteracao_salario) ? result.alteracao_salario : []);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        setDados(null);
        setEmpresaOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [startDate, endDate]); 
  // 🔄 Reset colaborador quando empresa muda
  useEffect(() => {
    setSelectedColaborador("");
  }, [selectedEmpresa]);

  // 📊 Título da evolução e dados processados para gráficos
  const evolucaoCardTitle = "Evolução de Custo Total";

  const processedEvolucaoChartDataFicha = useMemo(() => {
    return rawChartDataEntriesFicha.map(entry => {
      const [month, valueString] = entry.split(": ");
      return { month, value: parseCurrency(valueString) };
    });
  }, []);

  // 📋 Dados de tabela processados (removendo lógica de padding)
  const processedTableData = useMemo(() => {
    return {
      contratos: contratosData,
    };
  }, [contratosData]);
  // 🔄 Loading state
  if (loading) {
    return <Loading />;
  }

  // Função para exportar exames para PDF no padrão dos modais da carteira
  const exportExamesToPDF = (data: Exame[], reportName: string) => {
    const doc = new jsPDF(); // Default is portrait
    const tableStartY = addHeaderToPDF(doc, reportName, selectedEmpresa, startDate, endDate);

    const tableData = data.map((e) => [
      e.nomeColaborador,
      e.tipo,
      e.dataExame,
      e.vencimento,
      e.resultado,
    ]);
    const tableHeaders = [
      "Nome do Funcionário",
      "Tipo",
      "Data do Exame",
      "Data de Vencimento",
      "Resultado",
    ];

    autoTable(doc, {
      startY: tableStartY, 
      head: [tableHeaders],
      body: tableData,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 1,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
        textColor: [50, 50, 50],
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: 'bold' }, // Nome do Funcionário
        1: { cellWidth: 35, halign: 'left' },    // Tipo (text, so left align)
        2: { cellWidth: 35, halign: 'right' },   // Data do Exame
        3: { cellWidth: 35, halign: 'right' },   // Data de Vencimento
        4: { cellWidth: 35, halign: 'left' },    // Resultado (text, so left align)
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: 4, right: 2 },
      didDrawPage: function (data) {
        doc.setFontSize(8);
        doc.text('Página ' + data.pageNumber, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    doc.save(`${reportName.replace(/ /g, "_")}.pdf`);
  };

  // Função para exportar exames para Excel (usando XLSX, igual ao padrão do carteira)
  const exportExamesToExcel = (data: Exame[], fileName: string) => {
    // Importação dinâmica para evitar erro em ambiente SSR
    import("xlsx").then(XLSX => {
      const ws = XLSX.utils.json_to_sheet(
        data.map(e => ({
          "Nome do Funcionário": e.nomeColaborador,
          "Tipo": e.tipo,
          "Data do Exame": e.dataExame,
          "Data de Vencimento": e.vencimento,
          "Resultado": e.resultado,
        }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Exames");
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    });
  };

  // Função para exportar afastamentos para PDF (padrão carteira)
  const exportAfastamentosToPDF = (data: Afastamento[], reportName: string) => {
    const doc = new jsPDF(); // Default is portrait
    const tableStartY = addHeaderToPDF(doc, reportName, selectedEmpresa, startDate, endDate);

    const tableData = data.map((a) => [
      a.nomeColaborador,
      a.tipo,
      a.inicio,
      a.termino,
      a.diasAfastados,
    ]);
    const tableHeaders = [
      "Nome do Funcionário",
      "Tipo",
      "Data de Início",
      "Data de Término",
      "Dias Afastados",
    ];

    autoTable(doc, {
      startY: tableStartY, 
      head: [tableHeaders],
      body: tableData,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 1,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
        textColor: [50, 50, 50],
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: 'bold' }, // Nome do Funcionário
        1: { cellWidth: 35, halign: 'left' },    // Tipo (text, so left align)
        2: { cellWidth: 35, halign: 'right' },   // Data de Início
        3: { cellWidth: 35, halign: 'right' },   // Data de Término
        4: { cellWidth: 35, halign: 'right' },   // Dias Afastados
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: 4, right: 2 },
      didDrawPage: function (data) {
        doc.setFontSize(8);
        doc.text('Página ' + data.pageNumber, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    doc.save(`${reportName.replace(/ /g, "_")}.pdf`);
  };

  // Função para exportar afastamentos para Excel (padrão carteira)
  const exportAfastamentosToExcel = (data: Afastamento[], fileName: string) => {
    import("xlsx").then(XLSX => {
      const ws = XLSX.utils.json_to_sheet(
        data.map(a => ({
          "Nome do Funcionário": a.nomeColaborador,
          "Tipo": a.tipo,
          "Data de Início": a.inicio,
          "Data de Término": a.termino,
          "Dias Afastados": a.diasAfastados,
        }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Afastamentos");
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    });
  };

  // Função para exportar contratos para PDF (padrão carteira)
  const exportContratosToPDF = (data: Contrato[], reportName: string) => {
    const doc = new jsPDF(); // Default is portrait
    const tableStartY = addHeaderToPDF(doc, reportName, selectedEmpresa, startDate, endDate);

    const tableData = data.map((c) => [
      c.colaborador,
      c.dataAdmissao,
      c.dataRescisao === "" ? "Ativo" : c.dataRescisao,
      c.salarioBase,
    ]);
    const tableHeaders = [
      "Nome do Funcionário",
      "Data de Admissão",
      "Data de Rescisão",
      "Salário Base",
    ];

    autoTable(doc, {
      startY: tableStartY, 
      head: [tableHeaders],
      body: tableData,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 1,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
        textColor: [50, 50, 50],
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold' }, // Nome do Funcionário
        1: { cellWidth: 40, halign: 'right' },   // Data de Admissão
        2: { cellWidth: 40, halign: 'right' },   // Data de Rescisão
        3: { cellWidth: 50, halign: 'right' },   // Salário Base
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: 4, right: 2 },
      didDrawPage: function (data) {
        doc.setFontSize(8);
        doc.text('Página ' + data.pageNumber, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    doc.save(`${reportName.replace(/ /g, "_")}.pdf`);
  };

  // Função para exportar contratos para Excel (padrão carteira)
  const exportContratosToExcel = (data: Contrato[], fileName: string) => {
    import("xlsx").then(XLSX => {
      const ws = XLSX.utils.json_to_sheet(
        data.map(c => ({
          "Nome do Funcionário": c.colaborador,
          "Data de Admissão": c.dataAdmissao,
          "Data de Rescisão": c.dataRescisao,
          "Salário Base": c.salarioBase,
        }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Contratos");
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    });
  };

  // Função para exportar férias para PDF (padrão carteira, colunas mais compactas)
  const exportFeriasToPDF = (data: FormattedFerias[], reportName: string) => {
    const doc = new jsPDF({ orientation: "landscape" }); 
    const tableStartY = addHeaderToPDF(doc, reportName, selectedEmpresa, startDate, endDate);

    const tableData = data.map((f) => [
      f.nomeColaborador,
      f.inicioPeriodoAquisitivo,
      f.fimPeriodoAquisitivo,
      f.inicioPeriodoGozo,
      f.fimPeriodoGozo,
      f.limiteParaGozo,
      f.diasDeDireito,
      f.diasGozados,
      f.diasDeSaldo,
    ]);
    const tableHeaders = [
      "Nome do Funcionário",
      "Início Período Aquisitivo",
      "Fim Período Aquisitivo",
      "Início Gozo",
      "Fim Gozo",
      "Limite para Gozo",
      "Dias de Direito",
      "Dias Gozados",
      "Dias de Saldo",
    ];

    autoTable(doc, {
      startY: tableStartY,
      head: [tableHeaders],
      body: tableData,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 1,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
        textColor: [50, 50, 50],
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' }, // Nome do Funcionário
        1: { cellWidth: 32, halign: 'right' },   // Início Período Aquisitivo
        2: { cellWidth: 32, halign: 'right' },   // Fim Período Aquisitivo
        3: { cellWidth: 30, halign: 'right' },   // Início Gozo
        4: { cellWidth: 30, halign: 'right' },   // Fim Gozo
        5: { cellWidth: 32, halign: 'right' },   // Limite para Gozo
        6: { cellWidth: 25, halign: 'right' },   // Dias de Direito
        7: { cellWidth: 25, halign: 'right' },   // Dias Gozados
        8: { cellWidth: 25, halign: 'right' },   // Dias de Saldo
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: 4, right: 2 },
      didDrawPage: function (data) {
        doc.setFontSize(8);
        doc.text('Página ' + data.pageNumber, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    doc.save(`${reportName.replace(/ /g, "_")}.pdf`);
  };

  // Função para exportar férias para Excel (padrão carteira)
  const exportFeriasToExcel = (data: FormattedFerias[], fileName: string) => {
    import("xlsx").then(XLSX => {
      const ws = XLSX.utils.json_to_sheet(
        data.map(f => ({
          "Nome do Funcionário": f.nomeColaborador,
          "Início Período Aquisitivo": f.inicioPeriodoAquisitivo,
          "Fim Período Aquisitivo": f.fimPeriodoAquisitivo,
          "Início Gozo": f.inicioPeriodoGozo,
          "Fim Gozo": f.fimPeriodoGozo,
          "Limite para Gozo": f.limiteParaGozo,
          "Dias de Direito": f.diasDeDireito,
          "Dias Gozados": f.diasGozados,
          "Dias de Saldo": f.diasDeSaldo,
        }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Férias");
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    });
  };

  // Função para exportar alterações salariais para PDF (padrão carteira)
  const exportAlteracoesToPDF = (data: FormattedAlteracao[], reportName: string) => {
    const doc = new jsPDF(); // Default is portrait
    const tableStartY = addHeaderToPDF(doc, reportName, selectedEmpresa, startDate, endDate);

    const tableData = data.map((a) => [
      a.nomeColaborador,
      a.competencia,
      a.salarioAnterior !== null ? a.salarioAnterior.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "N/A",
      a.salarioNovo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      a.motivo,
      a.percentual === "" ? "-" : a.percentual, // Modified line
    ]);
    const tableHeaders = [
      "Nome do Funcionário",
      "Competência",
      "Salário Anterior",
      "Salário Novo",
      "Motivo",
      "Variação (%)",
    ];

    autoTable(doc, {
      startY: tableStartY, 
      head: [tableHeaders],
      body: tableData,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 1,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
        textColor: [50, 50, 50],
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 52, fontStyle: 'bold' }, // Nome do Funcionário
        1: { cellWidth: 32, halign: 'right' },   // Competência
        2: { cellWidth: 32, halign: 'right' },   // Salário Anterior
        3: { cellWidth: 32, halign: 'right' },   // Salário Novo
        4: { cellWidth: 32, halign: 'left' },    // Motivo (text, so left align)
        5: { cellWidth: 24, halign: 'right' },   // Variação (%)
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: 4, right: 2 },
      didDrawPage: function (data) {
        doc.setFontSize(8);
        doc.text('Página ' + data.pageNumber, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    doc.save(`${reportName.replace(/ /g, "_")}.pdf`);
  };

  // Função para exportar alterações salariais para Excel (padrão carteira)
  const exportAlteracoesToExcel = (data: FormattedAlteracao[], fileName: string) => {
    import("xlsx").then(XLSX => {
      const ws = XLSX.utils.json_to_sheet(
        data.map(a => ({
          "Nome do Funcionário": a.nomeColaborador,
          "Competência": a.competencia,
          "Salário Anterior": a.salarioAnterior !== null ? a.salarioAnterior.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "N/A",
          "Salário Novo": a.salarioNovo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          "Motivo": a.motivo,
          "Variação (%)": a.percentual,
        }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Alterações");      XLSX.writeFile(wb, `${fileName}.xlsx`);
    });
  };

  // 📤 Configurações de exportação para cada tipo de modal
  const exportConfigs: Record<string, ExportConfig> = {
    exames: {
      pdfHandler: exportExamesToPDF,
      excelHandler: exportExamesToExcel,
      reportName: "Histórico de Exames"
    },
    afastamentos: {
      pdfHandler: exportAfastamentosToPDF,
      excelHandler: exportAfastamentosToExcel,
      reportName: "Histórico de Afastamentos"
    },
    contratos: {
      pdfHandler: exportContratosToPDF,
      excelHandler: exportContratosToExcel,
      reportName: "Detalhes de Contratos"
    },
    ferias: {
      pdfHandler: exportFeriasToPDF,
      excelHandler: exportFeriasToExcel,
      reportName: "Detalhes de Férias"
    },
    alteracoes: {
      pdfHandler: exportAlteracoesToPDF,
      excelHandler: exportAlteracoesToExcel,
      reportName: "Detalhes de Alterações Salariais"
    }
  };

  return (
    <div className="bg-[#f7f7f8] flex flex-col flex-1 h-full min-h-0">
      {/* Header */}
      <div className="relative z-10 flex flex-row items-center justify-start gap-8 p-4 border-b border-black/10 bg-gray-100">
        <h1 className={`text-[32px] leading-8 font-700 text-black ${cairo.className}`}>
          Dashboard de Ficha Pessoal
        </h1>
        <SecaoFiltros
          selectedEmpresa={selectedEmpresa}
          onChangeEmpresa={setSelectedEmpresa}
          selectedColaborador={selectedColaborador}
          onChangeColaborador={setSelectedColaborador}
          empresaOptionsList={empresaOptions}
          empresaOptionsData={empresaOptionsData}
          areDatesSelected={!!(startDate && endDate)}
          colaboradorOptionsList={colaboradorOptions}
          isEmpresaSelected={!!selectedEmpresa}
        />
        <Calendar
          initialStartDate={startDate}
          initialEndDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
      </div>

      {/* Contéudo rolável */}
      <div className="flex-1 p-4 overflow-y-auto min-h-0">
         {/* KPIs: animação de slide down/up */}
         {/* This div with `transform` creates a stacking context. Its children (tooltips z-50) will be stacked relative to it. */}
         {/* This container itself needs to be effectively above the header's z-[40]. */}
         <div className={`transition-all duration-200 ease-in-out transform origin-top
             ${selectedColaborador
               ? 'max-h-[800px] opacity-100 translate-y-0'
               : 'max-h-0 opacity-0 -translate-y-4'}`}>
          <KpiCardsGrid cardsData={kpiCardData} />
        </div>

        {/* Evolução & Valor por Grupo */}
        {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
          <div className="w-full h-full flex flex-col shadow-md overflow-auto min-h-0 rounded-lg">
            <EvolucaoCard
              kpiSelecionado={evolucaoCardTitle}
              processedEvolucaoChartData={processedEvolucaoChartDataFicha}
              sectionIcons={sectionIconsFicha.filter(icon => icon.alt === "Maximize")}
              cairoClassName={cairo.className}
              onMaximize={() =>
                setModalContent(
                  <div className="flex flex-col w-[90vw] h-[80vh]">
                    <h2 className={`text-2xl font-bold mb-2 ${cairo.className}`}>
                      Evolução de Custo Total
                    </h2>
                    <p className={`text-base text-gray-500 mb-4 ${cairo.className}`}>
                      Variação mensal de custo total no período selecionado.
                    </p>
                    <div className="flex-1">
                      <EvolucaoChart
                        data={processedEvolucaoChartDataFicha}
                        kpiName={evolucaoCardTitle}
                      />
                    </div>
                  </div>
                )
              }
            />
          </div>
          <div className="w-full h-full flex flex-col shadow-md overflow-auto min-h-0 rounded-lg">
            <ValorPorGrupoCard
              valorPorGrupoData={valorPorGrupoDataFicha}
              sectionIcons={sectionIconsFicha.filter(icon => icon.alt === "Maximize")}
              cairoClassName={cairo.className}
              onMaximize={() =>
                setModalContent(
                  <div className="flex flex-col w-[90vw] h-[80vh]">
                    <h2 className={`text-2xl font-bold mb-2 ${cairo.className}`}>
                      Valor Por Grupo
                    </h2>
                    <p className={`text-base text-gray-500 mb-4 ${cairo.className}`}>
                      Distribuição de valores por grupo no período.
                    </p>
                    <div className="flex-1 overflow-x-auto">
                      <div className="min-w-[1560px] h-full">
                        <ValorPorGrupoChart data={valorPorGrupoDataFicha} />
                      </div>
                    </div>
                  </div>
                )
              }
            />
          </div>
        </div> */}

        {/* Tabelas */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[450px]"> 
          <div className="lg:col-span-1 h-full shadow-md overflow-auto min-h-0 rounded-lg">            <AtestadosTable 
              atestadosData={examesData} 
              cairoClassName={cairo.className} 
              headerIcons={tableHeaderIcons.filter(icon => icon.alt === "Maximize")}
              title="Histórico de Exames"
              onMaximize={() => setModalAberto('exames')}
            />
          </div>

          <div className="lg:col-span-1 h-full shadow-md overflow-auto min-h-0 rounded-lg">
            <AfastamentosTable 
              afastamentosData={afastamentosData}
              cairoClassName={cairo.className} 
              headerIcons={tableHeaderIcons.filter(icon => icon.alt === "Maximize")}
              onMaximize={() => setModalAberto('afastamentos')}
            />
          </div>

          <div className="lg:col-span-1 h-full shadow-md overflow-auto min-h-0 rounded-lg">
            <ContratosTable
              contratosData={contratosData}
              cairoClassName={cairo.className}
              headerIcons={tableHeaderIcons.filter(icon => icon.alt === "Maximize")}
              onMaximize={() => setModalAberto('contratos')}
            />
          </div>
        </div>

        {/* Férias & Alterações */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 h-[450px]">
          <div className="h-full shadow-md overflow-auto min-h-0 rounded-lg">
            <FeriasDetalheCard
              feriasData={feriasData}
              cairoClassName={cairo.className}
              headerIcons={tableHeaderIcons.filter(icon => icon.alt === "Maximize")}
              title="Detalhes de Férias"              onMaximize={() => setModalAberto('ferias')}
            />
          </div>
          <div className="h-full shadow-md overflow-auto min-h-0 rounded-lg">
            <AlteracoesSalariaisDetalheCard
              alteracoesData={alteracoesData}
              cairoClassName={cairo.className}
              headerIcons={tableHeaderIcons.filter(icon => icon.alt === "Maximize")}
              title="Detalhes de Alterações Salariais"              onMaximize={() => setModalAberto('alteracoes')}
            />
          </div>
        </div>
        <p className="mt-4"></p>
      </div>      {/* 🔄 Sistema de Modais Unificado */}
      {modalAberto && (
        <DetalhesModal
          isOpen={modalAberto !== null}
          onClose={handleCloseModal}
          title={getModalConfig(modalAberto).title}
          subtitle={getModalConfig(modalAberto).subtitle}
          data={getModalConfig(modalAberto).data}
          exportConfig={getModalConfig(modalAberto).exportConfig}
          cairoClassName={cairo.className}
        >
          {getModalConfig(modalAberto).component}
        </DetalhesModal>
      )}
    </div>
  );

  // 🎛️ Função helper para configurar cada modal
  function getModalConfig(tipo: ModalType) {
    switch (tipo) {
      case 'exames':
        return {
          title: "Histórico de Exames Detalhado",
          subtitle: "Visualização completa dos exames por funcionário",
          data: examesData,
          exportConfig: exportConfigs.exames,
          component: <AtestadosModalTable atestadosData={examesData} cairoClassName={cairo.className} />
        };
      case 'afastamentos':
        return {
          title: "Histórico de Afastamentos Detalhado",
          subtitle: "Visualização completa dos afastamentos por funcionário",
          data: afastamentosData,
          exportConfig: exportConfigs.afastamentos,
          component: <AfastamentosModalTable afastamentosData={afastamentosData} cairoClassName={cairo.className} />
        };
      case 'contratos':
        return {
          title: "Histórico de Contratos Detalhado",
          subtitle: "Visualização completa dos contratos por funcionário",
          data: contratosData,
          exportConfig: exportConfigs.contratos,
          component: <ContratosModalTable contratosData={contratosData} cairoClassName={cairo.className} />
        };
      case 'ferias':
        return {
          title: "Detalhes de Férias",
          subtitle: "Visualização completa das férias por funcionário",
          data: feriasData,
          exportConfig: exportConfigs.ferias,
          component: <FeriasModalTable feriasData={feriasData} cairoClassName={cairo.className} />
        };
      case 'alteracoes':
        return {
          title: "Detalhes de Alterações Salariais",
          subtitle: "Visualização completa das alterações salariais por funcionário",
          data: alteracoesData,
          exportConfig: exportConfigs.alteracoes,
          component: <AlteracoesSalariaisModalTable alteracoesData={alteracoesData} cairoClassName={cairo.className} />
        };
      default:
        return {
          title: "",
          subtitle: "",
          data: [],
          exportConfig: undefined,
          component: null
        };
    }
  }
}
