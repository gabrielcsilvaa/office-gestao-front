/**
 * COMPONENTE: SELETOR DE KPI PARA VENDAS
 * 
 * Componente especializado para seleção de KPIs específicos de vendas
 * com interface visual melhorada e descrições explicativas
 */

"use client";
import React from 'react';
import { VendasKpiType } from '../types';
import { getVendasKpiConfig, getVendasKpiOptions } from '../utils/vendasKpiUtils';

interface VendasKpiSelectorProps {
  selectedKpi: VendasKpiType;
  onKpiChange: (kpi: VendasKpiType) => void;
  disabled?: boolean;
  compactMode?: boolean;
}

const VendasKpiSelector: React.FC<VendasKpiSelectorProps> = ({ 
  selectedKpi, 
  onKpiChange, 
  disabled = false,
  compactMode = false
}) => {
  
  const kpiOptions = getVendasKpiOptions();
  
  if (compactMode) {
    return (
      <div className="w-full">
        <select
          value={selectedKpi}
          onChange={(e) => onKpiChange(e.target.value as VendasKpiType)}
          disabled={disabled}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {kpiOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.icon} {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Selecionar KPI de Vendas
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiOptions.map((option) => {
          const isSelected = selectedKpi === option.value;
          const config = getVendasKpiConfig(option.value);
          
          return (
            <button
              key={option.value}
              onClick={() => !disabled && onKpiChange(option.value)}
              disabled={disabled}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200 text-left
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }
                ${disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer'
                }
              `}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg
                  ${config.color}
                `}>
                  {option.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`
                    font-medium text-sm
                    ${isSelected ? 'text-blue-700' : 'text-gray-700'}
                  `}>
                    {option.label}
                  </h4>
                  
                  <p className={`
                    text-xs mt-1
                    ${isSelected ? 'text-blue-600' : 'text-gray-500'}
                  `}>
                    {option.description}
                  </p>
                  
                  {isSelected && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Selecionado
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Informações adicionais sobre o KPI selecionado */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-lg">{getVendasKpiConfig(selectedKpi).icon}</span>
          <h4 className="font-medium text-gray-700">
            {getVendasKpiConfig(selectedKpi).label}
          </h4>
        </div>
        
        <p className="text-sm text-gray-600">
          {getVendasKpiConfig(selectedKpi).description}
        </p>
        
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Formatação: {getVendasKpiConfig(selectedKpi).formatacao}
          </span>
          
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Fonte: {getVendasKpiConfig(selectedKpi).fonte}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VendasKpiSelector;
