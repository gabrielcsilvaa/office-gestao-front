"use client";
import { Cairo } from "next/font/google";
import { useState } from "react";
import Image from "next/image";
import { Dropdown } from "./components/Dropdown";
import { useDropdown } from "./hooks/useDropdown";
import Calendar from "@/components/calendar";
import KpiCardsGrid from "./components/KpiCardsGrid";
import EvolucaoCard from "./components/EvolucaoCard";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export default function DashboardFiscal() {
  const { openDropdown, handleToggleDropdown } = useDropdown();

  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [acumuladorSelecionado, setAcumuladorSelecionado] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [kpiSelecionado, setKpiSelecionado] = useState("Total de Entradas");

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
    setAcumuladorSelecionado("");
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

  const acumuladorOptions = [
    "Venda de Combustível (Subst. Tributária) (101)",
    "Venda Loja de Conveniência (748)",
    "Venda de Lubrificantes (105)",
    "Prestação de Serviço (Ex: Lava-Jato) (301)",
    "Devolução de Venda por Cliente (191)",
    "Transferência de Estoque entre Filiais (415)",
    "Compra de Mercadoria para Revenda (201)",
    "Compra para Uso e Consumo (225)",
    "Venda de Ativo Imobilizado (810)",
    "Bonificação, Doação ou Brinde (950)"
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
          
          {/* KPIs - 2 linhas de 4 colunas */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              {["Total de Entradas", "Aquisições de Serviço", "Compras", "Outras Entradas"].map((kpi) => (
                <button
                  key={kpi}
                  className={`w-[180px] px-4 h-[40px] flex items-center justify-center rounded-md border border-neutral-700 text-sm font-semibold leading-tight hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer transition-colors ${cairo.className} ${
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
              {["Faturamento Total", "Vendas", "Serviços", "Devoluções"].map((kpi) => (
                <button
                  key={kpi}
                  className={`w-[180px] px-4 h-[40px] flex items-center justify-center rounded-md border border-neutral-700 text-sm font-semibold leading-tight hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer transition-colors ${cairo.className} ${
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
                options={acumuladorOptions}
                label="Acumulador"
                widthClass="w-72"
                selectedValue={acumuladorSelecionado}
                onValueChange={setAcumuladorSelecionado}
                isOpen={openDropdown === 'acumulador'}
                onToggle={() => handleToggleDropdown('acumulador')}
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
        </div>
      </div>
  );
}