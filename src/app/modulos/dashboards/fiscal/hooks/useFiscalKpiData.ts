import { useState, useEffect } from 'react';


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

interface MapaRaiosData {
  [uf: string]: {
    valorTotal: number;
    valorSaidas: number;
    valorServicos: number;
    percentualDoTotal: number;
    raioSize: number; // Tamanho do raio baseado na concentração
    quantidadeClientes: number;
    quantidadeEmpresas: number;
  };
}

export const useFiscalKpiData = ({ startDate, endDate }: FiscalKpiParams) => {
  const [data, setData] = useState<FiscalKpiData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fornecedorOptions, setFornecedorOptions] = useState<string[]>([]);
  const [clienteOptions, setClienteOptions] = useState<string[]>([]);
  const [mapaRaiosData, setMapaRaiosData] = useState<MapaRaiosData | null>(null);

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

        // Processar dados para o mapa de raios
        const mapaData = processarDadosParaMapa(result);
        setMapaRaiosData(mapaData);

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
    clienteOptions,
    mapaRaiosData
  };
};

// Função para processar dados e gerar informações do mapa de raios
const processarDadosParaMapa = (data: FiscalKpiData): MapaRaiosData => {
  const mapaData: MapaRaiosData = {};
  
  // Processar saídas por UF
  data.saidas?.forEach(saida => {
    if (saida.cancelada === "N" && saida.UF) {
      if (!mapaData[saida.UF]) {
        mapaData[saida.UF] = {
          valorTotal: 0,
          valorSaidas: 0,
          valorServicos: 0,
          percentualDoTotal: 0,
          raioSize: 0,
          quantidadeClientes: 0,
          quantidadeEmpresas: 0
        };
      }
      
      const valor = parseFloat(saida.valor) || 0;
      mapaData[saida.UF].valorSaidas += valor;
      mapaData[saida.UF].valorTotal += valor;
    }
  });

  // Processar serviços por UF
  data.servicos?.forEach(servico => {
    if (servico.cancelada === "N" && servico.UF) {
      if (!mapaData[servico.UF]) {
        mapaData[servico.UF] = {
          valorTotal: 0,
          valorSaidas: 0,
          valorServicos: 0,
          percentualDoTotal: 0,
          raioSize: 0,
          quantidadeClientes: 0,
          quantidadeEmpresas: 0
        };
      }
      
      const valor = parseFloat(servico.valor) || 0;
      mapaData[servico.UF].valorServicos += valor;
      mapaData[servico.UF].valorTotal += valor;
    }
  });

  // Calcular clientes e empresas únicos por UF
  Object.keys(mapaData).forEach(uf => {
    const clientesUF = new Set<string>();
    const empresasUF = new Set<string>();

    // Clientes das saídas
    data.saidas?.forEach(saida => {
      if (saida.UF === uf && saida.cancelada === "N") {
        clientesUF.add(saida.nome_cliente);
        empresasUF.add(saida.nome_empresa);
      }
    });

    // Clientes dos serviços
    data.servicos?.forEach(servico => {
      if (servico.UF === uf && servico.cancelada === "N") {
        clientesUF.add(servico.nome_cliente);
        empresasUF.add(servico.nome_empresa);
      }
    });

    mapaData[uf].quantidadeClientes = clientesUF.size;
    mapaData[uf].quantidadeEmpresas = empresasUF.size;
  });

  // Calcular totais gerais
  const totalGeral = Object.values(mapaData).reduce((acc, uf) => acc + uf.valorTotal, 0);
  const quantidadeEstados = Object.keys(mapaData).length;

  // Calcular percentuais e tamanhos dos raios
  Object.keys(mapaData).forEach(uf => {
    mapaData[uf].percentualDoTotal = totalGeral > 0 ? (mapaData[uf].valorTotal / totalGeral) * 100 : 0;
    
    // Raio baseado no percentual (mínimo 20, máximo 100)
    // Estados com maior concentração têm raios maiores
    const raioBase = 20; // Raio mínimo
    const raioMaximo = 100; // Raio máximo
    const percentual = mapaData[uf].percentualDoTotal;
    
    // Fórmula: raio proporcional ao percentual, com escala logarítmica para melhor distribuição visual
    mapaData[uf].raioSize = raioBase + (Math.log(percentual + 1) / Math.log(101)) * (raioMaximo - raioBase);
  });

  console.log('🗺️ Dados do mapa processados:', {
    totalEstados: quantidadeEstados,
    totalGeral: totalGeral.toFixed(2),
    estadosPorcentagem: Object.entries(mapaData).map(([uf, dados]) => ({
      uf,
      percentual: dados.percentualDoTotal.toFixed(2) + '%',
      raio: dados.raioSize.toFixed(1),
      valor: dados.valorTotal.toFixed(2)
    }))
  });

  return mapaData;
};
