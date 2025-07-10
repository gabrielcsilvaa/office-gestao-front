import React from 'react';
import Card from './Card';

interface CardDataItem {
  title: string;
  value: string;
  tooltipText: string;
}

interface KpiCardsGridProps {
  cardsData: CardDataItem[];
}

const KpiCardsGrid: React.FC<KpiCardsGridProps> = ({ cardsData }) => {
  // Determinar o número de colunas baseado na quantidade de cards
  const getGridCols = (count: number) => {
    switch (count) {
      case 1: return "lg:grid-cols-1";
      case 2: return "lg:grid-cols-2";
      case 3: return "lg:grid-cols-3";
      case 4: return "lg:grid-cols-4";
      case 5: return "lg:grid-cols-5";
      case 6: return "lg:grid-cols-6";
      case 7: return "lg:grid-cols-7";
      default: return "lg:grid-cols-6"; // fallback para 6 ou mais cards
    }
  };

  const gridColsClass = getGridCols(cardsData.length);

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 ${gridColsClass} gap-6 mt-4 auto-rows-fr`}>
      {cardsData.map((card, index) => (
        <Card key={index} title={card.title} value={card.value} tooltipText={card.tooltipText} />
      ))}
    </div>
  );
};

export default KpiCardsGrid;
