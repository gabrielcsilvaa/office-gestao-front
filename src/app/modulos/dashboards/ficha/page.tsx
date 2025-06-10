"use client";
import { Cairo } from "next/font/google";
import { useMemo, useState, useEffect } from "react";
import SecaoFiltros from "./components/SecaoFiltros";
import KpiCardsGrid from "./components/KpiCardsGrid";
import EvolucaoCard from "./components/EvolucaoCard";
import ValorPorGrupoCard from "./components/ValorPorGrupoCard";
import AtestadosTable from "./components/AtestadosTable";
import AfastamentosTable from "./components/AfastamentosTable";
import ContratosTable from "./components/ContratosTable";
import FeriasDetalheCard from "./components/FeriasDetalheCard";
import AlteracoesSalariaisDetalheCard from "./components/AlteracoesSalariaisDetalheCard";
import Modal from "../organizacional/components/Modal";
import EvolucaoChart from "./components/EvolucaoChart";
import ValorPorGrupoChart from "./components/ValorPorGrupoChart";
import Calendar from "@/components/calendar";
const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cairo",
});

interface Funcionario {
  id_empregado: number;
  nome: string;
  data_nascimento?: string;
  cargo?: string;
  escolaridade?: string;
  admissao?: string;
  salario?: string;
  afastamentos?: AfastamentoEntryRaw[];
  exames?: ExameEntryRaw[];
}

interface EmpresaFicha {
  id_empresa: number;
  nome_empresa: string;
  funcionarios?: Funcionario[];
}

interface FeriasEntry {
  id_empregado: number;
  nome: string;
  inicio_aquisitivo: string;
  fim_aquisitivo: string;
  inicio_gozo: string;
  fim_gozo: string;
}

interface FeriasPorEmpresa {
  id_empresa: number;
  ferias: FeriasEntry[];
}

interface FormattedFerias {
  nomeColaborador: string;
  inicioPeriodoAquisitivo: string;
  fimPeriodoAquisitivo: string;
  inicioPeriodoGozo: string;         // adicionado
  fimPeriodoGozo: string;            // adicionado
  limiteParaGozo: string;
  diasDeDireito: number;
  diasGozados: number;
  diasDeSaldo: number;
}

interface AlteracaoEntry {
  id_empregado: number;
  nome: string;
  competencia: string;
  novo_salario: string;
  salario_anterior: string | null;
  motivo: number;
}
interface AlteracoesPorEmpresa {
  id_empresa: number;
  alteracoes: AlteracaoEntry[];
}
interface FormattedAlteracao {
  nomeColaborador: string;
  competencia: string;
  salarioAnterior: number | null;
  salarioNovo: number;
  motivo: string;
  percentual: string;
}

interface AfastamentoEntryRaw {
  data_inicial: string;
  data_final: string | null;
  num_dias: string;
  tipo: string;
}

interface Afastamento {
  inicio: string;
  termino: string;
  diasAfastados: string;
  tipo: string;
  nomeColaborador: string;
}

interface ExameEntryRaw {
  data_exame: string;
  data_vencimento: string;
  resultado: string;
  tipo: string;
}

interface Exame {
  vencimento: string;
  dataExame: string;
  resultado: string;
  tipo: string;
  nomeColaborador: string;
}

export const formatDate = (date: Date | null) => {
  if (date) {
    return date.toISOString().split("T")[0];
  }
  return null;
};

const formatDateToBR = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  try {
    const [year, month, day] = dateString.split("-");
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return "N/A";
  } catch (e) {
    return "N/A";
  }
};

const formatCurrencyValue = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined || value === "") return "N/A";
  const num = parseFloat(String(value));
  if (isNaN(num)) return "N/A";
  return `R$ ${num.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Helper function to capitalize words
const capitalizeWords = (text: string | null | undefined): string => {
  if (!text) return "N/A";
  
  const romanNumeralPattern = /^(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3}))$/i;

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (word.toLowerCase().startsWith("(o)") || word.toLowerCase().startsWith("(a)")) {
        // Specific handling for (o) or (a) if needed, e.g. Costureira(o)
        // This part can be tricky if the (o) or (a) is part of a larger word.
        // For "COSTUREIRA(O)", the current logic might produce "Costureira(o)"
        // If you want "Costureira(O)", more specific logic is needed.
        // The provided example "Costureira(o) Em Geral" seems to be the target.
        // Let's refine the (o)/(a) handling slightly for common cases.
        if (word.match(/\([oa]\)/i)) {
            const parts = word.split(/(\([oa]\))/i); // Split by (o) or (a)
            return parts.map((part, index) => {
                if (index === 0 && part.length > 0) { // Part before (o)/(a)
                    return part.charAt(0).toUpperCase() + part.slice(1);
                }
                return part; // (o)/(a) or part after
            }).join('');
        }
      }
      // Check if the word is a Roman numeral
      if (romanNumeralPattern.test(word)) {
        return word.toUpperCase();
      }
      if (word.length > 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return "";
    })
    .join(" ");
};

// Helper function to calculate age
const calculateAge = (birthDateString: string | null | undefined): string => {
  if (!birthDateString) return "N/A";
  try {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? `${age} anos` : "N/A";
  } catch (e) {
    return "N/A";
  }
};


const parseCurrency = (currencyString: string): number => {
  if (!currencyString) return 0;
  return parseFloat(
    currencyString
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim()
  );
};

const rawChartDataEntriesFicha = [
  "Jan/2024: R$ 1.896,58",
  "Fev/2024: R$ 2.200,00",
  "Mar/2024: R$ 2.050,75",
  "Abr/2024: R$ 2.350,00",
  "Mai/2024: R$ 2.100,50",
  "Jun/2024: R$ 2.600,00",
  "Jul/2024: R$ 2.450,25",
  "Ago/2024: R$ 2.850,00",
  "Set/2024: R$ 2.700,80",
  "Out/2024: R$ 3.000,00", 
  "Nov/2024: R$ 2.900,90", 
  "Dez/2024: R$ 3.134,66",
];

const sectionIconsFicha = [
  { src: "/assets/icons/icon-lay-down.svg", alt: "Lay Down", adjustSize: true },
  { src: "/assets/icons/icon-lay-up.svg", alt: "Lay Up", adjustSize: true },
  { src: "/assets/icons/icon-hierarchy.svg", alt: "Hierarchy" },
  { src: "/assets/icons/icon-filter-layers.svg", alt: "Filter Layers" },
  { src: "/assets/icons/icon-maximize.svg", alt: "Maximize" },
  { src: "/assets/icons/icon-more-options.svg", alt: "More Options" },
];

const tableHeaderIcons = sectionIconsFicha.slice(-3);

const valorPorGrupoDataFicha = [
  { name: "Salário Base", value: 5000.00 },
  { name: "Horas Extras (50%)", value: 350.75 },
  { name: "Adicional Noturno", value: 120.20 },
  { name: "Comissões", value: 850.00 },
  { name: "DSR sobre Horas Extras", value: 70.15 },
  { name: "DSR sobre Comissões", value: 170.00 },
  { name: "Gratificação de Função", value: 600.00 },
  { name: "Ajuda de Custo - Alimentação", value: 450.00 },
  { name: "Ajuda de Custo - Transporte", value: 180.00 },
  { name: "Prêmio por Desempenho", value: 1200.00 },
  { name: "Participação nos Lucros (PLR)", value: 2500.00 },
  { name: "Abono Pecuniário de Férias", value: 1666.67 },
  { name: "1/3 Constitucional de Férias", value: 555.56 },
  { name: "Salário Família", value: 90.78 },
  { name: "Adicional de Insalubridade", value: 282.40 },
  { name: "Adicional de Periculosidade", value: 1500.00 },
  { name: "Quebra de Caixa", value: 150.00 },
  { name: "INSS (Desconto)", value: -550.00 },
  { name: "IRRF (Desconto)", value: -320.50 },
  { name: "Contribuição Sindical (Desconto)", value: -50.00 },
  { name: "Vale Transporte (Desconto)", value: -90.00 },
  { name: "Vale Refeição (Desconto)", value: -70.00 },
  { name: "Plano de Saúde (Desconto)", value: -250.00 },
  { name: "Pensão Alimentícia (Desconto)", value: -750.00 },
  { name: "Faltas e Atrasos (Desconto)", value: -120.00 },
  { name: "Empréstimo Consignado (Desconto)", value: -400.00 },
];

const mockContratosRaw = [
  { id: "1", empresa: "Empresa Alpha", colaborador: "João Silva", dataAdmissao: "01/01/2020", dataRescisao: "31/12/2021", salarioBase: "R$ 3.500,00" },
  { id: "2", empresa: "Empresa Alpha", colaborador: "João Silva", dataAdmissao: "15/01/2022", salarioBase: "R$ 3.800,00" },
  { id: "3", empresa: "Empresa Beta", colaborador: "Maria Oliveira", dataAdmissao: "10/03/2019", salarioBase: "R$ 4.200,00" },
  { id: "4", empresa: "Empresa Gamma", colaborador: "Carlos Pereira", dataAdmissao: "05/07/2018", dataRescisao: "04/07/2020", salarioBase: "R$ 3.000,00" },
  { id: "5", empresa: "Empresa Delta", colaborador: "Ana Costa", dataAdmissao: "20/11/2022", salarioBase: "R$ 4.500,00" },
  { id: "6", empresa: "Empresa Epsilon", colaborador: "Lucas Martins", dataAdmissao: "01/02/2017", dataRescisao: "15/08/2019", salarioBase: "R$ 2.800,00" },
  { id: "7", empresa: "Empresa Epsilon", colaborador: "Lucas Martins", dataAdmissao: "01/09/2019", salarioBase: "R$ 3.200,00" },
  { id: "8", empresa: "Empresa Zeta", colaborador: "Beatriz Souza", dataAdmissao: "10/05/2021", salarioBase: "R$ 4.000,00" },
  { id: "9", empresa: "Empresa Eta", colaborador: "Rafael Lima", dataAdmissao: "22/08/2017", dataRescisao: "30/09/2020", salarioBase: "R$ 3.300,00" },
  { id: "10", empresa: "Empresa Theta", colaborador: "Juliana Alves", dataAdmissao: "03/03/2023", salarioBase: "R$ 4.800,00" },
  { id: "11", empresa: "Empresa Iota", colaborador: "Fernando Rocha", dataAdmissao: "19/06/2016", dataRescisao: "10/01/2019", salarioBase: "R$ 2.950,00" },
  { id: "12", empresa: "Empresa Kappa", colaborador: "Camila Santos", dataAdmissao: "08/12/2020", salarioBase: "R$ 3.700,00" },
  { id: "13", empresa: "Empresa Lambda", colaborador: "Gustavo Mendes", dataAdmissao: "14/04/2018", salarioBase: "R$ 4.100,00" },
  { id: "14", empresa: "Empresa Mu", colaborador: "Patrícia Ribeiro", dataAdmissao: "25/07/2022", dataRescisao: "10/10/2023", salarioBase: "R$ 3.900,00" },
];

const diffDays = (start: string, end: string): number =>
  Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000*60*60*24));

export default function FichaPessoalPage() {
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>("");
  const [selectedColaborador, setSelectedColaborador] = useState<string>("");
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const handleCloseModal = () => setModalContent(null);

    //Estados de data
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [dados, setDados] = useState<EmpresaFicha[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [empresaOptions, setEmpresaOptions] = useState<string[]>([]);
  const [colaboradorOptions, setColaboradorOptions] = useState<Funcionario[]>([]); 
  const [feriasRaw, setFeriasRaw] = useState<FeriasPorEmpresa[]>([]);
  const [feriasData, setFeriasData] = useState<FormattedFerias[]>([]);
  const [alteracoesRaw, setAlteracoesRaw] = useState<AlteracoesPorEmpresa[]>([]);
  const [alteracoesData, setAlteracoesData] = useState<FormattedAlteracao[]>([]);
  const [afastamentosData, setAfastamentosData] = useState<Afastamento[]>([]);
  const [examesData, setExamesData] = useState<Exame[]>([]);

  const initialKpiCardData = [
    { title: "Data de Admissão", value: "N/A", tooltipText: "Data de início do colaborador na empresa." },
    { title: "Salário Base", value: "N/A", tooltipText: "Salário bruto mensal do colaborador." },
    { title: "Cargo", value: "N/A", tooltipText: "Cargo atual do colaborador." },
    { title: "Escolaridade", value: "N/A", tooltipText: "Nível de escolaridade do colaborador." },
    { title: "Idade", value: "N/A", tooltipText: "Idade atual do colaborador." },
  ];
  const [currentKpiCardData, setCurrentKpiCardData] = useState(initialKpiCardData);


  const handleStartDateChange = (date: string | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: string | null) => {
    setEndDate(date);
  };

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        setError(null);
        setEmpresaOptions([]);
        setColaboradorOptions([]);
        setSelectedColaborador("");

        if (!startDate || !endDate) {
          setDados(null);
          return;
        }

        const formattedStartDate = formatDate(new Date(startDate));
        const formattedEndDate = formatDate(new Date(endDate));

        const body = {
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        };

        const response = await fetch("/api/dashboard-ficha", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);

        const result = (await response.json()) as {
          dados?: EmpresaFicha[];
          alteracao_salario?: AlteracoesPorEmpresa[];
          ferias?: FeriasPorEmpresa[];
        };

        console.log("Dados recebidos:", result);  // exibe { dados, alteracao_salario, ferias }

        // rawDados tipado como EmpresaFicha[]
        const rawDados: EmpresaFicha[] = Array.isArray(result.dados) ? result.dados : [];
        setDados(rawDados);

        // Console.log para exibir funcionários com exames não vazios
        if (rawDados.length > 0) {
          const funcionariosComExames = rawDados.flatMap(empresa => 
            empresa.funcionarios?.filter(funcionario => 
              funcionario.exames && funcionario.exames.length > 0
            ) || []
          );
          
          if (funcionariosComExames.length > 0) {
            console.log("Funcionários com exames:", funcionariosComExames);
          } else {
            console.log("Nenhum funcionário possui exames registrados");
          }
        }

        if (rawDados.length > 0) {
          // agora item é do tipo EmpresaFicha e uniqueEmpresas é string[]
          const uniqueEmpresas: string[] = Array.from(
            new Set(rawDados.map((item) => item.nome_empresa.trim()))
          ).sort();
          setEmpresaOptions(uniqueEmpresas);
        } else {
          setEmpresaOptions([]);
        }

        setFeriasRaw(Array.isArray(result.ferias) ? result.ferias : []);
        setAlteracoesRaw(Array.isArray(result.alteracao_salario) ? result.alteracao_salario : []);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        setDados(null); // Clear data on error
        setEmpresaOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [startDate, endDate]); 

  useEffect(() => {
    if (selectedEmpresa && dados) {
      const empresaSelecionada = dados.find(
        (emp) => emp.nome_empresa.trim() === selectedEmpresa // Trim emp.nome_empresa here
      );
      if (empresaSelecionada && empresaSelecionada.funcionarios) {
        const sortedFuncionarios = [...empresaSelecionada.funcionarios].sort((a, b) =>
          a.nome.localeCompare(b.nome)
        );
        setColaboradorOptions(sortedFuncionarios);
      } else {
        setColaboradorOptions([]);
      }
    } else {
      setColaboradorOptions([]);
    }
    setSelectedColaborador("");
  }, [selectedEmpresa, dados]);
  
  useEffect(() => {
    if (selectedColaborador && colaboradorOptions.length > 0) {
      const funcionarioSelecionado = colaboradorOptions.find(
        (func) => func.nome === selectedColaborador
      );

      if (funcionarioSelecionado) {
        setCurrentKpiCardData([
          { title: "Data de Admissão", value: formatDateToBR(funcionarioSelecionado.admissao), tooltipText: "Data de início do colaborador na empresa." },
          { title: "Salário Base", value: formatCurrencyValue(funcionarioSelecionado.salario), tooltipText: "Salário bruto mensal do colaborador." },
          { title: "Cargo", value: capitalizeWords(funcionarioSelecionado.cargo), tooltipText: "Cargo atual do colaborador." },
          { title: "Escolaridade", value: capitalizeWords(funcionarioSelecionado.escolaridade), tooltipText: "Nível de escolaridade do colaborador." },
          { title: "Idade", value: calculateAge(funcionarioSelecionado.data_nascimento), tooltipText: "Idade atual do colaborador." },
        ]);
      } else {
        setCurrentKpiCardData(initialKpiCardData);
      }
    } else {
      setCurrentKpiCardData(initialKpiCardData);
    }
  }, [selectedColaborador, colaboradorOptions]);
        
  const kpiCardData = [
    { title: "Data de Admissão", value: "01/01/2020", tooltipText: "Data de início do colaborador na empresa." },
    { title: "Salário Base", value: "R$ 5.000,00", tooltipText: "Salário bruto mensal do colaborador." },
    { title: "Cargo", value: "Desenvolvedor", tooltipText: "Cargo atual do colaborador." },
    { title: "Escolaridade", value: "Superior Completo", tooltipText: "Nível de escolaridade do colaborador." },
    { title: "Idade", value: "30 anos", tooltipText: "Idade atual do colaborador." },
  ];

  const processedEvolucaoChartDataFicha = useMemo(() => {
    return rawChartDataEntriesFicha.map(entry => {
      const [month, valueString] = entry.split(": ");
      return { month, value: parseCurrency(valueString) };
    });
  }, []);
  const evolucaoCardTitle = "Evolução de Custo Total";

  const processedTableData = useMemo(() => {
    const targetLength = 14;

    const padArray = <T,>(
      arr: T[],
      length: number,
      placeholderFactory: (index: number) => T
    ): T[] => {
      const currentLength = arr.length;
      if (currentLength >= length) {
        return arr.slice(0, length);
      }
      const placeholders = Array.from({ length: length - currentLength }, (_, i) =>
        placeholderFactory(currentLength + i)
      );
      return [...arr, ...placeholders];
    };

    const contratoPlaceholder = (index: number) => ({
      id: `placeholder-${index}`, empresa: "", colaborador: "", dataAdmissao: "", dataRescisao: "", salarioBase: ""
    });

    return {
      contratos: padArray(mockContratosRaw, targetLength, contratoPlaceholder),
    };
  }, []);

  useEffect(() => {
    if (selectedEmpresa && dados) {
      const empresaSelecionada = dados.find(
        (emp) => emp.nome_empresa.trim() === selectedEmpresa
      );

      if (empresaSelecionada && empresaSelecionada.funcionarios) {
        const todosExamesDaEmpresa: Exame[] = [];
        
        // Filtrar funcionários se um colaborador específico estiver selecionado
        const funcionariosFiltrados = selectedColaborador 
          ? empresaSelecionada.funcionarios.filter(func => func.nome === selectedColaborador)
          : empresaSelecionada.funcionarios;

        funcionariosFiltrados.forEach((funcionario) => {
          if (funcionario.exames && funcionario.exames.length > 0) {
            const examesDoFuncionario = funcionario.exames.map(
              (e) => ({
                vencimento: formatDateToBR(e.data_vencimento),
                dataExame: formatDateToBR(e.data_exame),
                resultado: e.resultado,
                tipo: e.tipo,
                nomeColaborador: funcionario.nome,
              })
            );
            todosExamesDaEmpresa.push(...examesDoFuncionario);
          }
        });
        
        // Ordenar exames: 1º por nome, 2º por data de vencimento (mais urgente primeiro)
        todosExamesDaEmpresa.sort((a, b) => {
          const nomeComparison = a.nomeColaborador.localeCompare(b.nomeColaborador);
          if (nomeComparison !== 0) return nomeComparison;
          
          try {
            const dataA = new Date(a.vencimento.split('/').reverse().join('-'));
            const dataB = new Date(b.vencimento.split('/').reverse().join('-'));
            return dataA.getTime() - dataB.getTime();
          } catch (e) {
            return 0;
          }
        });
        
        setExamesData(todosExamesDaEmpresa);
      } else {
        setExamesData([]);
      }
    } else {
      setExamesData([]);
    }
  }, [selectedEmpresa, dados, selectedColaborador]); // Adicionar selectedColaborador na dependência

  useEffect(() => {
    if (selectedEmpresa && dados) {
      const emp = dados.find(e => e.nome_empresa.trim() === selectedEmpresa);
      const rec = emp && feriasRaw.find(f => f.id_empresa === emp.id_empresa);
      if (rec) {
        // Filtrar férias por funcionário selecionado se houver
        const feriasFiltradas = selectedColaborador 
          ? rec.ferias.filter(f => f.nome === selectedColaborador)
          : rec.ferias;

        const feriasFormatadas = feriasFiltradas.map(f => ({
          nomeColaborador: f.nome,
          inicioPeriodoAquisitivo: formatDateToBR(f.inicio_aquisitivo),
          fimPeriodoAquisitivo: formatDateToBR(f.fim_aquisitivo),
          inicioPeriodoGozo: formatDateToBR(f.inicio_gozo),
          fimPeriodoGozo: formatDateToBR(f.fim_gozo),
          limiteParaGozo: formatDateToBR(f.fim_aquisitivo),
          diasDeDireito: diffDays(f.inicio_aquisitivo, f.fim_aquisitivo),
          diasGozados: diffDays(f.inicio_gozo, f.fim_gozo),
          diasDeSaldo: diffDays(f.inicio_aquisitivo, f.fim_aquisitivo)
            - diffDays(f.inicio_gozo, f.fim_gozo),
          // Manter as datas originais para ordenação
          _dataVencimento: f.fim_aquisitivo,
          _dataInicioAquisitivo: f.inicio_aquisitivo,
        }));

        // Aplicar ordenação multi-critério
        feriasFormatadas.sort((a, b) => {
          // 1º critério: Nome do funcionário (alfabética)
          const nomeComparison = a.nomeColaborador.localeCompare(b.nomeColaborador);
          if (nomeComparison !== 0) return nomeComparison;

          // 2º critério: Data de vencimento (mais urgente primeiro)
          try {
            const dataVencimentoA = new Date(a._dataVencimento);
            const dataVencimentoB = new Date(b._dataVencimento);
            const vencimentoComparison = dataVencimentoA.getTime() - dataVencimentoB.getTime();
            if (vencimentoComparison !== 0) return vencimentoComparison;
          } catch (e) {
            // Em caso de erro na conversão de data, continua para o próximo critério
          }

          // 3º critério: Data de início do período aquisitivo (mais antigo primeiro)
          try {
            const dataInicioA = new Date(a._dataInicioAquisitivo);
            const dataInicioB = new Date(b._dataInicioAquisitivo);
            return dataInicioA.getTime() - dataInicioB.getTime();
          } catch (e) {
            return 0;
          }
        });

        // Remover as propriedades auxiliares antes de definir o estado
        const feriasLimpas = feriasFormatadas.map(({ _dataVencimento, _dataInicioAquisitivo, ...ferias }) => ferias);
        setFeriasData(feriasLimpas);
      } else {
        setFeriasData([]);
      }
    } else {
      setFeriasData([]);
    }
  }, [selectedEmpresa, dados, feriasRaw, selectedColaborador]); // Adicionar selectedColaborador na dependência

  useEffect(() => {
    if (selectedEmpresa && dados) {
      const emp = dados.find(e => e.nome_empresa.trim() === selectedEmpresa);
      const rec = emp && alteracoesRaw.find(a => a.id_empresa === emp.id_empresa);
      if (rec) {
        // Filtrar alterações por funcionário selecionado se houver
        const alteracoesFiltradas = selectedColaborador 
          ? rec.alteracoes.filter(a => a.nome === selectedColaborador)
          : rec.alteracoes;

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
            // Manter a data original para ordenação
            _dataCompetencia: a.competencia,
          };
        });

        // Aplicar ordenação multi-critério
        alteracoesFormatadas.sort((a, b) => {
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

        // Remover a propriedade auxiliar antes de definir o estado
        const alteracoesLimpas = alteracoesFormatadas.map(({ _dataCompetencia, ...alteracao }) => alteracao);
        setAlteracoesData(alteracoesLimpas);
      } else {
        setAlteracoesData([]);
      }
    } else {
      setAlteracoesData([]);
    }
  }, [selectedEmpresa, dados, alteracoesRaw, selectedColaborador]); // Adicionar selectedColaborador na dependência

  useEffect(() => {
    if (selectedEmpresa && dados) {
      const empresaSelecionada = dados.find(
        (emp) => emp.nome_empresa.trim() === selectedEmpresa
      );

      if (empresaSelecionada && empresaSelecionada.funcionarios) {
        const todosAfastamentosDaEmpresa: Afastamento[] = [];
        
        // Filtrar funcionários se um colaborador específico estiver selecionado
        const funcionariosFiltrados = selectedColaborador 
          ? empresaSelecionada.funcionarios.filter(func => func.nome === selectedColaborador)
          : empresaSelecionada.funcionarios;

        funcionariosFiltrados.forEach((funcionario) => {
          if (funcionario.afastamentos && funcionario.afastamentos.length > 0) {
            const afastamentosDoFuncionario = funcionario.afastamentos.map(
              (a) => ({
                inicio: formatDateToBR(a.data_inicial),
                termino: a.data_final ? formatDateToBR(a.data_final) : "N/A",
                diasAfastados: parseFloat(a.num_dias).toString(),
                tipo: a.tipo,
                nomeColaborador: funcionario.nome,
              })
            );
            todosAfastamentosDaEmpresa.push(...afastamentosDoFuncionario);
          }
        });
        
        setAfastamentosData(todosAfastamentosDaEmpresa);
      } else {
        setAfastamentosData([]);
      }
    } else {
      setAfastamentosData([]);
    }
  }, [selectedEmpresa, dados, selectedColaborador]); // Adicionar selectedColaborador na dependência

  return (
    <div className="bg-[#f7f7f8] flex flex-col flex-1 h-full min-h-0">
      {/* Header */}
      <div className="relative z-10 flex flex-row items-center justify-start gap-8 p-4 border-b border-black/10 bg-gray-100">
        <h1 className={`text-[32px] leading-8 font-700 text-black ${cairo.className}`}>
          Dashboard de Ficha Pessoal
        </h1>
        <SecaoFiltros
          selectedEmpresa={selectedEmpresa}
          onChangeEmpresa={setSelectedEmpresa}
          selectedColaborador={selectedColaborador}
          onChangeColaborador={setSelectedColaborador}
          empresaOptionsList={empresaOptions}
          areDatesSelected={!!(startDate && endDate)}
          colaboradorOptionsList={colaboradorOptions}
          isEmpresaSelected={!!selectedEmpresa}
        />
        <Calendar
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
        {/* Progress bar */}
        {loading && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 animate-pulse" />
        )}
      </div>

      {/* Contéudo rolável */}
      <div className="flex-1 p-4 overflow-y-auto min-h-0">
         {/* KPIs: animação de slide down/up */}
         {/* This div with `transform` creates a stacking context. Its children (tooltips z-50) will be stacked relative to it. */}
         {/* This container itself needs to be effectively above the header's z-[40]. */}
         <div className={`transition-all duration-500 ease-in-out transform origin-top
             ${selectedColaborador
               ? 'max-h-[800px] opacity-100 translate-y-0'
               : 'max-h-0 opacity-0 -translate-y-4'}`}>
          <KpiCardsGrid cardsData={currentKpiCardData} />
        </div>

        {/* Evolução & Valor por Grupo */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
          <div className="w-full h-full flex flex-col shadow-md overflow-auto min-h-0 rounded-lg">
            <EvolucaoCard
              kpiSelecionado={evolucaoCardTitle}
              processedEvolucaoChartData={processedEvolucaoChartDataFicha}
              sectionIcons={sectionIconsFicha.filter(icon => icon.alt === "Maximize")}
              cairoClassName={cairo.className}
              onMaximize={() =>
                setModalContent(
                  <div className="flex flex-col w-[90vw] h-[80vh]">
                    <h2 className={`text-2xl font-bold mb-2 ${cairo.className}`}>
                      Evolução de Custo Total
                    </h2>
                    <p className={`text-base text-gray-500 mb-4 ${cairo.className}`}>
                      Variação mensal de custo total no período selecionado.
                    </p>
                    <div className="flex-1">
                      <EvolucaoChart
                        data={processedEvolucaoChartDataFicha}
                        kpiName={evolucaoCardTitle}
                      />
                    </div>
                  </div>
                )
              }
            />
          </div>
          <div className="w-full h-full flex flex-col shadow-md overflow-auto min-h-0 rounded-lg">
            <ValorPorGrupoCard
              valorPorGrupoData={valorPorGrupoDataFicha}
              sectionIcons={sectionIconsFicha.filter(icon => icon.alt === "Maximize")}
              cairoClassName={cairo.className}
              onMaximize={() =>
                setModalContent(
                  <div className="flex flex-col w-[90vw] h-[80vh]">
                    <h2 className={`text-2xl font-bold mb-2 ${cairo.className}`}>
                      Valor Por Grupo
                    </h2>
                    <p className={`text-base text-gray-500 mb-4 ${cairo.className}`}>
                      Distribuição de valores por grupo no período.
                    </p>
                    <div className="flex-1 overflow-x-auto">
                      <div className="min-w-[1560px] h-full">
                        <ValorPorGrupoChart data={valorPorGrupoDataFicha} />
                      </div>
                    </div>
                  </div>
                )
              }
            />
          </div>
        </div>

        {/* Tabelas */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[450px]"> 
          <div className="lg:col-span-1 h-full shadow-md overflow-auto min-h-0 rounded-lg">
            <AtestadosTable 
              atestadosData={examesData} 
              cairoClassName={cairo.className} 
              headerIcons={tableHeaderIcons.filter(icon => icon.alt === "Maximize")}
              title="Histórico de Exames"
            />
          </div>

          <div className="lg:col-span-1 h-full shadow-md overflow-auto min-h-0 rounded-lg">
            <AfastamentosTable 
              afastamentosData={afastamentosData}
              cairoClassName={cairo.className} 
              headerIcons={tableHeaderIcons.filter(icon => icon.alt === "Maximize")}
            />
          </div>

          <div className="lg:col-span-1 h-full shadow-md overflow-auto min-h-0 rounded-lg">
            <ContratosTable
              contratosData={processedTableData.contratos}
              cairoClassName={cairo.className}
              headerIcons={tableHeaderIcons.filter(icon => icon.alt === "Maximize")}
            />
          </div>
        </div>
        
        {/* Férias & Alterações */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 h-[450px]">
          <div className="h-full shadow-md overflow-auto min-h-0 rounded-lg">
            <FeriasDetalheCard
              feriasData={feriasData}
              cairoClassName={cairo.className}
              headerIcons={tableHeaderIcons.filter(icon => icon.alt === "Maximize")}
              title="Detalhes de Férias"
            />
          </div>
          <div className="h-full shadow-md overflow-auto min-h-0 rounded-lg">
            <AlteracoesSalariaisDetalheCard
              alteracoesData={alteracoesData}
              cairoClassName={cairo.className}
              headerIcons={tableHeaderIcons.filter(icon => icon.alt === "Maximize")}
              title="Detalhes de Alterações Salariais"
            />
          </div>
        </div>
        <p className="mt-4"></p>
      </div>

      {modalContent && (
        <Modal isOpen={true} onClose={handleCloseModal}>
          {modalContent}
        </Modal>
      )}
    </div>
  );
}
