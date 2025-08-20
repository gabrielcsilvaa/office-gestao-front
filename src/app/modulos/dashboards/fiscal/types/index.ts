/**
 * TIPOS PARA O DASHBOARD FISCAL
 * 
 * Este arquivo centraliza todas as definições de tipos TypeScript
 * utilizadas no módulo fiscal para garantir consistência e reutilização.
 */

// ========================================
// TIPOS PRINCIPAIS DE DADOS
// ========================================

/**
 * Representa os dados de entrada (compras/aquisições)
 * - Usado para KPI "Compras e Aquisições"
 * - Representa dinheiro SAINDO da empresa
 */
export interface EntradaData {
  fornecedor: number;
  nome_fornecedor: string;
  empresa: number;
  nome_empresa: string;
  cnpj: string;
  CEP: string | null;
  data: string;
  valor: string;
}

/**
 * Representa os dados de serviços prestados
 * - Usado para KPI "Serviços Prestados"
 * - Representa dinheiro ENTRANDO na empresa
 */
export interface ServicoData {
  cliente: number;
  nome_cliente: string;
  empresa: number;
  nome_empresa: string;
  cnpj: string;
  UF: string;
  data: string;
  valor: string;
  cancelada: string;
}

/**
 * Representa os dados de saídas (vendas de produtos)
 * - Usado para KPI "Vendas de Produtos"
 * - Representa dinheiro ENTRANDO na empresa
 */
export interface SaidaData {
  cliente: number;
  nome_cliente: string;
  empresa: number;
  nome_empresa: string;
  cnpj: string;
  UF: string;
  data: string;
  valor: string;
  cancelada: string;
}

/**
 * Estrutura principal dos dados do dashboard
 * Contém todos os tipos de movimentação fiscal
 */
export interface DashboardData {
  saidas?: SaidaData[];
  servicos?: ServicoData[];
  entradas?: EntradaData[];
}

// ========================================
// TIPOS PARA COMPONENTES UI
// ========================================

/**
 * Dados de um item para o card KPI
 */
export interface CardDataItem {
  title: string;
  value: string;
  tooltipText: string;
}

/**
 * Item para os cards de barra de progresso (TOP 100)
 */
export interface ProgressBarItem {
  name: string;
  value: number;
  percentage: number;
}

/**
 * Dados para o gráfico de evolução temporal
 */
export interface EvolucaoDataPoint {
  date: string;
  value: number;
  label?: string;
}

/**
 * Tipos de toast para feedback do usuário
 */
export interface ToastData {
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

// ========================================
// TIPOS PARA KPIs
// ========================================

/**
 * Enum com todos os KPIs disponíveis no dashboard fiscal
 */
export enum KpiType {
  RECEITA_BRUTA_TOTAL = "Receita Bruta Total",
  VENDAS_PRODUTOS = "Vendas de Produtos", 
  SERVICOS_PRESTADOS = "Serviços Prestados",
  COMPRAS_AQUISICOES = "Compras e Aquisições",
  CANCELAMENTOS_RECEITA = "Cancelamentos de Receita"
}

/**
 * Configuração de um KPI específico
 */
export interface KpiConfig {
  label: string;
  clienteFornecedorLabel: string;
  clienteFornecedorLabelPlural: string;
  evolucaoTitle: string;
  topTitle: string;
  dataSource: keyof DashboardData;
}

// ========================================
// TIPOS PARA FILTROS E ESTADO
// ========================================

/**
 * Estado dos filtros do dashboard
 */
export interface FiltrosState {
  clienteSelecionado: string;
  startDate: string | null;
  endDate: string | null;
  kpiSelecionado: KpiType;
}

/**
 * Estado de loading do dashboard
 */
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

/**
 * Opções para dropdowns
 */
export interface DropdownOptions {
  fornecedorOptions: string[];
  clienteOptions: string[];
}

// ========================================
// TIPOS PARA HOOKS
// ========================================

/**
 * Retorno do hook useDropdown
 */
export interface UseDropdownReturn {
  openDropdown: string | null;
  handleToggleDropdown: (dropdownName: string) => void;
}

/**
 * Parâmetros para busca de dados fiscais
 */
export interface FiscalDataParams {
  startDate: string | null;
  endDate: string | null;
  clienteSelecionado?: string;
  kpiType: KpiType;
}

/**
 * Retorno do hook de dados fiscais
 */
export interface UseFiscalDataReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}
