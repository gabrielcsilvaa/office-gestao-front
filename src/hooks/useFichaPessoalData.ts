// 🧠 Hook Customizado - Cérebro de Dados da Ficha Pessoal
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

  // ★ 1) Base de empresas: todas quando não há filtro, apenas a escolhida quando há
  const empresasBase = useMemo<EmpresaFicha[]>(() => {
    const arr = Array.isArray(dados) ? dados : [];
    return selectedEmpresa
      ? arr.filter(e => e.nome_empresa.trim() === selectedEmpresa.trim())
      : arr;
  }, [dados, selectedEmpresa]);

  // ★ (opcional) primeira empresa da base quando houver filtro (útil para id_empresa)
  const primeiraEmpresaSelecionada = empresasBase[0] ?? null;

  // ★ 2) Opções de colaboradores: de TODAS as empresas quando não há filtro
  const colaboradorOptions = useMemo(() => {
    const funcs = empresasBase.flatMap(e => e.funcionarios ?? []);
    return [...funcs].sort((a, b) => a.nome.localeCompare(b.nome));
  }, [empresasBase]);

  // Opções de empresas (sem mudança, apenas lendo de dados)
  const empresaOptionsData = useMemo(() => {
    if (!dados || dados.length === 0) return [];
    return dados
      .map(item => ({
        id_empresa: item.id_empresa,
        nome_empresa: item.nome_empresa.trim()
      }))
      .sort((a, b) => a.nome_empresa.localeCompare(b.nome_empresa));
  }, [dados]);

  // ★ 3) Funcionários filtrados: todos ou apenas o colaborador escolhido
  const funcionariosFiltrados = useMemo(() => {
    const todos = empresasBase.flatMap(e => e.funcionarios ?? []);
    return selectedColaborador
      ? todos.filter(func => func.nome === selectedColaborador)
      : todos;
  }, [empresasBase, selectedColaborador]);

  // KPIs do colaborador selecionado (passam a considerar colaboradorOptions global)
  const kpiCardData = useMemo(() => {
    const initialKpiCardData = [
      { title: "Data de Admissão", value: "N/A", tooltipText: "Data de início do funcionário na empresa." },
      { title: "Salário Base", value: "N/A", tooltipText: "Salário bruto mensal do funcionário." },
      { title: "Cargo", value: "N/A", tooltipText: "Cargo atual do funcionário." },
      { title: "Escolaridade", value: "N/A", tooltipText: "Nível de escolaridade do funcionário." },
      { title: "Idade", value: "N/A", tooltipText: "Idade atual do funcionário." },
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
        tooltipText: "Data de início do funcionário na empresa."
      },
      {
        title: "Salário Base",
        value: formatCurrencyValue(funcionarioSelecionado.salario),
        tooltipText: "Salário bruto mensal do funcionário."
      },
      {
        title: "Cargo",
        value: capitalizeWords(funcionarioSelecionado.cargo),
        tooltipText: "Cargo atual do funcionário."
      },
      {
        title: "Escolaridade",
        value: capitalizeWords(funcionarioSelecionado.escolaridade),
        tooltipText: "Nível de escolaridade do funcionário."
      },
      {
        title: "Idade",
        value: calculateAge(funcionarioSelecionado.data_nascimento),
        tooltipText: "Idade atual do funcionário."
      },
    ];
  }, [selectedColaborador, colaboradorOptions]);

  // ★ 4) Contratos: iterar empresasBase (para manter o nome da empresa) e aplicar filtro de colaborador
  const contratosData = useMemo(() => {
    if (!empresasBase.length) return [];

    const todosContratos: Contrato[] = [];

    empresasBase.forEach((empresa) => {
      (empresa.funcionarios ?? []).forEach((funcionario) => {
        if (selectedColaborador && funcionario.nome !== selectedColaborador) return;

        const contrato: Contrato = {
          id: `${funcionario.id_empregado}`,
          empresa: empresa.nome_empresa,
          colaborador: funcionario.nome,
          dataAdmissao: formatDateToBR(funcionario.admissao),
          dataRescisao: funcionario.demissao ? formatDateToBR(funcionario.demissao) : "",
          salarioBase: formatCurrencyValue(funcionario.salario),
        };
        todosContratos.push(contrato);
      });
    });

    // Ordenação: Nome → Ativos primeiro → Admissão mais recente
    return todosContratos.sort((a, b) => {
      const nomeComparison = a.colaborador.localeCompare(b.colaborador);
      if (nomeComparison !== 0) return nomeComparison;

      const aAtivo = a.dataRescisao === "" ? 1 : 0;
      const bAtivo = b.dataRescisao === "" ? 1 : 0;
      if (aAtivo !== bAtivo) return bAtivo - aAtivo;

      try {
        const dataA = new Date(a.dataAdmissao.split('/').reverse().join('-'));
        const dataB = new Date(b.dataAdmissao.split('/').reverse().join('-'));
        return dataB.getTime() - dataA.getTime();
      } catch {
        return 0;
      }
    });
  }, [empresasBase, selectedColaborador]);

  // Exames: agora parte de funcionariosFiltrados (que já agrega todas as empresas quando não há filtro)
  const examesData = useMemo(() => {
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

    return todosExames.sort((a, b) => {
      const nomeComparison = a.nomeColaborador.localeCompare(b.nomeColaborador);
      if (nomeComparison !== 0) return nomeComparison;

      try {
        const now = Date.now();
        const vencA = new Date(a.vencimento.split('/').reverse().join('-')).getTime();
        const vencB = new Date(b.vencimento.split('/').reverse().join('-')).getTime();
        const diffA = Math.abs(vencA - now);
        const diffB = Math.abs(vencB - now);
        if (diffA !== diffB) return diffA - diffB;
      } catch {}

      try {
        const dataExameA = new Date(a.dataExame.split('/').reverse().join('-')).getTime();
        const dataExameB = new Date(b.dataExame.split('/').reverse().join('-')).getTime();
        return dataExameB - dataExameA;
      } catch {
        return 0;
      }
    });
  }, [funcionariosFiltrados]);

  // Férias: agrega TODAS as empresas quando não há filtro
  const feriasData = useMemo(() => {
    if (!feriasRaw.length) return [];

    const fonte = selectedEmpresa && primeiraEmpresaSelecionada
      ? feriasRaw.filter(f => f.id_empresa === primeiraEmpresaSelecionada.id_empresa)
      : feriasRaw;

    const lista = fonte.flatMap(f => f.ferias);

    const feriasFiltradas = selectedColaborador
      ? lista.filter(f => f.nome === selectedColaborador)
      : lista;

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
      _dataVencimento: f.fim_aquisitivo,
      _dataInicioAquisitivo: f.inicio_aquisitivo,
    }));

    const feriasOrdenadas = feriasFormatadas.sort((a, b) => {
      const nomeComparison = a.nomeColaborador.localeCompare(b.nomeColaborador);
      if (nomeComparison !== 0) return nomeComparison;

      try {
        const now = Date.now();
        const vencA = new Date(a._dataVencimento).getTime();
        const vencB = new Date(b._dataVencimento).getTime();
        const diffA = Math.abs(vencA - now);
        const diffB = Math.abs(vencB - now);
        if (diffA !== diffB) return diffA - diffB;
      } catch {}

      try {
        const inicioA = new Date(a._dataInicioAquisitivo).getTime();
        const inicioB = new Date(b._dataInicioAquisitivo).getTime();
        return inicioA - inicioB;
      } catch {
        return 0;
      }
    });

    return feriasOrdenadas.map(({ _dataVencimento, _dataInicioAquisitivo, ...ferias }) => ferias);
  }, [feriasRaw, selectedEmpresa, primeiraEmpresaSelecionada, selectedColaborador]);

  // Alterações salariais: agrega TODAS as empresas quando não há filtro
  const alteracoesData = useMemo(() => {
    if (!alteracoesRaw.length) return [];

    const fonte = selectedEmpresa && primeiraEmpresaSelecionada
      ? alteracoesRaw.filter(a => a.id_empresa === primeiraEmpresaSelecionada.id_empresa)
      : alteracoesRaw;

    const lista = fonte.flatMap(a => a.alteracoes);

    const alteracoesFiltradas = selectedColaborador
      ? lista.filter(a => a.nome === selectedColaborador)
      : lista;

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
        _dataCompetencia: a.competencia,
      };
    });

    const alteracoesOrdenadas = alteracoesFormatadas.sort((a, b) => {
      const nomeComparison = a.nomeColaborador.localeCompare(b.nomeColaborador);
      if (nomeComparison !== 0) return nomeComparison;

      try {
        const dataCompetenciaA = new Date(a._dataCompetencia);
        const dataCompetenciaB = new Date(b._dataCompetencia);
        const competenciaComparison = dataCompetenciaB.getTime() - dataCompetenciaA.getTime();
        if (competenciaComparison !== 0) return competenciaComparison;
      } catch {}

      return b.salarioNovo - a.salarioNovo;
    });

    return alteracoesOrdenadas.map(({ _dataCompetencia, ...alteracao }) => alteracao);
  }, [alteracoesRaw, selectedEmpresa, primeiraEmpresaSelecionada, selectedColaborador]);

  // Afastamentos: parte de funcionariosFiltrados (todas as empresas quando não há filtro)
  const afastamentosData = useMemo(() => {
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

    return todosAfastamentos.sort((a, b) => {
      const nomeComparison = a.nomeColaborador.localeCompare(b.nomeColaborador);
      if (nomeComparison !== 0) return nomeComparison;

      const aAtivo = a.termino === "N/A" ? 1 : 0;
      const bAtivo = b.termino === "N/A" ? 1 : 0;
      if (aAtivo !== bAtivo) return bAtivo - aAtivo;

      try {
        const dataInicioA = new Date(a.inicio.split('/').reverse().join('-')).getTime();
        const dataInicioB = new Date(b.inicio.split('/').reverse().join('-')).getTime();
        return dataInicioB - dataInicioA;
      } catch {
        return 0;
      }
    });
  }, [funcionariosFiltrados]);

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
