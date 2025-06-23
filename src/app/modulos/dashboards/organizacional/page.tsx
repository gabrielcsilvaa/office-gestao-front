"use client"; 
import { Cairo } from "next/font/google";
import SelecaoIndicadores from "./components/SelecaoIndicadores";
import SecaoFiltros, { SecaoFiltrosRef } from "./components/SecaoFiltros";
import { useState, useMemo, useRef } from "react";
import Modal from "./components/Modal";
import EvolucaoChart from "./components/EvolucaoChart";
import ValorPorGrupoChart from "./components/ValorPorGrupoChart";
import EvolucaoCard from "./components/EvolucaoCard";
import ValorPorGrupoCard from "./components/ValorPorGrupoCard";
import DissidioCard from "./components/DissidioCard";
import ValorPorPessoaCard from "./components/ValorPorPessoaCard";
import ValorPorCalculoCard from "./components/ValorPorCalculoCard";
import KpiCardsGrid from "./components/KpiCardsGrid"; 
import { Header2 } from "../../../../components/header";
import Calendar from "@/components/calendar";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

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


const rawChartDataEntries = [
  "Jan/2024: R$ 5.462.280,00",
  "Fev/2024: R$ 5.463.540,00",
  "Mar/2024: R$ 5.599.900,00",
  "Abr/2024: R$ 5.600.930,00",
  "Mai/2024: R$ 5.811.220,00",
  "Jun/2024: R$ 6.204.950,00",
  "Jul/2024: R$ 6.443.690,00",
  "Ago/2024: R$ 6.564.000,00",
  "Set/2024: R$ 6.728.160,00",
  "Out/2024: R$ 6.551.310,00",
  "Nov/2024: R$ 8.289.970,00",
  "Dez/2024: R$ 33.388.510,00", 
];

const valorPorGrupoData = [
  { name: "Simples Doméstico", value: 25400 },
  { name: "Simples Doméstico 13º", value: 2000 },
  { name: "Outros Proventos", value: 300 },
  { name: "Fechamento", value: 300 }, 
  { name: "IRRF", value: -900 },
  { name: "Descontos", value: -21200 },
  { name: "Dependente IR 13º", value: -60700 },
  { name: "Dependente IR Férias", value: -77500 },
  { name: "Dependente IR Mensal", value: -533900 },
];

export default function DashboardOrganizacional() {
  const [kpiSelecionado, setKpiSelecionado] = useState<string>("Informativos");
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);

  // 📅 Estados de data
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // 🏢 Estados dos filtros para controlar exibição dos KPIs
  const [selectedEmpresa, setSelectedEmpresa] = useState<string[]>([]);
  const [selectedCentroCusto, setSelectedCentroCusto] = useState<string[]>([]);
  const [selectedDepartamento, setSelectedDepartamento] = useState<string[]>([]);
  const [selectedServico, setSelectedServico] = useState<string[]>([]);

  // � Ref para os filtros
  const secaoFiltrosRef = useRef<SecaoFiltrosRef>(null);

  // �📅 Handlers para mudanças de data
  const handleStartDateChange = (date: string | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: string | null) => {
    setEndDate(date);
  };  // 🔄 Handler para reset completo
  const handleResetAllFilters = () => {
    // Reseta o KPI selecionado para o padrão
    setKpiSelecionado("Informativos");
    // Reseta os filtros
    secaoFiltrosRef.current?.resetAllFilters();
    // Reseta os states dos filtros
    setSelectedEmpresa([]);
    setSelectedCentroCusto([]);
    setSelectedDepartamento([]);
    setSelectedServico([]);
    // Reseta as datas
    setStartDate(null);
    setEndDate(null);
  };

  const handleKpiChange = (kpi: string) => {
    setKpiSelecionado(kpi);
  };
  // 📊 Função para determinar se deve exibir os KPIs
  const shouldShowKPIs = () => {
    // KPIs só aparecem quando pelo menos a empresa estiver selecionada (e não for o placeholder)
    return selectedEmpresa.length > 0 && 
           !selectedEmpresa.includes("Empresa") && 
           selectedEmpresa.some(empresa => empresa !== "Todos" && empresa.length > 0);
  };

  const handleCloseModal = () => setModalContent(null);  const cardsData = [
    { title: "Proventos", value: "R$ 5.811.200,00", tooltipText: "Soma de todos os valores pagos aos funcionários." },
    { title: "Descontos", value: "-R$ 1.470.700,00", tooltipText: "Total de descontos realizados (INSS, IRRF, etc)." },
    { title: "Líquido", value: "R$ 4.340.600,00", tooltipText: "Valor final recebido pelos funcionários." },
    { title: "Custo Total Estimado", value: "R$ 6.452.500,00", tooltipText: "Custo completo incluindo encargos sociais." },
    { title: "Custo Médio Mensal", value: "R$ 2.300,00", tooltipText: "Custo médio por funcionário no mês." },
    { title: "Receita Média Mensal", value: "R$ 14.000,00", tooltipText: "Receita média gerada por funcionário." },
  ];

  const sectionIcons = [
    { src: "/assets/icons/icon-lay-down.svg", alt: "Lay Down", adjustSize: true }, 
    { src: "/assets/icons/icon-lay-up.svg", alt: "Lay Up", adjustSize: true },     
    { src: "/assets/icons/icon-hierarchy.svg", alt: "Hierarchy" },
    { src: "/assets/icons/icon-filter-layers.svg", alt: "Filter Layers" },
    { src: "/assets/icons/icon-maximize.svg", alt: "Maximize" },
    { src: "/assets/icons/icon-more-options.svg", alt: "More Options" },
  ];

  const processedEvolucaoChartData = useMemo(() => {
    return rawChartDataEntries.map(entry => {
      const [month, valueString] = entry.split(": ");
      return { month, value: parseCurrency(valueString) };
    });
  }, []);   return (
    <div className="bg-[#f7f7f8] fixed inset-0 flex flex-col overflow-hidden">
      <Header2 />
      <div className="flex flex-col items-start p-4 gap-4 border-b border-black/10 bg-gray-100">        {/* Primeira linha: Apenas KPIs (mais espaço para respirar) */}
        <SelecaoIndicadores 
          indicadorSelecionado={kpiSelecionado}
          onSelecaoIndicador={handleKpiChange}
          onResetFiltros={handleResetAllFilters}
        />        {/* Segunda linha: Filtros + Calendário */}
        <div className="flex flex-row items-center justify-between w-full">
          <SecaoFiltros 
            ref={secaoFiltrosRef}
            onEmpresaChange={setSelectedEmpresa}
            onCentroCustoChange={setSelectedCentroCusto}
            onDepartamentoChange={setSelectedDepartamento}
            onServicoChange={setSelectedServico}
          />
          <Calendar
            initialStartDate={startDate}
            initialEndDate={endDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
          />
        </div>
      </div>      <div className="flex-1 p-4 overflow-y-auto min-h-0">
        {/* KPIs: animação de slide down/up */}
        {/* This div with `transform` creates a stacking context. Its children (tooltips z-50) will be stacked relative to it. */}
        {/* This container itself needs to be effectively above the header's z-[40]. */}
        <div className="mt-6"> {/* Gap superior maior para evitar corte de tooltips */}
          <div className={`transition-all duration-200 ease-in-out transform origin-top
              ${shouldShowKPIs()
                ? 'max-h-[800px] opacity-100 translate-y-0'
                : 'max-h-0 opacity-0 -translate-y-4'}`}>
            <KpiCardsGrid cardsData={cardsData} />
          </div>
        </div>

        {/* 📊 GRÁFICOS TEMPORARIAMENTE COMENTADOS - Aguardando integração com API
        <div className="mt-6 flex flex-row gap-6">
          <EvolucaoCard
            kpiSelecionado={kpiSelecionado}
            processedEvolucaoChartData={processedEvolucaoChartData}
            sectionIcons={sectionIcons.filter(icon => icon.alt === "Maximize")}
            cairoClassName={cairo.className}
            onMaximize={() =>
              setModalContent(
                <div className="flex flex-col w-[90vw] h-[80vh]">
                  <h2 className={`text-2xl font-bold mb-2 ${cairo.className}`}>
                    Evolução de {kpiSelecionado}
                  </h2>
                  <p className={`text-base text-gray-500 mb-4 ${cairo.className}`}>
                    Variação mensal de {kpiSelecionado.toLowerCase()} no período selecionado.
                  </p>
                  <div className="flex-1">
                    <EvolucaoChart
                      data={processedEvolucaoChartData}
                      kpiName={kpiSelecionado}
                    />
                  </div>
                </div>
              )
            }
          />
          <ValorPorGrupoCard
            valorPorGrupoData={valorPorGrupoData}
            sectionIcons={sectionIcons.filter(icon => icon.alt === "Maximize")}
            cairoClassName={cairo.className}
            onMaximize={() =>
              setModalContent(
                <div className="flex flex-col w-[90vw] h-[80vh]">
                  <h2 className={`text-2xl font-bold mb-2 ${cairo.className}`}>
                    Valor Por Grupo e Evento
                  </h2>
                  <p className={`text-base text-gray-500 mb-4 ${cairo.className}`}>
                    Mostra a distribuição de valores por grupo e evento.
                  </p>
                  <div className="flex-1">
                    <ValorPorGrupoChart data={valorPorGrupoData} />
                  </div>
                </div>
              )
            }
          />
        </div>
        */}

        <div className="mt-6 flex flex-row gap-6">
          <DissidioCard
            sectionIcons={sectionIcons.filter(icon => icon.alt === "Maximize")}
            cairoClassName={cairo.className}
          />
          <ValorPorPessoaCard
            sectionIcons={sectionIcons.filter(icon => icon.alt === "Maximize")}
            cairoClassName={cairo.className}
          />
          <ValorPorCalculoCard
            sectionIcons={sectionIcons.filter(icon => icon.alt === "Maximize")}
            cairoClassName={cairo.className}
          />
        </div>
      </div>

      {modalContent && (
        <Modal isOpen onClose={handleCloseModal}>
          {modalContent}
        </Modal>
      )}
    </div>
  );
}