/**
 * TIPOS ESPECÍFICOS PARA DASHBOARD DE VENDAS
 * 
 * Define interfaces e enums para análise detalhada de vendas/saídas
 */

// Importa tipos base do fiscal
import { SaidaData as SaidaDataBase } from "../../types";

// Estende SaidaData com campos específicos para análise de vendas
export interface SaidaDataExtendida extends SaidaDataBase {
  // Campos calculados
  produto_nome?: string;
  produto_codigo?: string;
  quantidade?: number;
  valor_unitario?: number;
  valor_total?: number;
  custo_unitario?: number;
  custo_total?: number;
  margem_valor?: number;
  margem_percentual?: number;
  estado?: string;
  mes?: number;
  ano?: number;
  trimestre?: number;
  categoria_produto?: string;
  vendedor?: string;
  comissao_percentual?: number;
  comissao_valor?: number;
  desconto_valor?: number;
  observacoes?: string | null;
}

// Enum para KPIs específicos de vendas
export enum VendasKpiType {
  VENDAS_TOTAIS = "Vendas Totais",
  VENDAS_POR_PRODUTO = "Vendas por Produto", 
  VENDAS_POR_CLIENTE = "Vendas por Cliente",
  TICKET_MEDIO_VENDAS = "Ticket Médio de Vendas",
  QUANTIDADE_VENDIDA = "Quantidade Vendida",
  MARGEM_BRUTA = "Margem Bruta",
  CRESCIMENTO_VENDAS = "Crescimento de Vendas",
  TOP_PRODUTOS = "Top Produtos",
  SAZONALIDADE = "Sazonalidade",
  CONCENTRACAO_GEOGRAFICA = "Concentração Geográfica"
}

// Período para análise temporal
export enum PeriodoAnalise {
  DIARIO = "Diário",
  SEMANAL = "Semanal", 
  MENSAL = "Mensal",
  TRIMESTRAL = "Trimestral",
  ANUAL = "Anual"
}

// Tipo de visualização do mapa
export enum TipoVisualizacaoMapa {
  VALOR = "valor",
  QUANTIDADE = "quantidade",
  CLIENTES = "clientes",
  TICKET_MEDIO = "ticket_medio"
}

// Interface para dados de venda processados
export interface VendaProcessada {
  id: string;
  cliente: string;
  produto: string;
  categoria?: string;
  quantidade: number;
  valor: number;
  valorUnitario: number;
  data: string;
  mes: string;
  ano: string;
  trimestre: string;
  uf?: string;
  cidade?: string;
  vendedor?: string;
  margem?: number;
  custo?: number;
}

// Interface para ranking de produtos
export interface RankingProduto {
  produto: string;
  categoria?: string;
  totalVendido: number;
  quantidadeVendida: number;
  ticketMedio: number;
  participacao: number; // % do total
  crescimento?: number; // % vs período anterior
  margem?: number;
}

// Interface para ranking de clientes
export interface RankingCliente {
  cliente: string;
  totalComprado: number;
  quantidadeCompras: number;
  ticketMedio: number;
  participacao: number; // % do total
  ultimaCompra: string;
  frequencia: number; // compras por mês
  categoria: 'VIP' | 'Frequente' | 'Ocasional' | 'Novo';
}

// Interface para dados geográficos
export interface DadosGeograficos {
  uf: string;
  estado: string;
  lat: number;
  lng: number;
  totalVendas: number;
  quantidadeVendas: number;
  numeroClientes: number;
  ticketMedio: number;
  crescimento?: number;
  participacao: number;
}

// Interface para análise de sazonalidade
export interface DadosSazonalidade {
  periodo: string; // mês, trimestre, etc
  vendas: number;
  quantidade: number;
  crescimento: number;
  media: number;
  tendencia: 'alta' | 'baixa' | 'estavel';
}

// Interface para métricas avançadas
export interface MetricasAvancadas {
  crescimentoMensal: number;
  crescimentoAnual: number;
  concentracaoClientes: number; // % vendas dos top 20%
  diversificacaoProdutos: number; // índice de diversificação
  ticketMedioTendencia: 'crescente' | 'decrescente' | 'estavel';
  sazonalidadeIndex: number; // 0-100, quanto maior mais sazonal
  recorrencia: number; // % clientes que compraram mais de uma vez
}

// Interface para configuração de KPI de vendas
export interface VendasKpiConfig {
  type: VendasKpiType;
  label: string;
  description: string;
  icon: string;
  color: string;
  formatacao: 'moeda' | 'numero' | 'percentual';
  fonte: 'vendas' | 'calculado';
}

// Interface para filtros específicos de vendas
export interface FiltrosVendas {
  periodo?: {
    inicio: string;
    fim: string;
  };
  cliente?: string;
  produto?: string;
  categoria?: string;
  uf?: string;
  vendedor?: string;
  valorMinimo?: number;
  valorMaximo?: number;
}

// Interface para dashboard de vendas
export interface DashboardVendasData {
  vendas: VendaProcessada[];
  rankingProdutos: RankingProduto[];
  rankingClientes: RankingCliente[];
  dadosGeograficos: DadosGeograficos[];
  sazonalidade: DadosSazonalidade[];
  metricas: MetricasAvancadas;
  totalVendas: number;
  totalQuantidade: number;
  ticketMedio: number;
  numeroClientes: number;
  numeroProdutos: number;
}

// Interface para props de componentes de vendas
export interface VendasCardProps {
  titulo: string;
  valor: number | string;
  icone: string;
  cor: string;
  crescimento?: number;
  loading?: boolean;
}

export interface MapaVendasProps {
  dados: DadosGeograficos[];
  tipoVisualizacao: TipoVisualizacaoMapa;
  kpiSelecionado: VendasKpiType;
  loading?: boolean;
}

export interface RankingProps {
  tipo: 'produtos' | 'clientes';
  dados: RankingProduto[] | RankingCliente[];
  limite?: number;
  loading?: boolean;
}

export interface SazonalidadeProps {
  dados: DadosSazonalidade[];
  periodo: PeriodoAnalise;
  loading?: boolean;
}

// Re-exportar tipos do fiscal que serão reutilizados
export type { SaidaData, EntradaData, ServicoData } from '../../types';
