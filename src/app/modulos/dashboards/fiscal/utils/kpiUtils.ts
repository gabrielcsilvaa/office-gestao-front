/**
 * UTILITÁRIOS PARA GESTÃO DE KPIs
 * 
 * Este arquivo centraliza toda a lógica relacionada aos KPIs do dashboard fiscal,
 * incluindo configurações, cálculos e transformações de dados.
 */

import { 
  KpiType, 
  KpiConfig, 
  DashboardData, 
  ProgressBarItem,
  EvolucaoDataPoint,
  CardDataItem 
} from '../types';

// ========================================
// CONFIGURAÇÕES DOS KPIs
// ========================================

/**
 * Mapeamento completo de configurações para cada KPI
 * Define como cada KPI deve se comportar no dashboard
 */
export const KPI_CONFIGS: Record<KpiType, KpiConfig> = {
  [KpiType.RECEITA_BRUTA_TOTAL]: {
    label: "Receita Bruta Total",
    clienteFornecedorLabel: "Cliente",
    clienteFornecedorLabelPlural: "Clientes",
    evolucaoTitle: "Evolução da Receita Bruta Total",
    topTitle: "TOP 100 Produtos / Serviços",
    dataSource: "saidas" // Pode combinar múltiplas fontes
  },
  [KpiType.VENDAS_PRODUTOS]: {
    label: "Vendas de Produtos",
    clienteFornecedorLabel: "Cliente", 
    clienteFornecedorLabelPlural: "Clientes",
    evolucaoTitle: "Evolução de Vendas de Produtos",
    topTitle: "TOP 100 Produtos",
    dataSource: "saidas"
  },
  [KpiType.SERVICOS_PRESTADOS]: {
    label: "Serviços Prestados",
    clienteFornecedorLabel: "Cliente",
    clienteFornecedorLabelPlural: "Clientes", 
    evolucaoTitle: "Evolução de Serviços Prestados",
    topTitle: "TOP 100 Serviços",
    dataSource: "servicos"
  },
  [KpiType.COMPRAS_AQUISICOES]: {
    label: "Compras e Aquisições",
    clienteFornecedorLabel: "Fornecedor",
    clienteFornecedorLabelPlural: "Fornecedores",
    evolucaoTitle: "Evolução de Compras e Aquisições", 
    topTitle: "TOP 100 Produtos",
    dataSource: "entradas"
  },
  [KpiType.CANCELAMENTOS_RECEITA]: {
    label: "Cancelamentos de Receita",
    clienteFornecedorLabel: "Cliente",
    clienteFornecedorLabelPlural: "Clientes / Fornecedores",
    evolucaoTitle: "Evolução de Cancelamentos de Receita",
    topTitle: "TOP 100 Produtos",
    dataSource: "saidas"
  }
};

// ========================================
// FUNÇÕES AUXILIARES PARA KPIs
// ========================================

/**
 * Retorna a configuração de um KPI específico
 */
export const getKpiConfig = (kpiType: KpiType): KpiConfig => {
  return KPI_CONFIGS[kpiType];
};

/**
 * Retorna o label para cliente/fornecedor baseado no KPI
 */
export const getClienteFornecedorLabel = (kpiType: KpiType): string => {
  return getKpiConfig(kpiType).clienteFornecedorLabel;
};

/**
 * Retorna o label plural para cliente/fornecedor baseado no KPI
 */
export const getClienteFornecedorLabelPlural = (kpiType: KpiType): string => {
  return getKpiConfig(kpiType).clienteFornecedorLabelPlural;
};

/**
 * Retorna o título do card de evolução baseado no KPI
 */
export const getEvolucaoTitle = (kpiType: KpiType): string => {
  return getKpiConfig(kpiType).evolucaoTitle;
};

/**
 * Retorna o título do card TOP 100 baseado no KPI
 */
export const getTopTitle = (kpiType: KpiType): string => {
  return getKpiConfig(kpiType).topTitle;
};

// ========================================
// CÁLCULOS DE KPIs
// ========================================

/**
 * Calcula o valor total para um KPI específico
 */
export const calcularValorTotal = (data: DashboardData | null, kpiType: KpiType): number => {
  if (!data) return 0;
  
  const config = getKpiConfig(kpiType);
  const sourceData = data[config.dataSource];
  
  if (!sourceData || !Array.isArray(sourceData)) return 0;
  
  return sourceData.reduce((total, item) => {
    const valor = parseFloat(item.valor) || 0;
    return total + valor;
  }, 0);
};

/**
 * Calcula o ticket médio para um KPI específico
 */
export const calcularTicketMedio = (data: DashboardData | null, kpiType: KpiType): number => {
  if (!data) return 0;
  
  const config = getKpiConfig(kpiType);
  const sourceData = data[config.dataSource];
  
  if (!sourceData || !Array.isArray(sourceData) || sourceData.length === 0) return 0;
  
  const valorTotal = calcularValorTotal(data, kpiType);
  return valorTotal / sourceData.length;
};

/**
 * Conta o número de transações para um KPI específico
 */
export const contarTransacoes = (data: DashboardData | null, kpiType: KpiType): number => {
  if (!data) return 0;
  
  const config = getKpiConfig(kpiType);
  const sourceData = data[config.dataSource];
  
  return sourceData?.length || 0;
};

// ========================================
// GERAÇÃO DE DADOS PARA CARDS
// ========================================

/**
 * Gera dados de cards KPI baseados no tipo selecionado e dados disponíveis
 */
export const gerarCardsData = (
  data: DashboardData | null, 
  kpiType: KpiType
): CardDataItem[] => {
  const valorTotal = calcularValorTotal(data, kpiType);
  const ticketMedio = calcularTicketMedio(data, kpiType);
  const numeroTransacoes = contarTransacoes(data, kpiType);
  
  const config = getKpiConfig(kpiType);
  
  return [
    {
      title: config.label,
      value: formatarMoeda(valorTotal),
      tooltipText: `Valor total de ${config.label.toLowerCase()}`
    },
    {
      title: "Ticket Médio",
      value: formatarMoeda(ticketMedio),
      tooltipText: "Valor médio por transação"
    },
    {
      title: "Nº de Transações",
      value: numeroTransacoes.toLocaleString('pt-BR'),
      tooltipText: "Quantidade total de transações"
    }
  ];
};

// ========================================
// GERAÇÃO DE DADOS PARA TOP 100
// ========================================

/**
 * Gera dados do TOP 100 clientes/fornecedores baseado no KPI
 */
export const gerarTop100Data = (
  data: DashboardData | null, 
  kpiType: KpiType
): ProgressBarItem[] => {
  if (!data) return [];
  
  const config = getKpiConfig(kpiType);
  const sourceData = data[config.dataSource];
  
  if (!sourceData || !Array.isArray(sourceData)) return [];
  
  // Agrupa por cliente/fornecedor e soma os valores
  const agrupado = sourceData.reduce((acc, item) => {
    // Determina o nome baseado no tipo de KPI
    const nome = kpiType === KpiType.COMPRAS_AQUISICOES 
      ? (item as any).nome_fornecedor || 'Fornecedor não identificado'
      : (item as any).nome_cliente || 'Cliente não identificado';
    
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
  
  // Calcula percentuais baseados no maior valor
  const maiorValor = items[0]?.valor || 1;
  
  return items.map(item => ({
    name: item.nome,
    value: item.valor,
    percentage: (item.valor / maiorValor) * 100
  }));
};

// ========================================
// GERAÇÃO DE DADOS DE EVOLUÇÃO
// ========================================

/**
 * Gera dados de evolução temporal baseado no KPI
 */
export const gerarEvolucaoData = (
  data: DashboardData | null, 
  kpiType: KpiType
): EvolucaoDataPoint[] => {
  if (!data) return [];
  
  const config = getKpiConfig(kpiType);
  const sourceData = data[config.dataSource];
  
  if (!sourceData || !Array.isArray(sourceData)) return [];
  
  // Agrupa por data e soma os valores
  const agrupado = sourceData.reduce((acc, item) => {
    const data = item.data;
    const valor = parseFloat(item.valor) || 0;
    
    if (!acc[data]) {
      acc[data] = 0;
    }
    acc[data] += valor;
    
    return acc;
  }, {} as Record<string, number>);
  
  // Converte para array e ordena por data
  return Object.entries(agrupado)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// ========================================
// FUNÇÕES DE FORMATAÇÃO
// ========================================

/**
 * Formata um valor numérico como moeda brasileira
 */
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

/**
 * Formata um número com separadores de milhares
 */
export const formatarNumero = (valor: number): string => {
  return valor.toLocaleString('pt-BR');
};

/**
 * Formata uma data para exibição
 */
export const formatarData = (data: string): string => {
  try {
    return new Date(data).toLocaleDateString('pt-BR');
  } catch {
    return data;
  }
};
