"use client";
import { useState, useEffect } from "react";
import Calendar from "@/components/calendar";
import Evolucao from "./components/cardRentabilidade";
import Reload from "@/components/reload";
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";
import Image from "next/image";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';


interface Importacoes {
  lancamentos: Record<string, number>;
  porcentagem_lancamentos_manuais: Record<string, string>;
  entradas:Record<string, number>;
  saidas: Record<string, number>;
  servicos: Record<string, number>;
  total_geral: number;
}

interface Escritorio {
  codigo: number;
  escritorio: string;
  clientes: Record<string, number>;
  faturamento: Record<string, [number, string]>;
  tempo_ativo: Record<string, number>;
  importacoes: Importacoes;
  vinculos_folha_ativos: Record<string, number>;
}


interface ExportRow {
  metric: string;
  values: (string | number)[];
}

type ColStyle = {
  cellWidth: number;
  halign: 'left' | 'center' | 'right';
  fontStyle: 'bold' | 'normal';
};



export default function Escritorio() {
  const thStyle = "px-4 py-2 text-left text-sm font-semibold bg-gray-100 border-b border-gray-300 capitalize text-[#373A40]";
  const tdStyle = "whitespace-nowrap px-4 py-2 text-sm border-b border-gray-300 text-[#373A40]";
  const tdMetricStyle = `${tdStyle} font-semibold`;

  const [escritorios, setEscritorios] = useState<Escritorio[]>([]);
  const [escritorioSelecionado, setEscritorioSelecionado] = useState<Escritorio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>("2024-01-01");
  const [endDate, setEndDate] = useState<string | null>("2024-12-31");
  

  // Formata número em moeda BRL
  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  // Formata tempo ativo em segundos para hh:mm:ss
  function formatTempoAtivo(segundos: number) {
    if (!segundos || segundos <= 0) return "00:00:00";
    const h = Math.floor(segundos / 3600).toString().padStart(2, "0");
    const m = Math.floor((segundos % 3600) / 60).toString().padStart(2, "0");
    const s = Math.floor(segundos % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  const handleStartDateChange = (date: string | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: string | null) => {
    setEndDate(date);
  };

  useEffect(() => {
    async function fetchEscritorios() {
      try {
        setLoading(true);
        const response = await fetch("/api/analise-escritorio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ start_date: startDate, end_date: endDate }),
        });

        if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);

        const data = await response.json();
        console.log(data);
        setEscritorios(data);
        if (data.length > 0) setEscritorioSelecionado(data[0]);
      } catch (err: unknown) {
        if (err instanceof Error)
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }
    fetchEscritorios();
  }, [startDate, endDate]);

  if (loading) return <div className="p-4"><Reload/></div>;
  if (error) return <div className="p-4 text-red-600">Erro: {error}</div>;
  if (!escritorioSelecionado) return <div className="p-4">Nenhum escritório selecionado</div>;

  function exportToExcel(data: ExportRow[], fileName = "Escritorio.xlsx") {
      const header = [ ...Object.keys(escritorioSelecionado!.clientes), "Total"];
      const rows = data.map(row => [row.metric, ...row.values]);
      const sheetData = [header, ...rows];

      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });

      if (escritorioSelecionado?.escritorio) {
          const escritorioName = escritorioSelecionado?.escritorio.replace(/\s+/g, '_'); // Substitui espaços por underscores
          fileName = `${escritorioName}.xlsx`;
      }

      saveAs(dataBlob, fileName);
  }

  const exportToPDF = (data: ExportRow[], fileName: string) => {
    const doc = new jsPDF();
    
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    ;

    const pageWidth = doc.internal.pageSize.getWidth();

    const marginLR = 10;  
 
    const marginTop = 10;

    let currentY   = marginTop;


    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Dados do Escritorio",
      pageWidth / 2,
      currentY,
      { align: "center" }
    );
    currentY += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(
      `Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`,
      marginLR,
      currentY
    );

    // Preparar dados da tabela
    const tableData = data.map(row => [
      row.metric,
      ...row.values.map(value => {
        if (typeof value === 'string' && value.includes('R$')) {
          return value;
        } else if (typeof value === 'string' && value.includes('%')) {
          return value;
        } else {
          return String(value);
        }
      })
    ]);

    // Configurar cabeçalhos
    const tableHeaders = [
      ...Object.keys(escritorioSelecionado!.clientes),
      'Total'
    ];

    const usablePageWidth = pageWidth - marginLR * 2;
    const weights = tableHeaders.map((_, idx) => idx === 0 ? 2 : 1);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const unitWidth = usablePageWidth / totalWeight;
    const dynamicColumnStyles: Record<number, ColStyle> = {};
    tableHeaders.forEach((_, idx) => {
      dynamicColumnStyles[idx] = {
        cellWidth: unitWidth * weights[idx],
        halign:    idx === 0 ? 'left' : 'center',
        fontStyle: idx === 0 ? 'bold' : 'normal'
      };
    });
    // Configurar e gerar a tabela
    autoTable(doc, {
      startY: currentY + 4 ,
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
      columnStyles: dynamicColumnStyles,
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: marginLR, right: marginLR },
      didDrawPage: function(data) {
        // Adicionar rodapé em cada página
        doc.setFontSize(8);
        doc.text(
          'Página ' + data.pageNumber,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      }
    });

    // Salvar o PDF
    doc.save(`${fileName}.pdf`);
  };

  const meses = Object.keys(escritorioSelecionado.clientes);

  // Prepara os dados para o gráfico de evolução (Rentabilidade)
  const evolucaoData = meses.map(mes => {
    const horas = (escritorioSelecionado?.tempo_ativo?.[mes] ?? 0) / 3600;
    const custoHora = parseFloat(process.env.NEXT_PUBLIC_CUSTO_HORA || "0");
    const custo = custoHora * horas;

    const faturamentoMes = escritorioSelecionado?.faturamento?.[mes];
    const valorFaturado = Array.isArray(faturamentoMes) ? faturamentoMes[0] : 0;

    const rentabilidade = valorFaturado - custo;

    return {
      name: mes,
      value: rentabilidade
    };
  });

  const data = [
    {
      metric: "Quantidade de Clientes",
      values: [
          ...meses.map(mes => String(escritorioSelecionado.clientes[mes] || 0)),
          // Soma total como último valor:
          (() => {return "-"
          })()
        ],
    },
    {
      metric: "Faturamento do Escritório",
      values: [
        ...meses.map(mes => {
          const val = escritorioSelecionado.faturamento[mes];
          if (!val || !Array.isArray(val) || val.length === 0 as number) return "R$ 0";
          return formatCurrency(val[0]);
        }),
        // Total final
        (() => {
          const soma = meses.reduce((sum, mes) => {
            const val = escritorioSelecionado.faturamento[mes];
            const num = (Array.isArray(val) && val[0]) ? Number(val[0]) : 0;
            return sum + (isNaN(num) ? 0 : num);
          }, 0);
          return formatCurrency(soma);
        })()
      ],
    },
    {
      metric: "Variação de Faturamento",
      values: [
        ...meses.map(mes => {
          const val = escritorioSelecionado.faturamento[mes];
          if (!val || !Array.isArray(val) || val.length < 2) return "0%";
          return val[1].replace(".", ",");
        }),
        (() => {
          const soma = meses.reduce((sum, mes) => {
            const val = escritorioSelecionado.faturamento[mes];
            if (!val || !Array.isArray(val) || val.length < 2) return sum;
            const num = parseFloat(val[1].replace(",", ".").replace("%", ""));
            return isNaN(num) ? sum : sum + num;
          }, 0);
          return soma.toFixed(2).replace(".", ",") + "%";
        })()
      ],
    },
    {
      metric: "Tempo Ativo no Sistema",
      values: [
        ...meses.map(mes => {
          const val = escritorioSelecionado.tempo_ativo[mes];
          return val ? formatTempoAtivo(val) : "00:00:00";
        }),
        (() => {
          const totalSegundos = meses.reduce((sum, mes) => {
            const val = escritorioSelecionado.tempo_ativo[mes];
            return sum + (val && !isNaN(val) ? val : 0);
          }, 0);
          return formatTempoAtivo(totalSegundos);
        })()
      ],
    },
    {
      metric: "Lançamentos",
      values: [
        ...meses.map(mes => String(escritorioSelecionado.importacoes.lancamentos[mes] || 0)),
        (() => {
          const soma = meses.reduce((sum, mes) => {
            const val = escritorioSelecionado.importacoes.lancamentos[mes];
            const num = Number(val);
            return sum + (isNaN(num) ? 0 : num);
          }, 0);
          return soma.toLocaleString("pt-BR");
        })()
      ],
    },
    {
      metric: "% de Lançamentos Manuais",
      values: [
        ...meses.map(mes => escritorioSelecionado.importacoes.porcentagem_lancamentos_manuais[mes] || "0.0%"),
        (() => {
          const soma = meses.reduce((sum, mes) => {
            const val = escritorioSelecionado.importacoes.porcentagem_lancamentos_manuais[mes];
            if (!val) return sum;
            const num = parseFloat(val.replace(",", ".").replace("%", ""));
            return isNaN(num) ? sum : sum + num;
          }, 0);
          return soma.toFixed(2).replace(".", ",") + "%";
        })()
      ],
    },
    {
      metric: "Vínculos de Folhas Ativos",
      values: [
        ...meses.map(mes => String(escritorioSelecionado.vinculos_folha_ativos[mes] || 0)),
        (() => {
          const soma = meses.reduce((sum, mes) => {
            const val = escritorioSelecionado.vinculos_folha_ativos[mes];
            const num = Number(val);
            return sum + (isNaN(num) ? 0 : num);
          }, 0);
          return soma.toLocaleString("pt-BR");
        })()
      ],
    },
    {
      metric: "Notas Fiscais Emitidas",
      values: [
        ...meses.map((mes) => {
          const servicos = escritorioSelecionado.importacoes.servicos;
          const saidas = escritorioSelecionado.importacoes.saidas;

          const servicosValor = servicos[mes] || 0; 
          const saidasValor = saidas[mes] || 0; 

          return String(servicosValor + saidasValor || 0); 
        }),
        (() => {
          const servicos = escritorioSelecionado.importacoes.servicos;
          const saidas = escritorioSelecionado.importacoes.saidas;

          let soma = 0;
          meses.forEach((mes) => {
            const servicosValor = servicos[mes] || 0; 
            const saidasValor = saidas[mes] || 0; 
            soma += servicosValor + saidasValor;
          });

          return soma.toLocaleString("pt-BR");
        })()
      ]
    },
    {
      metric: "Total de Notas Fiscais Movimentadas",
      values: [
        ...meses.map((mes) => {
          const servicos = escritorioSelecionado.importacoes.servicos;
          const saidas = escritorioSelecionado.importacoes.saidas;
          const entradas = escritorioSelecionado.importacoes.entradas

          const servicosValor = servicos[mes] || 0; 
          const saidasValor = saidas[mes] || 0; 
          const entradasValor = entradas[mes] || 0;

          return String(servicosValor + saidasValor + entradasValor || 0); 
        }),
        (() => {
          const servicos = escritorioSelecionado.importacoes.servicos;
          const saidas = escritorioSelecionado.importacoes.saidas;
          const entradas = escritorioSelecionado.importacoes.entradas

          let soma = 0;
          meses.forEach((mes) => {
            const servicosValor = servicos[mes] || 0; 
            const saidasValor = saidas[mes] || 0; 
            const entradasValor = entradas[mes] || 0;
            soma += servicosValor + saidasValor + entradasValor;
          });

          return soma.toLocaleString("pt-BR");
        })()
      ]
    },
    {
      metric: "Custo Operacional",
      values: [
        ...meses.map(mes => {
          const horas = (escritorioSelecionado?.tempo_ativo?.[mes] ?? 0) / 3600;
          const custo = parseFloat(process.env.NEXT_PUBLIC_CUSTO_HORA || "0") * horas;
          return formatCurrency(custo);
        }),
        (() => {
          const totalCusto = meses.reduce((sum, mes) => {
            const horas = (escritorioSelecionado?.tempo_ativo?.[mes] ?? 0) / 3600;
            const custo = parseFloat(process.env.NEXT_PUBLIC_CUSTO_HORA || "0") * horas;
            return sum + custo;
          }, 0);
          return formatCurrency(totalCusto);
        })()
      ],
    },
    {
      metric: "Rentabilidade Operacional",
      values: [
        ...meses.map(mes => {
          const horas = (escritorioSelecionado?.tempo_ativo?.[mes] ?? 0) / 3600;
          const custoHora = parseFloat(process.env.NEXT_PUBLIC_CUSTO_HORA || "0");
          const custo = custoHora * horas;

          const faturamentoMes = escritorioSelecionado?.faturamento?.[mes];
          const valorFaturado = Array.isArray(faturamentoMes) ? faturamentoMes[0]: 0;

          const rentabilidade = valorFaturado - custo;

          return formatCurrency(rentabilidade);
        }),
        (() => {
          const totalRentabilidade = meses.reduce((sum, mes) => {
            const horas = (escritorioSelecionado?.tempo_ativo?.[mes] ?? 0) / 3600;
            const custoHora = parseFloat(process.env.NEXT_PUBLIC_CUSTO_HORA || "0");
            const custo = custoHora * horas;

            const faturamentoMes = escritorioSelecionado?.faturamento?.[mes];
            const valorFaturado = Array.isArray(faturamentoMes) ? faturamentoMes[0] : 0;

            const rentabilidade = valorFaturado - custo;
            return sum + rentabilidade;
          }, 0);
          return formatCurrency(totalRentabilidade);
        })()
      ],
    }
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="mb-4 flex items-center gap-4">
        <div>
          <label htmlFor="select-escritorio" className="block mb-1 font-semibold text-gray-700">
            Escolha o Escritório:
          </label>
          <select
            id="select-escritorio"
            value={escritorioSelecionado?.codigo ?? ""}
            onChange={(e) => {
              const codigo = Number(e.target.value);
              const esc = escritorios.find((item) => item.codigo === codigo) ?? null;
              setEscritorioSelecionado(esc);
            }}
            className="bg-white p-2 border border-gray-300 rounded-md"
          >
            {escritorios.map((esc) => (
              <option key={esc.codigo} value={esc.codigo}>
                {esc.escritorio}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-6">
          <Calendar
          initialStartDate={startDate}
          initialEndDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
        </div>
        <button
          onClick={() => exportToExcel(data)}
          title="Exportar para Excel"
          className="p-1 rounded border border-gray-300 hover:bg-green-100 mt-auto  justify-center ml-auto self-center bg-white cursor-pointer"
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

        <button
          onClick={() => exportToPDF(data, "Relatorio_Escritorio")}
          title="Exportar para Excel"
          className="p-1 rounded border border-gray-300 hover:bg-green-100 mt-auto bg-white cursor-pointer"
          style={{ width: 36, height: 36 }}
        >
        <Image
          src="/assets/icons/pdf.svg"
          alt="Ícone pdf"
          width={24}
          height={24}
          draggable={false}
        />
        </button>
      </div>
      <div className="overflow-x-auto p-4 bg-white shadow-md rounded-lg  w-full shadow-gray-600 mb-4">
        <table className="w-full">
          <thead>
            <tr>
              <th className={`${thStyle} w-1/4`}></th>
              {meses.map((mes) => (
                <th key={mes} className={thStyle}>
                  {mes}
                </th>
              ))}
              <th className={thStyle}>
                  Total
                </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row.metric} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className={tdMetricStyle}>{row.metric}</td>
                {row.values.map((value: string, idx: number) => (
                  <td key={`${row.metric}-${idx}`} className={tdStyle}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-4">
        <Evolucao data={evolucaoData} />
      </div>
    </div>
  );
}
