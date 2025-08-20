/**
 * SCRIPT DE INICIALIZAÇÃO PARA DEMONSTRAÇÃO DO DASHBOARD DE VENDAS
 * 
 * Este arquivo simula um carregamento automático de dados para demonstração
 */

import { SaidaDataExtendida } from "../types";
import { gerarDadosVendasEstaticos } from "../data/dadosEstaticos";

// Configurações para demonstração
export const CONFIGURACAO_DEMO = {
  AUTO_CARREGAR_DADOS: true,
  MOSTRAR_TOOLTIPS_DEMO: true,
  SIMULAR_DELAY_API: 1000, // 1 segundo
  PERIODO_PADRAO_MESES: 3, // Últimos 3 meses
  MENSAGEM_BOAS_VINDAS: "🎯 Dashboard de Vendas - Demonstração com dados fictícios"
};

// Função para obter dados de demonstração
export function obterDadosDemo(): SaidaDataExtendida[] {
  console.log("🎬 Iniciando demonstração do Dashboard de Vendas");
  console.log("📊 Gerando 500 transações de vendas fictícias...");
  
  const dados = gerarDadosVendasEstaticos();
  
  console.log(`✅ ${dados.length} vendas geradas para demonstração`);
  console.log("📈 Incluindo dados de:");
  console.log("   • Vendas por estado (27 UFs)");
  console.log("   • 15 produtos diferentes");
  console.log("   • 20 clientes fictícios");
  console.log("   • Período: Janeiro a Dezembro 2024");
  console.log("   • Análise geográfica completa");
  console.log("   • Rankings de produtos e clientes");
  console.log("   • Métricas de sazonalidade");
  
  return dados;
}

// Estatísticas dos dados de demonstração
export function estatisticasDados(dados: SaidaDataExtendida[]) {
  const dadosAtivos = dados.filter(d => d.cancelada === "N");
  
  const estatisticas = {
    totalVendas: dadosAtivos.reduce((acc, d) => acc + (d.valor_total || 0), 0),
    totalTransacoes: dadosAtivos.length,
    ticketMedio: 0,
    clientesUnicos: new Set(dadosAtivos.map(d => d.nome_cliente)).size,
    produtosUnicos: new Set(dadosAtivos.map(d => d.produto_nome)).size,
    estadosAtivos: new Set(dadosAtivos.map(d => d.UF)).size,
    periodoInicio: dadosAtivos.sort((a, b) => a.data.localeCompare(b.data))[0]?.data,
    periodoFim: dadosAtivos.sort((a, b) => b.data.localeCompare(a.data))[0]?.data,
  };
  
  estatisticas.ticketMedio = estatisticas.totalVendas / estatisticas.totalTransacoes;
  
  return estatisticas;
}

// Logs informativos para a demonstração
export function logDemonstracao() {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 DASHBOARD DE VENDAS - MODO DEMONSTRAÇÃO");
  console.log("=".repeat(60));
  console.log("📊 FUNCIONALIDADES DISPONÍVEIS:");
  console.log("   ✅ 10 KPIs especializados de vendas");
  console.log("   ✅ Mapa geográfico interativo (React-Leaflet)");
  console.log("   ✅ Rankings de produtos e clientes");
  console.log("   ✅ Análises de concentração (Pareto)");
  console.log("   ✅ Métricas de sazonalidade");
  console.log("   ✅ Sistema de filtros avançado");
  console.log("   ✅ Visualizações responsivas");
  console.log("");
  console.log("🎯 INSTRUÇÕES:");
  console.log("   1. Selecione diferentes KPIs no painel superior");
  console.log("   2. Explore o mapa geográfico com zoom/pan");
  console.log("   3. Altere filtros de período e cliente");
  console.log("   4. Analise rankings de produtos/clientes");
  console.log("   5. Verifique métricas avançadas no final");
  console.log("");
  console.log("📈 DADOS:");
  console.log("   • 500 transações fictícias");
  console.log("   • Período: 2024 completo");
  console.log("   • 27 estados brasileiros");
  console.log("   • 15 produtos diferentes");
  console.log("   • 20 clientes diversos");
  console.log("=".repeat(60) + "\n");
}

export default {
  CONFIGURACAO_DEMO,
  obterDadosDemo,
  estatisticasDados,
  logDemonstracao
};
