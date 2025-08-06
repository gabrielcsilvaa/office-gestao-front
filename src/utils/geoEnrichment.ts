/**
 * Funções para enriquecimento geográfico dos dados
 * Versão simplificada que trabalha apenas com UFs explícitas
 */

export interface UfData {
  uf: string;
  count: number;
}

/**
 * Determina a UF baseado nos dados disponíveis
 * Versão simplificada que usa apenas UF explícita
 */
export function determineUf(data: any): string {
  console.log('🔍 [determineUf] Analisando item:', data);
  
  // Lista de campos possíveis onde a UF pode estar
  const possibleUfFields = [
    'uf', 'UF', 'estado', 'Estado', 'ufDestino', 'ufOrigem', 
    'estadoDestino', 'estadoOrigem', 'ufCliente', 'ufFornecedor'
  ];
  
  // Tentar encontrar UF em qualquer um dos campos possíveis
  for (const field of possibleUfFields) {
    const ufValue = data[field];
    if (ufValue && typeof ufValue === 'string' && ufValue.length === 2) {
      const uf = ufValue.toUpperCase();
      console.log(`✅ [determineUf] UF encontrada no campo "${field}": ${uf}`);
      return uf;
    }
  }
  
  // Se tem endereço ou dados de localização, tentar extrair UF
  if (data.endereco || data.enderecoCompleto) {
    const endereco = data.endereco || data.enderecoCompleto;
    const ufMatch = endereco.match(/\b([A-Z]{2})\b/);
    if (ufMatch) {
      const uf = ufMatch[1];
      console.log(`✅ [determineUf] UF extraída do endereço: ${uf}`);
      return uf;
    }
  }
  
  console.log('⚠️ [determineUf] Nenhuma UF encontrada, retornando "Desconhecido"');
  
  // Para qualquer outro caso, retorna "Desconhecido"
  return 'Desconhecido';
}

/**
 * Agrupa dados por UF
 */
export function groupByUf(data: any[]): UfData[] {
  const ufCounts: { [key: string]: number } = {};

  data.forEach(item => {
    const uf = determineUf(item);
    ufCounts[uf] = (ufCounts[uf] || 0) + 1;
  });

  return Object.entries(ufCounts).map(([uf, count]) => ({
    uf,
    count
  }));
}

/**
 * Lista de UFs válidas do Brasil
 */
export const VALID_UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

/**
 * Valida se uma UF é válida
 */
export function isValidUf(uf: string): boolean {
  return VALID_UFS.includes(uf.toUpperCase());
}
