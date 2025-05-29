"use client";
import { Cairo } from "next/font/google";
import SecaoFiltros from "./components/SecaoFiltros";
import KpiCardsGrid from "./components/KpiCardsGrid";
import EvolucaoCard from "./components/EvolucaoCard";
import ValorPorGrupoCard from "./components/ValorPorGrupoCard"; // Import ValorPorGrupoCard
import AtestadosTable from "./components/AtestadosTable"; // Import AtestadosTable
import AfastamentosTable from "./components/AfastamentosTable"; // Novo componente
import ContratosTable from "./components/ContratosTable"; // Import ContratosTable
import { useMemo, useState } from "react";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cairo",
});

// Helper function to parse currency string to number (if not already available globally)
const parseCurrency = (currencyString: string): number => {
  if (!currencyString) return 0;
  return parseFloat(
    currencyString
      .replace("R$", "")
      .replace(/\./g, "") // Remove thousand separators
      .replace(",", ".") // Replace decimal comma with dot
      .trim()
  );
};

// Data for EvolucaoCard specific to Ficha Pessoal
const rawChartDataEntriesFicha = [
  "Jan/2024: R$ 1.896,58",
  "Fev/2024: R$ 2.200,00", // Varied data
  "Mar/2024: R$ 2.050,75", // Varied data
  "Abr/2024: R$ 2.350,00", // Varied data
  "Mai/2024: R$ 2.100,50", // Varied data
  "Jun/2024: R$ 2.600,00", // Varied data
  "Jul/2024: R$ 2.450,25", // Varied data
  "Ago/2024: R$ 2.850,00", // Varied data
  "Set/2024: R$ 2.700,80", // Varied data
  "Out/2024: R$ 3.000,00", // Varied data
  "Nov/2024: R$ 2.900,90", // Varied data
  "Dez/2024: R$ 3.134,66",
];

// Section icons data (can be shared or specific)
const sectionIconsFicha = [
  { src: "/assets/icons/icon-lay-down.svg", alt: "Lay Down", adjustSize: true },
  { src: "/assets/icons/icon-lay-up.svg", alt: "Lay Up", adjustSize: true },
  { src: "/assets/icons/icon-hierarchy.svg", alt: "Hierarchy" },
  { src: "/assets/icons/icon-filter-layers.svg", alt: "Filter Layers" },
  { src: "/assets/icons/icon-maximize.svg", alt: "Maximize" },
  { src: "/assets/icons/icon-more-options.svg", alt: "More Options" },
];

// Icons for table headers (last 3 from sectionIconsFicha)
const tableHeaderIcons = sectionIconsFicha.slice(-3);

// Data for ValorPorGrupoCard specific to Ficha Pessoal - with many items
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

// Dados de amostra do CSV para representar todos os tipos de resultados e tipos de exame
// This data will be passed to the AtestadosTable component
const atestadosDataRaw = [
  { vencimento: "30/10/2023", dataExame: "30/10/2021", resultado: "Apto", tipo: "Admissional" },
  { vencimento: "06/01/2023", dataExame: "07/01/2022", resultado: "Apto", tipo: "Periódico" },
  { vencimento: "22/12/2022", dataExame: "23/12/2021", resultado: "Apto", tipo: "Mudança de Função" },
  { vencimento: "12/12/2022", dataExame: "13/12/2021", resultado: "Apto", tipo: "Retorno ao Trabalho" },
  { vencimento: "07/11/2022", dataExame: "08/11/2021", resultado: "Apto", tipo: "Demissional" },
  { vencimento: "27/02/2013", dataExame: "28/02/2012", resultado: "Apto", tipo: "Periódico" }, // Dado atualizado
  { vencimento: "15/05/2024", dataExame: "15/05/2023", resultado: "Apto", tipo: "Periódico" },
  { vencimento: "10/08/2023", dataExame: "10/08/2022", resultado: "Inapto", tipo: "Periódico" },
  { vencimento: "20/03/2023", dataExame: "20/03/2022", resultado: "Apto com restrições", tipo: "Mudança de Função" },
  { vencimento: "05/07/2022", dataExame: "05/07/2021", resultado: "Apto", tipo: "Retorno ao Trabalho" },
  { vencimento: "14/02/2022", dataExame: "14/02/2020", resultado: "Apto", tipo: "Admissional" },
  { vencimento: "18/09/2021", dataExame: "18/09/2020", resultado: "Apto", tipo: "Periódico" },
  { vencimento: "25/11/2020", dataExame: "25/11/2019", resultado: "Apto", tipo: "Demissional" },
  { vencimento: "03/04/2020", dataExame: "03/04/2019", resultado: "Apto com restrições", tipo: "Periódico" },
];

// Dados mock para AfastamentosTable (baseado no CSV fornecido)
const mockAfastamentosRaw = [
  { inicio: "13/08/2015", termino: "10/12/2015", tipo: "Licença maternidade", diasAfastados: "120" },
  { inicio: "01/01/2016", termino: "03/01/2016", tipo: "Doença período igual ou inferior a 15 dias", diasAfastados: "3" },
  { inicio: "21/09/2015", termino: "18/01/2016", tipo: "Licença maternidade", diasAfastados: "120" },
  { inicio: "04/01/2016", termino: "04/01/2016", tipo: "Doença período igual ou inferior a 15 dias", diasAfastados: "1" },
  { inicio: "10/03/2017", termino: "25/03/2017", tipo: "Licença paternidade", diasAfastados: "15" },
  { inicio: "05/06/2018", termino: "05/07/2018", tipo: "Férias", diasAfastados: "30" },
  { inicio: "15/09/2019", termino: "20/09/2019", tipo: "Doença período igual ou inferior a 15 dias", diasAfastados: "5" },
  { inicio: "01/02/2020", termino: "15/02/2020", tipo: "Acidente de trabalho", diasAfastados: "14" },
  { inicio: "10/07/2021", termino: "10/08/2021", tipo: "Licença não remunerada", diasAfastados: "31" },
  { inicio: "03/11/2021", termino: "03/11/2021", tipo: "Atestado médico", diasAfastados: "1" },
  { inicio: "20/01/2022", termino: "20/04/2022", tipo: "Licença maternidade", diasAfastados: "90" }, // Exemplo de licença mais curta
  { inicio: "05/05/2022", termino: "10/05/2022", tipo: "Doença período igual ou inferior a 15 dias", diasAfastados: "5" },
  { inicio: "01/08/2023", termino: "15/08/2023", tipo: "Férias", diasAfastados: "15" },
  { inicio: "10/10/2023", termino: "12/10/2023", tipo: "Atestado médico", diasAfastados: "3" },
];

// Dados mock para ContratosTable
const mockContratosRaw = [
  { id: "1", empresa: "Empresa Alpha", colaborador: "João Silva", dataAdmissao: "01/01/2020", dataRescisao: "31/12/2021", salarioBase: "R$ 3.500,00" },
  { id: "2", empresa: "Empresa Alpha", colaborador: "João Silva", dataAdmissao: "15/01/2022", salarioBase: "R$ 3.800,00" }, // Contrato vigente
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


export default function FichaPessoalPage() {
  const kpiCardData = [
    { title: "Data de Admissão", value: "01/01/2020", tooltipText: "Data de início do colaborador na empresa." },
    { title: "Salário Base", value: "R$ 5.000,00", tooltipText: "Salário bruto mensal do colaborador." },
    { title: "Cargo", value: "Desenvolvedor", tooltipText: "Cargo atual do colaborador." },
    { title: "Escolaridade", value: "Superior Completo", tooltipText: "Nível de escolaridade do colaborador." },
    { title: "Idade", value: "30 anos", tooltipText: "Idade atual do colaborador." },
  ];

  // Process chart data for Ficha Pessoal (memoized for performance)
  const processedEvolucaoChartDataFicha = useMemo(() => {
    return rawChartDataEntriesFicha.map(entry => {
      const [month, valueString] = entry.split(": ");
      return { month, value: parseCurrency(valueString) };
    });
  }, []);
  const evolucaoCardTitle = "Evolução de Custo Total";

  // Process data for tables to ensure consistent length
  const processedTableData = useMemo(() => {
    const targetLength = 14; // Set target length to 14 for all tables

    const padArray = <T,>(
      arr: T[],
      length: number, // Renamed parameter for clarity
      placeholderFactory: (index: number) => T
    ): T[] => {
      const currentLength = arr.length;
      if (currentLength >= length) {
        return arr.slice(0, length); // Slice if longer
      }
      // Pad if shorter
      const placeholders = Array.from({ length: length - currentLength }, (_, i) =>
        placeholderFactory(currentLength + i)
      );
      return [...arr, ...placeholders];
    };

    const atestadoPlaceholder = () => ({
      vencimento: "", dataExame: "", resultado: "", tipo: ""
    });
    const afastamentoPlaceholder = () => ({
      inicio: "", termino: "", tipo: "", diasAfastados: ""
    });
    const contratoPlaceholder = (index: number) => ({
      id: `placeholder-${index}`, empresa: "", colaborador: "", dataAdmissao: "", dataRescisao: "", salarioBase: ""
    });

    return {
      atestados: padArray(atestadosDataRaw, targetLength, atestadoPlaceholder),
      afastamentos: padArray(mockAfastamentosRaw, targetLength, afastamentoPlaceholder),
      contratos: padArray(mockContratosRaw, targetLength, contratoPlaceholder),
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#f7f7f8]">
      {/* Header Section - Fixed */}
      <div className="flex flex-row items-center justify-start gap-8 p-4 border-b border-black/10 bg-gray-100">
        <h1 className={`text-[32px] leading-8 font-700 text-black text-left ${cairo.className}`}>
          Dashboard de Ficha Pessoal
        </h1>
        <SecaoFiltros />
      </div>

      {/* Content Section - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        <KpiCardsGrid cardsData={kpiCardData} />

        <div className="mt-4 flex flex-row gap-4">
          <div className="w-1/2 max-w-[50%] min-w-0 overflow-hidden">
            <EvolucaoCard
              kpiSelecionado={evolucaoCardTitle}
              processedEvolucaoChartData={processedEvolucaoChartDataFicha}
              sectionIcons={sectionIconsFicha}
              cairoClassName={cairo.className}
            />
          </div>
          <div className="w-1/2 max-w-[50%] min-w-0 overflow-hidden">
            <ValorPorGrupoCard
              valorPorGrupoData={valorPorGrupoDataFicha}
              sectionIcons={sectionIconsFicha}
              cairoClassName={cairo.className}
            />
          </div>
        </div>

        {/* Seção para Afastamentos e Atestados - Now using the component */}
        {/* The h-[350px] on this grid sets the fixed height for the row */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[350px]"> 
          {/* Coluna 1: Histórico de Atestados */}
          <div className="lg:col-span-1 h-full overflow-hidden"> {/* Added overflow-hidden */}
            <AtestadosTable 
              atestadosData={processedTableData.atestados} 
              cairoClassName={cairo.className} 
              headerIcons={tableHeaderIcons} // Pass icons
            />
          </div>

          {/* Coluna 2: Histórico de Afastamentos */}
          <div className="lg:col-span-1 h-full overflow-hidden"> {/* Added overflow-hidden */}
            <AfastamentosTable 
              afastamentosData={processedTableData.afastamentos} 
              cairoClassName={cairo.className} 
              headerIcons={tableHeaderIcons} // Pass icons
            />
          </div>

          {/* Coluna 3: Histórico de Contratos */}
          <div className="lg:col-span-1 h-full overflow-hidden"> {/* Added overflow-hidden */}
            <ContratosTable
              contratosData={processedTableData.contratos}
              cairoClassName={cairo.className}
              headerIcons={tableHeaderIcons} // Pass icons
            />
          </div>
        </div>

        {/* O restante do conteúdo do seu dashboard virá aqui */}
        <p className="mt-4"></p>
      </div>
    </div>
  );
}
