"use client";
import { useState, useEffect, useMemo } from 'react';

interface FiscalKpis {
  receita_bruta_total: string;
  ticket_medio: string;
  total_transacoes: string;
  numero_clientes_unicos: string;
  valor_cancelado: string;
  percentual_cancelamentos: string;
  mix_receita_produtos: number;
  mix_receita_servicos: number;
  // Adicionar mais KPIs conforme necessário
}

interface FiscalCharts {
  evolucao_mensal: Array<{
    month: string;
    value: number;
  }>;
  top_clientes: Array<{
    name: string;
    value: string;
    numericValue: number;
    percentage: number;
    rank: number;
  }>;
  top_produtos: Array<{
    name: string;
    value: string;
    numericValue: number;
    percentage: number;
    rank: number;
  }>;
}

interface FiscalAggregatedData {
  kpis: FiscalKpis;
  charts: FiscalCharts;
  metadata: {
    total_records_processed: number;
    calculation_time_ms: number;
    cache_used: boolean;
  };
}

interface UseFiscalDataProps {
  startDate: string | null;
  endDate: string | null;
  kpiSelecionado: string;
  clienteSelecionado: string;
}

// Cache simples no localStorage
const CACHE_PREFIX = 'fiscal_cache_';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

const getCacheKey = (startDate: string, endDate: string, kpiType: string, cliente: string) => {
  return `${CACHE_PREFIX}${startDate}_${endDate}_${kpiType}_${cliente}`;
};

const getFromCache = (key: string): FiscalAggregatedData | null => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    // Verificar se não expirou
    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    
    return data;
  } catch {
    return null;
  }
};

const setCache = (key: string, data: FiscalAggregatedData) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch {
    // Se der erro no localStorage, simplesmente ignora
  }
};

export const useFiscalOptimizedData = ({ 
  startDate, 
  endDate, 
  kpiSelecionado, 
  clienteSelecionado 
}: UseFiscalDataProps) => {
  const [data, setData] = useState<FiscalAggregatedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chave de cache baseada nos parâmetros
  const cacheKey = useMemo(() => {
    if (!startDate || !endDate) return null;
    return getCacheKey(startDate, endDate, kpiSelecionado, clienteSelecionado);
  }, [startDate, endDate, kpiSelecionado, clienteSelecionado]);

  // Dados mockados para simular a resposta otimizada do backend
  const getMockOptimizedData = (): FiscalAggregatedData => {
    const baseValues = {
      "Receita Bruta Total": {
        receita_bruta_total: "R$ 166.752.838,30",
        ticket_medio: "R$ 8.652,41",
        total_transacoes: "19.274",
        numero_clientes_unicos: "3.847",
      },
      "Vendas de Produtos": {
        receita_bruta_total: "R$ 115.439.645,23",
        ticket_medio: "R$ 5.970,12",
        total_transacoes: "19.340",
        numero_clientes_unicos: "2.156",
      },
      "Serviços Prestados": {
        receita_bruta_total: "R$ 51.313.193,07",
        ticket_medio: "R$ 12.250,89",
        total_transacoes: "4.188",
        numero_clientes_unicos: "1.691",
      },
      "Compras e Aquisições": {
        receita_bruta_total: "R$ 89.127.456,78",
        ticket_medio: "R$ 4.567,23",
        total_transacoes: "19.512",
        numero_clientes_unicos: "567",
      },
      "Cancelamentos de Receita": {
        receita_bruta_total: "R$ 8.337.642,15",
        ticket_medio: "R$ 2.234,67",
        total_transacoes: "3.732",
        numero_clientes_unicos: "892",
      }
    };

    const currentKpiData = baseValues[kpiSelecionado as keyof typeof baseValues] || baseValues["Receita Bruta Total"];

    return {
      kpis: {
        ...currentKpiData,
        valor_cancelado: "R$ 8.337.642,15",
        percentual_cancelamentos: "4,8%",
        mix_receita_produtos: 69,
        mix_receita_servicos: 31,
      },
      charts: {
        evolucao_mensal: [
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
        ],
        top_clientes: [
          { name: "YAMAHA MOTOR DA AMAZONIA LTDA", value: "R$ 21.068.918,95", numericValue: 21068918.95, percentage: 14.5, rank: 1 },
          { name: "VIBRA ENERGIA S.A", value: "R$ 20.507.156,97", numericValue: 20507156.97, percentage: 14.1, rank: 2 },
          { name: "F DINARTE IND E COM DE CONFEC", value: "R$ 19.127.937,07", numericValue: 19127937.07, percentage: 13.2, rank: 3 },
          { name: "DINART IND E COM DE CONFECCOES LTDA", value: "R$ 14.073.792,88", numericValue: 14073792.88, percentage: 9.7, rank: 4 },
          { name: "TICKET SERVIÇOS SA", value: "R$ 13.703.588,36", numericValue: 13703588.36, percentage: 9.4, rank: 5 }
        ],
        top_produtos: [
          { name: "Produto não informado", value: "R$ 115.439.645,23", numericValue: 115439645.23, percentage: 69.2, rank: 1 },
          { name: "SERVIÇOS TOMADOS (2)", value: "R$ 11.213.561,10", numericValue: 11213561.10, percentage: 6.7, rank: 2 },
          { name: "VASILHAME VAZIO P13 (2)", value: "R$ 6.496.853,83", numericValue: 6496853.83, percentage: 3.9, rank: 3 },
          { name: "COTTON ALQUIMIA MENEGOTTI", value: "R$ 4.694.056,41", numericValue: 4694056.41, percentage: 2.8, rank: 4 },
          { name: "GASOLINA C COMUM (101001)", value: "R$ 4.492.489,40", numericValue: 4492489.40, percentage: 2.7, rank: 5 }
        ]
      },
      metadata: {
        total_records_processed: 245780, // Simula muitos registros processados
        calculation_time_ms: 45, // Simula processamento rápido no backend
        cache_used: false
      }
    };
  };

  const fetchData = async () => {
    if (!startDate || !endDate || !cacheKey) return;

    // Verificar cache primeiro
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      console.log('📋 Dados carregados do cache');
      // Marcar como cache usado
      cachedData.metadata.cache_used = true;
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Simulando dados otimizados (mock)...');
      const startTime = performance.now();

      // Simular delay de rede (muito menor que os 22 segundos originais!)
      await new Promise(resolve => setTimeout(resolve, 300));

      const result = getMockOptimizedData();
      const endTime = performance.now();

      console.log(`⚡ Dados mockados carregados em ${(endTime - startTime).toFixed(2)}ms`);
      console.log('📊 Performance simulada:', {
        'Registros processados': result.metadata.total_records_processed.toLocaleString(),
        'Tempo de cálculo (backend)': `${result.metadata.calculation_time_ms}ms`,
        'Tempo total (rede + processamento)': `${(endTime - startTime).toFixed(2)}ms`
      });
      
      // Salvar no cache
      setCache(cacheKey, result);
      setData(result);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('❌ Erro ao carregar dados fiscais:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, kpiSelecionado, clienteSelecionado]);

  // Função para limpar cache (útil para debugging)
  const clearCache = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    console.log('🗑️ Cache fiscal limpo');
  };

  return {
    data,
    loading,
    error,
    clearCache,
    refetch: fetchData
  };
};
