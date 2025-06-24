"use client";
import { Cairo } from "next/font/google";
import { useState, useRef, useEffect } from "react";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export default function DashboardFiscal() {
  // Estados para controle dos dropdowns
  const [clienteAberto, setClienteAberto] = useState(false);
  const [acumuladorAberto, setAcumuladorAberto] = useState(false);
  const [produtoAberto, setProdutoAberto] = useState(false);
  
  // Estados para valores selecionados
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [acumuladorSelecionado, setAcumuladorSelecionado] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState("");

  // Estados para busca
  const [clienteSearch, setClienteSearch] = useState("");
  const [acumuladorSearch, setAcumuladorSearch] = useState("");
  const [produtoSearch, setProdutoSearch] = useState("");
  // Estados para navegação por teclado
  const [clienteHighlightedIndex, setClienteHighlightedIndex] = useState(-1);
  const [acumuladorHighlightedIndex, setAcumuladorHighlightedIndex] = useState(-1);
  const [produtoHighlightedIndex, setProdutoHighlightedIndex] = useState(-1);

  // Estados para salvar posição do scroll
  const [clienteScrollPosition, setClienteScrollPosition] = useState(0);
  const [acumuladorScrollPosition, setAcumuladorScrollPosition] = useState(0);
  const [produtoScrollPosition, setProdutoScrollPosition] = useState(0);

  // Refs para controle de foco e scroll
  const clienteSearchInputRef = useRef<HTMLInputElement>(null);
  const acumuladorSearchInputRef = useRef<HTMLInputElement>(null);
  const produtoSearchInputRef = useRef<HTMLInputElement>(null);  const clienteListRef = useRef<HTMLDivElement>(null);
  const acumuladorListRef = useRef<HTMLDivElement>(null);
  const produtoListRef = useRef<HTMLDivElement>(null);
  
  // Refs para os containers dos dropdowns (para click outside)
  const clienteRef = useRef<HTMLDivElement>(null);
  const acumuladorRef = useRef<HTMLDivElement>(null);
  const produtoRef = useRef<HTMLDivElement>(null);
  // Opções dos dropdowns
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

  // Filtros para busca
  const filteredClientes = clienteOptions.filter(cliente =>
    cliente.toLowerCase().includes(clienteSearch.toLowerCase())
  );

  const filteredAcumuladores = acumuladorOptions.filter(acumulador =>
    acumulador.toLowerCase().includes(acumuladorSearch.toLowerCase())
  );

  const filteredProdutos = produtoOptions.filter(produto =>
    produto.toLowerCase().includes(produtoSearch.toLowerCase())
  );

  // Função para navegação por teclado
  const handleKeyNavigation = (
    e: React.KeyboardEvent,
    filteredItems: string[],
    currentHighlightedIndex: number,
    setHighlightedIndex: (index: number) => void,
    onSelect: (item: string) => void,
    onClose: () => void,
    listRef: React.RefObject<HTMLDivElement | null>
  ) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = currentHighlightedIndex < filteredItems.length - 1 
          ? currentHighlightedIndex + 1 
          : 0;
        setHighlightedIndex(nextIndex);
        scrollToHighlightedItem(nextIndex, listRef);
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = currentHighlightedIndex > 0 
          ? currentHighlightedIndex - 1 
          : filteredItems.length - 1;
        setHighlightedIndex(prevIndex);
        scrollToHighlightedItem(prevIndex, listRef);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (currentHighlightedIndex >= 0 && filteredItems[currentHighlightedIndex]) {
          onSelect(filteredItems[currentHighlightedIndex]);
          onClose();
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };
  const scrollToHighlightedItem = (index: number, listRef: React.RefObject<HTMLDivElement | null>) => {
    if (listRef.current) {
      const listItem = listRef.current.children[index] as HTMLElement;
      if (listItem) {
        listItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  };

  // Funções para fechar dropdowns salvando posição do scroll
  const handleCloseClienteDropdown = () => {
    if (clienteListRef.current) {
      setClienteScrollPosition(clienteListRef.current.scrollTop);
    }
    setClienteAberto(false);
    setClienteHighlightedIndex(-1);
    setClienteSearch("");
  };

  const handleCloseAcumuladorDropdown = () => {
    if (acumuladorListRef.current) {
      setAcumuladorScrollPosition(acumuladorListRef.current.scrollTop);
    }
    setAcumuladorAberto(false);
    setAcumuladorHighlightedIndex(-1);
    setAcumuladorSearch("");
  };

  const handleCloseProdutoDropdown = () => {
    if (produtoListRef.current) {
      setProdutoScrollPosition(produtoListRef.current.scrollTop);
    }
    setProdutoAberto(false);
    setProdutoHighlightedIndex(-1);
    setProdutoSearch("");
  };

  // Effect para focar no input de pesquisa quando abrir dropdowns
  useEffect(() => {
    if (clienteAberto) {
      setTimeout(() => clienteSearchInputRef.current?.focus(), 50);
    }
  }, [clienteAberto]);

  useEffect(() => {
    if (acumuladorAberto) {
      setTimeout(() => acumuladorSearchInputRef.current?.focus(), 50);
    }
  }, [acumuladorAberto]);

  useEffect(() => {
    if (produtoAberto) {
      setTimeout(() => produtoSearchInputRef.current?.focus(), 50);
    }
  }, [produtoAberto]);
  // Reset highlighted index quando filtros mudam
  useEffect(() => {
    setClienteHighlightedIndex(-1);
  }, [clienteSearch]);

  useEffect(() => {
    setAcumuladorHighlightedIndex(-1);
  }, [acumuladorSearch]);

  useEffect(() => {
    setProdutoHighlightedIndex(-1);
  }, [produtoSearch]);

  // Effects para restaurar posição do scroll quando abrir dropdowns
  useEffect(() => {
    if (clienteAberto && clienteListRef.current) {
      setTimeout(() => {
        if (clienteListRef.current) {
          // Se há um item selecionado, fazer scroll para ele
          if (clienteSelecionado) {
            const selectedElement = clienteListRef.current.querySelector(`[data-cliente="${clienteSelecionado}"]`);
            if (selectedElement) {
              // Posicionar o item selecionado próximo ao topo, deixando espaço para ver os itens abaixo
              selectedElement.scrollIntoView({ block: 'start', behavior: 'auto' });
              
              // Ajuste fino: scroll um pouco para cima para mostrar contexto
              const currentScroll = clienteListRef.current.scrollTop;
              const itemHeight = 52; // altura aproximada de cada item (py-3 = 12px top + 12px bottom + texto)
              clienteListRef.current.scrollTop = Math.max(0, currentScroll - itemHeight);
            }
          } else {
            // Caso contrário, restaurar posição salva
            clienteListRef.current.scrollTop = clienteScrollPosition;
          }
        }
      }, 50);
    }
  }, [clienteAberto, clienteSelecionado, clienteScrollPosition]);

  useEffect(() => {
    if (acumuladorAberto && acumuladorListRef.current) {
      setTimeout(() => {
        if (acumuladorListRef.current) {
          // Se há um item selecionado, fazer scroll para ele
          if (acumuladorSelecionado) {
            const selectedElement = acumuladorListRef.current.querySelector(`[data-acumulador="${acumuladorSelecionado}"]`);
            if (selectedElement) {
              // Posicionar o item selecionado próximo ao topo, deixando espaço para ver os itens abaixo
              selectedElement.scrollIntoView({ block: 'start', behavior: 'auto' });
              
              // Ajuste fino: scroll um pouco para cima para mostrar contexto
              const currentScroll = acumuladorListRef.current.scrollTop;
              const itemHeight = 52; // altura aproximada de cada item
              acumuladorListRef.current.scrollTop = Math.max(0, currentScroll - itemHeight);
            }
          } else {
            // Caso contrário, restaurar posição salva
            acumuladorListRef.current.scrollTop = acumuladorScrollPosition;
          }
        }
      }, 50);
    }
  }, [acumuladorAberto, acumuladorSelecionado, acumuladorScrollPosition]);

  useEffect(() => {
    if (produtoAberto && produtoListRef.current) {
      setTimeout(() => {
        if (produtoListRef.current) {
          // Se há um item selecionado, fazer scroll para ele
          if (produtoSelecionado) {
            const selectedElement = produtoListRef.current.querySelector(`[data-produto="${produtoSelecionado}"]`);
            if (selectedElement) {
              // Posicionar o item selecionado próximo ao topo, deixando espaço para ver os itens abaixo
              selectedElement.scrollIntoView({ block: 'start', behavior: 'auto' });
              
              // Ajuste fino: scroll um pouco para cima para mostrar contexto
              const currentScroll = produtoListRef.current.scrollTop;
              const itemHeight = 52; // altura aproximada de cada item
              produtoListRef.current.scrollTop = Math.max(0, currentScroll - itemHeight);
            }
          } else {
            // Caso contrário, restaurar posição salva
            produtoListRef.current.scrollTop = produtoScrollPosition;
          }
        }
      }, 50);
    }  }, [produtoAberto, produtoSelecionado, produtoScrollPosition]);

  // Click outside handler para fechar dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clienteRef.current && !clienteRef.current.contains(event.target as Node)) {
        handleCloseClienteDropdown();
      }
      if (acumuladorRef.current && !acumuladorRef.current.contains(event.target as Node)) {
        handleCloseAcumuladorDropdown();
      }
      if (produtoRef.current && !produtoRef.current.contains(event.target as Node)) {
        handleCloseProdutoDropdown();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="bg-[#f7f7f8] flex flex-col flex-1 h-full min-h-0">
      {/* Header de Filtros - Fixo */}
      <div className="relative z-10 flex flex-row items-center justify-start gap-8 p-4 border-b border-black/10 bg-gray-100">
        <h1 className={`text-[32px] leading-8 font-700 text-black ${cairo.className}`}>Dashboard Fiscal</h1>
        
        {/* Filtros principais */}
        <div className="flex items-center gap-4">{/* Dropdown 1: Cliente / Fornecedor */}
          <div className="relative" ref={clienteRef}>
            <div 
              role="combobox"
              aria-haspopup="listbox"
              tabIndex={0}
              aria-expanded={clienteAberto}
              aria-label="Cliente / Fornecedor"
              className={`w-60 px-4 h-[44px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`}              onClick={() => {
                setClienteAberto(!clienteAberto);
                if (acumuladorAberto) handleCloseAcumuladorDropdown();
                if (produtoAberto) handleCloseProdutoDropdown();
              }}
            >
              <span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
                {clienteSelecionado || "Cliente / Fornecedor"}
              </span>
              <svg className="w-5 h-5 ml-2 fill-current" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
              </svg>
            </div>
            {clienteAberto && (
              <div className="absolute z-50 mt-1 w-60 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
                {/* Campo de pesquisa */}
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <div className="relative">
                    <svg 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      ref={clienteSearchInputRef}
                      type="text"
                      value={clienteSearch}
                      onChange={e => setClienteSearch(e.target.value)}
                      onKeyDown={e => handleKeyNavigation(
                        e,
                        filteredClientes,
                        clienteHighlightedIndex,
                        setClienteHighlightedIndex,                        (cliente) => {
                          setClienteSelecionado(cliente);
                          setClienteSearch("");
                          handleCloseClienteDropdown();
                        },
                        () => handleCloseClienteDropdown(),
                        clienteListRef
                      )}
                      placeholder="Buscar cliente/fornecedor..."
                      className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    {clienteSearch && (
                      <button
                        onClick={() => setClienteSearch("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Lista de opções */}
                <div ref={clienteListRef} className="max-h-48 overflow-y-auto">
                  {filteredClientes.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <div className="relative mx-auto w-12 h-12 mb-3">
                        <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Nenhum cliente encontrado</p>
                      <p className="text-xs text-gray-400">Tente buscar por outro termo</p>
                    </div>
                  ) : (
                    <>
                      {clienteSearch && (
                        <div className="px-3 py-2 bg-blue-50 border-b border-blue-100">
                          <p className="text-xs text-blue-600">
                            {filteredClientes.length} resultado{filteredClientes.length !== 1 ? 's' : ''} encontrado{filteredClientes.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      )}                      {filteredClientes.map((cliente, index) => (
                        <div
                          key={index}
                          data-cliente={cliente}
                          onClick={() => {
                            setClienteSelecionado(cliente);
                            setClienteSearch("");
                            handleCloseClienteDropdown();
                          }}
                          className={`px-4 py-3 text-sm hover:bg-blue-50 cursor-pointer transition-colors flex items-center justify-between group ${
                            clienteSelecionado === cliente 
                              ? 'bg-blue-50 text-blue-700' 
                              : clienteHighlightedIndex === index
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700 hover:text-blue-600'
                          }`}
                        >
                          <span className="truncate">{cliente}</span>
                          {clienteSelecionado === cliente && (
                            <svg className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>          {/* Dropdown 2: Acumulador */}
          <div className="relative" ref={acumuladorRef}>
            <div 
              role="combobox"
              aria-haspopup="listbox"
              tabIndex={0}
              aria-expanded={acumuladorAberto}
              aria-label="Acumulador"
              className={`w-72 px-4 h-[44px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`}              onClick={() => {
                setAcumuladorAberto(!acumuladorAberto);
                if (clienteAberto) handleCloseClienteDropdown();
                if (produtoAberto) handleCloseProdutoDropdown();
              }}
            >
              <span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
                {acumuladorSelecionado || "Acumulador"}
              </span>
              <svg className="w-5 h-5 ml-2 fill-current" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
              </svg>
            </div>            {acumuladorAberto && (
              <div className="absolute z-50 mt-1 w-72 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <div className="relative">
                    <svg 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      ref={acumuladorSearchInputRef}
                      type="text"
                      value={acumuladorSearch}
                      onChange={e => setAcumuladorSearch(e.target.value)}
                      onKeyDown={e => handleKeyNavigation(
                        e,
                        filteredAcumuladores,
                        acumuladorHighlightedIndex,
                        setAcumuladorHighlightedIndex,                        (acumulador) => {
                          setAcumuladorSelecionado(acumulador);
                          setAcumuladorSearch("");
                          handleCloseAcumuladorDropdown();
                        },
                        () => handleCloseAcumuladorDropdown(),
                        acumuladorListRef
                      )}
                      placeholder="Buscar acumulador..."
                      className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    {acumuladorSearch && (
                      <button
                        onClick={() => setAcumuladorSearch("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                <div ref={acumuladorListRef} className="max-h-48 overflow-y-auto">
                  {filteredAcumuladores.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <div className="relative mx-auto w-12 h-12 mb-3">
                        <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Nenhum acumulador encontrado</p>
                      <p className="text-xs text-gray-400">Tente buscar por outro termo</p>
                    </div>
                  ) : (
                    <>
                      {acumuladorSearch && (
                        <div className="px-3 py-2 bg-blue-50 border-b border-blue-100">
                          <p className="text-xs text-blue-600">
                            {filteredAcumuladores.length} resultado{filteredAcumuladores.length !== 1 ? 's' : ''} encontrado{filteredAcumuladores.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      )}                      {filteredAcumuladores.map((acumulador, index) => (
                        <div
                          key={index}
                          data-acumulador={acumulador}
                          onClick={() => {
                            setAcumuladorSelecionado(acumulador);
                            setAcumuladorSearch("");
                            handleCloseAcumuladorDropdown();
                          }}
                          className={`px-4 py-3 text-sm hover:bg-blue-50 cursor-pointer transition-colors flex items-center justify-between group ${
                            acumuladorSelecionado === acumulador 
                              ? 'bg-blue-50 text-blue-700' 
                              : acumuladorHighlightedIndex === index
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700 hover:text-blue-600'
                          }`}
                        >
                          <span className="truncate">{acumulador}</span>
                          {acumuladorSelecionado === acumulador && (
                            <svg className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>          {/* Dropdown 3: Produto */}
          <div className="relative" ref={produtoRef}>
            <div 
              role="combobox"
              aria-haspopup="listbox"
              tabIndex={0}
              aria-expanded={produtoAberto}
              aria-label="Produto"
              className={`w-64 px-4 h-[44px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`}              onClick={() => {
                setProdutoAberto(!produtoAberto);
                if (clienteAberto) handleCloseClienteDropdown();
                if (acumuladorAberto) handleCloseAcumuladorDropdown();
              }}
            >
              <span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
                {produtoSelecionado || "Produto"}
              </span>
              <svg className="w-5 h-5 ml-2 fill-current" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
              </svg>
            </div>            {produtoAberto && (
              <div className="absolute z-50 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <div className="relative">
                    <svg 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      ref={produtoSearchInputRef}
                      type="text"
                      value={produtoSearch}
                      onChange={e => setProdutoSearch(e.target.value)}
                      onKeyDown={e => handleKeyNavigation(
                        e,
                        filteredProdutos,
                        produtoHighlightedIndex,
                        setProdutoHighlightedIndex,                        (produto) => {
                          setProdutoSelecionado(produto);
                          setProdutoSearch("");
                          handleCloseProdutoDropdown();
                        },
                        () => handleCloseProdutoDropdown(),
                        produtoListRef
                      )}
                      placeholder="Buscar produto..."
                      className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    {produtoSearch && (
                      <button
                        onClick={() => setProdutoSearch("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                <div ref={produtoListRef} className="max-h-48 overflow-y-auto">
                  {filteredProdutos.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <div className="relative mx-auto w-12 h-12 mb-3">
                        <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Nenhum produto encontrado</p>
                      <p className="text-xs text-gray-400">Tente buscar por outro termo</p>
                    </div>
                  ) : (
                    <>
                      {produtoSearch && (
                        <div className="px-3 py-2 bg-blue-50 border-b border-blue-100">
                          <p className="text-xs text-blue-600">
                            {filteredProdutos.length} resultado{filteredProdutos.length !== 1 ? 's' : ''} encontrado{filteredProdutos.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      )}                      {filteredProdutos.map((produto, index) => (
                        <div
                          key={index}
                          data-produto={produto}
                          onClick={() => {
                            setProdutoSelecionado(produto);
                            setProdutoSearch("");
                            handleCloseProdutoDropdown();
                          }}
                          className={`px-4 py-3 text-sm hover:bg-blue-50 cursor-pointer transition-colors flex items-center justify-between group ${
                            produtoSelecionado === produto 
                              ? 'bg-blue-50 text-blue-700' 
                              : produtoHighlightedIndex === index
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700 hover:text-blue-600'
                          }`}
                        >
                          <span className="truncate">{produto}</span>
                          {produtoSelecionado === produto && (
                            <svg className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>        </div>
      </div>      {/* Conteúdo rolável */}
      <div className="flex-1 p-4 overflow-y-auto min-h-0">
        {/* Conteúdo será adicionado aqui */}
        <div className="text-center text-gray-500 mt-20">
          <p>Dashboard Fiscal em desenvolvimento...</p>
        </div>
      </div>
    </div>
  );
}