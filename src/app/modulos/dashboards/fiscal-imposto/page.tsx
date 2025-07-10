"use client";
import { Cairo } from "next/font/google";
import { useState, useEffect } from "react";
import { Dropdown } from "../fiscal/components/Dropdown";
import { Toast } from "../fiscal/components/Toast";
import { useDropdown } from "../fiscal/hooks/useDropdown";
import Calendar from "@/components/calendar";
import KpiCardsGrid from "../fiscal/components/KpiCardsGrid";
import EvolucaoImpostoCard from "./components/EvolucaoImpostoCard";
import ImpostosDevidosCard from "./components/ImpostosDevidosCard";
import AnaliseImpostosCard from "./components/AnaliseImpostosCard";
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

  // Dados do gráfico de evolução
  const getEvolucaoImpostoData = () => {
    if (!areDatesSelected) {
      return [];
    }
    
    return [
      { month: "Jan/2024", impostoDevido: 15000, saldoRecuperar: 8000 },
      { month: "Fev/2024", impostoDevido: 18000, saldoRecuperar: 12000 },
      { month: "Mar/2024", impostoDevido: 22000, saldoRecuperar: 15000 },
      { month: "Abr/2024", impostoDevido: 25000, saldoRecuperar: 18000 },
      { month: "Mai/2024", impostoDevido: 19000, saldoRecuperar: 13000 },
      { month: "Jun/2024", impostoDevido: 23000, saldoRecuperar: 16000 }
    ];
  };

  // Dados das empresas com impostos devidos
  const getImpostosDevidosData = () => {
    if (!areDatesSelected) {
      return [];
    }
    
    return [
      { empresa: "SIMPLES NACIONAL", valor: "R$ 9.300.000,00", numericValue: 9300000, percentage: 100 },
      { empresa: "COFINS", valor: "R$ 8.400.000,00", numericValue: 8400000, percentage: 90.3 },
      { empresa: "IRPJ-LP", valor: "R$ 6.800.000,00", numericValue: 6800000, percentage: 73.1 },
      { empresa: "ISS", valor: "R$ 4.500.000,00", numericValue: 4500000, percentage: 48.4 },
      { empresa: "CONTRIBUIÇÃO SOCIAL", valor: "R$ 4.100.000,00", numericValue: 4100000, percentage: 44.1 },
      { empresa: "COFINS(NÃO CUMULATIVA)", valor: "R$ 3.000.000,00", numericValue: 3000000, percentage: 32.3 },
      { empresa: "ICMS", valor: "R$ 2.200.000,00", numericValue: 2200000, percentage: 23.7 },
      { empresa: "PIS", valor: "R$ 1.800.000,00", numericValue: 1800000, percentage: 19.4 },
      { empresa: "ICMS ST ANTECIPAÇÃO TOTAL", valor: "R$ 1.700.000,00", numericValue: 1700000, percentage: 18.3 },
      { empresa: "CONTRIBUIÇÃO PREVIDENCIÁRIA SOBRE A RECEITA BRUTA", valor: "R$ 1.000.000,00", numericValue: 1000000, percentage: 10.8 }
    ];
  };

  // Dados da análise de impostos
  const getAnaliseImpostosData = () => {
    if (!areDatesSelected) {
      return [];
    }
    
    return [
      {
        imposto: "COFINS",
        impostoDevido: "R$ 8.390.386,75",
        periodicidade: "Mensal",
        saldoAnteriorRecuperar: "R$ 0,00",
        movimentoCredor: "R$ 0,00",
        saldoRecuperar: "R$ 0,00",
        percentual: "0,00%",
        cargaTributariaEfetiva: "1,35%"
      },
      {
        imposto: "COFINS Entidades Financeiras e Equiparadas",
        impostoDevido: "R$ 96.150,52",
        periodicidade: "Mensal",
        saldoAnteriorRecuperar: "R$ 0,00",
        movimentoCredor: "R$ 0,00",
        saldoRecuperar: "R$ 0,00",
        percentual: "0,00%",
        cargaTributariaEfetiva: "1,35%"
      },
      {
        imposto: "PIS/PASEP",
        impostoDevido: "R$ 1.850.200,45",
        periodicidade: "Mensal",
        saldoAnteriorRecuperar: "R$ 15.500,00",
        movimentoCredor: "R$ 8.200,00",
        saldoRecuperar: "R$ 23.700,00",
        percentual: "1,65%",
        cargaTributariaEfetiva: "1,42%"
      },
      {
        imposto: "ICMS - Imposto sobre Circulação de Mercadorias",
        impostoDevido: "R$ 2.200.850,30",
        periodicidade: "Mensal",
        saldoAnteriorRecuperar: "R$ 125.000,00",
        movimentoCredor: "R$ 78.500,00",
        saldoRecuperar: "R$ 203.500,00",
        percentual: "18,00%",
        cargaTributariaEfetiva: "16,80%"
      },
      {
        imposto: "ISS - Imposto Sobre Serviços",
        impostoDevido: "R$ 4.500.720,80",
        periodicidade: "Mensal",
        saldoAnteriorRecuperar: "R$ 0,00",
        movimentoCredor: "R$ 0,00",
        saldoRecuperar: "R$ 0,00",
        percentual: "5,00%",
        cargaTributariaEfetiva: "4,85%"
      },
      {
        imposto: "IRPJ - Imposto de Renda Pessoa Jurídica",
        impostoDevido: "R$ 6.800.960,15",
        periodicidade: "Trimestral",
        saldoAnteriorRecuperar: "R$ 45.000,00",
        movimentoCredor: "R$ 22.000,00",
        saldoRecuperar: "R$ 67.000,00",
        percentual: "15,00%",
        cargaTributariaEfetiva: "14,20%"
      },
      {
        imposto: "CSLL - Contribuição Social sobre Lucro Líquido",
        impostoDevido: "R$ 4.100.575,60",
        periodicidade: "Trimestral",
        saldoAnteriorRecuperar: "R$ 18.500,00",
        movimentoCredor: "R$ 11.200,00",
        saldoRecuperar: "R$ 29.700,00",
        percentual: "9,00%",
        cargaTributariaEfetiva: "8,75%"
      },
      {
        imposto: "IPI - Imposto sobre Produtos Industrializados",
        impostoDevido: "R$ 890.340,25",
        periodicidade: "Mensal",
        saldoAnteriorRecuperar: "R$ 35.800,00",
        movimentoCredor: "R$ 28.400,00",
        saldoRecuperar: "R$ 64.200,00",
        percentual: "10,00%",
        cargaTributariaEfetiva: "9,20%"
      },
      {
        imposto: "IOF - Imposto sobre Operações Financeiras",
        impostoDevido: "R$ 125.480,90",
        periodicidade: "Diário",
        saldoAnteriorRecuperar: "R$ 0,00",
        movimentoCredor: "R$ 0,00",
        saldoRecuperar: "R$ 0,00",
        percentual: "0,38%",
        cargaTributariaEfetiva: "0,32%"
      },
      {
        imposto: "INSS Patronal",
        impostoDevido: "R$ 1.000.760,85",
        periodicidade: "Mensal",
        saldoAnteriorRecuperar: "R$ 12.300,00",
        movimentoCredor: "R$ 9.800,00",
        saldoRecuperar: "R$ 22.100,00",
        percentual: "20,00%",
        cargaTributariaEfetiva: "19,50%"
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
          <EvolucaoImpostoCard 
            title="Evolução Mensal do Imposto Devido" 
            data={getEvolucaoImpostoData()}
          />
        </div>

        {/* Cards com Barras de Progresso e Análise - 2 por linha */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="w-full">
            <ImpostosDevidosCard 
              title="Impostos Devidos" 
              items={getImpostosDevidosData()}
            />
          </div>
          <div className="w-full">
            <AnaliseImpostosCard 
              title="Análise de Impostos" 
              items={getAnaliseImpostosData()}
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