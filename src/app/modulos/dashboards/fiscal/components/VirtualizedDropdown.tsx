"use client";
import { Cairo } from "next/font/google";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

interface VirtualizedDropdownProps {
  options: string[];
  label: string;
  widthClass: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  disabled?: boolean;
  areDatesSelected?: boolean;
  // Configurações de virtualização
  itemHeight?: number; // Altura fixa de cada item
  maxVisibleItems?: number; // Máximo de itens visíveis antes de mostrar scroll
  overscan?: number; // Quantos itens extra renderizar fora da área visível
}

export const VirtualizedDropdown: React.FC<VirtualizedDropdownProps> = ({
  options,
  label,
  widthClass,
  selectedValue,
  onValueChange,
  isOpen,
  onToggle,
  disabled = false,
  areDatesSelected = true,
  itemHeight = 44, // altura em px de cada item
  maxVisibleItems = 6, // máximo de itens visíveis
  overscan = 3, // itens extras para renderizar
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [scrollTop, setScrollTop] = useState(0);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtrar opções baseado no termo de busca
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  // Cálculos de virtualização
  const containerHeight = Math.min(filteredOptions.length, maxVisibleItems) * itemHeight;
  const totalHeight = filteredOptions.length * itemHeight;
  
  // Calcular quais itens estão visíveis
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + maxVisibleItems + overscan,
      filteredOptions.length
    );
    const adjustedStartIndex = Math.max(0, startIndex - overscan);
    
    return {
      startIndex: adjustedStartIndex,
      endIndex,
      offsetY: adjustedStartIndex * itemHeight
    };
  }, [scrollTop, itemHeight, maxVisibleItems, overscan, filteredOptions.length]);

  // Itens visíveis para renderizar
  const visibleItems = useMemo(() => {
    return filteredOptions.slice(visibleRange.startIndex, visibleRange.endIndex);
  }, [filteredOptions, visibleRange.startIndex, visibleRange.endIndex]);

  const handleSelect = (value: string) => {
    // Se a opção clicada já está selecionada, desseleciona (limpa)
    if (selectedValue === value) {
      onValueChange("");
    } else {
      onValueChange(value);
    }
    onToggle(); // This will close the dropdown
  };

  const scrollToIndex = useCallback((index: number) => {
    if (listRef.current && index >= 0 && index < filteredOptions.length) {
      const targetScrollTop = index * itemHeight;
      const maxScrollTop = totalHeight - containerHeight;
      const clampedScrollTop = Math.max(0, Math.min(targetScrollTop, maxScrollTop));
      
      listRef.current.scrollTop = clampedScrollTop;
      setScrollTop(clampedScrollTop);
    }
  }, [itemHeight, filteredOptions.length, totalHeight, containerHeight]);

  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = highlightedIndex < filteredOptions.length - 1 ? highlightedIndex + 1 : 0;
        setHighlightedIndex(nextIndex);
        scrollToIndex(nextIndex);
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = highlightedIndex > 0 ? highlightedIndex - 1 : filteredOptions.length - 1;
        setHighlightedIndex(prevIndex);
        scrollToIndex(prevIndex);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onToggle();
        break;
    }
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollTop(scrollTop);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
        if (selectedValue && !searchTerm) {
          const selectedIndex = filteredOptions.findIndex(
            (option) => option === selectedValue
          );
          if (selectedIndex !== -1) {
            setHighlightedIndex(selectedIndex);
            scrollToIndex(selectedIndex);
          }
        }
      }, 50);
    } else {
      setSearchTerm("");
      setHighlightedIndex(-1);
      setScrollTop(0);
    }
  }, [isOpen, selectedValue, searchTerm, filteredOptions, scrollToIndex]);

  useEffect(() => {
    setHighlightedIndex(-1);
    setScrollTop(0);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) {
            onToggle();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        role="combobox"
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={isOpen}
        aria-label={label}
        className={`${widthClass} px-4 h-[44px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-sm font-semibold leading-tight ${cairo.className} ${
          disabled 
            ? 'text-gray-400 cursor-not-allowed opacity-50' 
            : 'text-gray-500 hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer'
        }`}
        onClick={disabled ? undefined : onToggle}
      >
        <span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
          {selectedValue || label}
        </span>
        <svg className="w-5 h-5 ml-2 fill-current" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
        </svg>
      </div>
      {isOpen && !disabled && (
        <div className={`absolute z-50 mt-1 ${widthClass} bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden`}>
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
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyNavigation}
                placeholder={`Buscar ${label.toLowerCase()}...`}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {!areDatesSelected ? (
            <div className="px-4 py-8 text-center">
              <svg className="mx-auto w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-500">Selecione as datas para</p>
              <p className="text-sm text-gray-500">carregar as opções</p>
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-4 py-8 text-center">
               <div className="relative mx-auto w-12 h-12 mb-3">
                  <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
               </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Nenhum resultado</p>
              <p className="text-xs text-gray-400">Tente buscar por outro termo</p>
            </div>
          ) : (
            <>
              {searchTerm && (
                <div className="px-3 py-2 bg-blue-50 border-b border-blue-100">
                  <p className="text-xs text-blue-600">
                    {filteredOptions.length} resultado{filteredOptions.length !== 1 ? 's' : ''} encontrado{filteredOptions.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
              
              {/* Container virtualizado */}
              <div 
                ref={listRef}
                style={{ height: `${containerHeight}px` }}
                className="overflow-y-auto"
                onScroll={handleScroll}
              >
                {/* Spacer superior */}
                <div style={{ height: `${visibleRange.offsetY}px` }} />
                
                {/* Itens visíveis */}
                {visibleItems.map((option, virtualIndex) => {
                  const actualIndex = visibleRange.startIndex + virtualIndex;
                  return (
                    <div
                      key={`${option}-${actualIndex}`}
                      data-value={option}
                      onClick={() => handleSelect(option)}
                      style={{ height: `${itemHeight}px` }}
                      className={`px-4 flex items-center justify-between text-sm hover:bg-blue-50 cursor-pointer transition-colors group ${
                        selectedValue === option
                          ? 'bg-blue-50 text-blue-700'
                          : highlightedIndex === actualIndex
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700 hover:text-blue-600'
                      }`}
                      title={selectedValue === option ? 'Clique para desselecionar' : 'Clique para selecionar'}
                    >
                      <span className="truncate">{option}</span>
                      {selectedValue === option && (
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs text-blue-600 opacity-70">Clique para desselecionar</span>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Spacer inferior */}
                <div style={{ height: `${totalHeight - visibleRange.offsetY - (visibleItems.length * itemHeight)}px` }} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
