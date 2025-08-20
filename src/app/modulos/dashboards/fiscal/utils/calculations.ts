/**
 * UTILITÁRIOS PARA CÁLCULOS FISCAIS
 * 
 * Este arquivo centraliza toda a lógica de cálculos matemáticos aplicados aos dados fiscais,
 * eliminando duplicação e garantindo consistência nos resultados.
 */

import { DashboardData, KpiType } from '../types';
import { aplicarFiltrosCompletos } from './dataFilters';

// ========================================
// CÁLCULOS BÁSICOS
// ========================================

/**
 * Calcula o valor total de um array de dados
 * @param dados Array com objetos que possuem propriedade 'valor'
 * @returns Valor total somado
 */
export const calcularTotal = (dados: Array<{ valor: string }>): number => {
  if (!dados || !Array.isArray(dados)) return 0;
  
  return dados.reduce((acc, item) => {
    const valor = parseFloat(item.valor || "0");
    return acc + (isNaN(valor) ? 0 : valor);
  }, 0);
};

/**
 * Calcula o ticket médio de um array de dados
 * @param dados Array com objetos que possuem propriedade 'valor'
 * @returns Ticket médio ou 0 se não houver dados
 */
export const calcularTicketMedio = (dados: Array<{ valor: string }>): number => {
  if (!dados || !Array.isArray(dados) || dados.length === 0) return 0;
  
  const total = calcularTotal(dados);
  return total / dados.length;
};

/**
 * Conta o número de itens em um array
 * @param dados Array de dados
 * @returns Quantidade de itens
 */
export const contarItens = (dados: any[]): number => {
  return dados?.length || 0;
};

/**
 * Calcula o percentual de um valor em relação ao total
 * @param valor Valor parcial
 * @param total Valor total
 * @returns Percentual (0-100)
 */
export const calcularPercentual = (valor: number, total: number): number => {
  if (total === 0) return 0;
  return (valor / total) * 100;
};

// ========================================
// CÁLCULOS ESPECÍFICOS POR KPI
// ========================================

/**
 * Calcula métricas completas para um KPI específico
 * @param data Dados completos do dashboard
 * @param kpiType Tipo do KPI
 * @param clienteFornecedorSelecionado Cliente/fornecedor selecionado
 * @returns Objeto com todas as métricas calculadas
 */
export const calcularMetricasKpi = (
  data: DashboardData | null,
  kpiType: KpiType,
  clienteFornecedorSelecionado: string = ""
) => {
  // Aplica filtros baseados no KPI
  const dadosFiltrados = aplicarFiltrosCompletos(data, kpiType, clienteFornecedorSelecionado);
  
  let dadosRelevantes: Array<{ valor: string }> = [];
  
  // Determina quais dados usar baseado no KPI
  switch (kpiType) {
    case KpiType.VENDAS_PRODUTOS:
      dadosRelevantes = dadosFiltrados.saidas;
      break;
      
    case KpiType.SERVICOS_PRESTADOS:
      dadosRelevantes = dadosFiltrados.servicos;
      break;
      
    case KpiType.RECEITA_BRUTA_TOTAL:
      dadosRelevantes = [...dadosFiltrados.saidas, ...dadosFiltrados.servicos];
      break;
      
    case KpiType.COMPRAS_AQUISICOES:
      dadosRelevantes = dadosFiltrados.entradas;
      break;
      
    case KpiType.CANCELAMENTOS_RECEITA:
      dadosRelevantes = [...dadosFiltrados.saidas, ...dadosFiltrados.servicos];
      break;
      
    default:
      dadosRelevantes = [];
  }
  
  // Calcula todas as métricas
  const valorTotal = calcularTotal(dadosRelevantes);
  const ticketMedio = calcularTicketMedio(dadosRelevantes);
  const quantidadeTransacoes = contarItens(dadosRelevantes);
  
  return {
    valorTotal,
    ticketMedio,
    quantidadeTransacoes,
    dadosOriginais: dadosRelevantes,
    dadosFiltrados
  };
};

// ========================================
// CÁLCULOS DE MIX DE RECEITA
// ========================================

/**
 * Calcula o mix de receita entre produtos e serviços
 * @param data Dados completos do dashboard
 * @param clienteSelecionado Cliente selecionado (opcional)
 * @returns Objeto com percentuais e valores de produtos e serviços
 */
export const calcularMixReceita = (
  data: DashboardData | null,
  clienteSelecionado: string = ""
) => {
  if (!data) {
    return {
      produtos: { percentual: 0, valor: 0 },
      servicos: { percentual: 0, valor: 0 },
      total: 0
    };
  }
  
  // Aplica filtros para receita bruta (apenas não cancelados)
  const dadosFiltrados = aplicarFiltrosCompletos(data, KpiType.RECEITA_BRUTA_TOTAL, clienteSelecionado);
  
  const valorProdutos = calcularTotal(dadosFiltrados.saidas);
  const valorServicos = calcularTotal(dadosFiltrados.servicos);
  const valorTotal = valorProdutos + valorServicos;
  
  const percentualProdutos = calcularPercentual(valorProdutos, valorTotal);
  const percentualServicos = calcularPercentual(valorServicos, valorTotal);
  
  return {
    produtos: {
      percentual: Math.round(percentualProdutos),
      valor: valorProdutos
    },
    servicos: {
      percentual: Math.round(percentualServicos),
      valor: valorServicos
    },
    total: valorTotal
  };
};

// ========================================
// CÁLCULOS DE CANCELAMENTOS
// ========================================

/**
 * Calcula o percentual de cancelamentos em relação à receita total
 * @param data Dados completos do dashboard
 * @param clienteSelecionado Cliente selecionado (opcional)
 * @returns Percentual de cancelamentos
 */
export const calcularPercentualCancelamentos = (
  data: DashboardData | null,
  clienteSelecionado: string = ""
): number => {
  if (!data) return 0;
  
  // Valor total cancelado
  const metricasCancelamentos = calcularMetricasKpi(data, KpiType.CANCELAMENTOS_RECEITA, clienteSelecionado);
  const valorCancelado = metricasCancelamentos.valorTotal;
  
  // Valor total da receita (incluindo canceladas)
  const dadosFiltrados = aplicarFiltrosCompletos(data, KpiType.RECEITA_BRUTA_TOTAL, clienteSelecionado);
  
  // Para o total, precisamos incluir TODAS as transações (canceladas e não canceladas)
  let saidasTotal = data.saidas || [];
  let servicosTotal = data.servicos || [];
  
  // Aplica filtro de cliente se especificado
  if (clienteSelecionado) {
    saidasTotal = saidasTotal.filter(saida => saida.nome_cliente === clienteSelecionado);
    servicosTotal = servicosTotal.filter(servico => servico.nome_cliente === clienteSelecionado);
  }
  
  const valorTotalComCanceladas = calcularTotal(saidasTotal) + calcularTotal(servicosTotal);
  
  return calcularPercentual(valorCancelado, valorTotalComCanceladas);
};

// ========================================
// CÁLCULOS DE CLIENTES ÚNICOS
// ========================================

/**
 * Conta o número de clientes únicos para um KPI específico
 * @param data Dados completos do dashboard
 * @param kpiType Tipo do KPI
 * @param clienteSelecionado Cliente selecionado (opcional)
 * @returns Número de clientes únicos
 */
export const contarClientesUnicos = (
  data: DashboardData | null,
  kpiType: KpiType,
  clienteSelecionado: string = ""
): number => {
  if (!data) return 0;
  
  const dadosFiltrados = aplicarFiltrosCompletos(data, kpiType, clienteSelecionado);
  const clientesUnicos = new Set<string>();
  
  // Adiciona clientes baseado no KPI
  switch (kpiType) {
    case KpiType.VENDAS_PRODUTOS:
      dadosFiltrados.saidas.forEach(saida => {
        if (saida.nome_cliente) clientesUnicos.add(saida.nome_cliente);
      });
      break;
      
    case KpiType.SERVICOS_PRESTADOS:
      dadosFiltrados.servicos.forEach(servico => {
        if (servico.nome_cliente) clientesUnicos.add(servico.nome_cliente);
      });
      break;
      
    case KpiType.RECEITA_BRUTA_TOTAL:
    case KpiType.CANCELAMENTOS_RECEITA:
      dadosFiltrados.saidas.forEach(saida => {
        if (saida.nome_cliente) clientesUnicos.add(saida.nome_cliente);
      });
      dadosFiltrados.servicos.forEach(servico => {
        if (servico.nome_cliente) clientesUnicos.add(servico.nome_cliente);
      });
      break;
      
    case KpiType.COMPRAS_AQUISICOES:
      dadosFiltrados.entradas.forEach(entrada => {
        if (entrada.nome_fornecedor) clientesUnicos.add(entrada.nome_fornecedor);
      });
      break;
  }
  
  return clientesUnicos.size;
};

// ========================================
// UTILITÁRIOS DE FORMATAÇÃO
// ========================================

/**
 * Formata um valor numérico como moeda brasileira
 * @param valor Valor numérico
 * @returns String formatada como moeda
 */
export const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Formata um número com separadores de milhares
 * @param valor Valor numérico
 * @returns String formatada com separadores
 */
export const formatarNumero = (valor: number): string => {
  return valor.toLocaleString('pt-BR');
};

/**
 * Formata um percentual
 * @param valor Valor percentual (0-100)
 * @param casasDecimais Número de casas decimais
 * @returns String formatada como percentual
 */
export const formatarPercentual = (valor: number, casasDecimais: number = 1): string => {
  return `${valor.toFixed(casasDecimais)}%`;
};
