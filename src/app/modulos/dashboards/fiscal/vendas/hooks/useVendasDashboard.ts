/**
 * HOOKS PARA DASHBOARD DE VENDAS
 * 
 * Hooks customizados para gerenciar estado e cálculos do dashboard de vendas
 */

import { useState, useMemo } from 'react';
import {
  VendaProcessada,
  RankingProduto,
  RankingCliente,
  DadosGeograficos,
  DadosSazonalidade,
  MetricasAvancadas,
  DashboardVendasData,
  VendasKpiType,
  PeriodoAnalise,
  FiltrosVendas,
  SaidaDataExtendida
} from '../types';

import {
  processarDadosVendas
} from '../utils/vendasProcessor';

/**
 * Hook principal para dados do dashboard de vendas
 */
export const useVendasDashboard = (
  saidasData: SaidaDataExtendida[],
  filtros: FiltrosVendas = {}
) => {
  const [loading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Processa dados de vendas com memoização
  const vendasProcessadas = useMemo(() => {
    if (!saidasData || saidasData.length === 0) {
      console.log('📊 useVendasDashboard: Nenhum dado de saída fornecido');
      return [];
    }
    
    try {
      console.log(`📊 useVendasDashboard: Processando ${saidasData.length} registros de saída`);
      let vendas = processarDadosVendas(saidasData);
      console.log(`📊 useVendasDashboard: ${vendas.length} vendas processadas`);
      
      return vendas;
    } catch (err) {
      console.error('❌ Erro ao processar dados de vendas:', err);
      setError('Erro ao processar dados de vendas');
      return [];
    }
  }, [saidasData, filtros]);

  // Calcula métricas derivadas
  const dashboardData = useMemo((): DashboardVendasData => {
    if (vendasProcessadas.length === 0) {
      console.log('📊 useVendasDashboard: Retornando dados vazios');
      return {
        vendas: [],
        rankingProdutos: [],
        rankingClientes: [],
        dadosGeograficos: [],
        sazonalidade: [],
        metricas: {
          crescimentoMensal: 0,
          crescimentoAnual: 0,
          concentracaoClientes: 0,
          diversificacaoProdutos: 0,
          ticketMedioTendencia: 'estavel' as const,
          sazonalidadeIndex: 0,
          recorrencia: 0
        },
        totalVendas: 0,
        totalQuantidade: 0,
        ticketMedio: 0,
        numeroClientes: 0,
        numeroProdutos: 0
      };
    }

    try {
      // Cálculos básicos
      const totalVendas = vendasProcessadas.reduce((sum, v) => sum + (v.valor || 0), 0);
      const totalQuantidade = vendasProcessadas.reduce((sum, v) => sum + (v.quantidade || 0), 0);
      const ticketMedio = vendasProcessadas.length > 0 ? totalVendas / vendasProcessadas.length : 0;
      const numeroClientes = new Set(vendasProcessadas.map(v => v.cliente)).size;
      const numeroProdutos = new Set(vendasProcessadas.map(v => v.produto)).size;

      console.log('📊 Dados calculados:', {
        totalVendas,
        totalQuantidade,
        ticketMedio,
        numeroClientes,
        numeroProdutos
      });

      return {
        vendas: vendasProcessadas,
        rankingProdutos: [],
        rankingClientes: [],
        dadosGeograficos: [],
        sazonalidade: [],
        metricas: {
          crescimentoMensal: 0,
          crescimentoAnual: 0,
          concentracaoClientes: 0,
          diversificacaoProdutos: 0,
          ticketMedioTendencia: 'estavel' as const,
          sazonalidadeIndex: 0,
          recorrencia: 0
        },
        totalVendas,
        totalQuantidade,
        ticketMedio,
        numeroClientes,
        numeroProdutos
      };
    } catch (err) {
      console.error('❌ Erro ao calcular métricas do dashboard:', err);
      return {
        vendas: [],
        rankingProdutos: [],
        rankingClientes: [],
        dadosGeograficos: [],
        sazonalidade: [],
        metricas: {
          crescimentoMensal: 0,
          crescimentoAnual: 0,
          concentracaoClientes: 0,
          diversificacaoProdutos: 0,
          ticketMedioTendencia: 'estavel' as const,
          sazonalidadeIndex: 0,
          recorrencia: 0
        },
        totalVendas: 0,
        totalQuantidade: 0,
        ticketMedio: 0,
        numeroClientes: 0,
        numeroProdutos: 0
      };
    }
  }, [vendasProcessadas]);

  return {
    data: dashboardData,
    loading,
    error,
    isEmpty: vendasProcessadas.length === 0
  };
};

/**
 * Hook para calcular KPI específico
 */
export const useVendasKpi = (
  vendasData: DashboardVendasData,
  kpiType: VendasKpiType
) => {
  return useMemo(() => {
    if (!vendasData || vendasData.vendas.length === 0) {
      return {
        valor: 0,
        crescimento: 0,
        tendencia: 'estavel' as const,
        dados: null
      };
    }

    switch (kpiType) {
      case VendasKpiType.VENDAS_TOTAIS:
        return {
          valor: vendasData.totalVendas,
          crescimento: vendasData.metricas.crescimentoMensal,
          tendencia: 'estavel' as const,
          dados: vendasData.vendas
        };

      case VendasKpiType.TICKET_MEDIO_VENDAS:
        return {
          valor: vendasData.ticketMedio,
          crescimento: vendasData.metricas.crescimentoMensal,
          tendencia: 'estavel' as const,
          dados: vendasData.vendas
        };

      case VendasKpiType.QUANTIDADE_VENDIDA:
        return {
          valor: vendasData.totalQuantidade,
          crescimento: 0,
          tendencia: 'estavel' as const,
          dados: vendasData.vendas
        };

      case VendasKpiType.VENDAS_POR_PRODUTO:
        return {
          valor: vendasData.rankingProdutos.length,
          crescimento: 0,
          tendencia: 'estavel' as const,
          dados: vendasData.rankingProdutos
        };

      case VendasKpiType.VENDAS_POR_CLIENTE:
        return {
          valor: vendasData.numeroClientes,
          crescimento: 0,
          tendencia: 'estavel' as const,
          dados: vendasData.rankingClientes
        };

      case VendasKpiType.CONCENTRACAO_GEOGRAFICA:
        return {
          valor: vendasData.metricas.concentracaoClientes,
          crescimento: 0,
          tendencia: 'estavel' as const,
          dados: vendasData.dadosGeograficos
        };

      case VendasKpiType.SAZONALIDADE:
        return {
          valor: 0,
          crescimento: 0,
          tendencia: 'estavel' as const,
          dados: vendasData.sazonalidade
        };

      default:
        return {
          valor: 0,
          crescimento: 0,
          tendencia: 'estavel' as const,
          dados: null
        };
    }
  }, [vendasData, kpiType]);
};

/**
 * Hook para filtros de vendas
 */
export const useFiltrosVendas = () => {
  const [filtros, setFiltros] = useState<FiltrosVendas>({});

  const atualizarFiltro = (key: keyof FiltrosVendas, value: any) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const limparFiltros = () => {
    setFiltros({});
  };

  const temFiltrosAtivos = () => {
    return Object.keys(filtros).length > 0;
  };

  return {
    filtros,
    atualizarFiltro,
    limparFiltros,
    temFiltrosAtivos
  };
};
