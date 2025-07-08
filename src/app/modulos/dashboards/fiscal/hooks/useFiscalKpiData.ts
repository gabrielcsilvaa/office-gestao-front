import { useState, useEffect } from 'react';

/**
 * Hook para dados fiscais KPI (DADOS REAIS - SEMPRE ESTRATÉGICOS)
 * 
 * CARACTERÍSTICAS:
 * - Processa dataset completo (81MB) para garantir precisão
 * - Roda em background sem bloquear a interface
 * - Tempo: ~22 segundos (dados reais têm seu custo)
 * - Valor: 100% estratégico e confiável
 * 
 * STRATEGY: Este hook mantém a qualidade dos dados enquanto
 * outros componentes (gráficos) usam dados otimizados para UX
 */

interface FiscalKpiParams {
  startDate: string | null;
  endDate: string | null;
}

interface FiscalKpiData {
  entradas: any[];
  saidas: any[];
  servicos: any[];
  [key: string]: any;
}

export const useFiscalKpiData = ({ startDate, endDate }: FiscalKpiParams) => {
  const [data, setData] = useState<FiscalKpiData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fornecedorOptions, setFornecedorOptions] = useState<string[]>([]);
  const [clienteOptions, setClienteOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchKpiData = async () => {
      if (!startDate || !endDate) return;

      setLoading(true);
      setError(null);
      
      try {
        console.log('🔢 Carregando dados reais para KPIs...');
        const startTime = performance.now();
        
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

        const endTime = performance.now();
        console.log(`✅ KPIs reais calculados em ${Math.round(endTime - startTime)}ms`);
        console.log(`📊 Dados processados: ${result.entradas?.length || 0} entradas, ${result.saidas?.length || 0} saídas, ${result.servicos?.length || 0} serviços`);

        setData(result);

        // Extrair fornecedores únicos dos dados de entradas
        if (result.entradas && Array.isArray(result.entradas)) {
          const fornecedoresUnicos = Array.from(
            new Set(
              result.entradas.map((entrada: any) => entrada.nome_fornecedor)
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
            .filter((servico: any) => servico.cancelada === "N")
            .forEach((servico: any) => {
              clientesSet.add(servico.nome_cliente);
            });
        }
        
        // Adicionar clientes das saídas (apenas os não cancelados)
        if (result.saidas && Array.isArray(result.saidas)) {
          result.saidas
            .filter((saida: any) => saida.cancelada === "N")
            .forEach((saida: any) => {
              clientesSet.add(saida.nome_cliente);
            });
        }

        const clientesUnicos = Array.from(clientesSet).sort();
        setClienteOptions(clientesUnicos);

      } catch (error) {
        console.error("Erro ao buscar dados KPI:", error);
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchKpiData();
  }, [startDate, endDate]);

  return {
    data,
    loading,
    error,
    fornecedorOptions,
    clienteOptions
  };
};
