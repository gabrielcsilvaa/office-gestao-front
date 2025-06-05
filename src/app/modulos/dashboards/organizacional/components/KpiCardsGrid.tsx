import React from 'react';
import Card from './card'; 

interface CardDataItem {
  title: string;
  value: string;
  tooltipText: string;
}

interface KpiCardsGridProps {
  cardsData: CardDataItem[];
}

const KpiCardsGrid: React.FC<KpiCardsGridProps> = ({ cardsData }) => {
  return (
    <div className="grid grid-cols-6 gap-4">
      {cardsData.map((card, index) => (
        <Card key={index} title={card.title} value={card.value} tooltipText={card.tooltipText} />
      ))}
    </div>
  );
};

export default KpiCardsGrid;
