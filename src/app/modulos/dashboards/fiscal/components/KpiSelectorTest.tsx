/**
 * 🎯 Componente de Teste - Seletor de KPI
 * 
 * Este componente demonstra como integrar o sistema de análise geoestratégica
 * com a seleção dinâmica de KPIs. Use este componente para testar rapidamente
 * todas as funcionalidades implementadas.
 */

'use client';

import React, { useState } from 'react';
import { Cairo } from "next/font/google";
import EmptyCard from './EmptyCard';

const cairo = Cairo({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

// KPIs disponíveis para teste
const KPIS_DISPONIVEIS = [
  "Receita Bruta Total",
  "Vendas de Produtos", 
  "Serviços Prestados",
  "Compras e Aquisições",
  "Notas Canceladas"
] as const;

// Cores dos KPIs para visualização
const KPI_COLORS = {
  "Receita Bruta Total": "#0D6EFD",
  "Vendas de Produtos": "#0B5ED7", 
  "Serviços Prestados": "#198754",
  "Compras e Aquisições": "#FFC107",
  "Notas Canceladas": "#DC3545"
} as const;

interface KpiSelectorTestProps {
  data?: any;
}

const KpiSelectorTest: React.FC<KpiSelectorTestProps> = ({ data }) => {
  const [kpiAtivo, setKpiAtivo] = useState<string>("Receita Bruta Total");

  return (
    <div className="w-full space-y-6">
      {/* Painel de Controle de KPI */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${cairo.className}`}>
          🎯 Centro de Controle - Análise Geoestratégica
        </h3>
        
        <div className="space-y-4">
          {/* KPI Ativo */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${cairo.className}`}>
              KPI Ativo:
            </label>
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: KPI_COLORS[kpiAtivo as keyof typeof KPI_COLORS] }}
              ></div>
              <span className={`text-lg font-semibold ${cairo.className}`}>
                {kpiAtivo}
              </span>
            </div>
          </div>

          {/* Seletores de KPI */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-3 ${cairo.className}`}>
              Selecione o KPI para Análise:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {KPIS_DISPONIVEIS.map((kpi) => (
                <button
                  key={kpi}
                  onClick={() => setKpiAtivo(kpi)}
                  className={`
                    flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200
                    ${kpiAtivo === kpi 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: KPI_COLORS[kpi as keyof typeof KPI_COLORS] }}
                  ></div>
                  <span className={`text-sm font-medium text-gray-900 ${cairo.className}`}>
                    {kpi}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Instruções */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className={`text-sm font-semibold text-blue-900 mb-2 ${cairo.className}`}>
              💡 Como Funciona a Análise Geoestratégica:
            </h4>
            <ul className={`text-sm text-blue-800 space-y-1 ${cairo.className}`}>
              <li>• <strong>Receita Bruta Total:</strong> Soma saídas + serviços (não canceladas)</li>
              <li>• <strong>Vendas de Produtos:</strong> Apenas dados de saídas (não canceladas)</li>
              <li>• <strong>Serviços Prestados:</strong> Apenas dados de serviços (não cancelados)</li>
              <li>• <strong>Compras e Aquisições:</strong> Dados de entradas (todos)</li>
              <li>• <strong>Notas Canceladas:</strong> Saídas + serviços canceladas</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mapa Dinâmico */}
      <EmptyCard
        title="Análise Geoestratégica Interativa"
        data={data}
        kpiSelecionado={kpiAtivo}
        onMaximize={() => console.log('🔍 Maximizar mapa para:', kpiAtivo)}
      />

      {/* Painel de Estatísticas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${cairo.className}`}>
          📊 Estatísticas da Análise
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className={`text-sm text-gray-600 ${cairo.className}`}>KPI Ativo</div>
            <div className={`text-xl font-bold text-gray-900 ${cairo.className}`}>{kpiAtivo}</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className={`text-sm text-gray-600 ${cairo.className}`}>Cor do Tema</div>
            <div className="flex items-center space-x-2 mt-1">
              <div 
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: KPI_COLORS[kpiAtivo as keyof typeof KPI_COLORS] }}
              ></div>
              <span className={`text-sm font-mono text-gray-700 ${cairo.className}`}>
                {KPI_COLORS[kpiAtivo as keyof typeof KPI_COLORS]}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className={`text-sm text-gray-600 ${cairo.className}`}>Status</div>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`text-sm font-semibold text-green-700 ${cairo.className}`}>
                Sistema Ativo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpiSelectorTest;
