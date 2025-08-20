/**
 * HOOK CUSTOMIZADO PARA DADOS FISCAIS
 * 
 * Este hook centraliza toda a lógica de busca, processamento e cache
 * dos dados fiscais, fornecendo uma interface limpa para os componentes.
 */

"use client";
import { useState, useEffect, useCallback } from 'react';
import { 
  DashboardData, 
  KpiType, 
  FiscalDataParams, 
  UseFiscalDataReturn,
  ToastData 
} from '../types';

/**
 * Hook principal para gerenciamento de dados fiscais
 * 
 * @param params - Parâmetros de filtro para busca dos dados
 * @returns Objeto com dados, estados de loading/error e função de refetch
 */
export const useFiscalData = (params: FiscalDataParams): UseFiscalDataReturn => {
  // Estados internos do hook
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Função para buscar dados da API
   */
  const fetchData = useCallback(async () => {
    if (!params.startDate || !params.endDate) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Constrói a URL da API baseada no tipo de KPI
      const apiUrl = getApiUrlForKpi(params.kpiType);
      
      // Parâmetros da query
      const queryParams = new URLSearchParams({
        start_date: params.startDate,
        end_date: params.endDate
      });

      // Adiciona cliente selecionado se fornecido
      if (params.clienteSelecionado) {
        queryParams.append('cliente', params.clienteSelecionado);
      }

      const response = await fetch(`${apiUrl}?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      // Valida e processa os dados recebidos
      const processedData = processApiResponse(result, params.kpiType);
      setData(processedData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar dados';
      setError(errorMessage);
      console.error('Erro ao buscar dados fiscais:', err);
    } finally {
      setLoading(false);
    }
  }, [params.startDate, params.endDate, params.clienteSelecionado, params.kpiType]);

  /**
   * Função de refetch para recarregar dados
   */
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Effect para buscar dados quando os parâmetros mudarem
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch
  };
};

/**
 * Hook para gerenciar opções de dropdown (clientes/fornecedores)
 */
export const useDropdownOptions = (data: DashboardData | null, kpiType: KpiType) => {
  const [clienteOptions, setClienteOptions] = useState<string[]>([]);
  const [fornecedorOptions, setFornecedorOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!data) {
      setClienteOptions([]);
      setFornecedorOptions([]);
      return;
    }

    // Extrai opções baseadas no tipo de KPI
    if (kpiType === KpiType.COMPRAS_AQUISICOES) {
      // Para compras, extrair fornecedores
      const fornecedores = data.entradas?.map(item => item.nome_fornecedor).filter(Boolean) || [];
      const uniqueFornecedores = Array.from(new Set(fornecedores)).sort();
      setFornecedorOptions(uniqueFornecedores);
      setClienteOptions([]);
    } else {
      // Para vendas/serviços, extrair clientes
      const sourceData = kpiType === KpiType.SERVICOS_PRESTADOS ? data.servicos : data.saidas;
      const clientes = sourceData?.map(item => (item as any).nome_cliente).filter(Boolean) || [];
      const uniqueClientes = Array.from(new Set(clientes)).sort();
      setClienteOptions(uniqueClientes);
      setFornecedorOptions([]);
    }
  }, [data, kpiType]);

  return {
    clienteOptions,
    fornecedorOptions
  };
};

/**
 * Hook para gerenciar toasts de feedback
 */
export const useToast = () => {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (message: string, type: ToastData['type'] = 'info') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  return {
    toast,
    showToast,
    hideToast
  };
};

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

/**
 * Retorna a URL da API baseada no tipo de KPI
 */
const getApiUrlForKpi = (kpiType: KpiType): string => {
  switch (kpiType) {
    case KpiType.RECEITA_BRUTA_TOTAL:
      return '/api/dashboard-fiscal';
    case KpiType.VENDAS_PRODUTOS:
      return '/api/dashboard-fiscal';
    case KpiType.SERVICOS_PRESTADOS:
      return '/api/dashboard-fiscal';
    case KpiType.COMPRAS_AQUISICOES:
      return '/api/dashboard-fiscal';
    case KpiType.CANCELAMENTOS_RECEITA:
      return '/api/dashboard-fiscal';
    default:
      return '/api/dashboard-fiscal';
  }
};

/**
 * Processa a resposta da API e a adequa ao formato esperado
 */
const processApiResponse = (response: any, kpiType: KpiType): DashboardData => {
  // Validação básica da resposta
  if (!response || typeof response !== 'object') {
    return {};
  }

  // Estrutura esperada da resposta da API
  const processedData: DashboardData = {};

  // Processa cada tipo de dado se estiver presente
  if (response.saidas && Array.isArray(response.saidas)) {
    processedData.saidas = response.saidas;
  }

  if (response.servicos && Array.isArray(response.servicos)) {
    processedData.servicos = response.servicos;
  }

  if (response.entradas && Array.isArray(response.entradas)) {
    processedData.entradas = response.entradas;
  }

  return processedData;
};

/**
 * Hook para gerenciar estado de filtros
 */
export const useFiltros = () => {
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [kpiSelecionado, setKpiSelecionado] = useState<KpiType>(KpiType.RECEITA_BRUTA_TOTAL);

  const resetFiltros = () => {
    setClienteSelecionado("");
    setStartDate(null);
    setEndDate(null);
    setKpiSelecionado(KpiType.RECEITA_BRUTA_TOTAL);
  };

  return {
    filtros: {
      clienteSelecionado,
      startDate,
      endDate,
      kpiSelecionado
    },
    setClienteSelecionado,
    setStartDate,
    setEndDate,
    setKpiSelecionado,
    resetFiltros
  };
};
