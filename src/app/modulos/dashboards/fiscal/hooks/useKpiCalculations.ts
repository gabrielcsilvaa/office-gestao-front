/**
 * HOOK UNIFICADO PARA CÁLCULOS DE KPIs
 * 
 * Este hook centraliza todos os cálculos e processamentos de KPIs,
 * eliminando a necessidade de múltiplas funções dispersas no componente.
 */

"use client";
import { useMemo } from 'react';
import { DashboardData, KpiType } from '../types';
import { processarKpi, processarMixReceita, processarCancelamentos, validarDadosProcessados, gerarResumoExecutivo } from '../utils/kpiProcessor';

// ========================================
// HOOK PRINCIPAL
// ========================================

/**
 * Hook principal para todos os cálculos de KPIs
 * @param data Dados completos do dashboard
 * @param kpiType Tipo do KPI selecionado
 * @param clienteFornecedorSelecionado Cliente/fornecedor selecionado
 * @returns Objeto com todos os dados processados e memoizados
 */
export const useKpiCalculations = (
  data: DashboardData | null,
  kpiType: KpiType,
  clienteFornecedorSelecionado: string = ""
) => {
  
  /**
   * Processa dados principais do KPI com memoização
   */
  const dadosKpi = useMemo(() => {
    if (!data) {
      return {
        metricas: {
          valorTotal: 0,
          ticketMedio: 0,
          quantidadeTransacoes: 0,
          clientesUnicos: 0
        },
        cardsData: [],
        topData: [],
        evolucaoData: [],
        config: null,
        dadosOriginais: []
      };
    }
    
    return processarKpi(data, kpiType, clienteFornecedorSelecionado);
  }, [data, kpiType, clienteFornecedorSelecionado]);
  
  /**
   * Processa mix de receita com memoização
   */
  const mixReceita = useMemo(() => {
    return processarMixReceita(data, clienteFornecedorSelecionado);
  }, [data, clienteFornecedorSelecionado]);
  
  /**
   * Processa dados de cancelamentos com memoização
   */
  const cancelamentos = useMemo(() => {
    return processarCancelamentos(data, clienteFornecedorSelecionado);
  }, [data, clienteFornecedorSelecionado]);
  
  /**
   * Valida consistência dos dados processados
   */
  const isValido = useMemo(() => {
    return data && dadosKpi.config ? validarDadosProcessados(dadosKpi as any) : true;
  }, [dadosKpi, data]);
  
  /**
   * Gera resumo executivo dos dados
   */
  const resumo = useMemo(() => {
    return dadosKpi.config ? gerarResumoExecutivo(dadosKpi as any) : null;
  }, [dadosKpi]);
  
  /**
   * Verifica se há dados disponíveis
   */
  const temDados = useMemo(() => {
    return dadosKpi.metricas.quantidadeTransacoes > 0;
  }, [dadosKpi.metricas.quantidadeTransacoes]);
  
  /**
   * Estado de loading simulado baseado na presença de dados
   */
  const isLoading = useMemo(() => {
    return data === null;
  }, [data]);
  
  return {
    // Dados principais do KPI
    valorTotal: dadosKpi.metricas.valorTotal,
    ticketMedio: dadosKpi.metricas.ticketMedio,
    quantidadeTransacoes: dadosKpi.metricas.quantidadeTransacoes,
    clientesUnicos: dadosKpi.metricas.clientesUnicos,
    
    // Dados para componentes
    cardsData: dadosKpi.cardsData,
    topData: dadosKpi.topData,
    evolucaoData: dadosKpi.evolucaoData,
    
    // Mix de receita
    mixReceita,
    
    // Cancelamentos
    cancelamentos,
    
    // Metadados
    config: dadosKpi.config,
    resumo,
    
    // Estados
    temDados,
    isLoading,
    isValido,
    
    // Dados brutos (para casos especiais)
    dadosOriginais: dadosKpi.dadosOriginais
  };
};

// ========================================
// HOOKS ESPECIALIZADOS
// ========================================

/**
 * Hook especializado apenas para cards KPI
 * @param data Dados completos do dashboard
 * @param kpiType Tipo do KPI selecionado
 * @param clienteFornecedorSelecionado Cliente/fornecedor selecionado
 * @returns Dados memoizados apenas para os cards
 */
export const useKpiCards = (
  data: DashboardData | null,
  kpiType: KpiType,
  clienteFornecedorSelecionado: string = ""
) => {
  return useMemo(() => {
    if (!data) return [];
    
    const dadosProcessados = processarKpi(data, kpiType, clienteFornecedorSelecionado);
    return dadosProcessados.cardsData;
  }, [data, kpiType, clienteFornecedorSelecionado]);
};

/**
 * Hook especializado apenas para TOP 100
 * @param data Dados completos do dashboard
 * @param kpiType Tipo do KPI selecionado
 * @param clienteFornecedorSelecionado Cliente/fornecedor selecionado
 * @returns Dados memoizados apenas para o TOP 100
 */
export const useTop100Data = (
  data: DashboardData | null,
  kpiType: KpiType,
  clienteFornecedorSelecionado: string = ""
) => {
  return useMemo(() => {
    if (!data) return [];
    
    const dadosProcessados = processarKpi(data, kpiType, clienteFornecedorSelecionado);
    return dadosProcessados.topData;
  }, [data, kpiType, clienteFornecedorSelecionado]);
};

/**
 * Hook especializado apenas para evolução temporal
 * @param data Dados completos do dashboard
 * @param kpiType Tipo do KPI selecionado
 * @param clienteFornecedorSelecionado Cliente/fornecedor selecionado
 * @returns Dados memoizados apenas para evolução
 */
export const useEvolucaoData = (
  data: DashboardData | null,
  kpiType: KpiType,
  clienteFornecedorSelecionado: string = ""
) => {
  return useMemo(() => {
    if (!data) return [];
    
    const dadosProcessados = processarKpi(data, kpiType, clienteFornecedorSelecionado);
    return dadosProcessados.evolucaoData;
  }, [data, kpiType, clienteFornecedorSelecionado]);
};

/**
 * Hook especializado para mix de receita
 * @param data Dados completos do dashboard
 * @param clienteSelecionado Cliente selecionado
 * @returns Dados memoizados do mix de receita
 */
export const useMixReceita = (
  data: DashboardData | null,
  clienteSelecionado: string = ""
) => {
  return useMemo(() => {
    return processarMixReceita(data, clienteSelecionado);
  }, [data, clienteSelecionado]);
};

/**
 * Hook especializado para dados de cancelamentos
 * @param data Dados completos do dashboard
 * @param clienteSelecionado Cliente selecionado
 * @returns Dados memoizados de cancelamentos
 */
export const useCancelamentos = (
  data: DashboardData | null,
  clienteSelecionado: string = ""
) => {
  return useMemo(() => {
    return processarCancelamentos(data, clienteSelecionado);
  }, [data, clienteSelecionado]);
};

// ========================================
// HOOKS UTILITÁRIOS
// ========================================

/**
 * Hook para comparar KPIs
 * @param data Dados completos do dashboard
 * @param kpi1 Primeiro KPI para comparação
 * @param kpi2 Segundo KPI para comparação
 * @param clienteFornecedorSelecionado Cliente/fornecedor selecionado
 * @returns Dados comparativos entre os KPIs
 */
export const useComparacaoKpis = (
  data: DashboardData | null,
  kpi1: KpiType,
  kpi2: KpiType,
  clienteFornecedorSelecionado: string = ""
) => {
  return useMemo(() => {
    if (!data) {
      return {
        kpi1: { valorTotal: 0, quantidadeTransacoes: 0 },
        kpi2: { valorTotal: 0, quantidadeTransacoes: 0 },
        diferenca: { valor: 0, percentual: 0 }
      };
    }
    
    const dados1 = processarKpi(data, kpi1, clienteFornecedorSelecionado);
    const dados2 = processarKpi(data, kpi2, clienteFornecedorSelecionado);
    
    const diferencaValor = dados1.metricas.valorTotal - dados2.metricas.valorTotal;
    const diferencaPercentual = dados2.metricas.valorTotal !== 0 
      ? (diferencaValor / dados2.metricas.valorTotal) * 100 
      : 0;
    
    return {
      kpi1: {
        valorTotal: dados1.metricas.valorTotal,
        quantidadeTransacoes: dados1.metricas.quantidadeTransacoes
      },
      kpi2: {
        valorTotal: dados2.metricas.valorTotal,
        quantidadeTransacoes: dados2.metricas.quantidadeTransacoes
      },
      diferenca: {
        valor: diferencaValor,
        percentual: diferencaPercentual
      }
    };
  }, [data, kpi1, kpi2, clienteFornecedorSelecionado]);
};

/**
 * Hook para estatísticas gerais do dashboard
 * @param data Dados completos do dashboard
 * @param clienteFornecedorSelecionado Cliente/fornecedor selecionado
 * @returns Estatísticas gerais memoizadas
 */
export const useEstatisticasGerais = (
  data: DashboardData | null,
  clienteFornecedorSelecionado: string = ""
) => {
  return useMemo(() => {
    if (!data) {
      return {
        totalReceitas: 0,
        totalCancelamentos: 0,
        totalCompras: 0,
        mixReceita: { produtos: 0, servicos: 0 },
        taxaCancelamento: 0
      };
    }
    
    const receitas = processarKpi(data, KpiType.RECEITA_BRUTA_TOTAL, clienteFornecedorSelecionado);
    const cancelamentos = processarKpi(data, KpiType.CANCELAMENTOS_RECEITA, clienteFornecedorSelecionado);
    const compras = processarKpi(data, KpiType.COMPRAS_AQUISICOES, clienteFornecedorSelecionado);
    const mix = processarMixReceita(data, clienteFornecedorSelecionado);
    const dadosCancelamentos = processarCancelamentos(data, clienteFornecedorSelecionado);
    
    return {
      totalReceitas: receitas.metricas.valorTotal,
      totalCancelamentos: cancelamentos.metricas.valorTotal,
      totalCompras: compras.metricas.valorTotal,
      mixReceita: {
        produtos: mix.produtos.percentual,
        servicos: mix.servicos.percentual
      },
      taxaCancelamento: dadosCancelamentos.percentualNumerico
    };
  }, [data, clienteFornecedorSelecionado]);
};
