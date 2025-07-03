"use client";
import { Cairo } from "next/font/google";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Dropdown } from "./components/Dropdown";
import { useDropdown } from "./hooks/useDropdown";
import Calendar from "@/components/calendar";
import KpiCardsGrid from "./components/KpiCardsGrid";
import EvolucaoCard from "./components/EvolucaoCard";
import ProgressBarCard from "./components/ProgressBarCard";
import EmptyCard from "./components/EmptyCard";
import Loading from "@/app/loading";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export default function DashboardFiscal() {
  const { openDropdown, handleToggleDropdown } = useDropdown();

  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [kpiSelecionado, setKpiSelecionado] = useState("Total de Entradas");
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (startDate && endDate) {
        setLoading(true);
        try {
          console.log("Buscando dados para o dashboard fiscal com as datas:", {
            startDate,
            endDate,
          });
          const response = await fetch("/api/dashboard-fiscal", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              start_date: startDate,
              end_date: endDate,
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(
              result.error || `Erro do backend: ${response.statusText}`
            );
          }

          console.log("Dados recebidos da API fiscal:", result);
          setData(result);
        } catch (error) {
          console.error(
            "Erro ao buscar dados para o dashboard fiscal:",
            error
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [startDate, endDate]);
  // 🔄 Loading state
  if (loading) {
    return <Loading />;
  }

  const handleStartDateChange = (date: string | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: string | null) => {
    setEndDate(date);
  };

  const handleKpiChange = (kpi: string) => {
    setKpiSelecionado(kpi);
  };

  const handleResetAllFilters = () => {
    setClienteSelecionado("");
    setProdutoSelecionado("");
    setStartDate(null);
    setEndDate(null);
    setKpiSelecionado("Total de Entradas");
  };

  const handleMaximizeEvolucao = () => {
    // Função para maximizar o card de evolução (a ser implementada)
    console.log("Maximizar card de evolução");
  };

  const clienteOptions = [
    "CLIENTES DIVERSOS (Varejo)",
    "FUNDO MUNICIPAL DE SAUDE DE FORTALEZA",
    "POLÍCIA MILITAR DO ESTADO DO CEARÁ",
    "TRANSLOG TRANSPORTES E LOGÍSTICA S.A.",
    "LOCADORA DE VEÍCULOS MOVILOC LTDA",
    "IPIRANGA PRODUTOS DE PETRÓLEO S.A.",
    "RAÍZEN COMBUSTÍVEIS S.A. (Shell)",
    "AMBEV S.A.",
    "THE COCA-COLA COMPANY",
    "LIMPA FÁCIL PRODUTOS DE LIMPEZA"
  ];

  const produtoOptions = [
    "GASOLINA COMUM",
    "GASOLINA ADITIVADA (Ex: DT CLEAN)",
    "ETANOL HIDRATADO COMUM",
    "DIESEL S10 COMUM",
    "DIESEL S10 ADITIVADO (Ex: RENDMAX)",
    "GNV (GÁS NATURAL VEICULAR)",
    "ÓLEO LUBRIFICANTE 15W40 SEMISSINTÉTICO",
    "LAVAGEM COMPLETA DE VEÍCULO",
    "ÁGUA MINERAL S/ GÁS 500ML",
    "PÃO DE QUEIJO (Unidade)"
  ];

  const cardsData = [
    { title: "Ticket Médio", value: "4.778,16", tooltipText: "Valor médio por transação no período analisado." },
    { title: "Faturamento", value: "R$ 619.995.200,00", tooltipText: "Total de receitas antes dos impostos e deduções." },
    { title: "Entradas", value: "R$ 495.542.800,00", tooltipText: "Total de entradas fiscais no período." },
    { title: "Carga Tributária", value: "7,31%", tooltipText: "Percentual de impostos sobre o faturamento total." },
    { title: "Imposto Devido", value: "R$ 45.330,00", tooltipText: "Valor total de impostos a pagar no período." },
    { title: "A Recuperar", value: "R$ 846.090,00", tooltipText: "Valor de créditos tributários a recuperar." }
  ];

  // Dados para o gráfico de evolução
  const evolucaoData = [
    { month: "Jan/2024", value: 30288035.12 },
    { month: "Fev/2024", value: 26307276.15 },
    { month: "Mar/2024", value: 32832801.44 },
    { month: "Abr/2024", value: 43884300.49 },
    { month: "Mai/2024", value: 39243554.24 },
    { month: "Jun/2024", value: 40105421.16 },
    { month: "Jul/2024", value: 43384822.79 },
    { month: "Ago/2024", value: 46108634.08 },
    { month: "Set/2024", value: 47415413.48 },
    { month: "Out/2024", value: 46454140.89 },
    { month: "Nov/2024", value: 45986012.62 },
    { month: "Dez/2024", value: 53602856.14 }
  ];

  // Dados para o primeiro card de barra de progresso - "TOP 100 Produtos / Serviços"
  // Total dos valores: R$ 166.752.838,30
  const topProdutosServicosData = [
    { name: "Produto não informado", value: "R$ 115.439.645,23", numericValue: 115439645.23, percentage: 69.2, rank: 1 },
    { name: "SERVIÇOS TOMADOS (2)", value: "R$ 11.213.561,10", numericValue: 11213561.10, percentage: 6.7, rank: 2 },
    { name: "VASILHAME VAZIO P13 (2)", value: "R$ 6.496.853,83", numericValue: 6496853.83, percentage: 3.9, rank: 3 },
    { name: "COTTON ALQUIMIA MENEGOTTI (80000000006084)", value: "R$ 4.694.056,41", numericValue: 4694056.41, percentage: 2.8, rank: 4 },
    { name: "COTTON ALQUIMIA MENEGOTTI (143580A)", value: "R$ 4.670.102,95", numericValue: 4670102.95, percentage: 2.8, rank: 5 },
    { name: "COTTON ALQUIMIA MENEGOTTI (143580A)", value: "R$ 4.663.614,92", numericValue: 4663614.92, percentage: 2.8, rank: 6 },
    { name: "GASOLINA C COMUM (101001)", value: "R$ 4.492.489,40", numericValue: 4492489.40, percentage: 2.7, rank: 7 },
    { name: "SERVIÇOS TOMADOS SEM CREDITO (9)", value: "R$ 4.450.120,01", numericValue: 4450120.01, percentage: 2.7, rank: 8 },
    { name: "GASOLINA C COMUM (101001)", value: "R$ 4.365.533,64", numericValue: 4365533.64, percentage: 2.6, rank: 9 },
    { name: "COTTON ALQUIMIA MENEGOTTI (143580A)", value: "R$ 4.236.279,81", numericValue: 4236279.81, percentage: 2.5, rank: 10 },
    { name: "GASOLINA C COMUM (101001)", value: "R$ 4.031.582,00", numericValue: 4031582.00, percentage: 2.4, rank: 11 }
  ];

  // Dados para o segundo card de barra de progresso - "TOP 100 Clientes / Fornecedores"
  // Total dos valores: R$ 145.126.267,43
  const topClientesFornecedoresData = [
    { name: "YAMAHA MOTOR DA AMAZONIA LTDA", value: "R$ 21.068.918,95", numericValue: 21068918.95, percentage: 14.5, rank: 1 },
    { name: "VIBRA ENERGIA S.A", value: "R$ 20.507.156,97", numericValue: 20507156.97, percentage: 14.1, rank: 2 },
    { name: "F DINARTE IND E COM DE CONFEC", value: "R$ 19.127.937,07", numericValue: 19127937.07, percentage: 13.2, rank: 3 },
    { name: "DINART IND E COM DE CONFECCOES LTDA", value: "R$ 14.073.792,88", numericValue: 14073792.88, percentage: 9.7, rank: 4 },
    { name: "TICKET SERVICOS SA", value: "R$ 13.703.588,36", numericValue: 13703588.36, percentage: 9.4, rank: 5 },
    { name: "MALHAS MENEGOTTI INDUSTRIA TEXTIL LTDA", value: "R$ 11.524.068,34", numericValue: 11524068.34, percentage: 7.9, rank: 6 },
    { name: "BIOSAUDE", value: "R$ 10.180.027,94", numericValue: 10180027.94, percentage: 7.0, rank: 7 },
    { name: "BAHIANA DISTRIBUIDORA DE GAS LTDA", value: "R$ 9.972.635,56", numericValue: 9972635.56, percentage: 6.9, rank: 8 },
    { name: "LYCEUM CONSULTORIA EDUCACIONAL", value: "R$ 9.033.402,58", numericValue: 9033402.58, percentage: 6.2, rank: 9 },
    { name: "F DINART IND. E COM. DE CONFECCOES LTDA", value: "R$ 8.266.838,94", numericValue: 8266838.94, percentage: 5.7, rank: 10 },
    { name: "HOSPITAL UNIMED SUL", value: "R$ 7.668.899,58", numericValue: 7668899.58, percentage: 5.3, rank: 11 }
  ];

  const handleMaximizeTopProdutos = () => {
    console.log("Maximizar card TOP 100 Produtos / Serviços");
  };

  const handleMaximizeTopClientesFornecedores = () => {
    console.log("Maximizar card TOP 100 Clientes / Fornecedores");
  };

  const handleMaximizeValorPorLocal = () => {
    console.log("Maximizar card Valor por Local");
  };

  return (
    <div className="bg-[#f7f7f8] flex flex-col flex-1 h-full min-h-0">
      {/* Header de Filtros - Fixo */}
      <div className="relative z-10 flex flex-col gap-4 p-4 border-b border-black/10 bg-gray-100">
        <div className="flex items-center gap-8">
          <h1 className={`text-[32px] leading-8 font-700 text-black ${cairo.className}`}>Dashboard Fiscal - Faturamento e Entradas</h1>
          <Image
            src="/assets/icons/icon-reset-kpi.svg"
            alt="Reset KPI Icon"
            width={20}
            height={20}
            className="cursor-pointer hover:opacity-75 transition-opacity"
            onClick={handleResetAllFilters}
            title="Resetar todos os filtros"
          />
          <div className="w-[1px] h-[30px] bg-[#373A40]" />
          
          {/* KPIs - 2 linhas de 3 colunas alinhados à direita */}
          <div className="flex flex-col gap-2 ml-auto">
            <div className="flex items-center gap-4">
              {["Total de Entradas", "Faturamento Total", "Vendas"].map((kpi) => (
                <button
                  key={kpi}
                  className={`w-[220px] px-4 h-[40px] flex items-center justify-center rounded-md border border-neutral-700 text-sm font-semibold leading-tight hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer transition-colors ${cairo.className} ${
                    kpiSelecionado === kpi
                      ? "bg-[var(--color-neutral-700)] text-white"
                      : "bg-white text-gray-500"
                  }`}
                  onClick={() => handleKpiChange(kpi)}
                >
                  {kpi}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              {["Compras", "Serviços", "Devoluções"].map((kpi) => (
                <button
                  key={kpi}
                  className={`w-[220px] px-4 h-[40px] flex items-center justify-center rounded-md border border-neutral-700 text-sm font-semibold leading-tight hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer transition-colors ${cairo.className} ${
                    kpiSelecionado === kpi
                      ? "bg-[var(--color-neutral-700)] text-white"
                      : "bg-white text-gray-500"
                  }`}
                  onClick={() => handleKpiChange(kpi)}
                >
                  {kpi}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Filtros principais e Calendário */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Dropdown
                options={clienteOptions}
                label="Cliente / Fornecedor"
                widthClass="w-72"
                selectedValue={clienteSelecionado}
                onValueChange={setClienteSelecionado}
                isOpen={openDropdown === 'cliente'}
                onToggle={() => handleToggleDropdown('cliente')}
            />
            <Dropdown
                options={produtoOptions}
                label="Produto"
                widthClass="w-72"
                selectedValue={produtoSelecionado}
                onValueChange={setProdutoSelecionado}
                isOpen={openDropdown === 'produto'}
                onToggle={() => handleToggleDropdown('produto')}
            />
          </div>
          <Calendar
            initialStartDate={startDate}
            initialEndDate={endDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
          />
        </div>
      </div>

      {/* Conteúdo Principal - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Cards KPI */}
        <KpiCardsGrid cardsData={cardsData} />
        
        {/* Card de Evolução - Largura Total */}
        <div className="mt-6">
          <EvolucaoCard 
            title="Evolução do Total de Entradas" 
            data={evolucaoData}
            onMaximize={handleMaximizeEvolucao}
          />
        </div>

        {/* Novos Cards com Barras de Progresso - 2 por linha */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ProgressBarCard 
            title="TOP 100 Produtos / Serviços" 
            items={topProdutosServicosData}
            colorScheme="green"
            onMaximize={handleMaximizeTopProdutos}
          />
          <ProgressBarCard 
            title="TOP 100 Clientes / Fornecedores" 
            items={topClientesFornecedoresData}
            colorScheme="blue"
            onMaximize={handleMaximizeTopClientesFornecedores}
          />
        </div>

        {/* Terceiro Card - Valor por Local (largura total) */}
        <div className="mt-6">
          <EmptyCard 
            title="Valor por Local" 
            onMaximize={handleMaximizeValorPorLocal}
          />
        </div>
        </div>
      </div>
  );
}