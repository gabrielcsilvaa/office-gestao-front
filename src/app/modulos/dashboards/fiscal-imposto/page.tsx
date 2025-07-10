"use client";
import { Cairo } from "next/font/google";
import { useState, useEffect } from "react";
import { Dropdown } from "../fiscal/components/Dropdown";
import { Toast } from "../fiscal/components/Toast";
import { useDropdown } from "../fiscal/hooks/useDropdown";
import Calendar from "@/components/calendar";
import KpiCardsGrid from "../fiscal/components/KpiCardsGrid";
import EvolucaoCard from "../fiscal/components/EvolucaoCard";
import ProgressBarCard from "../fiscal/components/ProgressBarCard";
import Loading from "@/app/loading";
import Image from "next/image";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export default function DashboardFiscalImposto() {
  const { openDropdown, handleToggleDropdown } = useDropdown();

  // Estados do componente
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [areDatesSelected, setAreDatesSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [clienteFornecedorOptions, setClienteFornecedorOptions] = useState<string[]>([]);
  const [clienteFornecedorSelecionado, setClienteFornecedorSelecionado] = useState("");
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Dados dos KPIs de Imposto
  const getImpostoKpiData = () => {
    return [
      {
        title: "Saldo Anterior",
        value: "R$ 0,00",
        tooltipText: "Saldo de impostos do período anterior."
      },
      {
        title: "Movimento Credor",
        value: "R$ 0,00", 
        tooltipText: "Valores creditados no período analisado."
      },
      {
        title: "Saldo a Recuperar",
        value: "R$ 0,00",
        tooltipText: "Saldo disponível para recuperação tributária."
      },
      {
        title: "Percentual",
        value: "0,00%",
        tooltipText: "Percentual de imposto sobre o faturamento."
      },
      {
        title: "Imposto Devido",
        value: "R$ 0,00",
        tooltipText: "Valor total de impostos devidos no período."
      },
      {
        title: "Faturamento",
        value: "R$ 0,00",
        tooltipText: "Faturamento total no período analisado."
      },
      {
        title: "Carga Tributária Efetiva",
        value: "0,00%",
        tooltipText: "Percentual efetivo da carga tributária sobre o faturamento."
      }
    ];
  };

  // Atualizar disponibilidade de filtros e opções
  useEffect(() => {
    const ready = !!startDate && !!endDate;
    setAreDatesSelected(ready);
    if (ready) {
      // Carregar opções de clientes/fornecedores, por enquanto estático
      setClienteFornecedorOptions(["Todos", "Cliente A", "Fornecedor B", "Cliente C"]);
    }
  }, [startDate, endDate]);

  // Handler para aplicar filtros
  const handlePesquisar = async () => {
    setLoading(true);
    try {
      // TODO: implementar fetch de dados de imposto via API
      // const response = await fetch(`/api/fiscal-imposto?start=${startDate}&end=${endDate}&cliente=${clienteFornecedorSelecionado}`);
      // const json = await response.json();
      // setData(json);
      setData({}); // placeholder
    } catch (error) {
      setToast({ message: 'Erro ao carregar dados de imposto.', type: 'warning' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f7f8] flex flex-col flex-1 h-full min-h-0">
      {/* Header de Filtros - Fixo */}
      <div className="relative z-10 flex flex-col gap-4 p-4 border-b border-black/10 bg-gray-100">
        <div className="flex items-center justify-between gap-8">
          {/* Lado esquerdo - Título, Reset e Dropdown */}
          <div className="flex items-center gap-8">
            <h1 className={`text-[32px] leading-8 font-700 text-black ${cairo.className}`}>
              Dashboard Fiscal - Imposto Devido
            </h1>
            <Image
              src="/assets/icons/icon-reset-kpi.svg"
              alt="Reset KPI Icon"
              width={20}
              height={20}
              className="cursor-pointer hover:opacity-75 transition-opacity"
              title="Resetar todos os filtros"
            />
            <div className="w-[1px] h-[30px] bg-[#373A40]" />
            
            <Dropdown
              options={clienteFornecedorOptions}
              label="Cliente/Fornecedor"
              widthClass="w-72"
              selectedValue={clienteFornecedorSelecionado}
              onValueChange={setClienteFornecedorSelecionado}
              isOpen={openDropdown === 'clienteFornecedor'}
              onToggle={() => handleToggleDropdown('clienteFornecedor')}
              disabled={!areDatesSelected}
              areDatesSelected={areDatesSelected}
            />
          </div>
          
          {/* Lado direito - Calendário */}
          <div className="flex items-center gap-4">
            <Calendar
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              initialStartDate={startDate}
              initialEndDate={endDate}
            />
          </div>
        </div>
      </div>

      {/* Conteúdo Principal - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Cards KPI */}
        <KpiCardsGrid cardsData={getImpostoKpiData()} />
        
        {/* Card de Evolução - Largura Total */}
        <div className="mt-6">
          <EvolucaoCard 
            title="Evolução Mensal do Imposto Devido" 
            data={[
              { month: "Selecione um período", value: 0 }
            ]} 
          />
        </div>

        {/* Cards com Barras de Progresso - 2 por linha */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="w-full">
            <ProgressBarCard 
              title="Impostos Devidos" 
              items={[]}
              colorScheme="orange"
            />
          </div>
          <div className="w-full">
            <ProgressBarCard 
              title="Análise dos Impostos" 
              items={[]}
              colorScheme="purple"
            />
          </div>
        </div>
      </div>

      {/* Toast para notificações */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}