/**
 * COMPONENTE: SELETOR DE KPI
 * 
 * Este componente fornece uma interface visual para seleção de KPIs
 * com descrições explicativas e feedback visual para o usuário.
 */

"use client";
import React from 'react';
import { KpiType } from '../types';
import { getKpiConfig } from '../utils/kpiUtils';

interface KpiSelectorProps {
  selectedKpi: KpiType;
  onKpiChange: (kpi: KpiType) => void;
  disabled?: boolean;
}

const KpiSelector: React.FC<KpiSelectorProps> = ({ 
  selectedKpi, 
  onKpiChange, 
  disabled = false 
}) => {
  
  /**
   * Lista de todos os KPIs disponíveis com suas descrições
   */
  const kpiOptions = [
    {
      value: KpiType.RECEITA_BRUTA_TOTAL,
      label: "Receita Bruta Total",
      description: "Soma de todas as receitas (produtos + serviços)",
      icon: "💰",
      color: "bg-blue-100 border-blue-300 text-blue-800"
    },
    {
      value: KpiType.VENDAS_PRODUTOS,
      label: "Vendas de Produtos", 
      description: "Receitas provenientes da venda de produtos físicos",
      icon: "📦",
      color: "bg-green-100 border-green-300 text-green-800"
    },
    {
      value: KpiType.SERVICOS_PRESTADOS,
      label: "Serviços Prestados",
      description: "Receitas provenientes da prestação de serviços",
      icon: "🔧",
      color: "bg-purple-100 border-purple-300 text-purple-800"
    },
    {
      value: KpiType.COMPRAS_AQUISICOES,
      label: "Compras e Aquisições",
      description: "Gastos com fornecedores e aquisições",
      icon: "🛒",
      color: "bg-orange-100 border-orange-300 text-orange-800"
    },
    {
      value: KpiType.CANCELAMENTOS_RECEITA,
      label: "Cancelamentos de Receita",
      description: "Receitas canceladas ou devolvidas",
      icon: "❌",
      color: "bg-red-100 border-red-300 text-red-800"
    }
  ];

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Indicador Fiscal (KPI)
      </label>
      
      <div className="space-y-2">
        {kpiOptions.map((option) => {
          const isSelected = selectedKpi === option.value;
          const config = getKpiConfig(option.value);
          
          return (
            <div
              key={option.value}
              className={`
                relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
                ${isSelected 
                  ? `${option.color} ring-2 ring-offset-2 ring-blue-500` 
                  : 'bg-white border-gray-200 hover:border-gray-300'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => !disabled && onKpiChange(option.value)}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{option.icon}</div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`
                      font-medium text-sm
                      ${isSelected ? 'text-gray-900' : 'text-gray-900'}
                    `}>
                      {option.label}
                    </h3>
                    
                    {isSelected && (
                      <div className="text-blue-600">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <p className={`
                    text-xs mt-1
                    ${isSelected ? 'text-gray-700' : 'text-gray-500'}
                  `}>
                    {option.description}
                  </p>
                  
                  {isSelected && (
                    <div className="mt-2 text-xs text-gray-600 bg-white bg-opacity-50 rounded px-2 py-1">
                      <span className="font-medium">Foco:</span> {config.clienteFornecedorLabelPlural}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Informação adicional */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="text-blue-500 mt-0.5">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-600">
              <span className="font-medium">Dica:</span> Cada KPI mostra diferentes aspectos do fluxo financeiro. 
              Receitas representam dinheiro <span className="text-green-600 font-medium">entrando</span>, 
              compras representam dinheiro <span className="text-red-600 font-medium">saindo</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpiSelector;
