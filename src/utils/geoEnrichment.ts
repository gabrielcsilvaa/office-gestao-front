/**
 * 🌎 Sistema de Enriquecimento Geográfico
 * 
 * Implementa a arquitetura híbrida e priorizada recomendada pelo fiscal:
 * 1. Prioridade 1: Dado Explícito (UF já existe)
 * 2. Prioridade 2: Dado Geográfico (CEP via ViaCEP)
 * 3. Prioridade 3: Dado Cadastral (CNPJ via BrasilAPI)
 * 4. Prioridade 4: Desconhecido
 */

// Cache para evitar consultas desnecessárias
const cepCache = new Map<string, string | null>();
const cnpjCache = new Map<string, string | null>();

// Validação de UF brasileiras
const VALID_UF = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

/**
 * Função auxiliar para consulta de CEP via ViaCEP
 * @param cep - CEP para consulta (com ou sem formatação)
 * @returns UF ou null se não encontrado
 */
async function getUfFromCep(cep: string): Promise<string | null> {
  if (!cep) return null;
  
  // Limpar CEP (remover caracteres não numéricos)
  const cleanCep = cep.replace(/\D/g, '');
  
  // Validar formato do CEP (8 dígitos)
  if (cleanCep.length !== 8) return null;
  
  // Verificar cache primeiro
  if (cepCache.has(cleanCep)) {
    return cepCache.get(cleanCep) || null;
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    
    if (!response.ok) {
      cepCache.set(cleanCep, null);
      return null;
    }
    
    const data = await response.json();
    
    // Verificar se retornou erro da API
    if (data.erro) {
      cepCache.set(cleanCep, null);
      return null;
    }
    
    const uf = data.uf || null;
    
    // Validar se é uma UF válida
    const validUf = uf && VALID_UF.includes(uf.toUpperCase()) ? uf.toUpperCase() : null;
    
    // Salvar no cache
    cepCache.set(cleanCep, validUf);
    
    return validUf;
  } catch (error) {
    console.error("❌ Erro ao consultar CEP:", cleanCep, error);
    cepCache.set(cleanCep, null);
    return null;
  }
}

/**
 * Função auxiliar para consulta de CNPJ via BrasilAPI
 * @param cnpj - CNPJ para consulta (com ou sem formatação)
 * @returns UF ou null se não encontrado
 */
async function getUfFromCnpj(cnpj: string): Promise<string | null> {
  if (!cnpj) return null;
  
  // Limpar CNPJ (remover caracteres não numéricos)
  const cleanCnpj = cnpj.replace(/\D/g, '');
  
  // Validar formato do CNPJ (14 dígitos)
  if (cleanCnpj.length !== 14) return null;
  
  // Verificar cache primeiro
  if (cnpjCache.has(cleanCnpj)) {
    return cnpjCache.get(cleanCnpj) || null;
  }
  
  try {
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
    
    if (!response.ok) {
      cnpjCache.set(cleanCnpj, null);
      return null;
    }
    
    const data = await response.json();
    const uf = data.uf || null;
    
    // Validar se é uma UF válida
    const validUf = uf && VALID_UF.includes(uf.toUpperCase()) ? uf.toUpperCase() : null;
    
    // Salvar no cache
    cnpjCache.set(cleanCnpj, validUf);
    
    return validUf;
  } catch (error) {
    console.error("❌ Erro ao consultar CNPJ:", cleanCnpj, error);
    cnpjCache.set(cleanCnpj, null);
    return null;
  }
}

/**
 * Interface para dados de entrada flexível
 */
interface DataItem {
  UF?: string;
  uf?: string;
  CEP?: string;
  cep?: string;
  CNPJ?: string;
  cnpj?: string;
  [key: string]: any;
}

/**
 * Função principal que aplica a lógica de prioridade fiscal
 * Implementa a arquitetura híbrida recomendada
 * 
 * @param item - Objeto com dados que podem conter UF, CEP ou CNPJ
 * @returns Promise<string> - UF determinada ou "Desconhecido"
 */
export async function determineUf(item: DataItem): Promise<string> {
  // 1. Prioridade 1: Dado Explícito (Confiança Máxima)
  const explicitUf = item.UF || item.uf;
  if (explicitUf && typeof explicitUf === 'string' && explicitUf.length === 2) {
    const upperUf = explicitUf.toUpperCase();
    if (VALID_UF.includes(upperUf)) {
      return upperUf;
    }
  }

  // 2. Prioridade 2: Dado Geográfico (CEP)
  const cep = item.CEP || item.cep;
  if (cep) {
    const ufFromCep = await getUfFromCep(cep);
    if (ufFromCep) {
      return ufFromCep;
    }
  }
  
  // 3. Prioridade 3: Dado Cadastral (CNPJ)
  const cnpj = item.CNPJ || item.cnpj;
  if (cnpj) {
    const ufFromCnpj = await getUfFromCnpj(cnpj);
    if (ufFromCnpj) {
      return ufFromCnpj;
    }
  }
  
  // 4. Prioridade 4: Desconhecido
  return "Desconhecido";
}

/**
 * Função para processar arrays de dados em lote
 * Processa com controle de taxa para evitar sobrecarga das APIs
 * 
 * @param items - Array de itens para processar
 * @param batchSize - Tamanho do lote (padrão: 10)
 * @param delayMs - Delay entre lotes em ms (padrão: 100ms)
 * @returns Promise<Array<{item: DataItem, uf: string}>>
 */
export async function enrichDataWithUf<T extends DataItem>(
  items: T[], 
  batchSize: number = 10, 
  delayMs: number = 100
): Promise<Array<{ item: T, uf: string }>> {
  const results: Array<{ item: T, uf: string }> = [];
  
  console.log(`🌎 Iniciando enriquecimento geográfico de ${items.length} registros...`);
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    const batchResults = await Promise.all(
      batch.map(async (item) => ({
        item,
        uf: await determineUf(item)
      }))
    );
    
    results.push(...batchResults);
    
    // Log de progresso
    console.log(`📍 Processados ${Math.min(i + batchSize, items.length)}/${items.length} registros`);
    
    // Delay entre lotes para não sobrecarregar as APIs
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  // Estatísticas finais
  const stats = results.reduce((acc, { uf }) => {
    acc[uf] = (acc[uf] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log("🎯 Enriquecimento concluído! Estatísticas por UF:", stats);
  
  return results;
}

// Função para agregar dados por UF
export function aggregateByUf<T extends { uf_processada: string; valor: string }>(
  data: T[],
  viewType: 'quantidade' | 'valor'
): Array<{
  uf: string;
  nome: string;
  quantidade: number;
  valor: number;
  lat: number;
  lng: number;
}> {
  // Coordenadas das capitais dos estados
  const estadosCoords: Record<string, { nome: string; lat: number; lng: number }> = {
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
    'TO': { nome: 'Tocantins', lat: -10.2128, lng: -48.3603 },
    'DESCONHECIDO': { nome: 'Localização Desconhecida', lat: -15.7942, lng: -47.8825 }
  };

  const agregacao: Record<string, { quantidade: number; valor: number }> = {};

  // Agregar dados por UF
  data.forEach(item => {
    const uf = item.uf_processada;
    if (!agregacao[uf]) {
      agregacao[uf] = { quantidade: 0, valor: 0 };
    }
    
    agregacao[uf].quantidade += 1;
    agregacao[uf].valor += parseFloat(item.valor) || 0;
  });

  // Converter para array com coordenadas
  return Object.entries(agregacao).map(([uf, dados]) => ({
    uf,
    nome: estadosCoords[uf]?.nome || 'Desconhecido',
    quantidade: dados.quantidade,
    valor: dados.valor,
    lat: estadosCoords[uf]?.lat || -15.7942,
    lng: estadosCoords[uf]?.lng || -47.8825
  }));
}
