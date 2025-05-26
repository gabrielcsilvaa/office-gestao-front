//Total Atividades
export interface ActivitiesData {
  atividades_totais: number;
}

//Lista de usuários
export interface Usuario {
  id_usuario: number;
  situacao: number;
  usuario: string;
}
export interface UserList {
  usuarios: Usuario[];
}

//Atividades Modulo
export interface UsuarioModulo {
  usuario: string;
  atividades: Record<string, number>; // ex: "jan/2024": 478556
  total_usuario: number;
}

export interface Modulo {
  usuarios: UsuarioModulo[];
  total_sistema: number;
}

export interface DadosModulo {
  [modulo: string]: Modulo;
}

//Dados Gerais das atividades

export interface empresaDados {
  atividades: {
    [mesAno: string]: {
      tempo_gasto: number;
      importacoes: number;
      lancamentos: number;
      lancamentos_manuais: number;
    };
  };
  codi_emp: number;
  total_entradas: number;
  total_geral: number;
  total_importacoes: number;
  total_lancamentos: number;
  total_lancamentos_manuais: number;
  total_saidas: number;
  total_servicos: number;
  total_tempo_gasto: number;
}

export interface UsuarioDados {
  empresas: empresaDados[];
  nome_usuario: string;
  total_entradas: number;
  total_geral: number;
  total_importacoes: number;
  total_lancamentos: number;
  total_lancamentos_manuais: number;
  total_saidas: number;
  total_servicos: number;
  total_tempo_gasto: number;
  usuario_id: string;
}

export interface dadosUsuarios {
  analises: UsuarioDados[];
  totais_gerais: {
    total_entradas: number;
    total_geral: number;
    total_importacoes: number;
    total_lancamentos: number;
    total_lancamentos_manuais: number;
    total_saidas: number;
    total_servicos: number;
    total_tempo_gasto: number;
  };
}

//Atividades por mês

export interface AtividadeMesItem {
  name: string;
  valor: number;
}
export type AtividadesPorMes = AtividadeMesItem[];

//Empresas

export interface EmpresaInfo {
  nome_empresa: string;
  CEP: string;
  cnpj: string;
  ramo_atividade: string;
  CNAE: number;
  CNAE_20: string;
  usa_CNAE_20: string; // "S" ou "N" provavelmente
  codigo_empresa: number;
  responsavel_legal: string;
  situacao: string; // por exemplo: "A"
  data_inatividade: string | null; // pode ser null
  data_cadastro: string; // string no formato ISO de data
  CAE: number;
  cpf_responsavel: string;
  contador: number;
  email: string;
  data_inicio_atividades: string;
  duracao_contrato: string; // Exemplo: "I"
  data_termino_contrato: string | null;
  razao_social: string;
  motivo_inatividade: number;
  email_resp_legal: string | null;
  cert_digital: string; // "S" ou "N"
  regime_tributario: string; // Exemplo: "Lucro Real"
}
export interface EmpresasResponse {
  Empresas: EmpresaInfo[];
}
