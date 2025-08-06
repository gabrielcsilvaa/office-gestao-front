"use client";
import { Cairo } from "next/font/google";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Dropdown } from "./components/Dropdown";
import { VirtualizedDropdown } from "./components/VirtualizedDropdown";
import { SmartDropdown } from "./components/SmartDropdown";
import { Toast } from "./components/Toast";
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

  // Tipos para os dados do dashboard
  type DashboardData = {
    saidas?: any[];
    servicos?: any[];
    entradas?: EntradaData[];
  };

  // Estados do componente
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [kpiSelecionado, setKpiSelecionado] = useState("Receita Bruta Total");
  const [data, setData] = useState<DashboardData | null>(null);
  const [fornecedorOptions, setFornecedorOptions] = useState<string[]>([]);
  const [clienteOptions, setClienteOptions] = useState<string[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info' | 'warning';
  } | null>(null);

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
    // Fornecedor: dinheiro SAINDO da empresa (compras/aquisições)
    if (["Compras e Aquisições"].includes(kpi)) {
      return "Fornecedor";
    }
    // Cliente: dinheiro ENTRANDO na empresa (vendas/receitas/cancelamentos)
    if (["Receita Bruta Total", "Vendas de Produtos", "Serviços Prestados", "Cancelamentos de Receita"].includes(kpi)) {
      return "Cliente";
    }
    return "Cliente";
  };

  // Para o título do card, versão plural
  const getClienteFornecedorLabelPlural = (kpi: string) => {
    // Fornecedor: dinheiro SAINDO da empresa (compras/aquisições)
    if (["Compras e Aquisições"].includes(kpi)) {
      return "Fornecedores";
    }
    // Cliente: dinheiro ENTRANDO na empresa (vendas/receitas)
    if (["Receita Bruta Total", "Vendas de Produtos", "Serviços Prestados"].includes(kpi)) {
      return "Clientes";
    }
    // Para Cancelamentos, usar ambos os contextos
    if (["Cancelamentos de Receita"].includes(kpi)) {
      return "Clientes / Fornecedores";
    }
    return "Clientes";
  };
  
  // Retorna as opções do dropdown conforme o KPI selecionado
  const getDropdownOptions = (): string[] => {
    return getDropdownOptionsForKpi(kpiSelecionado);
  };

  const labelClienteFornecedor = getClienteFornecedorLabel(kpiSelecionado);
  const labelClienteFornecedorPlural = getClienteFornecedorLabelPlural(kpiSelecionado);

  // Define dinamicamente o título do card de evolução conforme o KPI selecionado
  const getEvolucaoTitle = (kpi: string) => {
    const titles: Record<string, string> = {
      "Compras e Aquisições": "Evolução de Compras e Aquisições",
      "Receita Bruta Total": "Evolução da Receita Bruta Total", 
      "Vendas de Produtos": "Evolução de Vendas de Produtos",
      "Serviços Prestados": "Evolução de Serviços Prestados",
      "Cancelamentos de Receita": "Evolução de Cancelamentos de Receita"
    };
    return titles[kpi] || `Evolução de ${kpi}`;
  };

  // Define dinamicamente o título do card TOP 100 conforme o KPI selecionado
  const getTopProdutosServicosTitle = (kpi: string) => {
    // Produtos: movimentação de mercadorias físicas
    if (["Vendas de Produtos", "Compras e Aquisições", "Cancelamentos de Receita"].includes(kpi)) {
      return "TOP 100 Produtos";
    }
    // Serviços: prestação de atividades
    if (["Serviços Prestados"].includes(kpi)) {
      return "TOP 100 Serviços";
    }
    // Ambos: receita bruta total engloba produtos e serviços
    if (["Receita Bruta Total"].includes(kpi)) {
      return "TOP 100 Produtos / Serviços";
    }
    return "TOP 100 Produtos / Serviços";
  };

  // Funções para título e tooltip dinâmicos do card de ticket médio/compra média
  const getTicketMedioTitle = (kpi: string): string => {
    switch (kpi) {
      case "Compras e Aquisições":
        return "Compra Média";
      case "Vendas de Produtos":
      case "Serviços Prestados":
      case "Receita Bruta Total":
        return "Ticket Médio";
      default:
        return "Ticket Médio";
    }
  };

  const getTicketMedioTooltip = (kpi: string): string => {
    switch (kpi) {
      case "Compras e Aquisições":
        return "Valor médio por pedido de compra no período analisado.";
      case "Vendas de Produtos":
      case "Serviços Prestados":
      case "Receita Bruta Total":
        return "Valor médio por transação de receita no período analisado.";
      default:
        return "Valor médio por transação no período analisado.";
    }
  };

  // Calcula dinamicamente o ticket médio conforme o KPI selecionado
  const getTicketMedio = (kpi: string, data: any): string => {
    if (!data) return "R$ 0,00";

    try {
      let total = 0;
      let quantidade = 0;

      switch (kpi) {
        case "Vendas de Produtos":
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

        case "Serviços Prestados":
          // Apenas serviços não cancelados
          if (data.servicos && Array.isArray(data.servicos)) {
            let servicosValidos = data.servicos.filter((servico: ServicoData) => servico.cancelada === "N");
            
            // Filtrar por cliente específico se selecionado
            if (clienteSelecionado) {
              servicosValidos = servicosValidos.filter((servico: ServicoData) => servico.nome_cliente === clienteSelecionado);
            }
            
            total = servicosValidos.reduce((acc: number, servico: ServicoData) => acc + parseFloat(servico.valor || "0"), 0);
            quantidade = servicosValidos.length;
          }
          break;

        case "Receita Bruta Total":
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

        case "Compras e Aquisições":
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

        case "Cancelamentos de Receita":
          // Para cancelamentos de receita, considerar apenas clientes (receita cancelada)
          if (clienteSelecionado) {
            // Buscar cancelamentos de clientes (saídas e serviços cancelados)
            if (data.saidas && Array.isArray(data.saidas)) {
              const saidasCanceladas = data.saidas
                .filter((saida: SaidaData) => saida.cancelada === "S" && saida.nome_cliente === clienteSelecionado);
              total += saidasCanceladas.reduce((acc: number, saida: SaidaData) => acc + parseFloat(saida.valor || "0"), 0);
              quantidade += saidasCanceladas.length;
            }
            if (data.servicos && Array.isArray(data.servicos)) {
              const servicosCancelados = data.servicos
                .filter((servico: ServicoData) => servico.cancelada === "S" && servico.nome_cliente === clienteSelecionado);
              total += servicosCancelados.reduce((acc: number, servico: ServicoData) => acc + parseFloat(servico.valor || "0"), 0);
              quantidade += servicosCancelados.length;
            }
          } else {
            // Todos os cancelamentos de receita (saídas e serviços cancelados)
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
      case "Vendas de Produtos":
      case "Serviços Prestados":
      case "Receita Bruta Total":
        return {
          title: "Receita Bruta",
          tooltipText: "Total de receitas brutas no período analisado."
        };
      
      case "Compras e Aquisições":
        return {
          title: "Total de Gastos",
          tooltipText: "Total de gastos com fornecedores no período."
        };
      
      case "Cancelamentos de Receita":
        return {
          title: "Valor Cancelado",
          tooltipText: "Total de valores de receitas canceladas (produtos + serviços)."
        };
      
      default:
        return {
          title: "Receita Bruta",
          tooltipText: "Total de receitas brutas no período analisado."
        };
    }
  };

  // Calcula dinamicamente o valor do card faturamento/gastos conforme o KPI selecionado
  const getFaturamentoValue = (kpi: string, data: any): string => {
    if (!data) return "R$ 0,00";

    try {
      let total = 0;

      switch (kpi) {
        case "Vendas de Produtos":
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

        case "Serviços Prestados":
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

        case "Receita Bruta Total":
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

        case "Compras e Aquisições":
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

        case "Cancelamentos de Receita":
          // Para cancelamentos de receita, considerar apenas clientes (receita cancelada)
          if (clienteSelecionado) {
            // Buscar cancelamentos de clientes (saídas e serviços cancelados)
            if (data.saidas && Array.isArray(data.saidas)) {
              const saidasCanceladas = data.saidas
                .filter((saida: SaidaData) => saida.cancelada === "S" && saida.nome_cliente === clienteSelecionado);
              total += saidasCanceladas.reduce((acc: number, saida: SaidaData) => acc + parseFloat(saida.valor || "0"), 0);
            }
            if (data.servicos && Array.isArray(data.servicos)) {
              const servicosCancelados = data.servicos
                .filter((servico: ServicoData) => servico.cancelada === "S" && servico.nome_cliente === clienteSelecionado);
              total += servicosCancelados.reduce((acc: number, servico: ServicoData) => acc + parseFloat(servico.valor || "0"), 0);
            }
          } else {
            // Todos os cancelamentos de receita (saídas e serviços cancelados)
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
    
    // ✅ MELHORIA UX: Validação inteligente da seleção atual
    // Só limpa a seleção se ela não for compatível com o novo KPI
    if (clienteSelecionado) {
      const currentOptions = getDropdownOptionsForKpi(kpi);
      const isCurrentSelectionValid = currentOptions.includes(clienteSelecionado);
      
      if (!isCurrentSelectionValid) {
        setClienteSelecionado("");
        setToast({
          message: `Seleção de "${clienteSelecionado}" removida (não disponível para ${kpi})`,
          type: 'warning'
        });
      }
      // Quando a seleção é mantida, não mostra toast (comportamento silencioso)
    }
  };

  // Função auxiliar para obter opções de dropdown para um KPI específico
  const getDropdownOptionsForKpi = (kpi: string): string[] => {
    // Fornecedor: dinheiro SAINDO da empresa (compras/aquisições)
    if (["Compras e Aquisições"].includes(kpi)) {
      return fornecedorOptions;
    }
    // Cliente: dinheiro ENTRANDO na empresa (vendas/receitas/cancelamentos)
    if (["Receita Bruta Total", "Vendas de Produtos", "Serviços Prestados"].includes(kpi)) {
      return clienteOptions;
    }
    // Para Cancelamentos de Receita, mostrar apenas clientes que têm cancelamentos
    if (["Cancelamentos de Receita"].includes(kpi)) {
      if (!data) return [];
      
      const clientesComCancelamentos = new Set<string>();
      const dataTyped = data as any;
      
      // Adicionar clientes das saídas canceladas
      if (dataTyped.saidas && Array.isArray(dataTyped.saidas)) {
        dataTyped.saidas
          .filter((saida: any) => saida.cancelada === "S")
          .forEach((saida: any) => {
            clientesComCancelamentos.add(saida.nome_cliente);
          });
      }
      
      // Adicionar clientes dos serviços cancelados
      if (dataTyped.servicos && Array.isArray(dataTyped.servicos)) {
        dataTyped.servicos
          .filter((servico: any) => servico.cancelada === "S")
          .forEach((servico: any) => {
            clientesComCancelamentos.add(servico.nome_cliente);
          });
      }
      
      return Array.from(clientesComCancelamentos).sort();
    }
    return [];
  };

  const handleResetAllFilters = () => {
    setClienteSelecionado("");
    setProdutoSelecionado("");
    setStartDate(null);
    setEndDate(null);
    setKpiSelecionado("Compras e Aquisições");
  };

  const handleMaximizeEvolucao = () => {
    // Função para maximizar o card de evolução (a ser implementada)
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

  const getPercentualCancelamentos = (data: any) => {
    if (!data) return "0,0%";
    
    // Valor total cancelado (já considera o filtro de cliente)
    const valorCancelado = getFaturamentoValueNumeric("Cancelamentos de Receita", data);
    
    // Valor total da receita bruta (incluindo canceladas, considerando filtro de cliente)
    let saidasTotal = data.saidas || [];
    let servicosTotal = data.servicos || [];
    
    if (clienteSelecionado) {
      saidasTotal = saidasTotal.filter((saida: any) => saida.nome_cliente === clienteSelecionado);
      servicosTotal = servicosTotal.filter((servico: any) => servico.nome_cliente === clienteSelecionado);
    }
    
    const valorSaidasTotal = saidasTotal.reduce((total: number, item: any) => total + parseFloat(item.valor), 0);
    const valorServicosTotal = servicosTotal.reduce((total: number, item: any) => total + parseFloat(item.valor), 0);
    const receitaBrutaComCanceladas = valorSaidasTotal + valorServicosTotal;
    
    if (receitaBrutaComCanceladas === 0) return "0,0%";
    
    const percentual = (valorCancelado / receitaBrutaComCanceladas) * 100;
    return `${percentual.toFixed(1)}%`;
  };

  const getFaturamentoValueNumeric = (kpi: string, data: any): number => {
    if (!data) return 0;
    
    switch (kpi) {
      case "Receita Bruta Total":
        let saidasFiltradas = data.saidas?.filter((item: any) => item.cancelada !== "S") || [];
        let servicosFiltrados = data.servicos?.filter((item: any) => item.cancelada !== "S") || [];
        
        if (clienteSelecionado) {
          saidasFiltradas = saidasFiltradas.filter((saida: any) => saida.nome_cliente === clienteSelecionado);
          servicosFiltrados = servicosFiltrados.filter((servico: any) => servico.nome_cliente === clienteSelecionado);
        }
        
        const saidasTotal = saidasFiltradas.reduce((total: number, item: any) => total + parseFloat(item.valor), 0);
        const servicosTotal = servicosFiltrados.reduce((total: number, item: any) => total + parseFloat(item.valor), 0);
        return saidasTotal + servicosTotal;
      
      case "Vendas de Produtos":
        let saidasProdutos = data.saidas?.filter((item: any) => item.cancelada !== "S") || [];
        if (clienteSelecionado) {
          saidasProdutos = saidasProdutos.filter((saida: any) => saida.nome_cliente === clienteSelecionado);
        }
        return saidasProdutos.reduce((total: number, item: any) => total + parseFloat(item.valor), 0);
      
      case "Serviços Prestados":
        let servicosPresados = data.servicos?.filter((item: any) => item.cancelada !== "S") || [];
        if (clienteSelecionado) {
          servicosPresados = servicosPresados.filter((servico: any) => servico.nome_cliente === clienteSelecionado);
        }
        return servicosPresados.reduce((total: number, item: any) => total + parseFloat(item.valor), 0);
      
      case "Compras e Aquisições":
        let entradasFiltradas = data.entradas || [];
        if (clienteSelecionado) {
          entradasFiltradas = entradasFiltradas.filter((entrada: any) => entrada.nome_fornecedor === clienteSelecionado);
        }
        return entradasFiltradas.reduce((total: number, item: any) => total + parseFloat(item.valor), 0);
      
      case "Cancelamentos de Receita":
        let canceladasSaidas = data.saidas?.filter((item: any) => item.cancelada === "S") || [];
        let canceladasServicos = data.servicos?.filter((item: any) => item.cancelada === "S") || [];
        
        if (clienteSelecionado) {
          canceladasSaidas = canceladasSaidas.filter((saida: any) => saida.nome_cliente === clienteSelecionado);
          canceladasServicos = canceladasServicos.filter((servico: any) => servico.nome_cliente === clienteSelecionado);
        }
        
        const valorCanceladoSaidas = canceladasSaidas.reduce((total: number, item: any) => total + parseFloat(item.valor), 0);
        const valorCanceladoServicos = canceladasServicos.reduce((total: number, item: any) => total + parseFloat(item.valor), 0);
        return valorCanceladoSaidas + valorCanceladoServicos;
      
      default:
        return 0;
    }
  };

  const getNumeroTransacoes = (kpi: string, data: any) => {
    if (!data) return "0";
    
    switch (kpi) {
      case "Receita Bruta Total":
        // Contar transações de saídas + serviços (não canceladas)
        let saidasFiltradas = data.saidas?.filter((item: any) => item.cancelada !== "S") || [];
        let servicosFiltrados = data.servicos?.filter((item: any) => item.cancelada !== "S") || [];
        
        if (clienteSelecionado) {
          saidasFiltradas = saidasFiltradas.filter((saida: any) => saida.nome_cliente === clienteSelecionado);
          servicosFiltrados = servicosFiltrados.filter((servico: any) => servico.nome_cliente === clienteSelecionado);
        }
        
        return (saidasFiltradas.length + servicosFiltrados.length).toLocaleString();
      
      case "Vendas de Produtos":
        let saidasProdutos = data.saidas?.filter((item: any) => item.cancelada !== "S") || [];
        if (clienteSelecionado) {
          saidasProdutos = saidasProdutos.filter((saida: any) => saida.nome_cliente === clienteSelecionado);
        }
        return saidasProdutos.length.toLocaleString();
      
      case "Serviços Prestados":
        let servicosPresados = data.servicos?.filter((item: any) => item.cancelada !== "S") || [];
        if (clienteSelecionado) {
          servicosPresados = servicosPresados.filter((servico: any) => servico.nome_cliente === clienteSelecionado);
        }
        return servicosPresados.length.toLocaleString();
      
      case "Compras e Aquisições":
        let entradasFiltradas = data.entradas || [];
        if (clienteSelecionado) {
          entradasFiltradas = entradasFiltradas.filter((entrada: any) => entrada.nome_fornecedor === clienteSelecionado);
        }
        return entradasFiltradas.length.toLocaleString();
      
      case "Cancelamentos de Receita":
        let canceladasSaidas = data.saidas?.filter((item: any) => item.cancelada === "S") || [];
        let canceladasServicos = data.servicos?.filter((item: any) => item.cancelada === "S") || [];
        
        if (clienteSelecionado) {
          canceladasSaidas = canceladasSaidas.filter((saida: any) => saida.nome_cliente === clienteSelecionado);
          canceladasServicos = canceladasServicos.filter((servico: any) => servico.nome_cliente === clienteSelecionado);
        }
        
        return (canceladasSaidas.length + canceladasServicos.length).toLocaleString();
      
      default:
        return "0";
    }
  };

  const getMixReceita = (data: any) => {
    if (!data) return { produtos: 0, servicos: 0 };
    
    // Filtrar dados conforme cliente selecionado
    let saidasFiltradas = data.saidas?.filter((item: any) => item.cancelada !== "S") || [];
    let servicosFiltrados = data.servicos?.filter((item: any) => item.cancelada !== "S") || [];
    
    if (clienteSelecionado) {
      saidasFiltradas = saidasFiltradas.filter((saida: any) => saida.nome_cliente === clienteSelecionado);
      servicosFiltrados = servicosFiltrados.filter((servico: any) => servico.nome_cliente === clienteSelecionado);
    }
    
    const valorSaidas = saidasFiltradas.reduce((total: number, item: any) => total + parseFloat(item.valor), 0);
    const valorServicos = servicosFiltrados.reduce((total: number, item: any) => total + parseFloat(item.valor), 0);
    
    const total = valorSaidas + valorServicos;
    
    if (total === 0) return { produtos: 0, servicos: 0 };
    
    return {
      produtos: Math.round((valorSaidas / total) * 100),
      servicos: Math.round((valorServicos / total) * 100)
    };
  };

  const getValorComponenteReceita = (tipo: 'produtos' | 'servicos', data: any) => {
    if (!data) return "R$ 0,00";
    
    if (tipo === 'produtos') {
      let saidasFiltradas = data.saidas?.filter((item: any) => item.cancelada !== "S") || [];
      
      if (clienteSelecionado) {
        saidasFiltradas = saidasFiltradas.filter((saida: any) => saidasFiltradas.nome_cliente === clienteSelecionado);
      }
      
      const valor = saidasFiltradas.reduce((total: number, item: any) => total + parseFloat(item.valor), 0);
      return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } else {
      let servicosFiltrados = data.servicos?.filter((item: any) => item.cancelada !== "S") || [];
      
      if (clienteSelecionado) {
        servicosFiltrados = servicosFiltrados.filter((servico: any) => servico.nome_cliente === clienteSelecionado);
      }
      
      const valor = servicosFiltrados.reduce((total: number, item: any) => total + parseFloat(item.valor), 0);
      return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
  };

  // Calcula o número de clientes únicos para um KPI específico
  const getNumeroClientesUnicos = (kpi: string, data: any): string => {
    if (!data) return "0";

    try {
      const clientesUnicos = new Set<string>();

      switch (kpi) {
        case "Vendas de Produtos":
          // Apenas saídas não canceladas
          if (data.saidas && Array.isArray(data.saidas)) {
            let saidasValidas = data.saidas.filter((saida: SaidaData) => saida.cancelada !== "S");
            
            // Filtrar por cliente específico se selecionado
            if (clienteSelecionado) {
              saidasValidas = saidasValidas.filter((saida: SaidaData) => saida.nome_cliente === clienteSelecionado);
            }
            
            saidasValidas.forEach((saida: SaidaData) => {
              clientesUnicos.add(saida.nome_cliente);
            });
          }
          break;

        case "Serviços Prestados":
          // Apenas serviços não cancelados
          if (data.servicos && Array.isArray(data.servicos)) {
            let servicosValidos = data.servicos.filter((servico: ServicoData) => servico.cancelada !== "S");
            
            // Filtrar por cliente específico se selecionado
            if (clienteSelecionado) {
              servicosValidos = servicosValidos.filter((servico: ServicoData) => servico.nome_cliente === clienteSelecionado);
            }
            
            servicosValidos.forEach((servico: ServicoData) => {
              clientesUnicos.add(servico.nome_cliente);
            });
          }
          break;

        case "Receita Bruta Total":
          // Saídas + Serviços não cancelados
          if (data.saidas && Array.isArray(data.saidas)) {
            let saidasValidas = data.saidas.filter((saida: SaidaData) => saida.cancelada !== "S");
            
            if (clienteSelecionado) {
              saidasValidas = saidasValidas.filter((saida: SaidaData) => saida.nome_cliente === clienteSelecionado);
            }
            
            saidasValidas.forEach((saida: SaidaData) => {
              clientesUnicos.add(saida.nome_cliente);
            });
          }
          if (data.servicos && Array.isArray(data.servicos)) {
            let servicosValidos = data.servicos.filter((servico: ServicoData) => servico.cancelada !== "S");
            
            if (clienteSelecionado) {
              servicosValidos = servicosValidos.filter((servico: ServicoData) => servico.nome_cliente === clienteSelecionado);
            }
            
            servicosValidos.forEach((servico: ServicoData) => {
              clientesUnicos.add(servico.nome_cliente);
            });
          }
          break;

        default:
          return "0";
      }

      return clientesUnicos.size.toLocaleString();

    } catch (error) {
      console.error("Erro ao calcular clientes únicos:", error);
      return "0";
    }
  };

  // Calcula o valor total cancelado de produtos (saídas canceladas)
  const getValorCanceladoProdutos = (data: any): string => {
    if (!data || !data.saidas || !Array.isArray(data.saidas)) return "R$ 0,00";
    
    try {
      let saidasCanceladas = data.saidas.filter((saida: SaidaData) => saida.cancelada === "S");
      
      // Filtrar por cliente específico se selecionado
      if (clienteSelecionado) {
        saidasCanceladas = saidasCanceladas.filter((saida: SaidaData) => saida.nome_cliente === clienteSelecionado);
      }
      
      const total = saidasCanceladas.reduce((acc: number, saida: SaidaData) => acc + parseFloat(saida.valor || "0"), 0);
      
      return "R$ " + total.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } catch (error) {
      console.error("Erro ao calcular valor cancelado de produtos:", error);
      return "R$ 0,00";
    }
  };

  // Calcula o valor total cancelado de serviços (serviços cancelados)
  const getValorCanceladoServicos = (data: any): string => {
    if (!data || !data.servicos || !Array.isArray(data.servicos)) return "R$ 0,00";
    
    try {
      let servicosCancelados = data.servicos.filter((servico: ServicoData) => servico.cancelada === "S");
      
      // Filtrar por cliente específico se selecionado
      if (clienteSelecionado) {
        servicosCancelados = servicosCancelados.filter((servico: ServicoData) => servico.nome_cliente === clienteSelecionado);
      }
      
      const total = servicosCancelados.reduce((acc: number, servico: ServicoData) => acc + parseFloat(servico.valor || "0"), 0);
      
      return "R$ " + total.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } catch (error) {
      console.error("Erro ao calcular valor cancelado de serviços:", error);
      return "R$ 0,00";
    }
  };

  // Calcula o cancelamento médio para o KPI "Cancelamentos de Receita"
  const getCancelamentoMedio = (data: any): string => {
    if (!data) return "R$ 0,00";
    
    try {
      let canceladasSaidas = data.saidas?.filter((item: any) => item.cancelada === "S") || [];
      let canceladasServicos = data.servicos?.filter((item: any) => item.cancelada === "S") || [];
      
      if (clienteSelecionado) {
        canceladasSaidas = canceladasSaidas.filter((saida: any) => saida.nome_cliente === clienteSelecionado);
        canceladasServicos = canceladasServicos.filter((servico: any) => servico.nome_cliente === clienteSelecionado);
      }
      
      const valorTotal = canceladasSaidas.reduce((total: number, item: any) => total + parseFloat(item.valor), 0) +
                        canceladasServicos.reduce((total: number, item: any) => total + parseFloat(item.valor), 0);
      const quantidade = canceladasSaidas.length + canceladasServicos.length;
      
      if (quantidade === 0) return "R$ 0,00";
      
      const cancelamentoMedio = valorTotal / quantidade;
      return "R$ " + cancelamentoMedio.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } catch (error) {
      console.error("Erro ao calcular cancelamento médio:", error);
      return "R$ 0,00";
    }
  };

  // Calcula o mix de cancelamentos entre produtos e serviços
  const getMixCancelamentos = (data: any): string => {
    if (!data) return "0% Produtos | 0% Serviços";
    
    try {
      let canceladasSaidas = data.saidas?.filter((item: any) => item.cancelada === "S") || [];
      let canceladasServicos = data.servicos?.filter((item: any) => item.cancelada === "S") || [];
      
      if (clienteSelecionado) {
        canceladasSaidas = canceladasSaidas.filter((saida: any) => saida.nome_cliente === clienteSelecionado);
        canceladasServicos = canceladasServicos.filter((servico: any) => servico.nome_cliente === clienteSelecionado);
      }
      
      const valorSaidas = canceladasSaidas.reduce((total: number, item: any) => total + parseFloat(item.valor), 0);
      const valorServicos = canceladasServicos.reduce((total: number, item: any) => total + parseFloat(item.valor), 0);
      const valorTotal = valorSaidas + valorServicos;
      
      if (valorTotal === 0) return "0% Produtos | 0% Serviços";
      
      const percentualProdutos = Math.round((valorSaidas / valorTotal) * 100);
      const percentualServicos = Math.round((valorServicos / valorTotal) * 100);
      
      return `${percentualProdutos}% Produtos | ${percentualServicos}% Serviços`;
    } catch (error) {
      console.error("Erro ao calcular mix de cancelamentos:", error);
      return "0% Produtos | 0% Serviços";
    }
  };

  // Encontra o cliente com maior valor total de cancelamentos
  const getTopClientePorCancelamento = (data: any): string => {
    if (!data) return "Nenhum cliente";
    
    try {
      const cancelamentosPorCliente: { [cliente: string]: number } = {};
      
      // Processar saídas canceladas
      const saidasCanceladas = data.saidas?.filter((item: any) => item.cancelada === "S") || [];
      saidasCanceladas.forEach((saida: any) => {
        const cliente = saida.nome_cliente;
        cancelamentosPorCliente[cliente] = (cancelamentosPorCliente[cliente] || 0) + parseFloat(saida.valor);
      });
      
      // Processar serviços cancelados
      const servicosCancelados = data.servicos?.filter((item: any) => item.cancelada === "S") || [];
      servicosCancelados.forEach((servico: any) => {
        const cliente = servico.nome_cliente;
        cancelamentosPorCliente[cliente] = (cancelamentosPorCliente[cliente] || 0) + parseFloat(servico.valor);
      });
      
      // Se um cliente específico está selecionado, retornar apenas esse cliente
      if (clienteSelecionado && cancelamentosPorCliente[clienteSelecionado]) {
        return clienteSelecionado;
      }
      
      // Encontrar o cliente com maior valor total
      const clientes = Object.keys(cancelamentosPorCliente);
      if (clientes.length === 0) return "Nenhum cliente";
      
      const topCliente = clientes.reduce((top, cliente) => 
        cancelamentosPorCliente[cliente] > cancelamentosPorCliente[top] ? cliente : top
      );
      
      return topCliente;
    } catch (error) {
      console.error("Erro ao calcular top cliente por cancelamento:", error);
      return "Erro no cálculo";
    }
  };

  // Função auxiliar: Número de Fornecedores Únicos (NOVA - Diversificação)
  const getNumeroFornecedoresUnicos = (data: any): string => {
    if (!data || !data.entradas || !Array.isArray(data.entradas)) {
      return "0";
    }

    try {
      let entradasValidas = data.entradas;
      
      // Filtrar por fornecedor específico se selecionado
      if (clienteSelecionado) {
        entradasValidas = entradasValidas.filter((entrada: EntradaData) => entrada.nome_fornecedor === clienteSelecionado);
      }
      
      const fornecedoresUnicos = new Set(entradasValidas.map((entrada: EntradaData) => entrada.nome_fornecedor));
      return fornecedoresUnicos.size.toString();
    } catch (error) {
      console.error("Erro ao calcular número de fornecedores únicos:", error);
      return "0";
    }
  };

  // Função auxiliar: % do Fornecedor Selecionado (NOVA - Dependência)
  const getPercentualFornecedorSelecionado = (data: any): string => {
    if (!data || !data.entradas || !Array.isArray(data.entradas) || !clienteSelecionado) {
      return "0%";
    }

    try {
      const totalGeral = data.entradas.reduce((acc: number, entrada: EntradaData) => acc + parseFloat(entrada.valor || "0"), 0);
      
      if (totalGeral === 0) return "0%";
      
      const totalFornecedor = data.entradas
        .filter((entrada: EntradaData) => entrada.nome_fornecedor === clienteSelecionado)
        .reduce((acc: number, entrada: EntradaData) => acc + parseFloat(entrada.valor || "0"), 0);
      
      const percentual = (totalFornecedor / totalGeral) * 100;
      return `${percentual.toFixed(1)}%`;
    } catch (error) {
      console.error("Erro ao calcular percentual do fornecedor:", error);
      return "0%";
    }
  };

  // Função auxiliar: % Top Fornecedor (quando nenhum fornecedor específico selecionado)
  const getPercentualTopFornecedor = (data: any): string => {
    if (!data || !data.entradas || !Array.isArray(data.entradas)) {
      return "0%";
    }

    try {
      const totalGeral = data.entradas.reduce((acc: number, entrada: EntradaData) => acc + parseFloat(entrada.valor || "0"), 0);
      
      if (totalGeral === 0) return "0%";
      
      // Agrupar por fornecedor e calcular totais
      const fornecedorTotais = data.entradas.reduce((acc: { [key: string]: number }, entrada: EntradaData) => {
        const fornecedor = entrada.nome_fornecedor;
        acc[fornecedor] = (acc[fornecedor] || 0) + parseFloat(entrada.valor || "0");
        return acc;
      }, {});
      
      // Encontrar o fornecedor com maior valor
      const valores = Object.values(fornecedorTotais) as number[];
      const maiorValor = Math.max(...valores);
      const percentual = (maiorValor / totalGeral) * 100;
      
      return `${percentual.toFixed(1)}%`;
    } catch (error) {
      console.error("Erro ao calcular percentual do top fornecedor:", error);
      return "0%";
    }
  };

  // Função auxiliar: Maior Compra Individual (NOVA - Controle de Outliers)
  const getMaiorCompraIndividual = (data: any): string => {
    if (!data || !data.entradas || !Array.isArray(data.entradas)) {
      return "R$ 0,00";
    }

    try {
      let entradasValidas = data.entradas;
      
      // Filtrar por fornecedor específico se selecionado
      if (clienteSelecionado) {
        entradasValidas = entradasValidas.filter((entrada: EntradaData) => entrada.nome_fornecedor === clienteSelecionado);
      }
      
      if (entradasValidas.length === 0) return "R$ 0,00";
      
      const maiorValor = Math.max(...entradasValidas.map((entrada: EntradaData) => parseFloat(entrada.valor || "0")));
      return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL',
        minimumFractionDigits: 2 
      }).format(maiorValor);
    } catch (error) {
      console.error("Erro ao calcular maior compra individual:", error);
      return "R$ 0,00";
    }
  };

  const handleMaximizeTopProdutos = () => {
    // Função para maximizar o card TOP 100 Produtos / Serviços (a ser implementada)
  };

  const handleMaximizeTopClientesFornecedores = () => {
    // Função para maximizar o card TOP 100 Clientes / Fornecedores (a ser implementada)
  };

  const handleMaximizeValorPorLocal = () => {
    // Função para maximizar o card Valor por Local (a ser implementada)
  };

  // Filtrar cards baseado no KPI selecionado - Nova Arquitetura Fiscal
  const getCardsData = () => {
    const faturamentoCardInfo = getFaturamentoCardInfo(kpiSelecionado);
    
    // Estrutura específica para cada KPI, focando apenas em métricas calculáveis
    switch (kpiSelecionado) {
      case "Receita Bruta Total":
        const mixReceita = getMixReceita(data);
        return [
          { 
            title: "Receita Bruta Total", 
            value: getFaturamentoValue(kpiSelecionado, data), 
            tooltipText: "Valor total da receita (produtos + serviços) no período selecionado." 
          },
          { 
            title: "Ticket Médio", 
            value: getTicketMedio(kpiSelecionado, data), 
            tooltipText: "Valor médio por transação de receita (Total ÷ Nº de transações)." 
          },
          { 
            title: "Nº de Transações", 
            value: getNumeroTransacoes(kpiSelecionado, data), 
            tooltipText: "Quantidade total de notas de venda e serviços emitidas." 
          },
          { 
            title: "Mix de Receita", 
            value: `${mixReceita.produtos}% Produtos | ${mixReceita.servicos}% Serviços`, 
            tooltipText: "Composição percentual da receita entre produtos e serviços." 
          },
          { 
            title: "Vendas de Produtos", 
            value: getValorComponenteReceita('produtos', data), 
            tooltipText: "Valor total das vendas de produtos (componente da receita bruta)." 
          },
          { 
            title: "Serviços Prestados", 
            value: getValorComponenteReceita('servicos', data), 
            tooltipText: "Valor total dos serviços prestados (componente da receita bruta)." 
          }
        ];

      case "Vendas de Produtos":
        // Hierarquia Fiscal Recomendada - 6 Cards em linha única
        // Linha 1: Performance da Operação (O Sucesso)
        // Linha 2: Contexto Estratégico e Saúde do Processo
        return [
          { 
            title: "Vendas de Produtos", 
            value: getFaturamentoValue(kpiSelecionado, data), 
            tooltipText: "Valor total das vendas de produtos no período." 
          },
          { 
            title: "Ticket Médio", 
            value: getTicketMedio(kpiSelecionado, data), 
            tooltipText: "Valor médio por nota de venda de produto." 
          },
          { 
            title: "Nº de Notas", 
            value: getNumeroTransacoes(kpiSelecionado, data), 
            tooltipText: "Quantidade de notas fiscais de venda emitidas." 
          },
          { 
            title: "% da Receita Total", 
            value: `${getMixReceita(data).produtos}%`, 
            tooltipText: "Percentual que as vendas de produtos representam da receita total." 
          },
          { 
            title: "Nº de Clientes Únicos", 
            value: getNumeroClientesUnicos(kpiSelecionado, data), 
            tooltipText: "Quantidade de clientes distintos que compraram produtos no período." 
          },
          { 
            title: "Valor Cancelado", 
            value: getValorCanceladoProdutos(data), 
            tooltipText: "Valor total das notas de venda de produtos canceladas." 
          }
        ];

      case "Serviços Prestados":
        // Hierarquia Fiscal Recomendada - 6 Cards em linha única
        // Linha 1: Performance da Operação (O Sucesso)
        // Linha 2: Contexto Estratégico e Saúde do Processo
        return [
          { 
            title: "Serviços Prestados", 
            value: getFaturamentoValue(kpiSelecionado, data), 
            tooltipText: "Valor total dos serviços prestados no período." 
          },
          { 
            title: "Ticket Médio", 
            value: getTicketMedio(kpiSelecionado, data), 
            tooltipText: "Valor médio por nota de serviço prestado." 
          },
          { 
            title: "Nº de Notas", 
            value: getNumeroTransacoes(kpiSelecionado, data), 
            tooltipText: "Quantidade de notas fiscais de serviço emitidas." 
          },
          { 
            title: "% da Receita Total", 
            value: `${getMixReceita(data).servicos}%`, 
            tooltipText: "Percentual que os serviços representam da receita total." 
          },
          { 
            title: "Nº de Clientes Únicos", 
            value: getNumeroClientesUnicos(kpiSelecionado, data), 
            tooltipText: "Quantidade de clientes distintos que contrataram serviços no período." 
          },
          { 
            title: "Valor Cancelado", 
            value: getValorCanceladoServicos(data), 
            tooltipText: "Valor total das notas de serviço que foram canceladas." 
          }
        ];

      case "Compras e Aquisições":
        // Hierarquia Fiscal Estratégica - 6 Cards: Performance + Análise de Risco
        // Linha 1: Performance da Operação de Compras (Total, Eficiência, Volume)
        // Linha 2: Análise Estratégica de Fornecedores e Controle de Risco
        return [
          { 
            title: "Compras e Aquisições", 
            value: getFaturamentoValue(kpiSelecionado, data), 
            tooltipText: "Valor total das compras e aquisições no período." 
          },
          { 
            title: "Compra Média", 
            value: getTicketMedio(kpiSelecionado, data), 
            tooltipText: "Valor médio por nota de entrada/compra." 
          },
          { 
            title: "Nº de Notas", 
            value: getNumeroTransacoes(kpiSelecionado, data), 
            tooltipText: "Quantidade de notas fiscais de entrada recebidas." 
          },
          { 
            title: "Nº de Fornecedores Únicos", 
            value: getNumeroFornecedoresUnicos(data), 
            tooltipText: "Quantidade de fornecedores distintos dos quais a empresa comprou no período. Maior diversificação = menor risco." 
          },
          { 
            title: clienteSelecionado ? "% do Fornecedor Selecionado" : "% Top Fornecedor", 
            value: clienteSelecionado ? getPercentualFornecedorSelecionado(data) : getPercentualTopFornecedor(data), 
            tooltipText: clienteSelecionado 
              ? "Percentual que as compras deste fornecedor representam do total. Mede dependência e risco de concentração." 
              : "Percentual que o maior fornecedor representa no total de compras. Indica nível de concentração e dependência."
          },
          { 
            title: "Maior Compra Individual", 
            value: getMaiorCompraIndividual(data), 
            tooltipText: "Valor da maior nota fiscal de entrada individual. Útil para identificar outliers, grandes projetos ou possíveis erros." 
          }
        ];

      case "Cancelamentos de Receita":
        return [
          { 
            title: "Valor Cancelado", 
            value: getFaturamentoValue(kpiSelecionado, data), 
            tooltipText: "Valor total das receitas canceladas (produtos + serviços)." 
          },
          { 
            title: "Cancelamento Médio", 
            value: getCancelamentoMedio(data), 
            tooltipText: "Valor médio por nota fiscal cancelada." 
          },
          { 
            title: "Nº de Cancelamentos", 
            value: getNumeroTransacoes(kpiSelecionado, data), 
            tooltipText: "Quantidade total de cancelamentos de receita." 
          },
          { 
            title: "% da Receita Bruta", 
            value: getPercentualCancelamentos(data), 
            tooltipText: "Percentual que os cancelamentos representam sobre a receita bruta total." 
          },
          { 
            title: "Mix de Cancelamentos", 
            value: getMixCancelamentos(data), 
            tooltipText: "Composição percentual dos cancelamentos entre produtos e serviços." 
          },
          { 
            title: "Top Cliente por Cancelamento", 
            value: getTopClientePorCancelamento(data), 
            tooltipText: "Cliente que acumulou o maior valor em cancelamentos de receita no período." 
          }
        ];

      default:
        return [];
    }
  };

  const cardsData = getCardsData();

  // 📊 FUNÇÃO: Gerar dados de evolução baseados nos dados reais da API
  const generateEvolucaoData = (kpi: string, data: any, startDate: string | null, endDate: string | null) => {
    if (!data || !startDate || !endDate) {
      return [];
    }

    try {
      // Mapa para agrupar valores por mês/ano
      const monthlyData = new Map<string, number>();
      
      // Converter datas de filtro para objetos Date (sem timezone issues)
      const startDateTime = new Date(startDate + 'T00:00:00');
      const endDateTime = new Date(endDate + 'T23:59:59');
      
      // Função helper para processar uma transação
      const processTransaction = (item: any, value: number) => {
        if (!item.data) return;
        
        // Parse da data da transação (assumindo formato YYYY-MM-DD ou similar)
        let transactionDate: Date;
        
        try {
          // Normalizar a data da transação para início do dia
          if (typeof item.data === 'string') {
            // Se é string no formato YYYY-MM-DD
            if (item.data.includes('-')) {
              transactionDate = new Date(item.data + 'T00:00:00');
            } else {
              // Outros formatos
              transactionDate = new Date(item.data);
              transactionDate.setHours(0, 0, 0, 0);
            }
          } else {
            // Se já é um objeto Date
            transactionDate = new Date(item.data);
            transactionDate.setHours(0, 0, 0, 0);
          }
        } catch (error) {
          return;
        }
        
        if (isNaN(transactionDate.getTime())) {
          return;
        }
        
        // Verificar se a transação está dentro do período selecionado
        if (transactionDate < startDateTime || transactionDate > endDateTime) {
          return;
        }
        
        // Gerar chave no formato "Jan/2024"
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const monthKey = `${monthNames[transactionDate.getMonth()]}/${transactionDate.getFullYear()}`;
        
        // Acumular valor
        monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + value);
      };

      // Processar dados conforme o KPI selecionado
      switch (kpi) {
        case "Receita Bruta Total":
          // Saídas não canceladas
          if (data.saidas && Array.isArray(data.saidas)) {
            let saidasValidas = data.saidas.filter((saida: SaidaData) => saida.cancelada === "N");
            
            if (clienteSelecionado) {
              saidasValidas = saidasValidas.filter((saida: SaidaData) => saida.nome_cliente === clienteSelecionado);
            }
            
            saidasValidas.forEach((saida: SaidaData) => {
              processTransaction(saida, parseFloat(saida.valor || "0"));
            });
          }
          
          // Serviços não cancelados
          if (data.servicos && Array.isArray(data.servicos)) {
            let servicosValidos = data.servicos.filter((servico: ServicoData) => servico.cancelada === "N");
            
            if (clienteSelecionado) {
              servicosValidos = servicosValidos.filter((servico: ServicoData) => servico.nome_cliente === clienteSelecionado);
            }
            
            servicosValidos.forEach((servico: ServicoData) => {
              processTransaction(servico, parseFloat(servico.valor || "0"));
            });
          }
          break;

        case "Vendas de Produtos":
          if (data.saidas && Array.isArray(data.saidas)) {
            let saidasValidas = data.saidas.filter((saida: SaidaData) => saida.cancelada === "N");
            
            if (clienteSelecionado) {
              saidasValidas = saidasValidas.filter((saida: SaidaData) => saida.nome_cliente === clienteSelecionado);
            }
            
            saidasValidas.forEach((saida: SaidaData) => {
              processTransaction(saida, parseFloat(saida.valor || "0"));
            });
          }
          break;

        case "Serviços Prestados":
          if (data.servicos && Array.isArray(data.servicos)) {
            let servicosValidos = data.servicos.filter((servico: ServicoData) => servico.cancelada === "N");
            
            if (clienteSelecionado) {
              servicosValidos = servicosValidos.filter((servico: ServicoData) => servico.nome_cliente === clienteSelecionado);
            }
            
            servicosValidos.forEach((servico: ServicoData) => {
              processTransaction(servico, parseFloat(servico.valor || "0"));
            });
          }
          break;

        case "Compras e Aquisições":
          if (data.entradas && Array.isArray(data.entradas)) {
            let entradasValidas = data.entradas;
            
            if (clienteSelecionado) {
              entradasValidas = entradasValidas.filter((entrada: EntradaData) => entrada.nome_fornecedor === clienteSelecionado);
            }
            
            entradasValidas.forEach((entrada: EntradaData) => {
              processTransaction(entrada, parseFloat(entrada.valor || "0"));
            });
          }
          break;

        case "Cancelamentos de Receita":
          // Saídas canceladas
          if (data.saidas && Array.isArray(data.saidas)) {
            let saidasCanceladas = data.saidas.filter((saida: SaidaData) => saida.cancelada === "S");
            
            if (clienteSelecionado) {
              saidasCanceladas = saidasCanceladas.filter((saida: SaidaData) => saida.nome_cliente === clienteSelecionado);
            }
            
            saidasCanceladas.forEach((saida: SaidaData) => {
              processTransaction(saida, parseFloat(saida.valor || "0"));
            });
          }
          
          // Serviços cancelados
          if (data.servicos && Array.isArray(data.servicos)) {
            let servicosCancelados = data.servicos.filter((servico: ServicoData) => servico.cancelada === "S");
            
            if (clienteSelecionado) {
              servicosCancelados = servicosCancelados.filter((servico: ServicoData) => servico.nome_cliente === clienteSelecionado);
            }
            
            servicosCancelados.forEach((servico: ServicoData) => {
              processTransaction(servico, parseFloat(servico.valor || "0"));
            });
          }
          break;

        default:
          return [];
      }

      // Converter Map para array e ordenar por data
      const sortedData = Array.from(monthlyData.entries())
        .map(([month, value]) => ({
          month,
          value
        }))
        .sort((a, b) => {
          // Ordenar por data
          const parseMonth = (monthStr: string) => {
            const [month, year] = monthStr.split('/');
            const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
            const monthIndex = monthNames.indexOf(month.toLowerCase());
            return new Date(parseInt(year), monthIndex);
          };
          
          return parseMonth(a.month).getTime() - parseMonth(b.month).getTime();
        });

      return sortedData;

    } catch (error) {
      return [];
    }
  };

  // Dados para o gráfico de evolução - agora dinâmicos baseados na API
  const evolucaoData = generateEvolucaoData(kpiSelecionado, data, startDate, endDate);

  // 📊 FALLBACK: Se não há dados, mostrar dados de exemplo ou placeholder
  const evolucaoDataWithFallback = evolucaoData.length > 0 
    ? evolucaoData 
    : (!startDate || !endDate) 
      ? [
          { month: "Selecione um período", value: 0 }
        ]
      : [
          { month: "Sem dados", value: 0 }
        ];

  // ⚠️ DADOS INDISPONÍVEIS: TOP 100 Produtos/Serviços
  // O card foi desabilitado por não termos dados específicos de produtos/serviços individuais
  // Mantemos a consistência com o dropdown "Produto" que também está desabilitado pela mesma razão
  // Os dados disponíveis agrupam por nome_empresa, não por produto/serviço específico
  
  // Dados para o segundo card de barra de progresso - "TOP 100 Clientes / Fornecedores"
  // Agora dinâmico baseado nos dados reais da API e KPI selecionado
  const topClientesFornecedoresData = data
    ? (() => {
        try {
          const entidadesMap = new Map<string, number>();
          
          // Definir quais dados processar baseado no KPI
          const incluirClientes = ["Receita Bruta Total", "Vendas de Produtos", "Serviços Prestados", "Cancelamentos de Receita"].includes(kpiSelecionado);
          const incluirFornecedores = ["Compras e Aquisições"].includes(kpiSelecionado);
          
          // Processar Clientes (saídas e serviços)
          if (incluirClientes) {
            let dadosClientes: any[] = [];
            
            if (kpiSelecionado === "Receita Bruta Total") {
              // Combinar saídas e serviços não cancelados
              const saidasValidas = (data as any).saidas?.filter((item: SaidaData) => item.cancelada !== "S") || [];
              const servicosValidos = (data as any).servicos?.filter((item: ServicoData) => item.cancelada !== "S") || [];
              dadosClientes = [...saidasValidas, ...servicosValidos];
            } else if (kpiSelecionado === "Vendas de Produtos") {
              // Apenas saídas não canceladas
              dadosClientes = (data as any).saidas?.filter((item: SaidaData) => item.cancelada !== "S") || [];
            } else if (kpiSelecionado === "Serviços Prestados") {
              // Apenas serviços não cancelados
              dadosClientes = (data as any).servicos?.filter((item: ServicoData) => item.cancelada !== "S") || [];
            } else if (kpiSelecionado === "Cancelamentos de Receita") {
              // Combinar saídas e serviços cancelados
              const saidasCanceladas = (data as any).saidas?.filter((item: SaidaData) => item.cancelada === "S") || [];
              const servicosCancelados = (data as any).servicos?.filter((item: ServicoData) => item.cancelada === "S") || [];
              dadosClientes = [...saidasCanceladas, ...servicosCancelados];
            }
            
            // Filtrar por cliente selecionado se houver
            if (clienteSelecionado) {
              dadosClientes = dadosClientes.filter((item: any) => item.nome_cliente === clienteSelecionado);
            }
            
            // Agrupar por cliente
            dadosClientes.forEach((item: any) => {
              const nomeCliente = item.nome_cliente || "Cliente não informado";
              const valor = parseFloat(item.valor || "0");
              
              if (entidadesMap.has(nomeCliente)) {
                entidadesMap.set(nomeCliente, entidadesMap.get(nomeCliente)! + valor);
              } else {
                entidadesMap.set(nomeCliente, valor);
              }
            });
            
          }
          
          // Processar Fornecedores (entradas)
          if (incluirFornecedores) {
            const entradasValidas = (data as any).entradas || [];
            
            // Filtrar por fornecedor selecionado se houver
            let dadosFornecedores = clienteSelecionado 
              ? entradasValidas.filter((entrada: any) => entrada.nome_fornecedor === clienteSelecionado)
              : entradasValidas;
            
            // Agrupar por fornecedor
            dadosFornecedores.forEach((entrada: any) => {
              const nomeFornecedor = entrada.nome_fornecedor || "Fornecedor não informado";
              const valor = parseFloat(entrada.valor || "0");
              
              if (entidadesMap.has(nomeFornecedor)) {
                entidadesMap.set(nomeFornecedor, entidadesMap.get(nomeFornecedor)! + valor);
              } else {
                entidadesMap.set(nomeFornecedor, valor);
              }
            });
            
          }
          
          // Calcular total geral para percentuais
          const totalGeral = Array.from(entidadesMap.values()).reduce((sum, valor) => sum + valor, 0);
          
          // Converter para array e ordenar por valor (maior para menor)
          const resultado = Array.from(entidadesMap.entries())
            .map(([nome, valor]) => ({
              name: nome,
              value: new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL',
                minimumFractionDigits: 2 
              }).format(valor),
              numericValue: valor,
              percentage: totalGeral > 0 ? Math.round((valor / totalGeral) * 1000) / 10 : 0,
              rank: 0
            }))
            .sort((a, b) => b.numericValue - a.numericValue)
            .slice(0, 100)
            .map((item, index) => ({
              ...item,
              rank: index + 1
            }));
          
          return resultado;
        } catch (error) {
          console.error("Erro ao processar ranking de clientes/fornecedores:", error);
          return [];
        }
      })()
    : [
      // Dados de fallback quando não há dados da API
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
          
          {/* KPIs - 2 linhas seguindo hierarquia fiscal: Receita → Componentes → Custos → Exceções */}
          <div className="flex flex-col gap-2 ml-auto">
            {/* Linha 1: Receita Total e seus Componentes */}
            <div className="flex items-center gap-4">
              {["Receita Bruta Total", "Vendas de Produtos", "Serviços Prestados"].map((kpi) => (
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
            {/* Linha 2: Custos e Exceções */}
            <div className="flex items-center gap-4">
              {["Compras e Aquisições", "Cancelamentos de Receita"].map((kpi) => (
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
              {/* Botão vazio para manter o layout */}
              <div className="w-[220px]"></div>
            </div>
          </div>
        </div>
        
        {/* Filtros principais e Calendário */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <SmartDropdown
                options={getDropdownOptions()}
                label={labelClienteFornecedor}
                widthClass="w-72"
                selectedValue={clienteSelecionado}
                onValueChange={setClienteSelecionado}
                isOpen={openDropdown === 'cliente'}
                onToggle={() => handleToggleDropdown('cliente')}
                areDatesSelected={startDate !== null && endDate !== null}
                virtualizationThreshold={50}
            />
            <SmartDropdown
                options={produtoOptions}
                label="Produto"
                widthClass="w-72"
                selectedValue={produtoSelecionado}
                onValueChange={setProdutoSelecionado}
                isOpen={openDropdown === 'produto'}
                onToggle={() => handleToggleDropdown('produto')}
                disabled={true}
                areDatesSelected={startDate !== null && endDate !== null}
                virtualizationThreshold={50}
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
            data={evolucaoDataWithFallback}
            onMaximize={handleMaximizeEvolucao}
          />
        </div>

        {/* Novos Cards com Barras de Progresso - 2 por linha */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Card TOP 100 Produtos/Serviços - Desabilitado por falta de dados específicos */}
          <div className="w-full bg-gray-100 rounded-lg shadow-md relative overflow-hidden h-[400px] opacity-60">
            {/* Barra vertical ao lado do título - cinza para indicar desabilitado */}
            <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-gray-400 outline-1 outline-offset-[-0.50px] outline-gray-500"></div>
            
            {/* Header com título e ícone de maximizar desabilitado */}
            <div className="flex justify-between items-start pt-[14px] px-5 mb-3 flex-shrink-0">
              <div className="flex-grow overflow-hidden mr-3">
                <div title={getTopProdutosServicosTitle(kpiSelecionado)} className={`text-gray-500 text-xl font-semibold leading-normal ${cairo.className} whitespace-nowrap overflow-hidden text-ellipsis`}>
                  {getTopProdutosServicosTitle(kpiSelecionado)}
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <div className="p-1 cursor-not-allowed">
                  <Image
                    src="/assets/icons/icon-maximize.svg"
                    alt="Maximize (Indisponível)"
                    width={16}
                    height={16}
                    className="opacity-30"
                  />
                </div>
              </div>
            </div>

            {/* Conteúdo indicando indisponibilidade */}
            <div className="absolute inset-x-0 top-[70px] bottom-0 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">📦</div>
                <div className={`text-gray-600 text-lg font-semibold mb-2 ${cairo.className}`}>
                  Dados Indisponíveis
                </div>
                <div className={`text-gray-500 text-sm leading-relaxed ${cairo.className} max-w-xs`}>
                  Ranking de produtos e serviços específicos não disponível.
                  <br/>
                  Utilize o TOP 100 {labelClienteFornecedorPlural} ao lado para análises detalhadas.
                </div>
                <div className="mt-4 inline-flex items-center gap-2 text-xs text-gray-400">
                  <Image
                    src="/assets/icons/icon-question-mark.svg"
                    alt="Info"
                    width={12}
                    height={12}
                    className="opacity-50"
                  />
                  Mesma razão do dropdown "Produto" estar desabilitado
                </div>
              </div>
            </div>
          </div>

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
            data={data}
            kpiSelecionado={kpiSelecionado}
            startDate={startDate}
            endDate={endDate}
            onMaximize={handleMaximizeValorPorLocal}
          />
        </div>
        
        {/* Toast de feedback UX */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
            duration={3000}
          />
        )}
        </div>
      </div>
  );
}