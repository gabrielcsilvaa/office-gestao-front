/**
 * UTILITÁRIOS PARA FILTROS DE DADOS
 * 
 * Este arquivo centraliza toda a lógica de filtros aplicados aos dados fiscais,
 * eliminando a duplicação de código e garantindo consistência.
 */

import { 
  DashboardData, 
  KpiType, 
  SaidaData, 
  ServicoData, 
  EntradaData 
} from '../types';

// ========================================
// FILTROS BÁSICOS
// ========================================

/**
 * Filtra dados por status de cancelamento
 * @param dados Array de dados para filtrar
 * @param incluirCancelados Se deve incluir itens cancelados
 * @returns Dados filtrados
 */
export const filtrarPorStatus = <T extends { cancelada: string }>(
  dados: T[], 
  incluirCancelados: boolean = false
): T[] => {
  if (!dados || !Array.isArray(dados)) return [];
  
  return incluirCancelados 
    ? dados.filter(item => item.cancelada === "S")
    : dados.filter(item => item.cancelada === "N");
};

/**
 * Filtra dados por cliente específico
 * @param dados Array de dados para filtrar  
 * @param clienteSelecionado Nome do cliente/fornecedor
 * @param isEntrada Se os dados são de entrada (fornecedor) ou saída/serviço (cliente)
 * @returns Dados filtrados
 */
export const filtrarPorCliente = <T extends Record<string, any>>(
  dados: T[],
  clienteSelecionado: string,
  isEntrada: boolean = false
): T[] => {
  if (!dados || !Array.isArray(dados) || !clienteSelecionado) return dados;
  
  const campoNome = isEntrada ? 'nome_fornecedor' : 'nome_cliente';
  
  return dados.filter(item => item[campoNome] === clienteSelecionado);
};

/**
 * Remove sufixos de tipo do nome do cliente (ex: " (Cliente)", " (Fornecedor)")
 * @param clienteSelecionado Nome com possível sufixo
 * @returns Nome limpo
 */
export const limparNomeCliente = (clienteSelecionado: string): string => {
  return clienteSelecionado.replace(/ \((Cliente|Fornecedor)\)$/, '');
};

// ========================================
// FILTROS COMPOSTOS POR KPI
// ========================================

/**
 * Aplica filtros completos para um KPI específico nos dados de saídas
 * @param dados Dados de saídas
 * @param kpiType Tipo do KPI
 * @param clienteSelecionado Cliente selecionado (opcional)
 * @returns Dados filtrados
 */
export const filtrarSaidas = (
  dados: SaidaData[], 
  kpiType: KpiType, 
  clienteSelecionado: string = ""
): SaidaData[] => {
  if (!dados || !Array.isArray(dados)) return [];
  
  // Aplica filtro de cancelamento baseado no KPI
  const incluirCancelados = kpiType === KpiType.CANCELAMENTOS_RECEITA;
  let dadosFiltrados = filtrarPorStatus(dados, incluirCancelados);
  
  // Aplica filtro de cliente se especificado
  if (clienteSelecionado) {
    const clienteLimpo = limparNomeCliente(clienteSelecionado);
    dadosFiltrados = filtrarPorCliente(dadosFiltrados, clienteLimpo, false);
  }
  
  return dadosFiltrados;
};

/**
 * Aplica filtros completos para um KPI específico nos dados de serviços
 * @param dados Dados de serviços
 * @param kpiType Tipo do KPI
 * @param clienteSelecionado Cliente selecionado (opcional)
 * @returns Dados filtrados
 */
export const filtrarServicos = (
  dados: ServicoData[], 
  kpiType: KpiType, 
  clienteSelecionado: string = ""
): ServicoData[] => {
  if (!dados || !Array.isArray(dados)) return [];
  
  // Aplica filtro de cancelamento baseado no KPI
  const incluirCancelados = kpiType === KpiType.CANCELAMENTOS_RECEITA;
  let dadosFiltrados = filtrarPorStatus(dados, incluirCancelados);
  
  // Aplica filtro de cliente se especificado
  if (clienteSelecionado) {
    const clienteLimpo = limparNomeCliente(clienteSelecionado);
    dadosFiltrados = filtrarPorCliente(dadosFiltrados, clienteLimpo, false);
  }
  
  return dadosFiltrados;
};

/**
 * Aplica filtros completos para um KPI específico nos dados de entradas
 * @param dados Dados de entradas
 * @param kpiType Tipo do KPI
 * @param fornecedorSelecionado Fornecedor selecionado (opcional)
 * @returns Dados filtrados
 */
export const filtrarEntradas = (
  dados: EntradaData[], 
  kpiType: KpiType, 
  fornecedorSelecionado: string = ""
): EntradaData[] => {
  if (!dados || !Array.isArray(dados)) return [];
  
  // Entradas não têm campo 'cancelada', então retorna todos os dados
  let dadosFiltrados = dados;
  
  // Aplica filtro de fornecedor se especificado
  if (fornecedorSelecionado) {
    dadosFiltrados = filtrarPorCliente(dadosFiltrados, fornecedorSelecionado, true);
  }
  
  return dadosFiltrados;
};

// ========================================
// FUNÇÃO PRINCIPAL DE FILTROS
// ========================================

/**
 * Aplica todos os filtros necessários baseados no KPI e retorna dados processados
 * @param data Dados completos do dashboard
 * @param kpiType Tipo do KPI selecionado
 * @param clienteFornecedorSelecionado Cliente ou fornecedor selecionado
 * @returns Objeto com dados filtrados por tipo
 */
export const aplicarFiltrosCompletos = (
  data: DashboardData | null,
  kpiType: KpiType,
  clienteFornecedorSelecionado: string = ""
) => {
  if (!data) {
    return {
      saidas: [],
      servicos: [],
      entradas: []
    };
  }
  
  // Determina se deve usar fornecedor ou cliente baseado no KPI
  const isCompraAquisicao = kpiType === KpiType.COMPRAS_AQUISICOES;
  const selecionado = clienteFornecedorSelecionado;
  
  return {
    saidas: filtrarSaidas(data.saidas || [], kpiType, isCompraAquisicao ? "" : selecionado),
    servicos: filtrarServicos(data.servicos || [], kpiType, isCompraAquisicao ? "" : selecionado),
    entradas: filtrarEntradas(data.entradas || [], kpiType, isCompraAquisicao ? selecionado : "")
  };
};

// ========================================
// UTILITÁRIOS DE VALIDAÇÃO
// ========================================

/**
 * Verifica se os dados filtrados estão vazios
 * @param dadosFiltrados Resultado do filtro
 * @returns true se todos os arrays estão vazios
 */
export const isDadosVazios = (dadosFiltrados: ReturnType<typeof aplicarFiltrosCompletos>): boolean => {
  return dadosFiltrados.saidas.length === 0 && 
         dadosFiltrados.servicos.length === 0 && 
         dadosFiltrados.entradas.length === 0;
};

/**
 * Conta o total de itens em todos os arrays filtrados
 * @param dadosFiltrados Resultado do filtro
 * @returns Número total de itens
 */
export const contarTotalItens = (dadosFiltrados: ReturnType<typeof aplicarFiltrosCompletos>): number => {
  return dadosFiltrados.saidas.length + 
         dadosFiltrados.servicos.length + 
         dadosFiltrados.entradas.length;
};
