export interface Faturamento {
  [mes: string]: [number, string]; // Ex: ["jan/2024"]: [3000.00, "10.00%"]
}

export interface Importacoes {
  entradas: Record<string, number>;
  saidas: Record<string, number>;
  servicos: Record<string, number>;
  lancamentos: { [mes: string]: number };
  lancamentos_manuais: { [mes: string]: number };
  total_entradas: number;
  total_saidas: number;
  total_servicos: number;
  total_lancamentos: number;
  total_lancamentos_manuais: number;
  total_geral: number;
}
export interface Escritorio {
  escritorio: number;
  id_cliente: number;
  valor_contrato: number | string | null;
}

export interface EmpresaAnalise {
  codigo_empresa: string;
  nome_empresa: string;
  cnpj: string;
  email: string | null;
  situacao: string;
  data_cadastro: string;
  data_inicio_atv: string;
  responsavel: string | null;
  escritorios: Escritorio[];
  faturamento: Faturamento;
  importacoes: Importacoes;
  empregados: Record<string, number>; // Ex: { "jan/2024": 6 }
  atividades: {
    total: number;
    [mes: string]: number; // Ex: "mar/2024": 951
  };
}

export interface Empresa {
  nome_empresa: string;
  cnpj: string;
  responsavel: string | null;
  data_cadastro: string;
  data_inicio_atv: string;
  faturamento: Faturamento;
}

export interface ListaEmpresasProps {
  empresas: EmpresaAnalise[];
}

export interface EmpresaVar {
  nome_empresa: string;
  cnpj: string;
  data_cadastro: string;
  data_inicio_atv: string;
  responsavel: string | null;
  faturamento: { [mes: string]: number };
  variacao_faturamento: { [mes: string]: string };
  atividades: { [mes: string]: string };
  lancamentos: { [mes: string]: number };
  lancamentos_manuais: { [mes: string]: number | string };
  empregados: { [mes: string]: number | string };
  nfe_emitidas: { [mes: string]: number | string };
  nfe_movimentadas: { [mes: string]: number | string };
  faturamento_escritorio: Escritorio[];
  // Definindo faturamento como um objeto de string (mes) -> number (valor)
}
