/**
 * CONFIGURAÇÕES DE KPIs PARA DASHBOARD DE VENDAS
 * 
 * Define as configurações, cores, ícones e formatação para cada KPI de vendas
 */

import { VendasKpiType, VendasKpiConfig } from '../types';

/**
 * Configurações dos KPIs de vendas
 */
export const VENDAS_KPI_CONFIGS: Record<VendasKpiType, VendasKpiConfig> = {
  [VendasKpiType.VENDAS_TOTAIS]: {
    type: VendasKpiType.VENDAS_TOTAIS,
    label: "Vendas Totais",
    description: "Valor total de todas as vendas realizadas no período",
    icon: "💰",
    color: "bg-blue-500",
    formatacao: "moeda",
    fonte: "vendas"
  },
  
  [VendasKpiType.VENDAS_POR_PRODUTO]: {
    type: VendasKpiType.VENDAS_POR_PRODUTO,
    label: "Vendas por Produto", 
    description: "Análise detalhada das vendas segmentada por produto",
    icon: "📦",
    color: "bg-green-500",
    formatacao: "moeda",
    fonte: "calculado"
  },
  
  [VendasKpiType.VENDAS_POR_CLIENTE]: {
    type: VendasKpiType.VENDAS_POR_CLIENTE,
    label: "Vendas por Cliente",
    description: "Ranking e análise das vendas por cliente",
    icon: "👥",
    color: "bg-purple-500",
    formatacao: "moeda",
    fonte: "calculado"
  },
  
  [VendasKpiType.TICKET_MEDIO_VENDAS]: {
    type: VendasKpiType.TICKET_MEDIO_VENDAS,
    label: "Ticket Médio",
    description: "Valor médio por transação de venda",
    icon: "🎯",
    color: "bg-orange-500",
    formatacao: "moeda",
    fonte: "calculado"
  },
  
  [VendasKpiType.QUANTIDADE_VENDIDA]: {
    type: VendasKpiType.QUANTIDADE_VENDIDA,
    label: "Quantidade Vendida",
    description: "Número total de itens vendidos",
    icon: "📊",
    color: "bg-teal-500",
    formatacao: "numero",
    fonte: "vendas"
  },
  
  [VendasKpiType.MARGEM_BRUTA]: {
    type: VendasKpiType.MARGEM_BRUTA,
    label: "Margem Bruta",
    description: "Percentual de margem de lucro nas vendas",
    icon: "📈",
    color: "bg-emerald-500",
    formatacao: "percentual",
    fonte: "calculado"
  },
  
  [VendasKpiType.CRESCIMENTO_VENDAS]: {
    type: VendasKpiType.CRESCIMENTO_VENDAS,
    label: "Crescimento",
    description: "Crescimento das vendas em relação ao período anterior",
    icon: "🚀",
    color: "bg-indigo-500",
    formatacao: "percentual",
    fonte: "calculado"
  },
  
  [VendasKpiType.TOP_PRODUTOS]: {
    type: VendasKpiType.TOP_PRODUTOS,
    label: "Top Produtos",
    description: "Produtos mais vendidos no período",
    icon: "🏆",
    color: "bg-yellow-500",
    formatacao: "numero",
    fonte: "calculado"
  },
  
  [VendasKpiType.SAZONALIDADE]: {
    type: VendasKpiType.SAZONALIDADE,
    label: "Sazonalidade",
    description: "Análise temporal e padrões sazonais das vendas",
    icon: "📅",
    color: "bg-pink-500",
    formatacao: "percentual",
    fonte: "calculado"
  },
  
  [VendasKpiType.CONCENTRACAO_GEOGRAFICA]: {
    type: VendasKpiType.CONCENTRACAO_GEOGRAFICA,
    label: "Distribuição Geográfica",
    description: "Concentração das vendas por região/estado",
    icon: "🗺️",
    color: "bg-cyan-500",
    formatacao: "percentual",
    fonte: "calculado"
  }
};

/**
 * Obtém configuração de um KPI específico
 */
export const getVendasKpiConfig = (kpi: VendasKpiType): VendasKpiConfig => {
  return VENDAS_KPI_CONFIGS[kpi];
};

/**
 * Obtém cor do KPI
 */
export const getVendasKpiColor = (kpi: VendasKpiType): string => {
  return VENDAS_KPI_CONFIGS[kpi].color;
};

/**
 * Obtém ícone do KPI
 */
export const getVendasKpiIcon = (kpi: VendasKpiType): string => {
  return VENDAS_KPI_CONFIGS[kpi].icon;
};

/**
 * Formata valor baseado no tipo de KPI
 */
export const formatarValorVendas = (valor: number, kpi: VendasKpiType): string => {
  const config = getVendasKpiConfig(kpi);
  
  switch (config.formatacao) {
    case 'moeda':
      return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      
    case 'percentual':
      return `${valor.toFixed(1)}%`;
      
    case 'numero':
      return valor.toLocaleString('pt-BR');
      
    default:
      return valor.toString();
  }
};

/**
 * Lista todos os KPIs disponíveis
 */
export const getVendasKpiOptions = () => {
  return Object.values(VendasKpiType).map(kpi => ({
    value: kpi,
    label: VENDAS_KPI_CONFIGS[kpi].label,
    description: VENDAS_KPI_CONFIGS[kpi].description,
    icon: VENDAS_KPI_CONFIGS[kpi].icon,
    color: VENDAS_KPI_CONFIGS[kpi].color
  }));
};

/**
 * Determina se um KPI precisa de dados de entrada adicionais
 */
export const kpiPrecisaDadosAdicionais = (kpi: VendasKpiType): boolean => {
  const kpisComplexos = [
    VendasKpiType.MARGEM_BRUTA,
    VendasKpiType.SAZONALIDADE,
    VendasKpiType.CONCENTRACAO_GEOGRAFICA
  ];
  
  return kpisComplexos.includes(kpi);
};

/**
 * Obtém KPIs relacionados para sugestões
 */
export const getKpisRelacionados = (kpi: VendasKpiType): VendasKpiType[] => {
  const relacionamentos: Record<VendasKpiType, VendasKpiType[]> = {
    [VendasKpiType.VENDAS_TOTAIS]: [
      VendasKpiType.TICKET_MEDIO_VENDAS,
      VendasKpiType.CRESCIMENTO_VENDAS
    ],
    [VendasKpiType.VENDAS_POR_PRODUTO]: [
      VendasKpiType.TOP_PRODUTOS,
      VendasKpiType.MARGEM_BRUTA
    ],
    [VendasKpiType.VENDAS_POR_CLIENTE]: [
      VendasKpiType.TICKET_MEDIO_VENDAS,
      VendasKpiType.CONCENTRACAO_GEOGRAFICA
    ],
    [VendasKpiType.TICKET_MEDIO_VENDAS]: [
      VendasKpiType.VENDAS_TOTAIS,
      VendasKpiType.MARGEM_BRUTA
    ],
    [VendasKpiType.QUANTIDADE_VENDIDA]: [
      VendasKpiType.TOP_PRODUTOS,
      VendasKpiType.SAZONALIDADE
    ],
    [VendasKpiType.MARGEM_BRUTA]: [
      VendasKpiType.VENDAS_POR_PRODUTO,
      VendasKpiType.TOP_PRODUTOS
    ],
    [VendasKpiType.CRESCIMENTO_VENDAS]: [
      VendasKpiType.VENDAS_TOTAIS,
      VendasKpiType.SAZONALIDADE
    ],
    [VendasKpiType.TOP_PRODUTOS]: [
      VendasKpiType.VENDAS_POR_PRODUTO,
      VendasKpiType.MARGEM_BRUTA
    ],
    [VendasKpiType.SAZONALIDADE]: [
      VendasKpiType.CRESCIMENTO_VENDAS,
      VendasKpiType.VENDAS_TOTAIS
    ],
    [VendasKpiType.CONCENTRACAO_GEOGRAFICA]: [
      VendasKpiType.VENDAS_POR_CLIENTE,
      VendasKpiType.VENDAS_TOTAIS
    ]
  };
  
  return relacionamentos[kpi] || [];
};
