"use client";
import { useState } from "react";
import { Cairo } from "next/font/google";
import { SmartDropdown } from "../components/SmartDropdown";
import { VirtualizedDropdown } from "../components/VirtualizedDropdown";
import { Dropdown } from "../components/Dropdown";
import { useDropdownTestData } from "../hooks/useDropdownTestData";
import { useDropdown } from "../hooks/useDropdown";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export default function DropdownDemo() {
  const { openDropdown, handleToggleDropdown } = useDropdown();
  const { largeClientList, largeFornecedorList, clientCount, fornecedorCount } = useDropdownTestData();
  
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedFornecedor, setSelectedFornecedor] = useState("");
  const [selectedSmallList, setSelectedSmallList] = useState("");

  // Lista pequena para comparação
  const smallList = [
    "Item 1",
    "Item 2", 
    "Item 3",
    "Item 4",
    "Item 5"
  ];

  return (
    <div className={`min-h-screen bg-gray-50 p-8 ${cairo.className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Demonstração de Dropdowns Virtualizados
          </h1>
          <p className="text-gray-600">
            Teste de performance com listas grandes de clientes e fornecedores
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{clientCount}</div>
            <div className="text-sm text-gray-600">Clientes carregados</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{fornecedorCount}</div>
            <div className="text-sm text-gray-600">Fornecedores carregados</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">50</div>
            <div className="text-sm text-gray-600">Limite para virtualização</div>
          </div>
        </div>

        {/* Testes de Dropdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* SmartDropdown - Automaticamente escolhe entre normal e virtualizado */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              SmartDropdown (Auto-detecção)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clientes ({clientCount} itens - Usa virtualização)
                </label>
                <SmartDropdown
                  options={largeClientList}
                  label="Selecione um cliente"
                  widthClass="w-full"
                  selectedValue={selectedClient}
                  onValueChange={setSelectedClient}
                  isOpen={openDropdown === 'smart-client'}
                  onToggle={() => handleToggleDropdown('smart-client')}
                  virtualizationThreshold={50}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lista pequena ({smallList.length} itens - Usa dropdown normal)
                </label>
                <SmartDropdown
                  options={smallList}
                  label="Selecione um item"
                  widthClass="w-full"
                  selectedValue={selectedSmallList}
                  onValueChange={setSelectedSmallList}
                  isOpen={openDropdown === 'smart-small'}
                  onToggle={() => handleToggleDropdown('smart-small')}
                  virtualizationThreshold={50}
                />
              </div>
            </div>
          </div>

          {/* Dropdown Virtualizado Forçado */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Dropdown Virtualizado (Forçado)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fornecedores ({fornecedorCount} itens)
                </label>
                <VirtualizedDropdown
                  options={largeFornecedorList}
                  label="Selecione um fornecedor"
                  widthClass="w-full"
                  selectedValue={selectedFornecedor}
                  onValueChange={setSelectedFornecedor}
                  isOpen={openDropdown === 'virtual-fornecedor'}
                  onToggle={() => handleToggleDropdown('virtual-fornecedor')}
                  itemHeight={44}
                  maxVisibleItems={8}
                  overscan={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Instruções de teste */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            Como testar a performance:
          </h3>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Abra os dropdowns de clientes/fornecedores e observe que a abertura é instantânea</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Digite no campo de busca - a busca funciona em toda a lista, mesmo com virtualização</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Use as setas do teclado para navegar - o scroll automático funciona corretamente</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Note o indicador no rodapé mostrando quantos itens estão sendo renderizados</span>
            </li>
          </ul>
        </div>

        {/* Valores selecionados */}
        {(selectedClient || selectedFornecedor || selectedSmallList) && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-3">
              Valores Selecionados:
            </h3>
            <div className="space-y-2 text-green-700">
              {selectedClient && (
                <div><strong>Cliente:</strong> {selectedClient}</div>
              )}
              {selectedFornecedor && (
                <div><strong>Fornecedor:</strong> {selectedFornecedor}</div>
              )}
              {selectedSmallList && (
                <div><strong>Lista pequena:</strong> {selectedSmallList}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
