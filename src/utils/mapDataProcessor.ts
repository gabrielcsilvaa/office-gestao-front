/**
 * 🗺️ PROCESSADOR DE DADOS GEOGRÁFICOS - A "Fábrica de Mapas"
 * 
 * Sistema que transforma dados fiscais brutos em dados prontos para visualização
 * geográfica baseado no KPI ativo selecionado pelo usuário.
 * 
 * Arquitetura: Cada KPI tem suas próprias regras de processamento, filtragem,
 * cores e conteúdo de popup para criar uma experiência de análise única.
 */

import { determineUf } from './geoEnrichment';

// Interface para dados de estado processados para o mapa
export interface MapStateData {
  uf: string;          // Código da UF (ex: "SP")
  nome: string;        // Nome completo (ex: "São Paulo")
  lat: number;         // Latitude da capital
  lng: number;         // Longitude da capital
  valorPrincipal: number; // Valor que define o raio do marcador
  contagem: number;       // Número de transações
  popupData: Record<string, string | number>; // Dados para o popup
  theme: { color: string; fillColor: string }; // Cores do marcador
}

// Interface para dados de entrada
interface DashboardData {
  saidas?: any[];
  servicos?: any[];
  entradas?: any[];
}

// Configuração de KPIs - "O Livro de Regras"
const KPI_CONFIG = {
  "Receita Bruta Total": {
    dataSources: ['saidas', 'servicos'],
    filter: (item: any) => item.cancelada === 'N',
    color: '#0D6EFD',
    fillColor: '#0D6EFD',
    legend: 'Raio = Valor da Receita',
    popupTemplate: (data: any) => ({
      'Receita': `R$ ${formatCurrency(data.valorPrincipal)}`,
      'Transações': data.contagem,
      'Ticket Médio': `R$ ${formatCurrency(data.valorPrincipal / data.contagem)}`
    })
  },
  "Vendas de Produtos": {
    dataSources: ['saidas'],
    filter: (item: any) => item.cancelada === 'N',
    color: '#0B5ED7',
    fillColor: '#0B5ED7',
    legend: 'Raio = Valor das Vendas',
    popupTemplate: (data: any) => ({
      'Vendas': `R$ ${formatCurrency(data.valorPrincipal)}`,
      'Notas Fiscais': data.contagem,
      'Ticket Médio': `R$ ${formatCurrency(data.valorPrincipal / data.contagem)}`
    })
  },
  "Serviços Prestados": {
    dataSources: ['servicos'],
    filter: (item: any) => item.cancelada === 'N',
    color: '#198754',
    fillColor: '#198754',
    legend: 'Raio = Valor dos Serviços',
    popupTemplate: (data: any) => ({
      'Serviços': `R$ ${formatCurrency(data.valorPrincipal)}`,
      'Notas Fiscais': data.contagem,
      'Ticket Médio': `R$ ${formatCurrency(data.valorPrincipal / data.contagem)}`
    })
  },
  "Compras e Aquisições": {
    dataSources: ['entradas'],
    filter: () => true, // Sem filtro para entradas
    color: '#FFC107',
    fillColor: '#FFC107',
    legend: 'Raio = Valor das Compras',
    popupTemplate: (data: any) => ({
      'Compras': `R$ ${formatCurrency(data.valorPrincipal)}`,
      'Notas Fiscais': data.contagem,
      'Compra Média': `R$ ${formatCurrency(data.valorPrincipal / data.contagem)}`
    })
  },
  "Notas Canceladas": {
    dataSources: ['saidas', 'servicos'],
    filter: (item: any) => item.cancelada === 'S',
    color: '#DC3545',
    fillColor: '#DC3545',
    legend: 'Raio = Valor Cancelado',
    popupTemplate: (data: any) => ({
      'Valor Cancelado': `R$ ${formatCurrency(data.valorPrincipal)}`,
      'Notas Canceladas': data.contagem
    })
  }
} as const;

// Coordenadas das capitais dos estados brasileiros
const ESTADO_COORDINATES: Record<string, { nome: string; lat: number; lng: number }> = {
  'AC': { nome: 'Acre', lat: -9.9749, lng: -67.8243 },
  'AL': { nome: 'Alagoas', lat: -9.6659, lng: -35.7352 },
  'AP': { nome: 'Amapá', lat: 0.0389, lng: -51.0664 },
  'AM': { nome: 'Amazonas', lat: -3.1190, lng: -60.0217 },
  'BA': { nome: 'Bahia', lat: -12.9714, lng: -38.5014 },
  'CE': { nome: 'Ceará', lat: -3.7172, lng: -38.5433 },
  'DF': { nome: 'Distrito Federal', lat: -15.7797, lng: -47.9297 },
  'ES': { nome: 'Espírito Santo', lat: -20.3194, lng: -40.3378 },
  'GO': { nome: 'Goiás', lat: -16.6869, lng: -49.2648 },
  'MA': { nome: 'Maranhão', lat: -2.5307, lng: -44.3068 },
  'MT': { nome: 'Mato Grosso', lat: -15.6014, lng: -56.0977 },
  'MS': { nome: 'Mato Grosso do Sul', lat: -20.4486, lng: -54.6295 },
  'MG': { nome: 'Minas Gerais', lat: -19.9167, lng: -43.9345 },
  'PA': { nome: 'Pará', lat: -1.4558, lng: -48.5044 },
  'PB': { nome: 'Paraíba', lat: -7.1195, lng: -34.8631 },
  'PR': { nome: 'Paraná', lat: -25.4284, lng: -49.2733 },
  'PE': { nome: 'Pernambuco', lat: -8.0578, lng: -34.8829 },
  'PI': { nome: 'Piauí', lat: -5.0949, lng: -42.8041 },
  'RJ': { nome: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
  'RN': { nome: 'Rio Grande do Norte', lat: -5.7945, lng: -35.2094 },
  'RS': { nome: 'Rio Grande do Sul', lat: -30.0346, lng: -51.2177 },
  'RO': { nome: 'Rondônia', lat: -8.7619, lng: -63.9039 },
  'RR': { nome: 'Roraima', lat: 2.8235, lng: -60.6753 },
  'SC': { nome: 'Santa Catarina', lat: -27.5954, lng: -48.5480 },
  'SP': { nome: 'São Paulo', lat: -23.5505, lng: -46.6333 },
  'SE': { nome: 'Sergipe', lat: -10.9472, lng: -37.0731 },
  'TO': { nome: 'Tocantins', lat: -10.2128, lng: -48.3603 }
};

// Utilitário para formatação de moeda
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * 🎯 FUNÇÃO PRINCIPAL: Processador de Dados para Mapa
 * 
 * Esta é a "Fábrica de Mapas" que transforma dados brutos em dados
 * prontos para visualização geográfica baseado no KPI ativo.
 * 
 * @param apiData - Dados completos da API (saidas, servicos, entradas)
 * @param activeKpi - KPI ativo selecionado pelo usuário
 * @returns Array de dados processados para renderização no mapa
 */
export async function processDataForMap(
  apiData: DashboardData,
  activeKpi: string
): Promise<MapStateData[]> {
  console.log(`🗺️ Processando dados para KPI: "${activeKpi}"`);

  // Verificar se o KPI é válido
  if (!KPI_CONFIG[activeKpi as keyof typeof KPI_CONFIG]) {
    console.warn(`❌ KPI "${activeKpi}" não reconhecido. Usando dados vazios.`);
    return [];
  }

  const config = KPI_CONFIG[activeKpi as keyof typeof KPI_CONFIG];
  
  // 1. SELEÇÃO: Coletar dados das fontes apropriadas
  let rawData: any[] = [];
  for (const source of config.dataSources) {
    const sourceData = apiData[source as keyof DashboardData] || [];
    rawData = [...rawData, ...sourceData];
  }

  console.log(`📊 Coletados ${rawData.length} registros de [${config.dataSources.join(', ')}]`);

  // 2. FILTRAGEM: Aplicar filtros específicos do KPI
  const filteredData = rawData.filter(config.filter);
  console.log(`🔍 Após filtragem: ${filteredData.length} registros`);

  // 3. ENRIQUECIMENTO GEOGRÁFICO: Determinar UF para cada registro
  const enrichedData: Array<{ item: any; uf: string }> = [];
  
  for (const item of filteredData) {
    const uf = await determineUf(item);
    enrichedData.push({ item, uf });
  }

  // 4. AGREGAÇÃO: Agrupar por UF
  const agregacaoPorUf: Record<string, { valorTotal: number; contagem: number }> = {};

  enrichedData.forEach(({ item, uf }) => {
    if (uf === 'Desconhecido') return; // Ignorar dados sem localização

    if (!agregacaoPorUf[uf]) {
      agregacaoPorUf[uf] = { valorTotal: 0, contagem: 0 };
    }

    const valor = parseFloat(item.valor || 0);
    agregacaoPorUf[uf].valorTotal += valor;
    agregacaoPorUf[uf].contagem += 1;
  });

  // 5. TRANSFORMAÇÃO: Converter em dados para o mapa
  const mapData: MapStateData[] = Object.entries(agregacaoPorUf)
    .filter(([uf]) => ESTADO_COORDINATES[uf]) // Apenas UFs válidas
    .map(([uf, dados]) => {
      const coordenadas = ESTADO_COORDINATES[uf];
      
      const stateData = {
        uf,
        nome: coordenadas.nome,
        lat: coordenadas.lat,
        lng: coordenadas.lng,
        valorPrincipal: dados.valorTotal,
        contagem: dados.contagem,
        theme: {
          color: config.color,
          fillColor: config.fillColor
        },
        popupData: {} as Record<string, string | number>
      };

      // Aplicar template do popup específico do KPI
      stateData.popupData = config.popupTemplate(stateData);

      return stateData;
    })
    .sort((a, b) => b.valorPrincipal - a.valorPrincipal); // Ordenar por valor (maior primeiro)

  console.log(`✅ Processamento concluído! ${mapData.length} estados com dados para "${activeKpi}"`);
  
  return mapData;
}

/**
 * Função para obter a configuração de um KPI
 */
export function getKpiConfig(activeKpi: string) {
  return KPI_CONFIG[activeKpi as keyof typeof KPI_CONFIG] || null;
}

/**
 * Função para calcular o raio proporcional do marcador no mapa
 */
export function calculateMarkerRadius(
  valor: number, 
  minValor: number, 
  maxValor: number, 
  minRadius: number = 8, 
  maxRadius: number = 40
): number {
  if (maxValor === minValor) return minRadius;
  
  const ratio = (valor - minValor) / (maxValor - minValor);
  return Math.round(minRadius + (ratio * (maxRadius - minRadius)));
}
