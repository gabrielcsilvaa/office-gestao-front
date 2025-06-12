"use client";
import { Cairo } from "next/font/google";
import { useState, useEffect } from "react";
import { EmpresaAnalise } from "./interface/interfaces";
import { ListaEmpresas } from "./components/tableCreator";
import Calendar from "@/components/calendar";
import { formatDate } from "./services/formatDate";
import Pagination from "./components/pagination";
import Reload from "@/components/reload";
import { formatarCpfCnpj, formatarData, gerarMesesEntreDatas } from "@/utils/formatadores";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import Image from "next/image";
import { maxValueContrato } from "./services/maxValorContrato";

const cairo = Cairo({
  weight: ["500", "600", "700"], // Você pode especificar os pesos que deseja (normal e negrito)
  subsets: ["latin"],
});

export default function Clientes() {
  //Dados
  const [value, setValue] = useState<string>("");
  const [clientData, setClientData] = useState<EmpresaAnalise[] | null>(null);
  const [filteredData, setFilteredData] = useState<EmpresaAnalise[] | null>(
    null
  );
  const [custoPorHora, setCustoPorHora] = useState("");
  //Loading e Erro
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  //Estados de data
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [meses, setMeses] = useState<string[] | null>(null);
  //Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //Aguardando colocar data
  const [awaitDateSelection, setAwaitDateSelection] = useState(true); // Tela de seleção de data

  const handleStartDateChange = (date: string | null) => {
    setStartDate(date);
    setAwaitDateSelection(false); // Remove a tela de seleção de data
    setCurrentPage(1);
  };

  const handleEndDateChange = (date: string | null) => {
    setEndDate(date);
    setAwaitDateSelection(false); // Remove a tela de seleção de data
    setCurrentPage(1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setCurrentPage(1);
  };

  const handleCustoHora = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value;
    // Substitui vírgula por ponto e converte para número
    valor = valor.replace(",", ".");
    // Atualiza o estado (se for NaN, define como 0)
    setCustoPorHora(valor);
  };

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const mesesgerados = gerarMesesEntreDatas(startDate, endDate);
        setMeses(mesesgerados);
        // Formata as datas antes de enviar
        const formattedStartDate = formatDate(
          startDate ? new Date(startDate) : null
        );
        const formattedEndDate = formatDate(endDate ? new Date(endDate) : null);

        const body = {
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        };

        const response = await fetch("/api/analise-clientes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.statusText}`);
        }

        const data = await response.json();
        // Ordenar as empresas por nome alfabético e remover espaços à esquerda
        const sortedData = data.sort(
          (a: EmpresaAnalise, b: EmpresaAnalise) =>
            a.nome_empresa.trimStart().localeCompare(b.nome_empresa.trimStart()) // Aplicar trimStart() para remover espaços à esquerda antes da comparação
        );

        setClientData(sortedData); // Armazena os dados ordenados
        setFilteredData(sortedData); // Inicialmente, os dados filtrados são os mesmos que os dados completos
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido");
        }
      } finally {
        setLoading(false);
      }
    };

    // Só faz a requisição quando as datas estiverem definidas
    if (startDate && endDate) {
      fetchClientData();
    }
  }, [startDate, endDate]); // Executa quando startDate ou endDate mudam

  // Filtro dinâmico
  useEffect(() => {
    if (clientData) {
      const lowercasedValue = value.toLowerCase(); // Converte o valor digitado para minúsculas
      const filtered = clientData.filter(
        (empresa) =>
          empresa.nome_empresa.toLowerCase().includes(lowercasedValue) // Filtra pelo nome da empresa
      );
      setFilteredData(filtered); // Atualiza os dados filtrados
    }
  }, [value, clientData]); // Executa o filtro sempre que o valor de pesquisa ou os dados mudarem

  //Paginação

  // Função para calcular as empresas a serem exibidas na página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Verifica se filteredData existe e se não é null
  const currentItems = filteredData
    ? filteredData.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = filteredData
    ? Math.ceil(filteredData.length / itemsPerPage)
    : 0;

  const exportToPDF = (
    data: EmpresaAnalise[] | null,
    fileName: string,
    meses: string[] | null
  ) => {
    if (!data || !meses) return;

    // Configurações iniciais do PDF
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;

    // Função auxiliar para formatar valores
    const formatMoney = (value: number) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    };

    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Processar cada empresa
    data.forEach((empresa, index) => {
      if (index > 0) {
        doc.addPage("landscape"); // Adiciona nova página para cada empresa após a primeira
      }

      // Cabeçalho
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Relatório de Análise Empresarial", pageWidth / 2, 15, {
        align: "center",
      });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Empresa: ${empresa.nome_empresa}`, margin, 25);
      doc.text(`CNPJ: ${formatarCpfCnpj(empresa.cnpj)}`, margin, 30);
      doc.text(`Data Cadastro: ${formatarData(empresa.data_cadastro)}`, margin, 35);
      doc.text(`Início Atividades: ${formatarData(empresa.data_inicio_atv)}`, margin, 40);
      doc.text(
        `Responsável: ${empresa.responsavel || "SEM RESPONSÁVEL"}`,
        margin,
        45
      );

      // Dados calculados (similares aos que você já tem)
      const faturamentoTotal = meses.reduce(
        (sum, mes) => sum + (empresa.faturamento?.[mes]?.[0] || 0),
        0
      );
      const atividadesTotal = meses.reduce(
        (sum, mes) => sum + (empresa.atividades?.[mes] || 0),
        0
      );
      const lancamentosTotal = empresa.importacoes?.total_lancamentos || 0;
      const lancamentosManuaisTotal =
        empresa.importacoes?.total_lancamentos_manuais || 0;
      const empregadosTotal = meses.reduce(
        (sum, mes) => sum + (empresa.empregados?.[mes] || 0),
        0
      );
      const nfeEmitidasTotal = meses.reduce((sum, mes) => {
        const servicos = empresa.importacoes?.servicos?.[mes] || 0;
        const saidas = empresa.importacoes?.saidas?.[mes] || 0;
        return sum + servicos + saidas;
      }, 0);
      const nfeMovimentadasTotal = meses.reduce((sum, mes) => {
        const entradas = empresa.importacoes?.entradas?.[mes] || 0;
        const saidas = empresa.importacoes?.saidas?.[mes] || 0;
        const servicos = empresa.importacoes?.servicos?.[mes] || 0;
        return sum + entradas + saidas + servicos;
      }, 0);

      // Cálculo de custo e rentabilidade
      const custoHora = parseFloat(
        custoPorHora || process.env.NEXT_PUBLIC_CUSTO_HORA || "0"
      );
      const valorContrato = maxValueContrato(empresa.escritorios || []);
      let custoTotal = 0;
      let rentabilidadeTotal = 0;

      // Preparar dados para a tabela
      const tableData = [
        [
          "Faturamento da Empresa",
          ...meses.map((mes) =>
            formatMoney(empresa.faturamento?.[mes]?.[0] || 0)
          ),
          formatMoney(faturamentoTotal),
        ],
        [
          "Variação de Faturamento",
          ...meses.map((mes) => empresa.faturamento?.[mes]?.[1] || "0.00%"),
          "0.00%",
        ],
        [
          "Tempo Gasto no Sistema",
          ...meses.map((mes) => formatTime(empresa.atividades?.[mes] || 0)),
          formatTime(atividadesTotal),
        ],
        [
          "Lançamentos",
          ...meses.map((mes) => empresa.importacoes?.lancamentos?.[mes] || 0),
          lancamentosTotal,
        ],
        [
          "% Lançamentos Manuais",
          ...meses.map((mes) => {
            const manual = empresa.importacoes?.lancamentos_manuais?.[mes] || 0;
            const normal = empresa.importacoes?.lancamentos?.[mes] || 0;
            return normal > 0
              ? ((manual / normal) * 100).toFixed(2) + "%"
              : "0.00%";
          }),
          lancamentosTotal > 0
            ? ((lancamentosManuaisTotal / lancamentosTotal) * 100).toFixed(2) +
              "%"
            : "0.00%",
        ],
        [
          "Vínculos de Folha Ativos",
          ...meses.map((mes) => empresa.empregados?.[mes] || 0),
          empregadosTotal,
        ],
        [
          "Total NF-e Emitidas",
          ...meses.map((mes) => {
            const servicos = empresa.importacoes?.servicos?.[mes] || 0;
            const saidas = empresa.importacoes?.saidas?.[mes] || 0;
            return servicos + saidas;
          }),
          nfeEmitidasTotal,
        ],
        [
          "Total NF-e Movimentadas",
          ...meses.map((mes) => {
            const entradas = empresa.importacoes?.entradas?.[mes] || 0;
            const saidas = empresa.importacoes?.saidas?.[mes] || 0;
            const servicos = empresa.importacoes?.servicos?.[mes] || 0;
            return entradas + saidas + servicos;
          }),
          nfeMovimentadasTotal,
        ],
        [
          "Faturamento do Escritório",
          ...meses.map(() => formatMoney(valorContrato)),
          formatMoney(valorContrato * meses.length),
        ],
        [
          "Custo Operacional",
          ...meses.map((mes) => {
            const segundos = empresa.atividades?.[mes] || 0;
            const horas = segundos / 3600;
            const custo = horas * custoHora;
            custoTotal += custo;
            return formatMoney(custo);
          }),
          formatMoney(custoTotal),
        ],
        [
          "Rentabilidade Operacional",
          ...meses.map((mes) => {
            const segundos = empresa.atividades?.[mes] || 0;
            const horas = segundos / 3600;
            const custo = horas * custoHora;
            const rentabilidade = valorContrato - custo;
            rentabilidadeTotal += rentabilidade;
            return formatMoney(rentabilidade);
          }),
          formatMoney(rentabilidadeTotal),
        ],
      ];

      // Configurar cabeçalhos da tabela
      const headers = ["Métrica", ...meses, "Total"];

      // Ajustes na tabela
      autoTable(doc, {
        startY: 55,
        head: [headers],
        body: tableData,
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 7,
          cellPadding: 2,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
          textColor: [50, 50, 50],
          overflow: "linebreak",
          halign: "center", // Centraliza os dados nas células
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: "bold",
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 40, fontStyle: "bold" }, // Ajustando a largura da primeira coluna
          ...meses.reduce(
            (acc, _, i) => {
              acc[i + 1] = { cellWidth: "auto", halign: "right" }; // Ajustando a largura das colunas de mês
              return acc;
            },
            {} as Record<number, object>
          ),
          [meses.length + 1]: { cellWidth: "auto", halign: "right" },
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { left: margin, right: margin },
        didDrawPage: function (data) {
          doc.setFontSize(8);
          doc.text(
            `Página ${data.pageNumber}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          );
        },
      });
    });

    // Salvar o PDF
    doc.save(`${fileName}.pdf`);
  };

  const exportToExcel = (
    data: EmpresaAnalise[] | null,
    fileName: string,
    meses: string[] | null
  ) => {
    if (!data || !meses) return;

    // Funções auxiliares de formatação
    const formatMoney = (value: number) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    };

    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Criar os dados para a planilha
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: any[][] = [];

    // Adicionar cabeçalho
    const headerRow = [
      "Código",
      "Nome",
      "CNPJ",
      "Situação",
      "Responsável",
      "Data Cadastro",
      "Data Início",
      "Email",
      "Métrica",
      ...meses,
      "Total",
    ];
    rows.push(headerRow);

    // Processar cada empresa
    data.forEach((empresa) => {
      // Dados básicos da empresa
      const basicInfo = [
        empresa.codigo_empresa,
        empresa.nome_empresa,
        formatarCpfCnpj(empresa.cnpj),
        empresa.situacao,
        empresa.responsavel || "SEM RESPONSÁVEL",
        formatarData(empresa.data_cadastro),
        formatarData(empresa.data_inicio_atv),
        empresa.email || "",
      ];

      // Calcular totais
      const faturamentoTotal = meses.reduce(
        (sum, mes) => sum + (empresa.faturamento?.[mes]?.[0] || 0),
        0
      );
      const atividadesTotal = meses.reduce(
        (sum, mes) => sum + (empresa.atividades?.[mes] || 0),
        0
      );
      const lancamentosTotal = empresa.importacoes?.total_lancamentos || 0;
      const lancamentosManuaisTotal =
        empresa.importacoes?.total_lancamentos_manuais || 0;
      const empregadosTotal = meses.reduce(
        (sum, mes) => sum + (empresa.empregados?.[mes] || 0),
        0
      );
      const nfeEmitidasTotal = meses.reduce((sum, mes) => {
        const servicos = empresa.importacoes?.servicos?.[mes] || 0;
        const saidas = empresa.importacoes?.saidas?.[mes] || 0;
        return sum + servicos + saidas;
      }, 0);
      const nfeMovimentadasTotal = meses.reduce((sum, mes) => {
        const entradas = empresa.importacoes?.entradas?.[mes] || 0;
        const saidas = empresa.importacoes?.saidas?.[mes] || 0;
        const servicos = empresa.importacoes?.servicos?.[mes] || 0;
        return sum + entradas + saidas + servicos;
      }, 0);

      // Cálculo de custo e rentabilidade
      const custoHora = parseFloat(
        custoPorHora || process.env.NEXT_PUBLIC_CUSTO_HORA || "0"
      );
      const valorContrato = maxValueContrato(empresa.escritorios || []);
      let custoTotal = 0;
      let rentabilidadeTotal = 0;

      // Métricas para cada empresa (11 linhas por empresa)
      const metricas = [
        {
          nome: "Faturamento da Empresa",
          valores: meses.map((mes) =>
            formatMoney(empresa.faturamento?.[mes]?.[0] || 0)
          ),
          total: formatMoney(faturamentoTotal),
        },
        {
          nome: "Variação de Faturamento",
          valores: meses.map(
            (mes) => empresa.faturamento?.[mes]?.[1] || "0.00%"
          ),
          total: "0.00%",
        },
        {
          nome: "Tempo Gasto no Sistema",
          valores: meses.map((mes) =>
            formatTime(empresa.atividades?.[mes] || 0)
          ),
          total: formatTime(atividadesTotal),
        },
        {
          nome: "Lançamentos",
          valores: meses.map(
            (mes) => empresa.importacoes?.lancamentos?.[mes] || 0
          ),
          total: lancamentosTotal,
        },
        {
          nome: "% Lançamentos Manuais",
          valores: meses.map((mes) => {
            const manual = empresa.importacoes?.lancamentos_manuais?.[mes] || 0;
            const normal = empresa.importacoes?.lancamentos?.[mes] || 0;
            return normal > 0
              ? ((manual / normal) * 100).toFixed(2) + "%"
              : "0.00%";
          }),
          total:
            lancamentosTotal > 0
              ? ((lancamentosManuaisTotal / lancamentosTotal) * 100).toFixed(
                  2
                ) + "%"
              : "0.00%",
        },
        {
          nome: "Vínculos de Folha Ativos",
          valores: meses.map((mes) => empresa.empregados?.[mes] || 0),
          total: empregadosTotal,
        },
        {
          nome: "Total NF-e Emitidas",
          valores: meses.map((mes) => {
            const servicos = empresa.importacoes?.servicos?.[mes] || 0;
            const saidas = empresa.importacoes?.saidas?.[mes] || 0;
            return servicos + saidas;
          }),
          total: nfeEmitidasTotal,
        },
        {
          nome: "Total NF-e Movimentadas",
          valores: meses.map((mes) => {
            const entradas = empresa.importacoes?.entradas?.[mes] || 0;
            const saidas = empresa.importacoes?.saidas?.[mes] || 0;
            const servicos = empresa.importacoes?.servicos?.[mes] || 0;
            return entradas + saidas + servicos;
          }),
          total: nfeMovimentadasTotal,
        },
        {
          nome: "Faturamento do Escritório",
          valores: meses.map(() => formatMoney(valorContrato)),
          total: formatMoney(valorContrato * meses.length),
        },
        {
          nome: "Custo Operacional",
          valores: meses.map((mes) => {
            const segundos = empresa.atividades?.[mes] || 0;
            const horas = segundos / 3600;
            const custo = horas * custoHora;
            custoTotal += custo;
            return formatMoney(custo);
          }),
          total: formatMoney(custoTotal),
        },
        {
          nome: "Rentabilidade Operacional",
          valores: meses.map((mes) => {
            const segundos = empresa.atividades?.[mes] || 0;
            const horas = segundos / 3600;
            const custo = horas * custoHora;
            const rentabilidade = valorContrato - custo;
            rentabilidadeTotal += rentabilidade;
            return formatMoney(rentabilidade);
          }),
          total: formatMoney(rentabilidadeTotal),
        },
      ];

      // Adicionar linhas para cada métrica
      metricas.forEach((metrica) => {
        const row = [
          ...basicInfo, // Dados básicos repetidos
          metrica.nome, // Nome da métrica
          ...metrica.valores, // Valores mensais
          metrica.total, // Valor total
        ];
        rows.push(row);
      });

      // Adicionar linha em branco entre empresas
      rows.push(Array(headerRow.length).fill(""));
    });

    // Criar a planilha Excel
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Análise Empresas");

    // Configurar largura das colunas
    const colWidths = [
      { wch: 10 }, // Código
      { wch: 30 }, // Nome
      { wch: 20 }, // CNPJ
      { wch: 10 }, // Situação
      { wch: 25 }, // Responsável
      { wch: 15 }, // Data Cadastro
      { wch: 15 }, // Data Início
      { wch: 25 }, // Email
      { wch: 30 }, // Métrica
      ...meses.map(() => ({ wch: 15 })), // Colunas mensais
      { wch: 15 }, // Total
    ];
    ws["!cols"] = colWidths;

    // Estilização básica (cabeçalhos em negrito)
    const headerStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "295f8d" } },
    };
    for (let col = 0; col < headerRow.length; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = headerStyle;
    }

    // Exportar o arquivo
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };
  return (
    <div className="max-h-screen bg-gray-100">
      <div className="h-[70px] flex flex-row items-end pl-4 gap-8 border-b border-black/10 bg-gray-100">
        <div className="flex items-center gap-4 w-full">
          <h1
            className={`text-[32px] whitespace-nowrap ${cairo.className} font-700 text-black text-left`}
          >
            Custo Operacional
          </h1>

          <div className="flex items-center gap-2 ml-4 mr-8 w-full">
            <input
              type="text"
              id="inputText"
              value={value}
              onChange={handleChange}
              className={`${cairo.className} bg-white border shadow-lg border-gray-400 w-[16vw] h-[38px] p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400`}
              placeholder="Buscar Empresa"
            />
            {/* SELEÇÃO DE DATAS  */}
            <Calendar
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
            />
            <div className="flex ml-5 gap-2 items-center">
              <p
                className={`text-[22px] whitespace-nowrap ${cairo.className} font-500 text-black text-left`}
              >
                Valor Hora
              </p>
              <input
                type="text"
                id="inputText"
                value={custoPorHora}
                onChange={handleCustoHora}
                className={`${cairo.className} bg-white border shadow-lg border-gray-400 w-[6vw] h-[38px] p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400`}
                placeholder="R$ 20,50"
              />
            </div>
            <div className="flex gap-4 ml-auto">
              <button
                onClick={() =>
                  exportToPDF(filteredData, "Empresas_Regime_Tributario", meses)
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
                  exportToExcel(
                    filteredData,
                    "Empresas_Regime_Tributario",
                    meses
                  )
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
        </div>
      </div>

      {/* Conteúdo da Tabela e Loading */}
      <div className="h-[calc(95vh-85px)] w-full overflow-y-auto p-4 rounded-lg">
        <div className="w-max min-w-full shadow-gray-300 shadow-md rounded-lg">
          <div className="overflow-x-auto p-4 bg-white shadow-md rounded-lg">
            {awaitDateSelection && (
              <div className="flex justify-center items-center h-[70vh] bg-gray-200">
                <div className={`${cairo.className} text-center p-4`}>
                  <p className="text-xl mb-4">
                    Selecione uma data para carregar os dados
                  </p>
                </div>
              </div>
            )}

            {loading ? (
              <Reload />
            ) : error ? (
              <div
                className={`${cairo.className} not-only-of-type:flex justify-center items-center h-[70vh] bg-gray-200`}
              >
                <div>Erro: Dados não foram encontrados</div>
              </div>
            ) : (
              currentItems && (
                <ListaEmpresas
                  empresas={currentItems}
                  start_date={startDate}
                  end_date={endDate}
                  custoPorHora={custoPorHora}
                />
              )
            )}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
