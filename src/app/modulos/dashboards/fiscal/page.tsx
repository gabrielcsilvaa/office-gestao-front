"use client";
import { Cairo } from "next/font/google";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Dropdown } from "./components/Dropdown";
import { useDropdown } from "./hooks/useDropdown";
import Calendar from "@/components/calendar";
import KpiCardsGrid from "./components/KpiCardsGrid";
import EvolucaoCard from "./components/EvolucaoCard";
import ProgressBarCard from "./components/ProgressBarCard";
import EmptyCard from "./components/EmptyCard";
import Loading from "@/app/loading";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export default function DashboardFiscal() {
  const { openDropdown, handleToggleDropdown } = useDropdown();

  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [kpiSelecionado, setKpiSelecionado] = useState("Total de Entradas");
  const [data, setData] = useState(null);
  const [fornecedorOptions, setFornecedorOptions] = useState<string[]>([]);
  const [clienteOptions, setClienteOptions] = useState<string[]>([]);
  const [opcoesMintas, setOpcoesMintas] = useState<Array<{value: string, type: 'Cliente' | 'Fornecedor'}>>([]);
  const [clienteFornecedorMixedOptions, setClienteFornecedorMixedOptions] = useState<Array<{label: string, value: string, type: 'cliente' | 'fornecedor'}>>([]);

  // Tipo para os dados de entrada
  type EntradaData = {
    fornecedor: number;
    nome_fornecedor: string;
    empresa: number;
    nome_empresa: string;
    cnpj: string;
    CEP: string | null;
    data: string;
    valor: string;
  };

  // Tipo para os dados de serviços
  type ServicoData = {
    cliente: number;
    nome_cliente: string;
    empresa: number;
    nome_empresa: string;
    cnpj: string;
    UF: string;
    data: string;
    valor: string;
    cancelada: string;
  };

  // Tipo para os dados de saídas
  type SaidaData = {
    cliente: number;
    nome_cliente: string;
    empresa: number;
    nome_empresa: string;
    cnpj: string;
    UF: string;
    data: string;
    valor: string;
    cancelada: string;
  };

  // Define dinamicamente o rótulo do dropdown principal conforme o KPI selecionado
  const getClienteFornecedorLabel = (kpi: string) => {
    // Fornecedor: dinheiro SAINDO da empresa (compras/entradas)
    if (["Total de Entradas", "Compras"].includes(kpi)) {
      return "Fornecedor";
    }
    // Cliente: dinheiro ENTRANDO na empresa (vendas/faturamento)
    if (["Faturamento Total", "Vendas"].includes(kpi)) {
      return "Cliente";
    }
    // Para Serviços e Devoluções, usar ambos os contextos
    if (["Serviços", "Devoluções"].includes(kpi)) {
      return "Cliente / Fornecedor";
    }
    return "Cliente";
  };

  // Para o título do card, versão plural
  const getClienteFornecedorLabelPlural = (kpi: string) => {
    // Fornecedor: dinheiro SAINDO da empresa (compras/entradas)
    if (["Total de Entradas", "Compras"].includes(kpi)) {
      return "Fornecedores";
    }
    // Cliente: dinheiro ENTRANDO na empresa (vendas/faturamento)
    if (["Faturamento Total", "Vendas"].includes(kpi)) {
      return "Clientes";
    }
    // Para Serviços e Devoluções, usar ambos os contextos
    if (["Serviços", "Devoluções"].includes(kpi)) {
      return "Clientes / Fornecedores";
    }
    return "Clientes";
  };
  
  // Retorna as opções do dropdown conforme o KPI selecionado
  const getDropdownOptions = (): string[] => {
    // Fornecedor: dinheiro SAINDO da empresa (compras/entradas)
    if (["Total de Entradas", "Compras"].includes(kpiSelecionado)) {
      return fornecedorOptions;
    }
    // Cliente: dinheiro ENTRANDO na empresa (vendas/faturamento)
    if (["Faturamento Total", "Vendas"].includes(kpiSelecionado)) {
      return clienteOptions;
    }
    // Para Serviços e Devoluções, usar opções mistas com indicação do tipo
    if (["Serviços", "Devoluções"].includes(kpiSelecionado)) {
      return opcoesMintas.map(opcao => `${opcao.value} (${opcao.type})`);
    }
    return [];
  };

  const labelClienteFornecedor = getClienteFornecedorLabel(kpiSelecionado);
  const labelClienteFornecedorPlural = getClienteFornecedorLabelPlural(kpiSelecionado);

  // Define dinamicamente o título do card de evolução conforme o KPI selecionado
  const getEvolucaoTitle = (kpi: string) => {
    const titles: Record<string, string> = {
      "Total de Entradas": "Evolução do Total de Entradas",
      "Faturamento Total": "Evolução do Faturamento Total",
      "Vendas": "Evolução das Vendas",
      "Compras": "Evolução das Compras",
      "Serviços": "Evolução dos Serviços",
      "Devoluções": "Evolução das Devoluções"
    };
    return titles[kpi] || `Evolução de ${kpi}`;
  };

  // Define dinamicamente o título do card TOP 100 conforme o KPI selecionado
  const getTopProdutosServicosTitle = (kpi: string) => {
    // Produtos: movimentação de mercadorias físicas
    if (["Vendas", "Compras", "Total de Entradas", "Devoluções"].includes(kpi)) {
      return "TOP 100 Produtos";
    }
    // Serviços: prestação de atividades
    if (["Serviços"].includes(kpi)) {
      return "TOP 100 Serviços";
    }
    // Ambos: faturamento total engloba produtos e serviços
    if (["Faturamento Total"].includes(kpi)) {
      return "TOP 100 Produtos / Serviços";
    }
    return "TOP 100 Produtos / Serviços";
  };

  // Calcula dinamicamente o ticket médio conforme o KPI selecionado
  const getTicketMedio = (kpi: string, data: any): string => {
    if (!data) return "R$ 0,00";

    try {
      let total = 0;
      let quantidade = 0;

      switch (kpi) {
        case "Vendas":
          // Apenas saídas não canceladas
          if (data.saidas && Array.isArray(data.saidas)) {
            let saidasValidas = data.saidas.filter((saida: SaidaData) => saida.cancelada === "N");
            
            // Filtrar por cliente específico se selecionado
            if (clienteSelecionado) {
              saidasValidas = saidasValidas.filter((saida: SaidaData) => saida.nome_cliente === clienteSelecionado);
            }
            
            total = saidasValidas.reduce((acc: number, saida: SaidaData) => acc + parseFloat(saida.valor || "0"), 0);
            quantidade = saidasValidas.length;
          }
          break;

        case "Serviços":
          // Apenas serviços não cancelados
          if (data.servicos && Array.isArray(data.servicos)) {
            let servicosValidos = data.servicos.filter((servico: ServicoData) => servico.cancelada === "N");
            
            // Filtrar por cliente específico se selecionado (remover indicação de tipo)
            if (clienteSelecionado) {
              const clienteLimpo = clienteSelecionado.replace(/ \((Cliente|Fornecedor)\)$/, '');
              servicosValidos = servicosValidos.filter((servico: ServicoData) => servico.nome_cliente === clienteLimpo);
            }
            
            total = servicosValidos.reduce((acc: number, servico: ServicoData) => acc + parseFloat(servico.valor || "0"), 0);
            quantidade = servicosValidos.length;
          }
          break;

        case "Faturamento Total":
          // Saídas + Serviços não cancelados
          if (data.saidas && Array.isArray(data.saidas)) {
            let saidasValidas = data.saidas.filter((saida: SaidaData) => saida.cancelada === "N");
            
            // Filtrar por cliente específico se selecionado
            if (clienteSelecionado) {
              saidasValidas = saidasValidas.filter((saida: SaidaData) => saida.nome_cliente === clienteSelecionado);
            }
            
            total += saidasValidas.reduce((acc: number, saida: SaidaData) => acc + parseFloat(saida.valor || "0"), 0);
            quantidade += saidasValidas.length;
          }
          if (data.servicos && Array.isArray(data.servicos)) {
            let servicosValidos = data.servicos.filter((servico: ServicoData) => servico.cancelada === "N");
            
            // Filtrar por cliente específico se selecionado
            if (clienteSelecionado) {
              servicosValidos = servicosValidos.filter((servico: ServicoData) => servico.nome_cliente === clienteSelecionado);
            }
            
            total += servicosValidos.reduce((acc: number, servico: ServicoData) => acc + parseFloat(servico.valor || "0"), 0);
            quantidade += servicosValidos.length;
          }
          break;

        case "Compras":
        case "Total de Entradas":
          // Todas as entradas
          if (data.entradas && Array.isArray(data.entradas)) {
            let entradasValidas = data.entradas;
            
            // Filtrar por fornecedor específico se selecionado
            if (clienteSelecionado) {
              entradasValidas = entradasValidas.filter((entrada: EntradaData) => entrada.nome_fornecedor === clienteSelecionado);
            }
            
            total = entradasValidas.reduce((acc: number, entrada: EntradaData) => acc + parseFloat(entrada.valor || "0"), 0);
            quantidade = entradasValidas.length;
          }
          break;

        case "Devoluções":
          // Para devoluções, considerar transações canceladas como proxy
          if (clienteSelecionado) {
            const clienteLimpo = clienteSelecionado.replace(/ \((Cliente|Fornecedor)\)$/, '');
            const tipoSelecionado = clienteSelecionado.includes('(Fornecedor)') ? 'fornecedor' : 'cliente';
            
            if (tipoSelecionado === 'cliente') {
              // Buscar devoluções de clientes (saídas e serviços cancelados)
              if (data.saidas && Array.isArray(data.saidas)) {
                const saidasCanceladas = data.saidas
                  .filter((saida: SaidaData) => saida.cancelada === "S" && saida.nome_cliente === clienteLimpo);
                total += saidasCanceladas.reduce((acc: number, saida: SaidaData) => acc + parseFloat(saida.valor || "0"), 0);
                quantidade += saidasCanceladas.length;
              }
              if (data.servicos && Array.isArray(data.servicos)) {
                const servicosCancelados = data.servicos
                  .filter((servico: ServicoData) => servico.cancelada === "S" && servico.nome_cliente === clienteLimpo);
                total += servicosCancelados.reduce((acc: number, servico: ServicoData) => acc + parseFloat(servico.valor || "0"), 0);
                quantidade += servicosCancelados.length;
              }
            } else {
              // Para fornecedor, não temos dados específicos de devoluções de compras
              return "R$ 0,00";
            }
          } else {
            // Todas as devoluções (saídas e serviços cancelados)
            if (data.saidas && Array.isArray(data.saidas)) {
              const saidasCanceladas = data.saidas.filter((saida: SaidaData) => saida.cancelada === "S");
              total += saidasCanceladas.reduce((acc: number, saida: SaidaData) => acc + parseFloat(saida.valor || "0"), 0);
              quantidade += saidasCanceladas.length;
            }
            if (data.servicos && Array.isArray(data.servicos)) {
              const servicosCancelados = data.servicos.filter((servico: ServicoData) => servico.cancelada === "S");
              total += servicosCancelados.reduce((acc: number, servico: ServicoData) => acc + parseFloat(servico.valor || "0"), 0);
              quantidade += servicosCancelados.length;
            }
          }
          break;

        default:
          return "R$ 0,00";
      }

      if (quantidade === 0) return "R$ 0,00";

      const ticketMedio = total / quantidade;
      return "R$ " + ticketMedio.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

    } catch (error) {
      console.error("Erro ao calcular ticket médio:", error);
      return "R$ 0,00";
    }
  };

  // Define dinamicamente o card de faturamento/gastos conforme o KPI selecionado
  const getFaturamentoCardInfo = (kpi: string) => {
    switch (kpi) {
      case "Vendas":
      case "Serviços":
      case "Faturamento Total":
        return {
          title: "Faturamento",
          tooltipText: "Total de receitas no período analisado."
        };
      
      case "Compras":
      case "Total de Entradas":
        return {
          title: "Total de Gastos",
          tooltipText: "Total de gastos com fornecedores no período."
        };
      
      case "Devoluções":
        return {
          title: "Valor Devolvido",
          tooltipText: "Total de valores devolvidos aos clientes."
        };
      
      default:
        return {
          title: "Faturamento",
          tooltipText: "Total de receitas no período analisado."
        };
    }
  };

  // Calcula dinamicamente o valor do card faturamento/gastos conforme o KPI selecionado
  const getFaturamentoValue = (kpi: string, data: any): string => {
    if (!data) return "R$ 0,00";

    try {
      let total = 0;

      switch (kpi) {
        case "Vendas":
          // Apenas saídas não canceladas
          if (data.saidas && Array.isArray(data.saidas)) {
            let saidasValidas = data.saidas.filter((saida: SaidaData) => saida.cancelada === "N");
            
            // Filtrar por cliente específico se selecionado
            if (clienteSelecionado) {
              saidasValidas = saidasValidas.filter((saida: SaidaData) => saida.nome_cliente === clienteSelecionado);
            }
            
            total = saidasValidas.reduce((acc: number, saida: SaidaData) => acc + parseFloat(saida.valor || "0"), 0);
          }
          break;

        case "Serviços":
          // Apenas serviços não cancelados
          if (data.servicos && Array.isArray(data.servicos)) {
            let servicosValidos = data.servicos.filter((servico: ServicoData) => servico.cancelada === "N");
            
            // Filtrar por cliente específico se selecionado (remover indicação de tipo)
            if (clienteSelecionado) {
              const clienteLimpo = clienteSelecionado.replace(/ \((Cliente|Fornecedor)\)$/, '');
              servicosValidos = servicosValidos.filter((servico: ServicoData) => servico.nome_cliente === clienteLimpo);
            }
            
            total = servicosValidos.reduce((acc: number, servico: ServicoData) => acc + parseFloat(servico.valor || "0"), 0);
          }
          break;

        case "Faturamento Total":
          // Saídas + Serviços não cancelados
          if (data.saidas && Array.isArray(data.saidas)) {
            let saidasValidas = data.saidas.filter((saida: SaidaData) => saida.cancelada === "N");
            
            // Filtrar por cliente específico se selecionado
            if (clienteSelecionado) {
              saidasValidas = saidasValidas.filter((saida: SaidaData) => saida.nome_cliente === clienteSelecionado);
            }
            
            total += saidasValidas.reduce((acc: number, saida: SaidaData) => acc + parseFloat(saida.valor || "0"), 0);
          }
          if (data.servicos && Array.isArray(data.servicos)) {
            let servicosValidos = data.servicos.filter((servico: ServicoData) => servico.cancelada === "N");
            
            // Filtrar por cliente específico se selecionado
            if (clienteSelecionado) {
              servicosValidos = servicosValidos.filter((servico: ServicoData) => servico.nome_cliente === clienteSelecionado);
            }
            
            total += servicosValidos.reduce((acc: number, servico: ServicoData) => acc + parseFloat(servico.valor || "0"), 0);
          }
          break;

        case "Compras":
        case "Total de Entradas":
          // Todas as entradas
          if (data.entradas && Array.isArray(data.entradas)) {
            let entradasValidas = data.entradas;
            
            // Filtrar por fornecedor específico se selecionado
            if (clienteSelecionado) {
              entradasValidas = entradasValidas.filter((entrada: EntradaData) => entrada.nome_fornecedor === clienteSelecionado);
            }
            
            total = entradasValidas.reduce((acc: number, entrada: EntradaData) => acc + parseFloat(entrada.valor || "0"), 0);
          }
          break;

        case "Devoluções":
          // Para devoluções, considerar transações canceladas como proxy
          if (clienteSelecionado) {
            const clienteLimpo = clienteSelecionado.replace(/ \((Cliente|Fornecedor)\)$/, '');
            const tipoSelecionado = clienteSelecionado.includes('(Fornecedor)') ? 'fornecedor' : 'cliente';
            
            if (tipoSelecionado === 'cliente') {
              // Buscar devoluções de clientes (saídas e serviços cancelados)
              if (data.saidas && Array.isArray(data.saidas)) {
                const saidasCanceladas = data.saidas
                  .filter((saida: SaidaData) => saida.cancelada === "S" && saida.nome_cliente === clienteLimpo);
                total += saidasCanceladas.reduce((acc: number, saida: SaidaData) => acc + parseFloat(saida.valor || "0"), 0);
              }
              if (data.servicos && Array.isArray(data.servicos)) {
                const servicosCancelados = data.servicos
                  .filter((servico: ServicoData) => servico.cancelada === "S" && servico.nome_cliente === clienteLimpo);
                total += servicosCancelados.reduce((acc: number, servico: ServicoData) => acc + parseFloat(servico.valor || "0"), 0);
              }
            }
            // Para fornecedor, não temos dados específicos de devoluções de compras
          } else {
            // Todas as devoluções (saídas e serviços cancelados)
            if (data.saidas && Array.isArray(data.saidas)) {
              const saidasCanceladas = data.saidas.filter((saida: SaidaData) => saida.cancelada === "S");
              total += saidasCanceladas.reduce((acc: number, saida: SaidaData) => acc + parseFloat(saida.valor || "0"), 0);
            }
            if (data.servicos && Array.isArray(data.servicos)) {
              const servicosCancelados = data.servicos.filter((servico: ServicoData) => servico.cancelada === "S");
              total += servicosCancelados.reduce((acc: number, servico: ServicoData) => acc + parseFloat(servico.valor || "0"), 0);
            }
          }
          break;

        default:
          return "R$ 0,00";
      }

      return "R$ " + total.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

    } catch (error) {
      console.error("Erro ao calcular faturamento/gastos:", error);
      return "R$ 0,00";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (startDate && endDate) {
        setLoading(true);
        try {
          console.log("Buscando dados para o dashboard fiscal com as datas:", {
            startDate,
            endDate,
          });
          const response = await fetch("/api/dashboard-fiscal", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              start_date: startDate,
              end_date: endDate,
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(
              result.error || `Erro do backend: ${response.statusText}`
            );
          }

          console.log("Dados recebidos da API fiscal:", result);
          setData(result);

          // Extrair fornecedores únicos dos dados de entradas
          if (result.entradas && Array.isArray(result.entradas)) {
            const fornecedoresUnicos = Array.from(
              new Set(
                result.entradas.map((entrada: EntradaData) => entrada.nome_fornecedor)
              )
            ).sort() as string[];
            setFornecedorOptions(fornecedoresUnicos);
          } else {
            setFornecedorOptions([]);
          }

          // Extrair clientes únicos dos dados de serviços e saídas
          const clientesSet = new Set<string>();
          
          // Adicionar clientes dos serviços (apenas os não cancelados)
          if (result.servicos && Array.isArray(result.servicos)) {
            result.servicos
              .filter((servico: ServicoData) => servico.cancelada === "N")
              .forEach((servico: ServicoData) => {
                clientesSet.add(servico.nome_cliente);
              });
          }
          
          // Adicionar clientes das saídas (apenas os não cancelados)
          if (result.saidas && Array.isArray(result.saidas)) {
            result.saidas
              .filter((saida: SaidaData) => saida.cancelada === "N")
              .forEach((saida: SaidaData) => {
                clientesSet.add(saida.nome_cliente);
              });
          }

          const clientesUnicos = Array.from(clientesSet).sort();
          setClienteOptions(clientesUnicos);

          // Criar opções mistas para "Serviços" e "Devoluções" (clientes + fornecedores)
          const opcoesMistas: Array<{value: string, type: 'Cliente' | 'Fornecedor'}> = [];
          
          // Adicionar fornecedores únicos
          if (result.entradas && Array.isArray(result.entradas)) {
            const fornecedoresUnicos = Array.from(
              new Set(result.entradas.map((entrada: EntradaData) => entrada.nome_fornecedor))
            ) as string[];
            fornecedoresUnicos.forEach((fornecedor) => {
              opcoesMistas.push({ value: fornecedor, type: 'Fornecedor' });
            });
          }

          // Adicionar clientes únicos
          clientesUnicos.forEach(cliente => {
            opcoesMistas.push({ value: cliente, type: 'Cliente' });
          });

          // Ordenar por valor (alfabética)
          opcoesMistas.sort((a, b) => a.value.localeCompare(b.value));
          setOpcoesMintas(opcoesMistas);

        } catch (error) {
          console.error(
            "Erro ao buscar dados para o dashboard fiscal:",
            error
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [startDate, endDate]);
  // 🔄 Loading state
  if (loading) {
    return <Loading />;
  }

  const handleStartDateChange = (date: string | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: string | null) => {
    setEndDate(date);
  };

  const handleKpiChange = (kpi: string) => {
    setKpiSelecionado(kpi);
    // Limpar seleção do dropdown quando KPI mudar
    setClienteSelecionado("");
  };

  const handleResetAllFilters = () => {
    setClienteSelecionado("");
    setProdutoSelecionado("");
    setStartDate(null);
    setEndDate(null);
    setKpiSelecionado("Total de Entradas");
  };

  const handleMaximizeEvolucao = () => {
    // Função para maximizar o card de evolução (a ser implementada)
    console.log("Maximizar card de evolução");
  };

  const produtoOptions = [
    "GASOLINA COMUM",
    "GASOLINA ADITIVADA (Ex: DT CLEAN)",
    "ETANOL HIDRATADO COMUM",
    "DIESEL S10 COMUM",
    "DIESEL S10 ADITIVADO (Ex: RENDMAX)",
    "GNV (GÁS NATURAL VEICULAR)",
    "ÓLEO LUBRIFICANTE 15W40 SEMISSINTÉTICO",
    "LAVAGEM COMPLETA DE VEÍCULO",
    "ÁGUA MINERAL S/ GÁS 500ML",
    "PÃO DE QUEIJO (Unidade)"
  ];

  // Filtrar cards baseado no KPI selecionado
  const getCardsData = () => {
    const faturamentoCardInfo = getFaturamentoCardInfo(kpiSelecionado);
    
    const baseCards = [
      { 
        title: faturamentoCardInfo.title, 
        value: getFaturamentoValue(kpiSelecionado, data), 
        tooltipText: faturamentoCardInfo.tooltipText 
      },
      { title: "Entradas", value: "R$ 495.542.800,00", tooltipText: "Total de entradas fiscais no período." },
      { title: "Carga Tributária", value: "7,31%", tooltipText: "Percentual de impostos sobre o faturamento total." },
      { title: "Imposto Devido", value: "R$ 45.330,00", tooltipText: "Valor total de impostos a pagar no período." },
      { title: "A Recuperar", value: "R$ 846.090,00", tooltipText: "Valor de créditos tributários a recuperar." }
    ];

    // Para Devoluções, não mostrar o card de Ticket Médio
    if (kpiSelecionado === "Devoluções") {
      return baseCards;
    }

    // Para todos os outros KPIs, incluir o Ticket Médio no início
    return [
      { title: "Ticket Médio", value: getTicketMedio(kpiSelecionado, data), tooltipText: "Valor médio por transação no período analisado." },
      ...baseCards
    ];
  };

  const cardsData = getCardsData();

  // Dados para o gráfico de evolução
  const evolucaoData = [
    { month: "Jan/2024", value: 30288035.12 },
    { month: "Fev/2024", value: 26307276.15 },
    { month: "Mar/2024", value: 32832801.44 },
    { month: "Abr/2024", value: 43884300.49 },
    { month: "Mai/2024", value: 39243554.24 },
    { month: "Jun/2024", value: 40105421.16 },
    { month: "Jul/2024", value: 43384822.79 },
    { month: "Ago/2024", value: 46108634.08 },
    { month: "Set/2024", value: 47415413.48 },
    { month: "Out/2024", value: 46454140.89 },
    { month: "Nov/2024", value: 45986012.62 },
    { month: "Dez/2024", value: 53602856.14 }
  ];

  // Dados para o primeiro card de barra de progresso - "TOP 100 Produtos / Serviços"
  // Total dos valores: R$ 166.752.838,30
  const topProdutosServicosData = [
    { name: "Produto não informado", value: "R$ 115.439.645,23", numericValue: 115439645.23, percentage: 69.2, rank: 1 },
    { name: "SERVIÇOS TOMADOS (2)", value: "R$ 11.213.561,10", numericValue: 11213561.10, percentage: 6.7, rank: 2 },
    { name: "VASILHAME VAZIO P13 (2)", value: "R$ 6.496.853,83", numericValue: 6496853.83, percentage: 3.9, rank: 3 },
    { name: "COTTON ALQUIMIA MENEGOTTI (80000000006084)", value: "R$ 4.694.056,41", numericValue: 4694056.41, percentage: 2.8, rank: 4 },
    { name: "COTTON ALQUIMIA MENEGOTTI (143580A)", value: "R$ 4.670.102,95", numericValue: 4670102.95, percentage: 2.8, rank: 5 },
    { name: "COTTON ALQUIMIA MENEGOTTI (143580A)", value: "R$ 4.663.614,92", numericValue: 4663614.92, percentage: 2.8, rank: 6 },
    { name: "GASOLINA C COMUM (101001)", value: "R$ 4.492.489,40", numericValue: 4492489.40, percentage: 2.7, rank: 7 },
    { name: "SERVIÇOS TOMADOS SEM CREDITO (9)", value: "R$ 4.450.120,01", numericValue: 4450120.01, percentage: 2.7, rank: 8 },
    { name: "GASOLINA C COMUM (101001)", value: "R$ 4.365.533,64", numericValue: 4365533.64, percentage: 2.6, rank: 9 },
    { name: "COTTON ALQUIMIA MENEGOTTI (143580A)", value: "R$ 4.236.279,81", numericValue: 4236279.81, percentage: 2.5, rank: 10 },
    { name: "GASOLINA C COMUM (101001)", value: "R$ 4.031.582,00", numericValue: 4031582.00, percentage: 2.4, rank: 11 }
  ];

  // Dados para o segundo card de barra de progresso - "TOP 100 Clientes / Fornecedores"
  // Total dos valores: R$ 145.126.267,43
  const topClientesFornecedoresData = [
    { name: "YAMAHA MOTOR DA AMAZONIA LTDA", value: "R$ 21.068.918,95", numericValue: 21068918.95, percentage: 14.5, rank: 1 },
    { name: "VIBRA ENERGIA S.A", value: "R$ 20.507.156,97", numericValue: 20507156.97, percentage: 14.1, rank: 2 },
    { name: "F DINARTE IND E COM DE CONFEC", value: "R$ 19.127.937,07", numericValue: 19127937.07, percentage: 13.2, rank: 3 },
    { name: "DINART IND E COM DE CONFECCOES LTDA", value: "R$ 14.073.792,88", numericValue: 14073792.88, percentage: 9.7, rank: 4 },
    { name: "TICKET SERVIÇOS SA", value: "R$ 13.703.588,36", numericValue: 13703588.36, percentage: 9.4, rank: 5 },
    { name: "MALHAS MENEGOTTI INDUSTRIA TEXTIL LTDA", value: "R$ 11.524.068,34", numericValue: 11524068.34, percentage: 7.9, rank: 6 },
    { name: "BIOSAUDE", value: "R$ 10.180.027,94", numericValue: 10180027.94, percentage: 7.0, rank: 7 },
    { name: "BAHIANA DISTRIBUIDORA DE GAS LTDA", value: "R$ 9.972.635,56", numericValue: 9972635.56, percentage: 6.9, rank: 8 },
    { name: "LYCEUM CONSULTORIA EDUCACIONAL", value: "R$ 9.033.402,58", numericValue: 9033402.58, percentage: 6.2, rank: 9 },
    { name: "F DINART IND. E COM. DE CONFECCOES LTDA", value: "R$ 8.266.838,94", numericValue: 8266838.94, percentage: 5.7, rank: 10 },
    { name: "HOSPITAL UNIMED SUL", value: "R$ 7.668.899,58", numericValue: 7668899.58, percentage: 5.3, rank: 11 }
  ];

  const handleMaximizeTopProdutos = () => {
    console.log("Maximizar card TOP 100 Produtos / Serviços");
  };

  const handleMaximizeTopClientesFornecedores = () => {
    console.log("Maximizar card TOP 100 Clientes / Fornecedores");
  };

  const handleMaximizeValorPorLocal = () => {
    console.log("Maximizar card Valor por Local");
  };

  return (
    <div className="bg-[#f7f7f8] flex flex-col flex-1 h-full min-h-0">
      {/* Header de Filtros - Fixo */}
      <div className="relative z-10 flex flex-col gap-4 p-4 border-b border-black/10 bg-gray-100">
        <div className="flex items-center gap-8">
          <h1 className={`text-[32px] leading-8 font-700 text-black ${cairo.className}`}>Dashboard Fiscal - Faturamento e Entradas</h1>
          <Image
            src="/assets/icons/icon-reset-kpi.svg"
            alt="Reset KPI Icon"
            width={20}
            height={20}
            className="cursor-pointer hover:opacity-75 transition-opacity"
            onClick={handleResetAllFilters}
            title="Resetar todos os filtros"
          />
          <div className="w-[1px] h-[30px] bg-[#373A40]" />
          
          {/* KPIs - 2 linhas de 3 colunas alinhados à direita */}
          <div className="flex flex-col gap-2 ml-auto">
            <div className="flex items-center gap-4">
              {["Total de Entradas", "Faturamento Total", "Vendas"].map((kpi) => (
                <button
                  key={kpi}
                  className={`w-[220px] px-4 h-[40px] flex items-center justify-center rounded-md border border-neutral-700 text-sm font-semibold leading-tight hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer transition-colors ${cairo.className} ${
                    kpiSelecionado === kpi
                      ? "bg-[var(--color-neutral-700)] text-white"
                      : "bg-white text-gray-500"
                  }`}
                  onClick={() => handleKpiChange(kpi)}
                >
                  {kpi}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              {["Compras", "Serviços", "Devoluções"].map((kpi) => (
                <button
                  key={kpi}
                  className={`w-[220px] px-4 h-[40px] flex items-center justify-center rounded-md border border-neutral-700 text-sm font-semibold leading-tight hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer transition-colors ${cairo.className} ${
                    kpiSelecionado === kpi
                      ? "bg-[var(--color-neutral-700)] text-white"
                      : "bg-white text-gray-500"
                  }`}
                  onClick={() => handleKpiChange(kpi)}
                >
                  {kpi}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Filtros principais e Calendário */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Dropdown
                options={getDropdownOptions()}
                label={labelClienteFornecedor}
                widthClass="w-72"
                selectedValue={clienteSelecionado}
                onValueChange={setClienteSelecionado}
                isOpen={openDropdown === 'cliente'}
                onToggle={() => handleToggleDropdown('cliente')}
            />
            <Dropdown
                options={produtoOptions}
                label="Produto"
                widthClass="w-72"
                selectedValue={produtoSelecionado}
                onValueChange={setProdutoSelecionado}
                isOpen={openDropdown === 'produto'}
                onToggle={() => handleToggleDropdown('produto')}
                disabled={true}
            />
          </div>
          <Calendar
            initialStartDate={startDate}
            initialEndDate={endDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
          />
        </div>
      </div>

      {/* Conteúdo Principal - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Cards KPI */}
        <KpiCardsGrid cardsData={cardsData} />
        
        {/* Card de Evolução - Largura Total */}
        <div className="mt-6">
          <EvolucaoCard 
            title={getEvolucaoTitle(kpiSelecionado)} 
            data={evolucaoData}
            onMaximize={handleMaximizeEvolucao}
          />
        </div>

        {/* Novos Cards com Barras de Progresso - 2 por linha */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ProgressBarCard 
            title={getTopProdutosServicosTitle(kpiSelecionado)} 
            items={topProdutosServicosData}
            colorScheme="green"
            onMaximize={handleMaximizeTopProdutos}
          />
          <ProgressBarCard 
            title={`TOP 100 ${labelClienteFornecedorPlural}`}
            items={topClientesFornecedoresData}
            colorScheme="blue"
            onMaximize={handleMaximizeTopClientesFornecedores}
          />
        </div>

        {/* Terceiro Card - Valor por Local (largura total) */}
        <div className="mt-6">
          <EmptyCard 
            title="Valor por Local" 
            onMaximize={handleMaximizeValorPorLocal}
          />
        </div>
        </div>
      </div>
  );
}