"use client";
import { Cairo } from "next/font/google";
import { useState, useRef, useEffect, useMemo } from "react";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

interface DropdownProps {
  options: string[];
  label: string;
  widthClass: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  disabled?: boolean;
  areDatesSelected?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  label,
  widthClass,
  selectedValue,
  onValueChange,
  isOpen,
  onToggle,
  disabled = false,
  areDatesSelected = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  ), [options, searchTerm]);

  const handleSelect = (value: string) => {
    // Se a opção clicada já está selecionada, desseleciona (limpa)
    if (selectedValue === value) {
      onValueChange("");
    } else {
      onValueChange(value);
    }
    onToggle(); // This will close the dropdown
  };

  const scrollToHighlightedItem = (index: number) => {
    if (listRef.current) {
      const listItems = listRef.current.querySelectorAll('[data-value]');
      const listItem = listItems[index] as HTMLElement;
      if (listItem) {
        listItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  };

  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = highlightedIndex < filteredOptions.length - 1 ? highlightedIndex + 1 : 0;
        setHighlightedIndex(nextIndex);
        scrollToHighlightedItem(nextIndex);
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = highlightedIndex > 0 ? highlightedIndex - 1 : filteredOptions.length - 1;
        setHighlightedIndex(prevIndex);
        scrollToHighlightedItem(prevIndex);
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
            if (listRef.current) {
                const listItems = listRef.current.querySelectorAll('[data-value]');
                const selectedElement = listItems[selectedIndex] as HTMLElement;
                if (selectedElement) {
                    selectedElement.scrollIntoView({ block: 'center', behavior: 'auto' });
                }
            }
          }
        }
      }, 50);
    } else {
      setSearchTerm("");
      setHighlightedIndex(-1);
    }
  }, [isOpen, selectedValue, searchTerm, filteredOptions]);

  useEffect(() => {
    setHighlightedIndex(-1);
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

          <div ref={listRef} className="max-h-48 overflow-y-auto">
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
                {filteredOptions.map((option, index) => (
                  <div
                    key={index}
                    data-value={option}
                    onClick={() => handleSelect(option)}
                    className={`px-4 py-3 text-sm hover:bg-blue-50 cursor-pointer transition-colors flex items-center justify-between group ${
                      selectedValue === option
                        ? 'bg-blue-50 text-blue-700'
                        : highlightedIndex === index
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
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
