"use client";
import { useState, useEffect } from "react";
import Calendar from "@/components/calendar";
import Evolucao from "./components/cardRentabilidade";
import Reload from "@/components/reload";
interface Escritorio {
  codigo: number;
  escritorio: string;
  clientes: Record<string, number>;
  faturamento: Record<string, [number, string]>;
  tempo_ativo: Record<string, number>;
  importacoes: {
    lancamentos: Record<string, number>;
    porcentagem_lancamentos_manuais: Record<string, string>;
    total_geral: number;
  };
  vinculos_folha_ativos: Record<string, number>;
}


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
        ...meses.map(() => String(escritorioSelecionado.importacoes.total_geral || 0)),
        (() => {
          const totalGeral = Number(escritorioSelecionado.importacoes.total_geral || 0);
          const soma = totalGeral * meses.length;
          return soma.toLocaleString("pt-BR");
        })()
      ],
    },
    {
      metric: "Total de Notas Fiscais Movimentadas",
      values: [
        ...meses.map(() => String(escritorioSelecionado.importacoes.total_geral || 0)),
        (() => {
          const totalGeral = Number(escritorioSelecionado.importacoes.total_geral || 0);
          const soma = totalGeral * meses.length;
          return soma.toLocaleString("pt-BR");
        })()
      ],
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
      {/* Select para escolher o escritório */}
      <div className="mb-4 flex items-center gap-4">
        <div>
          <label htmlFor="select-escritorio" className="block mb-2 font-semibold text-gray-700">
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
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
          />
        </div>
      </div>

      {/* Tabela com dados do escritório selecionado */}
      <div className="overflow-x-auto p-4 bg-white shadow-lg rounded-lg  w-full shadow-gray-600 mb-4">
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
