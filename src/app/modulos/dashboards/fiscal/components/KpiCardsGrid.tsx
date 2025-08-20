/**
 * COMPONENTE: GRID DE CARDS KPI
 * 
 * Este componente renderiza um grid responsivo de cards KPI,
 * adaptando automaticamente o número de colunas baseado na quantidade de cards.
 */

import React from 'react';
import Card from './Card';
import { CardDataItem } from '../types';

interface KpiCardsGridProps {
  cardsData: CardDataItem[];
  loading?: boolean;
  error?: string | null;
}

const KpiCardsGrid: React.FC<KpiCardsGridProps> = ({ cardsData, loading = false, error = null }) => {
  /**
   * Determina o número de colunas baseado na quantidade de cards
   * Garante responsividade em diferentes tamanhos de tela
   */
  const getGridCols = (count: number): string => {
    switch (count) {
      case 1: return "lg:grid-cols-1";
      case 2: return "lg:grid-cols-2";
      case 3: return "lg:grid-cols-3";
      case 4: return "lg:grid-cols-4";
      case 5: return "lg:grid-cols-5";
      case 6: return "lg:grid-cols-6";
      default: return "lg:grid-cols-6"; // fallback para 6 ou mais cards
    }
  };

  // Renderiza estado de erro
  if (error) {
    return (
      <div className="grid grid-cols-1 gap-6 mt-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-red-600 font-medium mb-2">Erro ao carregar KPIs</div>
          <div className="text-red-500 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  // Renderiza estado de loading
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-4 auto-rows-fr">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-gray-200 rounded-lg h-24 animate-pulse">
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Renderiza estado vazio
  if (!cardsData || cardsData.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6 mt-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-gray-600 font-medium mb-2">Nenhum dado disponível</div>
          <div className="text-gray-500 text-sm">
            Selecione um período e KPI para visualizar os dados
          </div>
        </div>
      </div>
    );
  }

  const gridColsClass = getGridCols(cardsData.length);

  // Renderiza os cards KPI
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${gridColsClass} gap-6 mt-4 auto-rows-fr`}>
      {cardsData.map((card, index) => (
        <Card 
          key={`${card.title}-${index}`}
          title={card.title} 
          value={card.value} 
          tooltipText={card.tooltipText} 
        />
      ))}
    </div>
  );
};

export default KpiCardsGrid;
