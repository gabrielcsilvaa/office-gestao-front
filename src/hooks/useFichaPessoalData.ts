// 🧠 Hook Customizado - Cérebro de Dados da Ficha Pessoal
// Este hook centraliza toda a lógica de transformação, filtragem e ordenação de dados

import { useMemo } from "react";
import { 
  EmpresaFicha, 
  FeriasPorEmpresa, 
  AlteracoesPorEmpresa,
  FormattedFerias,
  FormattedAlteracao,
  Afastamento,
  Exame,
  Contrato,
  Funcionario
} from "@/types/fichaPessoal.types";
import { 
  formatDateToBR, 
  formatCurrencyValue, 
  capitalizeWords, 
  calculateAge, 
  diffDays 
} from "@/utils/formatters";

interface UseFichaPessoalDataProps {
  dados: EmpresaFicha[] | null;
  feriasRaw: FeriasPorEmpresa[];
  alteracoesRaw: AlteracoesPorEmpresa[];
  selectedEmpresa: string;
  selectedColaborador: string;
}

interface FichaPessoalData {
  kpiCardData: Array<{
    title: string;
    value: string;
    tooltipText: string;
  }>;
  contratosData: Contrato[];
  examesData: Exame[];
  afastamentosData: Afastamento[];
  feriasData: FormattedFerias[];
  alteracoesData: FormattedAlteracao[];
  colaboradorOptions: Funcionario[];
  empresaOptionsData: Array<{
    id_empresa: number;
    nome_empresa: string;
  }>;
}

export const useFichaPessoalData = ({
  dados,
  feriasRaw,
  alteracoesRaw,
  selectedEmpresa,
  selectedColaborador
}: UseFichaPessoalDataProps): FichaPessoalData => {

  // 🏢 Empresa selecionada - Encontra a empresa baseada no nome
  const empresaSelecionada = useMemo(() => {
    if (!selectedEmpresa || !dados) return null;
    return dados.find(emp => emp.nome_empresa.trim() === selectedEmpresa) || null;
  }, [selectedEmpresa, dados]);

  // 👥 Opções de colaboradores filtrados por empresa
  const colaboradorOptions = useMemo(() => {
    if (!empresaSelecionada?.funcionarios) return [];
    
    return [...empresaSelecionada.funcionarios].sort((a, b) =>
      a.nome.localeCompare(b.nome)
    );
  }, [empresaSelecionada]);

  // 🏢 Opções de empresas com dados completos
  const empresaOptionsData = useMemo(() => {
    if (!dados || dados.length === 0) return [];
    
    return dados
      .map(item => ({
        id_empresa: item.id_empresa,
        nome_empresa: item.nome_empresa.trim()
      }))
      .sort((a, b) => a.nome_empresa.localeCompare(b.nome_empresa));
  }, [dados]);

  // 🎯 Funcionários filtrados (baseado na seleção do colaborador)
  const funcionariosFiltrados = useMemo(() => {
    if (!empresaSelecionada?.funcionarios) return [];
    
    return selectedColaborador 
      ? empresaSelecionada.funcionarios.filter(func => func.nome === selectedColaborador)
      : empresaSelecionada.funcionarios;
  }, [empresaSelecionada, selectedColaborador]);

  // 📊 Dados dos KPIs - Informações do colaborador selecionado
  const kpiCardData = useMemo(() => {
    const initialKpiCardData = [
      { title: "Data de Admissão", value: "N/A", tooltipText: "Data de início do colaborador na empresa." },
      { title: "Salário Base", value: "N/A", tooltipText: "Salário bruto mensal do colaborador." },
      { title: "Cargo", value: "N/A", tooltipText: "Cargo atual do colaborador." },
      { title: "Escolaridade", value: "N/A", tooltipText: "Nível de escolaridade do colaborador." },
      { title: "Idade", value: "N/A", tooltipText: "Idade atual do colaborador." },
    ];

    if (!selectedColaborador || colaboradorOptions.length === 0) {
      return initialKpiCardData;
    }

    const funcionarioSelecionado = colaboradorOptions.find(
      func => func.nome === selectedColaborador
    );

    if (!funcionarioSelecionado) return initialKpiCardData;

    return [
      { 
        title: "Data de Admissão", 
        value: formatDateToBR(funcionarioSelecionado.admissao), 
        tooltipText: "Data de início do colaborador na empresa." 
      },
      { 
        title: "Salário Base", 
        value: formatCurrencyValue(funcionarioSelecionado.salario), 
        tooltipText: "Salário bruto mensal do colaborador." 
      },
      { 
        title: "Cargo", 
        value: capitalizeWords(funcionarioSelecionado.cargo), 
        tooltipText: "Cargo atual do colaborador." 
      },
      { 
        title: "Escolaridade", 
        value: capitalizeWords(funcionarioSelecionado.escolaridade), 
        tooltipText: "Nível de escolaridade do colaborador." 
      },
      { 
        title: "Idade", 
        value: calculateAge(funcionarioSelecionado.data_nascimento), 
        tooltipText: "Idade atual do colaborador." 
      },
    ];
  }, [selectedColaborador, colaboradorOptions]);

  // 📝 Dados de contratos formatados e ordenados
  const contratosData = useMemo(() => {
    if (!empresaSelecionada?.funcionarios) return [];

    const todosContratos: Contrato[] = [];

    funcionariosFiltrados.forEach((funcionario) => {
      const contrato: Contrato = {
        id: `${funcionario.id_empregado}`,
        empresa: empresaSelecionada.nome_empresa,
        colaborador: funcionario.nome,
        dataAdmissao: formatDateToBR(funcionario.admissao),
        dataRescisao: funcionario.demissao ? formatDateToBR(funcionario.demissao) : "",
        salarioBase: formatCurrencyValue(funcionario.salario),
      };
      todosContratos.push(contrato);
    });

    // 🔄 Ordenação multi-critério: Nome → Status → Data Admissão
    return todosContratos.sort((a, b) => {
      // 1º critério: Nome do funcionário (alfabética)
      const nomeComparison = a.colaborador.localeCompare(b.colaborador);
      if (nomeComparison !== 0) return nomeComparison;
      
      // 2º critério: Status do contrato (ativos primeiro)
      const aAtivo = a.dataRescisao === "" ? 1 : 0;
      const bAtivo = b.dataRescisao === "" ? 1 : 0;
      if (aAtivo !== bAtivo) return bAtivo - aAtivo;

      // 3º critério: Data de admissão (mais recente primeiro)
      try {
        const dataA = new Date(a.dataAdmissao.split('/').reverse().join('-'));
        const dataB = new Date(b.dataAdmissao.split('/').reverse().join('-'));
        return dataB.getTime() - dataA.getTime();
      } catch (e) {
        return 0;
      }
    });
  }, [empresaSelecionada, funcionariosFiltrados]);

  // 🏥 Dados de exames formatados e ordenados
  const examesData = useMemo(() => {
    if (!empresaSelecionada?.funcionarios) return [];

    const todosExames: Exame[] = [];

    funcionariosFiltrados.forEach((funcionario) => {
      if (funcionario.exames && funcionario.exames.length > 0) {
        const examesDoFuncionario = funcionario.exames.map(e => ({
          vencimento: formatDateToBR(e.data_vencimento),
          dataExame: formatDateToBR(e.data_exame),
          resultado: e.resultado,
          tipo: e.tipo,
          nomeColaborador: funcionario.nome,
        }));
        todosExames.push(...examesDoFuncionario);
      }
    });

    // 🔄 Ordenação multi-critério: Nome → Vencimento Urgente → Data Exame
    return todosExames.sort((a, b) => {
      // 1º critério: Nome do funcionário (alfabética)
      const nomeComparison = a.nomeColaborador.localeCompare(b.nomeColaborador);
      if (nomeComparison !== 0) return nomeComparison;
      
      // 2º critério: Data de vencimento mais urgente (mais próxima de hoje)
      try {
        const now = Date.now();
        const vencA = new Date(a.vencimento.split('/').reverse().join('-')).getTime();
        const vencB = new Date(b.vencimento.split('/').reverse().join('-')).getTime();
        const diffA = Math.abs(vencA - now);
        const diffB = Math.abs(vencB - now);
        if (diffA !== diffB) return diffA - diffB;
      } catch (e) {
        // falha na conversão da data, ignora e segue
      }

      // 3º critério: Data do exame (mais recente primeiro)
      try {
        const dataExameA = new Date(a.dataExame.split('/').reverse().join('-')).getTime();
        const dataExameB = new Date(b.dataExame.split('/').reverse().join('-')).getTime();
        return dataExameB - dataExameA;
      } catch (e) {
        return 0;
      }
    });
  }, [empresaSelecionada, funcionariosFiltrados]);

  // 🏖️ Dados de férias formatados e ordenados
  const feriasData = useMemo(() => {
    if (!empresaSelecionada || !feriasRaw.length) return [];

    const feriasEmpresa = feriasRaw.find(f => f.id_empresa === empresaSelecionada.id_empresa);
    if (!feriasEmpresa) return [];

    // Filtrar férias por funcionário selecionado se houver
    const feriasFiltradas = selectedColaborador 
      ? feriasEmpresa.ferias.filter(f => f.nome === selectedColaborador)
      : feriasEmpresa.ferias;

    const feriasFormatadas = feriasFiltradas.map(f => ({
      nomeColaborador: f.nome,
      inicioPeriodoAquisitivo: formatDateToBR(f.inicio_aquisitivo),
      fimPeriodoAquisitivo: formatDateToBR(f.fim_aquisitivo),
      inicioPeriodoGozo: formatDateToBR(f.inicio_gozo),
      fimPeriodoGozo: formatDateToBR(f.fim_gozo),
      limiteParaGozo: formatDateToBR(f.fim_aquisitivo),
      diasDeDireito: diffDays(f.inicio_aquisitivo, f.fim_aquisitivo),
      diasGozados: diffDays(f.inicio_gozo, f.fim_gozo),
      diasDeSaldo: diffDays(f.inicio_aquisitivo, f.fim_aquisitivo) - diffDays(f.inicio_gozo, f.fim_gozo),
      // Propriedades auxiliares para ordenação
      _dataVencimento: f.fim_aquisitivo,
      _dataInicioAquisitivo: f.inicio_aquisitivo,
    }));

    // 🔄 Ordenação multi-critério: Nome → Vencimento Urgente → Data Início
    const feriasOrdenadas = feriasFormatadas.sort((a, b) => {
      // 1º critério: Nome do funcionário (alfabética)
      const nomeComparison = a.nomeColaborador.localeCompare(b.nomeColaborador);
      if (nomeComparison !== 0) return nomeComparison;

      // 2º critério: Data de vencimento mais urgente (mais próxima de hoje)
      try {
        const now = Date.now();
        const vencA = new Date(a._dataVencimento).getTime();
        const vencB = new Date(b._dataVencimento).getTime();
        const diffA = Math.abs(vencA - now);
        const diffB = Math.abs(vencB - now);
        if (diffA !== diffB) return diffA - diffB;
      } catch (e) {
        // falha na conversão da data, ignora e segue
      }

      // 3º critério: Data de início do período aquisitivo (mais antigo primeiro)
      try {
        const inicioA = new Date(a._dataInicioAquisitivo).getTime();
        const inicioB = new Date(b._dataInicioAquisitivo).getTime();
        return inicioA - inicioB;
      } catch (e) {
        return 0;
      }
    });

    // Remover as propriedades auxiliares antes de retornar
    return feriasOrdenadas.map(({ _dataVencimento, _dataInicioAquisitivo, ...ferias }) => ferias);
  }, [empresaSelecionada, feriasRaw, selectedColaborador]);

  // 💰 Dados de alterações salariais formatados e ordenados
  const alteracoesData = useMemo(() => {
    if (!empresaSelecionada || !alteracoesRaw.length) return [];

    const alteracoesEmpresa = alteracoesRaw.find(a => a.id_empresa === empresaSelecionada.id_empresa);
    if (!alteracoesEmpresa) return [];

    // Filtrar alterações por funcionário selecionado se houver
    const alteracoesFiltradas = selectedColaborador 
      ? alteracoesEmpresa.alteracoes.filter(a => a.nome === selectedColaborador)
      : alteracoesEmpresa.alteracoes;

    const alteracoesFormatadas = alteracoesFiltradas.map(a => {
      const anterior = a.salario_anterior ? parseFloat(a.salario_anterior) : null;
      const novo = parseFloat(a.novo_salario);
      const perc = anterior
        ? `${(((novo - anterior) / anterior) * 100).toFixed(1)}%`
        : "";
      
      return {
        nomeColaborador: a.nome,
        competencia: formatDateToBR(a.competencia),
        salarioAnterior: anterior,
        salarioNovo: novo,
        motivo: a.motivo === 0 ? "Primeira Contratação" : "Ajuste",
        percentual: perc,
        // Propriedade auxiliar para ordenação
        _dataCompetencia: a.competencia,
      };
    });

    // 🔄 Ordenação multi-critério: Nome → Data Competência → Valor Salário
    const alteracoesOrdenadas = alteracoesFormatadas.sort((a, b) => {
      // 1º critério: Nome do funcionário (alfabética)
      const nomeComparison = a.nomeColaborador.localeCompare(b.nomeColaborador);
      if (nomeComparison !== 0) return nomeComparison;

      // 2º critério: Data da competência (mais recente primeiro)
      try {
        const dataCompetenciaA = new Date(a._dataCompetencia);
        const dataCompetenciaB = new Date(b._dataCompetencia);
        const competenciaComparison = dataCompetenciaB.getTime() - dataCompetenciaA.getTime();
        if (competenciaComparison !== 0) return competenciaComparison;
      } catch (e) {
        // Em caso de erro na conversão de data, continua para o próximo critério
      }

      // 3º critério: Valor do salário novo (maior para menor)
      return b.salarioNovo - a.salarioNovo;
    });

    // Remover a propriedade auxiliar antes de retornar
    return alteracoesOrdenadas.map(({ _dataCompetencia, ...alteracao }) => alteracao);
  }, [empresaSelecionada, alteracoesRaw, selectedColaborador]);

  // 🚫 Dados de afastamentos formatados e ordenados
  const afastamentosData = useMemo(() => {
    if (!empresaSelecionada?.funcionarios) return [];

    const todosAfastamentos: Afastamento[] = [];

    funcionariosFiltrados.forEach((funcionario) => {
      if (funcionario.afastamentos && funcionario.afastamentos.length > 0) {
        const afastamentosDoFuncionario = funcionario.afastamentos.map(a => ({
          inicio: formatDateToBR(a.data_inicial),
          termino: a.data_final ? formatDateToBR(a.data_final) : "N/A",
          diasAfastados: parseFloat(a.num_dias).toString(),
          tipo: a.tipo,
          nomeColaborador: funcionario.nome,
        }));
        todosAfastamentos.push(...afastamentosDoFuncionario);
      }
    });

    // 🔄 Ordenação multi-critério: Nome → Status → Data Início
    return todosAfastamentos.sort((a, b) => {
      // 1º critério: Nome do funcionário (alfabética)
      const nomeComparison = a.nomeColaborador.localeCompare(b.nomeColaborador);
      if (nomeComparison !== 0) return nomeComparison;

      // 2º critério: Status do afastamento (ativos primeiro)
      const aAtivo = a.termino === "N/A" ? 1 : 0;
      const bAtivo = b.termino === "N/A" ? 1 : 0;
      if (aAtivo !== bAtivo) return bAtivo - aAtivo;

      // 3º critério: Data de início (mais recente primeiro)
      try {
        const dataInicioA = new Date(a.inicio.split('/').reverse().join('-')).getTime();
        const dataInicioB = new Date(b.inicio.split('/').reverse().join('-')).getTime();
        return dataInicioB - dataInicioA;
      } catch (e) {
        return 0;
      }
    });
  }, [empresaSelecionada, funcionariosFiltrados]);

  return {
    kpiCardData,
    contratosData,
    examesData,
    afastamentosData,
    feriasData,
    alteracoesData,
    colaboradorOptions,
    empresaOptionsData,
  };
};
