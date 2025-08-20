/**
 * UTILITÁRIOS PARA PROCESSAMENTO DE DADOS DE VENDAS
 * 
 * Funções para transformar dados brutos de saídas em dados estruturados para análise de vendas
 */

import { 
  VendaProcessada, 
  RankingProduto, 
  RankingCliente, 
  DadosGeograficos,
  DadosSazonalidade,
  MetricasAvancadas,
  SaidaDataExtendida,
  PeriodoAnalise
} from '../types';

/**
 * Processa dados brutos de saídas em vendas estruturadas
 */
export const processarDadosVendas = (saidas: SaidaDataExtendida[]): VendaProcessada[] => {
  console.log(`🔧 processarDadosVendas: Recebidos ${saidas.length} registros para processar`);
  
  const vendasProcessadas = saidas
    .filter(saida => {
      const naoFoiCancelada = saida.cancelada === "N";
      if (!naoFoiCancelada) {
        console.log(`⚠️ Filtrando venda cancelada: ${saida.cliente}`);
      }
      return naoFoiCancelada;
    })
    .map((saida, index) => {
      const data = new Date(saida.data || new Date());
      const valor = parseFloat(saida.valor || "0");
      const quantidade = saida.quantidade || 1;
      const valorTotal = saida.valor_total || valor;
      
      const vendaProcessada = {
        id: `${saida.cliente}-${index}`,
        cliente: saida.nome_cliente || "Cliente não identificado",
        produto: saida.produto_nome || `Produto ${saida.cliente}`,
        categoria: saida.categoria_produto || "Geral",
        quantidade,
        valor: valorTotal,
        valorUnitario: saida.valor_unitario || valor,
        data: data.toISOString().split('T')[0],
        mes: data.toISOString().slice(0, 7), // YYYY-MM
        ano: data.getFullYear().toString(),
        trimestre: `${data.getFullYear()}-T${Math.ceil((data.getMonth() + 1) / 3)}`,
        uf: saida.UF || "N/A",
        cidade: "N/A", // Não disponível na interface atual
        vendedor: saida.vendedor || "N/A",
        margem: saida.margem_valor,
        custo: saida.custo_total
      };
      
      if (index < 3) { // Log das primeiras 3 vendas para debug
        console.log(`🔧 Venda processada ${index + 1}:`, {
          cliente: vendaProcessada.cliente,
          produto: vendaProcessada.produto,
          valor: vendaProcessada.valor,
          quantidade: vendaProcessada.quantidade
        });
      }
      
      return vendaProcessada;
    });
    
  console.log(`✅ processarDadosVendas: ${vendasProcessadas.length} vendas processadas com sucesso`);
  return vendasProcessadas;
};

/**
 * Gera ranking de produtos por vendas
 */
export const gerarRankingProdutos = (vendas: VendaProcessada[], limite: number = 10): RankingProduto[] => {
  const produtoMap = new Map<string, {
    produto: string;
    categoria: string;
    totalVendido: number;
    quantidadeVendida: number;
    vendas: number;
  }>();

  // Agrupa por produto
  vendas.forEach(venda => {
    const key = venda.produto;
    const existing = produtoMap.get(key);
    
    if (existing) {
      existing.totalVendido += venda.valor;
      existing.quantidadeVendida += venda.quantidade;
      existing.vendas += 1;
    } else {
      produtoMap.set(key, {
        produto: venda.produto,
        categoria: venda.categoria || "Sem categoria",
        totalVendido: venda.valor,
        quantidadeVendida: venda.quantidade,
        vendas: 1
      });
    }
  });

  const totalGeral = Array.from(produtoMap.values()).reduce((acc, item) => acc + item.totalVendido, 0);

  // Converte para ranking ordenado
  return Array.from(produtoMap.values())
    .map(item => ({
      produto: item.produto,
      categoria: item.categoria,
      totalVendido: item.totalVendido,
      quantidadeVendida: item.quantidadeVendida,
      ticketMedio: item.totalVendido / item.vendas,
      participacao: totalGeral > 0 ? (item.totalVendido / totalGeral) * 100 : 0
    }))
    .sort((a, b) => b.totalVendido - a.totalVendido)
    .slice(0, limite);
};

/**
 * Gera ranking de clientes por compras
 */
export const gerarRankingClientes = (vendas: VendaProcessada[], limite: number = 10): RankingCliente[] => {
  const clienteMap = new Map<string, {
    cliente: string;
    totalComprado: number;
    compras: VendaProcessada[];
  }>();

  // Agrupa por cliente
  vendas.forEach(venda => {
    const key = venda.cliente;
    const existing = clienteMap.get(key);
    
    if (existing) {
      existing.totalComprado += venda.valor;
      existing.compras.push(venda);
    } else {
      clienteMap.set(key, {
        cliente: venda.cliente,
        totalComprado: venda.valor,
        compras: [venda]
      });
    }
  });

  const totalGeral = Array.from(clienteMap.values()).reduce((acc, item) => acc + item.totalComprado, 0);

  // Converte para ranking ordenado
  return Array.from(clienteMap.values())
    .map(item => {
      const compras = item.compras;
      const ultimaCompra = compras.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0].data;
      const frequencia = compras.length; // Simplificado - poderia calcular por período
      
      // Categoriza cliente baseado na frequência e valor
      let categoria: 'VIP' | 'Frequente' | 'Ocasional' | 'Novo' = 'Novo';
      if (item.totalComprado > 50000 && frequencia > 10) categoria = 'VIP';
      else if (frequencia > 5) categoria = 'Frequente';
      else if (frequencia > 1) categoria = 'Ocasional';

      return {
        cliente: item.cliente,
        totalComprado: item.totalComprado,
        quantidadeCompras: compras.length,
        ticketMedio: item.totalComprado / compras.length,
        participacao: totalGeral > 0 ? (item.totalComprado / totalGeral) * 100 : 0,
        ultimaCompra,
        frequencia,
        categoria
      };
    })
    .sort((a, b) => b.totalComprado - a.totalComprado)
    .slice(0, limite);
};

/**
 * Processa dados geográficos das vendas
 */
export const processarDadosGeograficos = (vendas: VendaProcessada[]): DadosGeograficos[] => {
  const ufMap = new Map<string, {
    uf: string;
    vendas: VendaProcessada[];
    clientes: Set<string>;
  }>();

  // Agrupa por UF
  vendas.forEach(venda => {
    if (!venda.uf || venda.uf === "N/A") return;
    
    const existing = ufMap.get(venda.uf);
    if (existing) {
      existing.vendas.push(venda);
      existing.clientes.add(venda.cliente);
    } else {
      ufMap.set(venda.uf, {
        uf: venda.uf,
        vendas: [venda],
        clientes: new Set([venda.cliente])
      });
    }
  });

  const totalGeralVendas = vendas.reduce((acc, venda) => acc + venda.valor, 0);

  // Coordenadas aproximadas dos estados (centro geográfico)
  const coordenadas: Record<string, { lat: number; lng: number; estado: string }> = {
    'AC': { lat: -8.77, lng: -70.55, estado: 'Acre' },
    'AL': { lat: -9.71, lng: -35.73, estado: 'Alagoas' },
    'AP': { lat: 1.41, lng: -51.77, estado: 'Amapá' },
    'AM': { lat: -3.07, lng: -61.66, estado: 'Amazonas' },
    'BA': { lat: -12.96, lng: -38.51, estado: 'Bahia' },
    'CE': { lat: -3.71, lng: -38.54, estado: 'Ceará' },
    'DF': { lat: -15.83, lng: -47.86, estado: 'Distrito Federal' },
    'ES': { lat: -19.19, lng: -40.34, estado: 'Espírito Santo' },
    'GO': { lat: -16.64, lng: -49.31, estado: 'Goiás' },
    'MA': { lat: -2.55, lng: -44.30, estado: 'Maranhão' },
    'MT': { lat: -12.64, lng: -55.42, estado: 'Mato Grosso' },
    'MS': { lat: -20.51, lng: -54.54, estado: 'Mato Grosso do Sul' },
    'MG': { lat: -18.10, lng: -44.38, estado: 'Minas Gerais' },
    'PA': { lat: -5.53, lng: -52.29, estado: 'Pará' },
    'PB': { lat: -7.06, lng: -35.55, estado: 'Paraíba' },
    'PR': { lat: -24.89, lng: -51.55, estado: 'Paraná' },
    'PE': { lat: -8.28, lng: -35.07, estado: 'Pernambuco' },
    'PI': { lat: -8.28, lng: -43.68, estado: 'Piauí' },
    'RJ': { lat: -22.84, lng: -43.15, estado: 'Rio de Janeiro' },
    'RN': { lat: -5.22, lng: -36.52, estado: 'Rio Grande do Norte' },
    'RS': { lat: -30.01, lng: -51.22, estado: 'Rio Grande do Sul' },
    'RO': { lat: -11.22, lng: -62.80, estado: 'Rondônia' },
    'RR': { lat: 1.89, lng: -61.22, estado: 'Roraima' },
    'SC': { lat: -27.33, lng: -49.44, estado: 'Santa Catarina' },
    'SP': { lat: -23.55, lng: -46.64, estado: 'São Paulo' },
    'SE': { lat: -10.90, lng: -37.07, estado: 'Sergipe' },
    'TO': { lat: -10.25, lng: -48.25, estado: 'Tocantins' }
  };

  return Array.from(ufMap.entries()).map(([uf, data]) => {
    const totalVendas = data.vendas.reduce((acc, venda) => acc + venda.valor, 0);
    const quantidadeVendas = data.vendas.length;
    const numeroClientes = data.clientes.size;
    const ticketMedio = totalVendas / quantidadeVendas;
    const participacao = totalGeralVendas > 0 ? (totalVendas / totalGeralVendas) * 100 : 0;
    
    const coord = coordenadas[uf] || { lat: -15.83, lng: -47.86, estado: uf };

    return {
      uf,
      estado: coord.estado,
      lat: coord.lat,
      lng: coord.lng,
      totalVendas,
      quantidadeVendas,
      numeroClientes,
      ticketMedio,
      participacao
    };
  }).sort((a, b) => b.totalVendas - a.totalVendas);
};

/**
 * Analisa sazonalidade das vendas
 */
export const analisarSazonalidade = (vendas: VendaProcessada[], periodo: PeriodoAnalise): DadosSazonalidade[] => {
  const periodoMap = new Map<string, VendaProcessada[]>();

  // Agrupa por período
  vendas.forEach(venda => {
    let chavePeriodo: string;
    
    switch (periodo) {
      case PeriodoAnalise.MENSAL:
        chavePeriodo = venda.mes; // YYYY-MM
        break;
      case PeriodoAnalise.TRIMESTRAL:
        chavePeriodo = venda.trimestre; // YYYY-TX
        break;
      case PeriodoAnalise.ANUAL:
        chavePeriodo = venda.ano; // YYYY
        break;
      default:
        chavePeriodo = venda.mes;
    }

    const existing = periodoMap.get(chavePeriodo);
    if (existing) {
      existing.push(venda);
    } else {
      periodoMap.set(chavePeriodo, [venda]);
    }
  });

  const dados = Array.from(periodoMap.entries()).map(([periodo, vendasPeriodo]) => {
    const vendas = vendasPeriodo.reduce((acc, venda) => acc + venda.valor, 0);
    const quantidade = vendasPeriodo.length;
    
    return {
      periodo,
      vendas,
      quantidade,
      crescimento: 0, // Será calculado posteriormente
      media: 0, // Será calculado posteriormente
      tendencia: 'estavel' as 'alta' | 'baixa' | 'estavel'
    };
  }).sort((a, b) => a.periodo.localeCompare(b.periodo));

  // Calcula crescimento e média
  const media = dados.reduce((acc, item) => acc + item.vendas, 0) / dados.length;
  
  dados.forEach((item, index) => {
    item.media = media;
    
    if (index > 0) {
      const anterior = dados[index - 1].vendas;
      item.crescimento = anterior > 0 ? ((item.vendas - anterior) / anterior) * 100 : 0;
    }
    
    // Determina tendência
    if (item.crescimento > 5) item.tendencia = 'alta';
    else if (item.crescimento < -5) item.tendencia = 'baixa';
    else item.tendencia = 'estavel';
  });

  return dados;
};

/**
 * Calcula métricas avançadas
 */
export const calcularMetricasAvancadas = (vendas: VendaProcessada[]): MetricasAvancadas => {
  if (vendas.length === 0) {
    return {
      crescimentoMensal: 0,
      crescimentoAnual: 0,
      concentracaoClientes: 0,
      diversificacaoProdutos: 0,
      ticketMedioTendencia: 'estavel',
      sazonalidadeIndex: 0,
      recorrencia: 0
    };
  }

  // Análise temporal para crescimento
  const vendasPorMes = analisarSazonalidade(vendas, PeriodoAnalise.MENSAL);
  const crescimentoMensal = vendasPorMes.length > 1 
    ? vendasPorMes[vendasPorMes.length - 1].crescimento 
    : 0;

  // Concentração de clientes (Pareto)
  const rankingClientes = gerarRankingClientes(vendas, vendas.length);
  const top20Percent = Math.ceil(rankingClientes.length * 0.2);
  const vendasTop20 = rankingClientes.slice(0, top20Percent).reduce((acc, cliente) => acc + cliente.totalComprado, 0);
  const totalVendas = rankingClientes.reduce((acc, cliente) => acc + cliente.totalComprado, 0);
  const concentracaoClientes = totalVendas > 0 ? (vendasTop20 / totalVendas) * 100 : 0;

  // Diversificação de produtos
  const produtosUnicos = new Set(vendas.map(v => v.produto)).size;
  const diversificacaoProdutos = Math.min(produtosUnicos / 10, 10) * 10; // Escala 0-100

  // Recorrência de clientes
  const clientesComMultiplasCompras = rankingClientes.filter(c => c.quantidadeCompras > 1).length;
  const totalClientes = rankingClientes.length;
  const recorrencia = totalClientes > 0 ? (clientesComMultiplasCompras / totalClientes) * 100 : 0;

  // Índice de sazonalidade (variação dos dados mensais)
  const mediaVendasMensal = vendasPorMes.reduce((acc, item) => acc + item.vendas, 0) / vendasPorMes.length;
  const variancia = vendasPorMes.reduce((acc, item) => acc + Math.pow(item.vendas - mediaVendasMensal, 2), 0) / vendasPorMes.length;
  const coeficienteVariacao = mediaVendasMensal > 0 ? Math.sqrt(variancia) / mediaVendasMensal : 0;
  const sazonalidadeIndex = Math.min(coeficienteVariacao * 100, 100);

  return {
    crescimentoMensal,
    crescimentoAnual: 0, // Poderia ser calculado se houvesse dados de anos anteriores
    concentracaoClientes,
    diversificacaoProdutos,
    ticketMedioTendencia: crescimentoMensal > 5 ? 'crescente' : crescimentoMensal < -5 ? 'decrescente' : 'estavel',
    sazonalidadeIndex,
    recorrencia
  };
};
