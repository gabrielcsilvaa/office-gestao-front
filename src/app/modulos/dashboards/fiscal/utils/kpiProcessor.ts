/**
 * PROCESSADOR UNIFICADO DE KPIs
 * 
 * Este arquivo centraliza todo o processamento de KPIs, eliminando a necessidade
 * de múltiplas funções com switch cases duplicados.
 */

import { DashboardData, KpiType, CardDataItem, ProgressBarItem, EvolucaoDataPoint } from '../types';
import { calcularMetricasKpi, calcularMixReceita, calcularPercentualCancelamentos, contarClientesUnicos, formatarMoeda, formatarNumero, formatarPercentual } from './calculations';
import { aplicarFiltrosCompletos } from './dataFilters';
import { getKpiConfig } from './kpiUtils';

// ========================================
// PROCESSADOR PRINCIPAL DE KPIs
// ========================================

/**
 * Processa todos os dados necessários para um KPI específico
 * @param data Dados completos do dashboard
 * @param kpiType Tipo do KPI
 * @param clienteFornecedorSelecionado Cliente/fornecedor selecionado
 * @returns Objeto com todos os dados processados para o KPI
 */
export const processarKpi = (
  data: DashboardData | null,
  kpiType: KpiType,
  clienteFornecedorSelecionado: string = ""
) => {
  // Calcula métricas básicas
  const metricas = calcularMetricasKpi(data, kpiType, clienteFornecedorSelecionado);
  const config = getKpiConfig(kpiType);
  
  // Gera dados para os cards KPI
  const cardsData = gerarCardsDataUnificado(metricas, kpiType, config.label);
  
  // Gera dados para TOP 100
  const topData = gerarTop100Unificado(metricas.dadosFiltrados, kpiType);
  
  // Gera dados de evolução
  const evolucaoData = gerarEvolucaoUnificado(metricas.dadosOriginais as any);
  
  // Calcula clientes únicos
  const clientesUnicos = contarClientesUnicos(data, kpiType, clienteFornecedorSelecionado);
  
  return {
    metricas: {
      valorTotal: metricas.valorTotal,
      ticketMedio: metricas.ticketMedio,
      quantidadeTransacoes: metricas.quantidadeTransacoes,
      clientesUnicos
    },
    cardsData,
    topData,
    evolucaoData,
    config,
    dadosOriginais: metricas.dadosOriginais
  };
};

// ========================================
// GERADORES DE DADOS PARA COMPONENTES
// ========================================

/**
 * Gera dados unificados para os cards KPI
 * @param metricas Métricas calculadas
 * @param kpiType Tipo do KPI
 * @param kpiLabel Label do KPI
 * @returns Array de dados para os cards
 */
const gerarCardsDataUnificado = (
  metricas: ReturnType<typeof calcularMetricasKpi>,
  kpiType: KpiType,
  kpiLabel: string
): CardDataItem[] => {
  
  const { valorTotal, ticketMedio, quantidadeTransacoes } = metricas;
  
  // Determina o título e tooltip baseado no KPI
  const getTituloTooltip = (kpi: KpiType) => {
    switch (kpi) {
      case KpiType.VENDAS_PRODUTOS:
      case KpiType.SERVICOS_PRESTADOS:
      case KpiType.RECEITA_BRUTA_TOTAL:
        return {
          titulo: "Receita Bruta",
          tooltip: "Total de receitas brutas no período analisado."
        };
      
      case KpiType.COMPRAS_AQUISICOES:
        return {
          titulo: "Total de Gastos",
          tooltip: "Total de gastos com fornecedores no período."
        };
      
      case KpiType.CANCELAMENTOS_RECEITA:
        return {
          titulo: "Valor Cancelado",
          tooltip: "Total de valores de receitas canceladas (produtos + serviços)."
        };
      
      default:
        return {
          titulo: "Receita Bruta",
          tooltip: "Total de receitas brutas no período analisado."
        };
    }
  };
  
  const { titulo, tooltip } = getTituloTooltip(kpiType);
  
  return [
    {
      title: titulo,
      value: formatarMoeda(valorTotal),
      tooltipText: tooltip
    },
    {
      title: "Ticket Médio",
      value: formatarMoeda(ticketMedio),
      tooltipText: "Valor médio por transação no período selecionado."
    },
    {
      title: "Nº de Transações",
      value: formatarNumero(quantidadeTransacoes),
      tooltipText: "Quantidade total de transações no período."
    }
  ];
};

/**
 * Gera dados unificados para o TOP 100
 * @param dadosFiltrados Dados filtrados pelos filtros aplicados
 * @param kpiType Tipo do KPI
 * @returns Array de dados para o TOP 100
 */
const gerarTop100Unificado = (
  dadosFiltrados: ReturnType<typeof aplicarFiltrosCompletos>,
  kpiType: KpiType
): ProgressBarItem[] => {
  
  let dadosParaAgrupamento: Array<{ nome_cliente?: string; nome_fornecedor?: string; valor: string }> = [];
  
  // Determina quais dados usar baseado no KPI
  switch (kpiType) {
    case KpiType.VENDAS_PRODUTOS:
      dadosParaAgrupamento = dadosFiltrados.saidas;
      break;
      
    case KpiType.SERVICOS_PRESTADOS:
      dadosParaAgrupamento = dadosFiltrados.servicos;
      break;
      
    case KpiType.RECEITA_BRUTA_TOTAL:
    case KpiType.CANCELAMENTOS_RECEITA:
      dadosParaAgrupamento = [...dadosFiltrados.saidas, ...dadosFiltrados.servicos];
      break;
      
    case KpiType.COMPRAS_AQUISICOES:
      dadosParaAgrupamento = dadosFiltrados.entradas;
      break;
  }
  
  // Agrupa por cliente/fornecedor
  const agrupado = dadosParaAgrupamento.reduce((acc, item) => {
    const nome = kpiType === KpiType.COMPRAS_AQUISICOES 
      ? item.nome_fornecedor || 'Fornecedor não identificado'
      : item.nome_cliente || 'Cliente não identificado';
    
    const valor = parseFloat(item.valor) || 0;
    
    if (!acc[nome]) {
      acc[nome] = 0;
    }
    acc[nome] += valor;
    
    return acc;
  }, {} as Record<string, number>);
  
  // Converte para array e ordena
  const items = Object.entries(agrupado)
    .map(([nome, valor]) => ({ nome, valor }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 100); // TOP 100
  
  // Calcula percentuais
  const maiorValor = items[0]?.valor || 1;
  
  return items.map(item => ({
    name: item.nome,
    value: item.valor,
    percentage: (item.valor / maiorValor) * 100
  }));
};

/**
 * Gera dados unificados para evolução temporal
 * @param dadosOriginais Dados originais filtrados
 * @returns Array de pontos de evolução
 */
const gerarEvolucaoUnificado = (
  dadosOriginais: Array<{ data: string; valor: string }>
): EvolucaoDataPoint[] => {
  
  if (!dadosOriginais || dadosOriginais.length === 0) return [];
  
  // Agrupa por data
  const agrupado = dadosOriginais.reduce((acc, item) => {
    const data = item.data;
    const valor = parseFloat(item.valor) || 0;
    
    if (!acc[data]) {
      acc[data] = 0;
    }
    acc[data] += valor;
    
    return acc;
  }, {} as Record<string, number>);
  
  // Converte para array e ordena
  return Object.entries(agrupado)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// ========================================
// PROCESSADORES ESPECIALIZADOS
// ========================================

/**
 * Processa dados específicos para mix de receita
 * @param data Dados completos do dashboard
 * @param clienteSelecionado Cliente selecionado
 * @returns Dados formatados do mix de receita
 */
export const processarMixReceita = (
  data: DashboardData | null,
  clienteSelecionado: string = ""
) => {
  const mixData = calcularMixReceita(data, clienteSelecionado);
  
  return {
    produtos: {
      percentual: mixData.produtos.percentual,
      valor: formatarMoeda(mixData.produtos.valor),
      valorNumerico: mixData.produtos.valor
    },
    servicos: {
      percentual: mixData.servicos.percentual,
      valor: formatarMoeda(mixData.servicos.valor),
      valorNumerico: mixData.servicos.valor
    },
    total: {
      valor: formatarMoeda(mixData.total),
      valorNumerico: mixData.total
    }
  };
};

/**
 * Processa dados de cancelamentos
 * @param data Dados completos do dashboard
 * @param clienteSelecionado Cliente selecionado
 * @returns Dados formatados de cancelamentos
 */
export const processarCancelamentos = (
  data: DashboardData | null,
  clienteSelecionado: string = ""
) => {
  const percentual = calcularPercentualCancelamentos(data, clienteSelecionado);
  const metricas = calcularMetricasKpi(data, KpiType.CANCELAMENTOS_RECEITA, clienteSelecionado);
  
  return {
    percentual: formatarPercentual(percentual),
    percentualNumerico: percentual,
    valor: formatarMoeda(metricas.valorTotal),
    valorNumerico: metricas.valorTotal,
    quantidade: formatarNumero(metricas.quantidadeTransacoes),
    quantidadeNumerica: metricas.quantidadeTransacoes
  };
};

// ========================================
// UTILITÁRIOS DE SUPORTE
// ========================================

/**
 * Valida se os dados processados estão consistentes
 * @param dadosProcessados Resultado do processamento
 * @returns true se os dados estão válidos
 */
export const validarDadosProcessados = (dadosProcessados: ReturnType<typeof processarKpi>): boolean => {
  const { metricas, cardsData, topData } = dadosProcessados;
  
  // Validações básicas
  if (metricas.valorTotal < 0) return false;
  if (metricas.quantidadeTransacoes < 0) return false;
  if (cardsData.length !== 3) return false;
  if (!Array.isArray(topData)) return false;
  
  return true;
};

/**
 * Gera resumo executivo dos dados processados
 * @param dadosProcessados Resultado do processamento
 * @returns Objeto com resumo dos dados
 */
export const gerarResumoExecutivo = (dadosProcessados: ReturnType<typeof processarKpi>) => {
  const { metricas, config } = dadosProcessados;
  
  return {
    kpi: config.label,
    valorTotal: formatarMoeda(metricas.valorTotal),
    ticketMedio: formatarMoeda(metricas.ticketMedio),
    transacoes: formatarNumero(metricas.quantidadeTransacoes),
    clientesUnicos: formatarNumero(metricas.clientesUnicos),
    temDados: metricas.quantidadeTransacoes > 0
  };
};
