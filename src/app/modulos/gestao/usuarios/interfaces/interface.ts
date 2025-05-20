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
  atividades: object;
  total_usuario: number;
  usuario: string;
}

export interface Modulo {
  total_sistema: number;
  usuarios: UsuarioModulo[];
}

//Dados Gerais das atividades

export interface empresaDados {
  atividades: object;
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
