"use client";
import { Cairo } from "next/font/google";
import { useState } from "react";
import { Dropdown } from "./components/Dropdown";
import { useDropdown } from "./hooks/useDropdown";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export default function DashboardFiscal() {
  const { openDropdown, handleToggleDropdown } = useDropdown();

  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [acumuladorSelecionado, setAcumuladorSelecionado] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState("");

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

  return (
    <div className="bg-[#f7f7f8] flex flex-col flex-1 h-full min-h-0">
      {/* Header de Filtros - Fixo */}
      <div className="relative z-10 flex flex-row items-center justify-start gap-8 p-4 border-b border-black/10 bg-gray-100">
        <h1 className={`text-[32px] leading-8 font-700 text-black ${cairo.className}`}>Dashboard Fiscal</h1>
        
        {/* Filtros principais */}
        <div className="flex items-center gap-4">
            <Dropdown
                options={clienteOptions}
                label="Cliente / Fornecedor"
                widthClass="w-60"
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
      </div>

      {/* Conteúdo Principal - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Aqui vai o conteúdo do dashboard, como gráficos e tabelas */}
        <p>Fasjsagjoasjgosajgosa</p>
        </div>
      </div>
  );
}