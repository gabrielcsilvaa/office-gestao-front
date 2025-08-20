/**
 * DASHBOARD DE VENDAS - PÁGINA PRINCIPAL
 * 
 * Dashboard especializado em análise de vendas/saídas com:
 * - KPIs específicos de vendas
 * - Visualização geográfica
 * - Rankings de produtos e clientes
 * - Análises avançadas e sazonalidade
 */

"use client";
import { Cairo } from "next/font/google";
import { useState, useEffect } from "react";
import Image from "next/image";

// Componentes reutilizados do dashboard fiscal
import { SmartDropdown } from "../components/SmartDropdown";
import { Toast } from "../components/Toast";
import { useDropdown } from "../hooks/useDropdown";
import Calendar from "@/components/calendar";
import Loading from "@/app/loading";

// Componentes específicos de vendas
import VendasKpiSelector from "./components/VendasKpiSelector";
import MapaVendas from "./components/MapaVendas";
import RankingComponent from "./components/RankingComponent";

// Componentes reutilizados (adaptados)
import KpiCardsGrid from "../components/KpiCardsGrid";
import EvolucaoCard from "../components/EvolucaoCard";
import ProgressBarCard from "../components/ProgressBarCard";
import EmptyCard from "../components/EmptyCard";

// Hooks e utilitários
import { useVendasDashboard, useFiltrosVendas } from "./hooks/useVendasDashboard";
import { VendasKpiType, TipoVisualizacaoMapa, PeriodoAnalise, SaidaDataExtendida } from "./types";
import { formatarValorVendas, getVendasKpiConfig } from "./utils/vendasKpiUtils";

// Dados estáticos para demonstração
import { gerarDadosVendasEstaticos } from "./data/dadosEstaticos";
import { obterDadosDemo, logDemonstracao, estatisticasDados } from "./utils/demoUtils";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export default function DashboardVendas() {
  const { openDropdown, handleToggleDropdown } = useDropdown();
  const { filtros, atualizarFiltro, limparFiltros, temFiltrosAtivos } = useFiltrosVendas();

  // Estados do componente
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  // Definir período padrão (últimos 3 meses) para carregar dados automaticamente
  const dataAtual = new Date();
  const dataInicio = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 3, 1);
  
  const [startDate, setStartDate] = useState<string | null>(dataInicio.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string | null>(dataAtual.toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [kpiSelecionado, setKpiSelecionado] = useState<VendasKpiType>(VendasKpiType.VENDAS_TOTAIS);
  const [tipoVisualizacaoMapa, setTipoVisualizacaoMapa] = useState<TipoVisualizacaoMapa>(TipoVisualizacaoMapa.VALOR);
  const [data, setData] = useState<{ saidas: SaidaDataExtendida[] } | null>(null);
  const [clienteOptions, setClienteOptions] = useState<string[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info' | 'warning';
  } | null>(null);

  // Hook principal para dados de vendas
  const { 
    data: vendasData, 
    loading: vendasLoading, 
    error: vendasError,
    isEmpty 
  } = useVendasDashboard(data?.saidas || [], {
    ...filtros,
    cliente: clienteSelecionado || undefined,
    periodo: startDate && endDate ? { inicio: startDate, fim: endDate } : undefined
  });

  // Buscar dados (usando dados estáticos para demonstração)
  const fetchData = async () => {
    if (!startDate || !endDate) {
      setToast({
        message: "Por favor, selecione um período para análise.",
        type: "warning"
      });
      return;
    }

    setLoading(true);
    setToast(null);

    try {
      // **USANDO DADOS ESTÁTICOS PARA DEMONSTRAÇÃO**
      console.log("🎯 Carregando dados estáticos para demonstração...");
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Gerar dados estáticos com funções de demonstração
      const dadosEstaticos = obterDadosDemo();
      const stats = estatisticasDados(dadosEstaticos);
      
      // Filtrar por período se necessário
      const dadosFiltrados = dadosEstaticos.filter(item => {
        const dataItem = new Date(item.data);
        const dataInicio = new Date(startDate);
        const dataFim = new Date(endDate);
        return dataItem >= dataInicio && dataItem <= dataFim;
      });
      
      const result = { saidas: dadosFiltrados };
      setData(result);
      
      // Atualizar opções de clientes
      if (result.saidas && Array.isArray(result.saidas)) {
        const clientes = [...new Set(result.saidas.map((item: SaidaDataExtendida) => item.nome_cliente))]
          .filter(Boolean)
          .sort() as string[];
        setClienteOptions(clientes);
      }

      // Log detalhado para demonstração
      console.log(`📊 Estatísticas dos dados carregados:`);
      console.log(`   • Total de vendas: R$ ${stats.totalVendas.toLocaleString('pt-BR')}`);
      console.log(`   • Transações: ${stats.totalTransacoes}`);
      console.log(`   • Ticket médio: R$ ${stats.ticketMedio.toFixed(2)}`);
      console.log(`   • Clientes únicos: ${stats.clientesUnicos}`);
      console.log(`   • Produtos únicos: ${stats.produtosUnicos}`);
      console.log(`   • Estados ativos: ${stats.estadosAtivos}`);

      setToast({
        message: `✅ Dados estáticos carregados! ${result.saidas?.length || 0} vendas encontradas no período. Valor total: R$ ${stats.totalVendas.toLocaleString('pt-BR')}`,
        type: "success"
      });

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setToast({
        message: "Erro ao carregar dados. Usando dados estáticos para demonstração.",
        type: "warning"
      });
      
      // Fallback para dados estáticos em caso de erro
      const dadosEstaticos = gerarDadosVendasEstaticos();
      const result = { saidas: dadosEstaticos };
      setData(result);
    } finally {
      setLoading(false);
    }
  };

  // Buscar dados automaticamente quando datas mudarem
  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  // Carregar dados estáticos na inicialização
  useEffect(() => {
    logDemonstracao(); // Log detalhado no console
    console.log("📊 Dashboard de Vendas - Carregando dados estáticos para demonstração");
    
    // Carregar dados estáticos imediatamente
    const dadosEstaticos = gerarDadosVendasEstaticos();
    const result = { saidas: dadosEstaticos };
    setData(result);
    
    // Atualizar opções de clientes
    if (result.saidas && Array.isArray(result.saidas)) {
      const clientes = [...new Set(result.saidas.map((item: SaidaDataExtendida) => item.nome_cliente))]
        .filter(Boolean)
        .sort() as string[];
      setClienteOptions(clientes);
    }
    
    setToast({
      message: `🎯 Dashboard carregado com ${dadosEstaticos.length} vendas estáticas para demonstração!`,
      type: "info"
    });
    
    // Auto-hide toast após 5 segundos
    setTimeout(() => setToast(null), 5000);
  }, []);

  // Preparar dados para os cards KPI
  const prepararCardsData = () => {
    if (!vendasData || isEmpty) return [];

    const config = getVendasKpiConfig(kpiSelecionado);
    
    return [
      {
        title: "Vendas Totais",
        value: formatarValorVendas(vendasData.totalVendas, VendasKpiType.VENDAS_TOTAIS),
        tooltipText: "Valor total de todas as vendas realizadas no período"
      },
      {
        title: "Ticket Médio",
        value: formatarValorVendas(vendasData.ticketMedio, VendasKpiType.TICKET_MEDIO_VENDAS),
        tooltipText: "Valor médio por transação de venda"
      },
      {
        title: "Total de Clientes",
        value: vendasData.numeroClientes.toString(),
        tooltipText: "Número total de clientes únicos no período"
      },
      {
        title: "Quantidade Vendida",
        value: vendasData.totalQuantidade.toLocaleString('pt-BR'),
        tooltipText: "Quantidade total de itens vendidos"
      }
    ];
  };

  const cardsData = prepararCardsData();

  return (
    <div className={`min-h-screen bg-gray-50 ${cairo.className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard de Vendas
              </h1>
              <p className="mt-2 text-gray-600">
                Análise detalhada de vendas e saídas com visualização geográfica
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {temFiltrosAtivos() && (
                <button
                  onClick={limparFiltros}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Limpar Filtros
                </button>
              )}
              
              <button
                onClick={fetchData}
                disabled={loading || !startDate || !endDate}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Carregando..." : "Atualizar"}
              </button>
            </div>
          </div>
        </div>

        {/* Controles Principais */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Seleção de Período */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período de Análise
            </label>
            <Calendar
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </div>

          {/* Filtro de Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente (Opcional)
            </label>
            <SmartDropdown
              options={clienteOptions}
              label="Todos os Clientes"
              widthClass="w-full"
              selectedValue={clienteSelecionado}
              onValueChange={setClienteSelecionado}
              isOpen={openDropdown === 'cliente'}
              onToggle={() => handleToggleDropdown('cliente')}
              disabled={loading}
              areDatesSelected={!!startDate && !!endDate}
            />
          </div>

          {/* Tipo de Visualização do Mapa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visualização do Mapa
            </label>
            <select
              value={tipoVisualizacaoMapa}
              onChange={(e) => setTipoVisualizacaoMapa(e.target.value as TipoVisualizacaoMapa)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={TipoVisualizacaoMapa.VALOR}>Valor das Vendas</option>
              <option value={TipoVisualizacaoMapa.QUANTIDADE}>Quantidade de Vendas</option>
              <option value={TipoVisualizacaoMapa.CLIENTES}>Número de Clientes</option>
              <option value={TipoVisualizacaoMapa.TICKET_MEDIO}>Ticket Médio</option>
            </select>
          </div>
        </div>

        {/* Seletor de KPI */}
        <div className="mb-8">
          <VendasKpiSelector
            selectedKpi={kpiSelecionado}
            onKpiChange={setKpiSelecionado}
            disabled={loading}
            compactMode={false}
          />
        </div>

        {/* Loading State */}
        {(loading || vendasLoading) && <Loading />}

        {/* Error State */}
        {vendasError && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erro no carregamento
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {vendasError}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo Principal */}
        {!loading && !vendasLoading && (
          <>
            {isEmpty ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-gray-400 text-4xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Nenhuma venda encontrada
                </h3>
                <p className="text-gray-500">
                  Selecione um período ou ajuste os filtros para visualizar os dados de vendas
                </p>
              </div>
            ) : (
              <>
                {/* Cards de KPIs */}
                <div className="mb-8">
                  <KpiCardsGrid cardsData={cardsData} />
                </div>

                {/* Grid Principal de Análises */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                  
                  {/* Evolução Temporal */}
                  <div className="xl:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Evolução das Vendas
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Análise temporal das vendas no período selecionado
                      </p>
                      {/* Aqui seria o gráfico - temporariamente simplificado */}
                      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-gray-400 text-2xl mb-2">📈</div>
                          <div className="text-gray-500">Gráfico de evolução</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Métricas Avançadas */}
                  <div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Métricas Avançadas
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Indicadores de performance de vendas
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Concentração de Clientes</span>
                          <span className="font-medium">{vendasData.metricas.concentracaoClientes.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Diversificação de Produtos</span>
                          <span className="font-medium">{vendasData.metricas.diversificacaoProdutos.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Índice de Sazonalidade</span>
                          <span className="font-medium">{vendasData.metricas.sazonalidadeIndex.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Taxa de Recorrência</span>
                          <span className="font-medium">{vendasData.metricas.recorrencia.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mapa Geográfico */}
                <div className="mb-8">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-700">
                        Distribuição Geográfica das Vendas
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Visualização das vendas por estado brasileiro
                      </p>
                    </div>
                    
                    <MapaVendas
                      dados={vendasData.dadosGeograficos}
                      tipoVisualizacao={tipoVisualizacaoMapa}
                      kpiSelecionado={kpiSelecionado}
                      loading={vendasLoading}
                      altura="500px"
                    />
                  </div>
                </div>

                {/* Rankings */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  
                  {/* Ranking de Produtos */}
                  <RankingComponent
                    tipo="produtos"
                    dados={vendasData.rankingProdutos}
                    limite={10}
                    loading={vendasLoading}
                    titulo="Top Produtos por Vendas"
                  />

                  {/* Ranking de Clientes */}
                  <RankingComponent
                    tipo="clientes"
                    dados={vendasData.rankingClientes}
                    limite={10}
                    loading={vendasLoading}
                    titulo="Top Clientes por Volume"
                  />
                </div>
              </>
            )}
          </>
        )}

        {/* Toast de Notificação */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
