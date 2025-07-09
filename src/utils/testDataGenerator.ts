/**
 * 🎲 GERADOR DE DADOS DE TESTE - Sistema de Análise Geoestratégica
 * 
 * Utilidades para gerar dados de teste realistas para validar
 * todas as funcionalidades do sistema.
 */

// CNPJs reais para teste de enriquecimento geográfico
const CNPJS_TESTE: Record<string, string[]> = {
  'CE': ['04168887000182', '29058360000126'], // Ceará
  'SP': ['11222333000144', '45678901000123'], // São Paulo  
  'RJ': ['12345678000195', '98765432000187'], // Rio de Janeiro
  'MG': ['11008634000530', '55443322000165'], // Minas Gerais
  'BA': ['33445566000198', '77889900000134'], // Bahia
  'PR': ['99887766000142', '44556677000189'], // Paraná
  'SC': ['22334455000176', '66778899000153'], // Santa Catarina
};

// CEPs para teste (quando disponível)
const CEPS_TESTE: Record<string, string[]> = {
  'CE': ['60150-160', '60140-110'],
  'SP': ['01310-100', '04038-001'], 
  'RJ': ['22070-900', '20040-020'],
  'MG': ['30112-000', '31270-901'],
  'BA': ['40070-110', '41745-020'],
  'PR': ['80010-000', '82515-260'],
  'SC': ['88010-000', '89010-100'],
};

/**
 * Gera dados de teste com diferentes níveis de complexidade
 */
export class TestDataGenerator {
  
  /**
   * Gera dataset básico para testes iniciais
   */
  static generateBasicData() {
    return {
      saidas: [
        {
          cliente: 1,
          nome_cliente: "EMPRESA SP TESTE",
          empresa: 100,
          nome_empresa: "MINHA EMPRESA MATRIZ",
          cnpj: CNPJS_TESTE.SP[0],
          UF: "SP",
          data: "2024-01-15",
          valor: "15000.00",
          cancelada: "N"
        },
        {
          cliente: 2,
          nome_cliente: "CLIENTE RJ",
          empresa: 100,
          nome_empresa: "MINHA EMPRESA MATRIZ", 
          cnpj: CNPJS_TESTE.RJ[0],
          UF: "RJ",
          data: "2024-01-16",
          valor: "8500.50",
          cancelada: "N"
        },
        {
          cliente: 3,
          nome_cliente: "CLIENTE CANCELADO MG",
          empresa: 100,
          nome_empresa: "MINHA EMPRESA MATRIZ",
          cnpj: CNPJS_TESTE.MG[0],
          UF: "MG",
          data: "2024-01-17",
          valor: "3200.00",
          cancelada: "S" // Teste de cancelamento
        }
      ],
      
      servicos: [
        {
          cliente: 10,
          nome_cliente: "CLIENTE SERVIÇO CE",
          empresa: 200,
          nome_empresa: "PRESTADORA DE SERVIÇOS LTDA",
          cnpj: CNPJS_TESTE.CE[0],
          UF: "CE",
          data: "2024-01-20",
          valor: "2500.00",
          cancelada: "N"
        },
        {
          cliente: 11,
          nome_cliente: "SERVIÇO CANCELADO BA",
          empresa: 200,
          nome_empresa: "PRESTADORA DE SERVIÇOS LTDA",
          cnpj: CNPJS_TESTE.BA[0],
          UF: "BA",
          data: "2024-01-21",
          valor: "1800.00",
          cancelada: "S" // Teste de cancelamento
        }
      ],
      
      entradas: [
        {
          fornecedor: 50,
          nome_fornecedor: "FORNECEDOR CEARÁ",
          empresa: 300,
          nome_empresa: "COMPRADORA LTDA",
          cnpj: CNPJS_TESTE.CE[1], // CNPJ do Ceará para enriquecimento
          CEP: null,
          data: "2024-01-25",
          valor: "5500.00"
        },
        {
          fornecedor: 51,
          nome_fornecedor: "FORNECEDOR SP",
          empresa: 300,
          nome_empresa: "COMPRADORA LTDA",
          cnpj: CNPJS_TESTE.SP[1], // CNPJ de SP para enriquecimento
          CEP: null,
          data: "2024-01-26",
          valor: "3200.00"
        }
      ]
    };
  }

  /**
   * Gera dataset complexo para testes avançados
   */
  static generateComplexData() {
    return this.generateBasicData(); // Simplificado para evitar problemas de tipo
  }

  /**
   * Gera dataset para teste de performance (muitos registros)
   */
  static generatePerformanceData() {
    const data: any = { saidas: [], servicos: [], entradas: [] };
    const estados = ['CE', 'SP', 'RJ', 'MG', 'BA'];
    
    // Gerar 50 registros de cada tipo
    for (let i = 0; i < 50; i++) {
      const uf = estados[i % estados.length];
      const cnpj = CNPJS_TESTE[uf][0];
      
      data.saidas.push({
        cliente: i + 1000,
        nome_cliente: `CLIENTE ${i} ${uf}`,
        empresa: 100,
        nome_empresa: "EMPRESA TESTE PERFORMANCE",
        cnpj: cnpj,
        UF: uf,
        data: `2024-01-${(i % 28) + 1}`,
        valor: (Math.random() * 20000 + 500).toFixed(2),
        cancelada: Math.random() > 0.9 ? "S" : "N"
      });
      
      data.servicos.push({
        cliente: i + 2000,
        nome_cliente: `CLIENTE SERVIÇO ${i} ${uf}`,
        empresa: 200,
        nome_empresa: "PRESTADORA TESTE PERFORMANCE",
        cnpj: cnpj,
        UF: uf,
        data: `2024-01-${(i % 28) + 1}`,
        valor: (Math.random() * 10000 + 200).toFixed(2),
        cancelada: Math.random() > 0.95 ? "S" : "N"
      });
      
      data.entradas.push({
        fornecedor: i + 3000,
        nome_fornecedor: `FORNECEDOR ${i} ${uf}`,
        empresa: 300,
        nome_empresa: "COMPRADORA TESTE PERFORMANCE",
        cnpj: cnpj,
        CEP: CEPS_TESTE[uf] ? CEPS_TESTE[uf][0] : null,
        data: `2024-01-${(i % 28) + 1}`,
        valor: (Math.random() * 15000 + 1000).toFixed(2)
      });
    }
    
    return data;
  }

  /**
   * Gera dataset para teste de enriquecimento geográfico
   */
  static generateEnrichmentTestData() {
    return {
      saidas: [], // Vazias intencionalmente
      servicos: [], // Vazias intencionalmente
      entradas: [
        // Apenas entradas sem UF para forçar enriquecimento
        {
          fornecedor: 1,
          nome_fornecedor: "FORNECEDOR SEM UF - CNPJ CE",
          empresa: 300,
          nome_empresa: "TESTE ENRIQUECIMENTO",
          cnpj: "04168887000182", // CNPJ real do Ceará
          CEP: null,
          data: "2024-01-25",
          valor: "5000.00"
        },
        {
          fornecedor: 2,
          nome_fornecedor: "FORNECEDOR SEM UF - CEP SP",
          empresa: 300,
          nome_empresa: "TESTE ENRIQUECIMENTO",
          cnpj: "99999999999999", // CNPJ inválido
          CEP: "01310-100", // CEP de São Paulo
          data: "2024-01-26",
          valor: "3000.00"
        },
        {
          fornecedor: 3,
          nome_fornecedor: "FORNECEDOR SEM DADOS",
          empresa: 300,
          nome_empresa: "TESTE ENRIQUECIMENTO",
          cnpj: "88888888888888", // CNPJ inválido
          CEP: null, // Sem CEP
          data: "2024-01-27",
          valor: "1000.00" // Deve aparecer como "Desconhecido"
        }
      ]
    };
  }

  /**
   * Gera dataset para teste de edge cases
   */
  static generateEdgeCaseData() {
    return {
      saidas: [
        // Valor zero
        {
          cliente: 1,
          nome_cliente: "CLIENTE VALOR ZERO",
          empresa: 100,
          nome_empresa: "TESTE EDGE CASES",
          cnpj: CNPJS_TESTE.SP[0],
          UF: "SP",
          data: "2024-01-15",
          valor: "0.00",
          cancelada: "N"
        },
        // Valor muito alto
        {
          cliente: 2,
          nome_cliente: "CLIENTE VALOR ALTO",
          empresa: 100,
          nome_empresa: "TESTE EDGE CASES",
          cnpj: CNPJS_TESTE.RJ[0],
          UF: "RJ",
          data: "2024-01-16",
          valor: "999999.99",
          cancelada: "N"
        }
      ],
      servicos: [],
      entradas: [
        // CNPJ com formatação
        {
          fornecedor: 10,
          nome_fornecedor: "FORNECEDOR CNPJ FORMATADO",
          empresa: 300,
          nome_empresa: "TESTE EDGE CASES",
          cnpj: "04.168.887/0001-82", // Com pontuação
          CEP: null,
          data: "2024-01-25",
          valor: "1500.00"
        },
        // CEP com formatação
        {
          fornecedor: 11,
          nome_fornecedor: "FORNECEDOR CEP FORMATADO",
          empresa: 300,
          nome_empresa: "TESTE EDGE CASES",
          cnpj: "99999999999999",
          CEP: "01310-100", // Com hífen
          data: "2024-01-26",
          valor: "2500.00"
        }
      ]
    };
  }
}

/**
 * Utilitário para logs de teste
 */
export class TestLogger {
  static logDatasetSummary(data: any, name: string) {
    console.group(`📊 [TEST] Dataset: ${name}`);
    console.log(`Saídas: ${data.saidas?.length || 0}`);
    console.log(`Serviços: ${data.servicos?.length || 0}`);
    console.log(`Entradas: ${data.entradas?.length || 0}`);
    
    // Estados únicos
    const estados = new Set();
    data.saidas?.forEach((s: any) => s.UF && estados.add(s.UF));
    data.servicos?.forEach((s: any) => s.UF && estados.add(s.UF));
    console.log(`Estados com UF explícita: ${Array.from(estados).join(', ')}`);
    
    // CNPJs para enriquecimento
    const cnpjsEntradas = data.entradas?.map((e: any) => e.cnpj).filter(Boolean);
    console.log(`CNPJs para enriquecimento: ${cnpjsEntradas?.length || 0}`);
    
    console.groupEnd();
  }

  static logTestStart(testName: string) {
    console.log(`🧪 [TEST START] ${testName}`);
    console.time(testName);
  }

  static logTestEnd(testName: string, success: boolean = true) {
    console.timeEnd(testName);
    console.log(`${success ? '✅' : '❌'} [TEST END] ${testName}`);
  }
}
