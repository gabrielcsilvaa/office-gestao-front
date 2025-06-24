"use client";
import { Cairo } from "next/font/google";
import { useState } from "react";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export default function DashboardFiscal() {
  // Estados para controle dos dropdowns
  const [acumuladorAberto, setAcumuladorAberto] = useState(false);
  const [clienteAberto, setClienteAberto] = useState(false);
  const [produtoAberto, setProdutoAberto] = useState(false);
  
  // Estados para valores selecionados
  const [acumuladorSelecionado, setAcumuladorSelecionado] = useState("Acumulador");
  const [clienteSelecionado, setClienteSelecionado] = useState("Cliente / Fornecedor");
  const [produtoSelecionado, setProdutoSelecionado] = useState("Produto");

  // Opções dos dropdowns
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

  return (    <div className={`min-h-screen bg-gray-50 ${cairo.className}`}>
      {/* Header de Filtros */}      <div className="relative z-10 flex flex-row items-center justify-start gap-8 p-4 border-b border-black/10 bg-gray-100">
        <h1 className={`text-[32px] leading-8 font-700 text-black ${cairo.className}`}>Dashboard Fiscal</h1>
          {/* Filtros principais */}        <div className="flex items-center gap-4">
          {/* Dropdown 1: Cliente / Fornecedor */}
          <div className="relative">
            <div 
              className="w-52 px-4 h-[44px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer"
              onClick={() => {
                setClienteAberto(!clienteAberto);
                setAcumuladorAberto(false);
                setProdutoAberto(false);
              }}
            >
              <span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">{clienteSelecionado}</span>
              <svg className="w-5 h-5 ml-2 fill-current" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
              </svg>
            </div>
            {clienteAberto && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {clienteOptions.map((option, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      setClienteSelecionado(option);
                      setClienteAberto(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown 2: Acumulador */}
          <div className="relative">
            <div 
              className="w-48 px-4 h-[44px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer"
              onClick={() => {
                setAcumuladorAberto(!acumuladorAberto);
                setClienteAberto(false);
                setProdutoAberto(false);
              }}
            >
              <span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">{acumuladorSelecionado}</span>
              <svg className="w-5 h-5 ml-2 fill-current" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
              </svg>
            </div>
            {acumuladorAberto && (
              <div className="absolute top-full left-0 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {acumuladorOptions.map((option, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      setAcumuladorSelecionado(option);
                      setAcumuladorAberto(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown 3: Produto */}
          <div className="relative">
            <div 
              className="w-44 px-4 h-[44px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer"
              onClick={() => {
                setProdutoAberto(!produtoAberto);
                setClienteAberto(false);
                setAcumuladorAberto(false);
              }}
            >
              <span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">{produtoSelecionado}</span>
              <svg className="w-5 h-5 ml-2 fill-current" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
              </svg>
            </div>
            {produtoAberto && (
              <div className="absolute top-full left-0 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {produtoOptions.map((option, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      setProdutoSelecionado(option);
                      setProdutoAberto(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Conteúdo será adicionado aqui */}
        <div className="text-center text-gray-500 mt-20">
          <p>Dashboard Fiscal em desenvolvimento...</p>
        </div>
      </div>
    </div>
  );
}