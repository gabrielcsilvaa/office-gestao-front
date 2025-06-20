// C:\PROJETO\office-gestao-front\src\types\fichaPessoal.types.ts
export interface Funcionario {
  id_empregado: number;
  nome: string;
  data_nascimento?: string;
  cargo?: string;
  escolaridade?: string;
  admissao?: string;
  demissao?: string;
  salario?: string;
  afastamentos?: AfastamentoEntryRaw[];
  exames?: ExameEntryRaw[];
}

export interface EmpresaFicha {
  id_empresa: number;
  nome_empresa: string;
  funcionarios?: Funcionario[];
}

export interface FeriasEntry {
  id_empregado: number;
  nome: string;
  inicio_aquisitivo: string;
  fim_aquisitivo: string;
  inicio_gozo: string;
  fim_gozo: string;
}

export interface FeriasPorEmpresa {
  id_empresa: number;
  ferias: FeriasEntry[];
}

export interface FormattedFerias {
  nomeColaborador: string;
  inicioPeriodoAquisitivo: string;
  fimPeriodoAquisitivo: string;
  inicioPeriodoGozo: string;
  fimPeriodoGozo: string;
  limiteParaGozo: string;
  diasDeDireito: number;
  diasGozados: number;
  diasDeSaldo: number;
}

export interface AlteracaoEntry {
  id_empregado: number;
  nome: string;
  competencia: string;
  novo_salario: string;
  salario_anterior: string | null;
  motivo: number;
}

export interface AlteracoesPorEmpresa {
  id_empresa: number;
  alteracoes: AlteracaoEntry[];
}

export interface FormattedAlteracao {
  nomeColaborador: string;
  competencia: string;
  salarioAnterior: number | null;
  salarioNovo: number;
  motivo: string;
  percentual: string;
}

export interface AfastamentoEntryRaw {
  data_inicial: string;
  data_final: string | null;
  num_dias: string;
  tipo: string;
}

export interface Afastamento {
  inicio: string;
  termino: string;
  diasAfastados: string;
  tipo: string;
  nomeColaborador: string;
}

export interface ExameEntryRaw {
  data_exame: string;
  data_vencimento: string;
  resultado: string;
  tipo: string;
}

export interface Exame {
  vencimento: string;
  dataExame: string;
  resultado: string;
  tipo: string;
  nomeColaborador: string;
}

export interface Contrato {
  id: string;
  empresa: string;
  colaborador: string;
  dataAdmissao: string;
  dataRescisao: string;
  salarioBase: string;
}
