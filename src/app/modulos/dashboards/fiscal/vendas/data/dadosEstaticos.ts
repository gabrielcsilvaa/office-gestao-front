/**
 * DADOS ESTÁTICOS PARA DASHBOARD DE VENDAS
 * 
 * Arquivo contendo dados de exemplo para demonstrar
 * todas as funcionalidades do dashboard de vendas
 */

import { SaidaDataExtendida } from "../types";

// Estados brasileiros com coordenadas
export const estadosBrasileiros = [
  { codigo: "SP", nome: "São Paulo", lat: -23.5505, lng: -46.6333 },
  { codigo: "RJ", nome: "Rio de Janeiro", lat: -22.9068, lng: -43.1729 },
  { codigo: "MG", nome: "Minas Gerais", lat: -19.9167, lng: -43.9345 },
  { codigo: "RS", nome: "Rio Grande do Sul", lat: -30.0346, lng: -51.2177 },
  { codigo: "PR", nome: "Paraná", lat: -25.4284, lng: -49.2733 },
  { codigo: "SC", nome: "Santa Catarina", lat: -27.5954, lng: -48.5480 },
  { codigo: "BA", nome: "Bahia", lat: -12.9714, lng: -38.5014 },
  { codigo: "GO", nome: "Goiás", lat: -16.6869, lng: -49.2648 },
  { codigo: "PE", nome: "Pernambuco", lat: -8.0476, lng: -34.8770 },
  { codigo: "CE", nome: "Ceará", lat: -3.7319, lng: -38.5267 },
  { codigo: "DF", nome: "Distrito Federal", lat: -15.8267, lng: -47.9218 },
  { codigo: "MT", nome: "Mato Grosso", lat: -15.6014, lng: -56.0979 },
  { codigo: "ES", nome: "Espírito Santo", lat: -20.3155, lng: -40.3128 },
  { codigo: "PA", nome: "Pará", lat: -1.4558, lng: -48.4902 },
  { codigo: "AL", nome: "Alagoas", lat: -9.5713, lng: -36.7820 },
  { codigo: "PB", nome: "Paraíba", lat: -7.1195, lng: -34.8450 },
  { codigo: "RN", nome: "Rio Grande do Norte", lat: -5.7945, lng: -35.2110 },
  { codigo: "MS", nome: "Mato Grosso do Sul", lat: -20.4486, lng: -54.6295 },
  { codigo: "SE", nome: "Sergipe", lat: -10.9472, lng: -37.0731 },
  { codigo: "AM", nome: "Amazonas", lat: -3.1190, lng: -60.0217 },
  { codigo: "RO", nome: "Rondônia", lat: -8.7612, lng: -63.9039 },
  { codigo: "AC", nome: "Acre", lat: -10.0000, lng: -67.8000 },
  { codigo: "MA", nome: "Maranhão", lat: -2.5387, lng: -44.2825 },
  { codigo: "TO", nome: "Tocantins", lat: -10.1753, lng: -48.2982 },
  { codigo: "PI", nome: "Piauí", lat: -5.0892, lng: -42.8019 },
  { codigo: "AP", nome: "Amapá", lat: 0.0000, lng: -51.0000 },
  { codigo: "RR", nome: "Roraima", lat: 2.8235, lng: -60.6758 }
];

// Produtos de exemplo
export const produtosExemplo = [
  "Consultoria Contábil",
  "Declaração de Imposto de Renda",
  "Abertura de Empresa",
  "Contabilidade Mensal",
  "Auditoria Fiscal",
  "Consultoria Trabalhista",
  "Escrituração Digital",
  "Certificado Digital",
  "Planejamento Tributário",
  "Alteração Contratual",
  "Encerramento de Empresa",
  "Consultoria Societária",
  "Compliance Fiscal",
  "Revisão Contábil",
  "Assessoria Jurídica",
];

// Clientes de exemplo
export const clientesExemplo = [
  "Tech Solutions Ltda",
  "Comercial Santos & Cia",
  "Indústria Metalúrgica ABC",
  "Restaurante Sabor Mineiro",
  "Clínica Médica Central",
  "Transportadora Rápida",
  "Farmácia Popular",
  "Construtora Moderna",
  "Escola Futuro Brilhante",
  "Loja de Roupas Fashion",
  "Oficina Mecânica Silva",
  "Padaria Pão Dourado",
  "Academia Corpo Saudável",
  "Escritório de Advocacia Lima",
  "Consultoria RH Plus",
  "Empresa de Limpeza Clean",
  "Gráfica Impressão Total",
  "Petshop Amigo Fiel",
  "Salão de Beleza Glamour",
  "Autoescola Direção Certa",
];

// Função para gerar dados de vendas aleatórios
function gerarDataAleatoria(inicio: Date, fim: Date): Date {
  const inicioTimestamp = inicio.getTime();
  const fimTimestamp = fim.getTime();
  const randomTimestamp = inicioTimestamp + Math.random() * (fimTimestamp - inicioTimestamp);
  return new Date(randomTimestamp);
}

function gerarValorAleatorio(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Gerador de dados estáticos para vendas
export function gerarDadosVendasEstaticos(): SaidaDataExtendida[] {
  const dados: SaidaDataExtendida[] = [];
  const dataInicio = new Date(2024, 0, 1); // Janeiro 2024
  const dataFim = new Date(2024, 11, 31); // Dezembro 2024
  
  // Gerar 500 transações de exemplo
  for (let i = 1; i <= 500; i++) {
    const estado = estadosBrasileiros[Math.floor(Math.random() * estadosBrasileiros.length)];
    const produto = produtosExemplo[Math.floor(Math.random() * produtosExemplo.length)];
    const cliente = clientesExemplo[Math.floor(Math.random() * clientesExemplo.length)];
    const data = gerarDataAleatoria(dataInicio, dataFim);
    
    // Valores baseados no tipo de produto
    let valorBase = 0;
    switch (produto) {
      case "Declaração de Imposto de Renda":
        valorBase = gerarValorAleatorio(150, 400);
        break;
      case "Abertura de Empresa":
        valorBase = gerarValorAleatorio(800, 2000);
        break;
      case "Contabilidade Mensal":
        valorBase = gerarValorAleatorio(500, 1500);
        break;
      case "Auditoria Fiscal":
        valorBase = gerarValorAleatorio(2000, 8000);
        break;
      case "Consultoria Contábil":
        valorBase = gerarValorAleatorio(300, 1200);
        break;
      case "Planejamento Tributário":
        valorBase = gerarValorAleatorio(1000, 5000);
        break;
      default:
        valorBase = gerarValorAleatorio(200, 1000);
    }
    
    const quantidade = gerarValorAleatorio(1, 3);
    const valorTotal = valorBase * quantidade;
    const custoBase = valorBase * 0.6; // 60% do valor é custo
    const custoTotal = custoBase * quantidade;
    
    dados.push({
      cliente: i,
      nome_cliente: cliente,
      empresa: Math.floor(Math.random() * 5) + 1,
      nome_empresa: "Office Gestão Contábil",
      cnpj: `${String(Math.floor(Math.random() * 99999999999999)).padStart(14, '0')}`,
      UF: estado.codigo,
      data: data.toISOString().split('T')[0],
      valor: valorTotal.toString(),
      cancelada: Math.random() > 0.95 ? "S" : "N", // 5% de cancelamento
      // Campos específicos para análise de vendas
      produto_nome: produto,
      produto_codigo: `PROD${String(i).padStart(3, '0')}`,
      quantidade: quantidade,
      valor_unitario: valorBase,
      valor_total: valorTotal,
      custo_unitario: custoBase,
      custo_total: custoTotal,
      margem_valor: valorTotal - custoTotal,
      margem_percentual: ((valorTotal - custoTotal) / valorTotal) * 100,
      estado: estado.nome,
      mes: data.getMonth() + 1,
      ano: data.getFullYear(),
      trimestre: Math.ceil((data.getMonth() + 1) / 3),
      categoria_produto: produto.includes('Consultoria') ? 'Consultoria' : 
                        produto.includes('Contabilidade') ? 'Contabilidade' : 
                        produto.includes('Declaração') ? 'Tributário' : 'Serviços',
      vendedor: `Vendedor ${Math.floor(Math.random() * 5) + 1}`,
      comissao_percentual: 5,
      comissao_valor: valorTotal * 0.05,
      desconto_valor: Math.random() > 0.8 ? valorTotal * 0.1 : 0,
      observacoes: i % 10 === 0 ? 'Cliente VIP - Desconto especial' : null,
    });
  }
  
  return dados.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
}

// Dados específicos para demonstração de sazonalidade
export function gerarDadosSazonalidade() {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  // Padrão sazonal: picos em Janeiro (IR), Março (fim trimestre), Dezembro (fim ano)
  const multiplicadores = [1.8, 0.9, 1.4, 1.0, 1.1, 0.8, 0.9, 1.0, 1.2, 1.1, 1.3, 1.6];
  
  return meses.map((mes, index) => ({
    mes,
    vendas: Math.floor(50000 * multiplicadores[index]),
    crescimento: index > 0 ? (multiplicadores[index] / multiplicadores[index - 1] - 1) * 100 : 0,
    transacoes: Math.floor(120 * multiplicadores[index]),
  }));
}

// Dados para análise de concentração (Pareto)
export function gerarDadosConcentracao() {
  const totalVendas = 850000;
  const totalClientes = 20;
  
  // 20% dos clientes (4) representam 80% das vendas
  const clientesVIP = [
    { nome: "Tech Solutions Ltda", vendas: 170000, participacao: 20 },
    { nome: "Indústria Metalúrgica ABC", vendas: 153000, participacao: 18 },
    { nome: "Comercial Santos & Cia", vendas: 136000, participacao: 16 },
    { nome: "Construtora Moderna", vendas: 119000, participacao: 14 },
  ];
  
  const clientesRegulares = Array.from({ length: 16 }, (_, i) => ({
    nome: clientesExemplo[i + 4],
    vendas: Math.floor(Math.random() * 15000) + 5000,
    participacao: Math.floor(Math.random() * 3) + 1,
  }));
  
  return {
    vip: clientesVIP,
    regulares: clientesRegulares,
    concentracao80_20: true,
    indiceConcentracao: 0.85,
  };
}

// Dados para ranking de produtos
export function gerarRankingProdutos() {
  const produtos = [
    { nome: "Contabilidade Mensal", vendas: 180000, quantidade: 240, participacao: 21.2 },
    { nome: "Declaração de Imposto de Renda", vendas: 95000, quantidade: 380, participacao: 11.2 },
    { nome: "Consultoria Contábil", vendas: 85000, quantidade: 170, participacao: 10.0 },
    { nome: "Abertura de Empresa", vendas: 75000, quantidade: 50, participacao: 8.8 },
    { nome: "Planejamento Tributário", vendas: 68000, quantidade: 28, participacao: 8.0 },
    { nome: "Auditoria Fiscal", vendas: 64000, quantidade: 16, participacao: 7.5 },
    { nome: "Escrituração Digital", vendas: 52000, quantidade: 130, participacao: 6.1 },
    { nome: "Consultoria Trabalhista", vendas: 45000, quantidade: 90, participacao: 5.3 },
    { nome: "Certificado Digital", vendas: 38000, quantidade: 190, participacao: 4.5 },
    { nome: "Alteração Contratual", vendas: 35000, quantidade: 70, participacao: 4.1 },
  ];
  
  return produtos;
}

export default {
  gerarDadosVendasEstaticos,
  gerarDadosSazonalidade,
  gerarDadosConcentracao,
  gerarRankingProdutos,
  estadosBrasileiros,
  produtosExemplo,
  clientesExemplo,
};
