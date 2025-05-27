"use client";

import Card from "./Card"; // Import the Card component

interface KpiCardData {
  title: string;
  value: string;
  tooltipText?: string; // Ensure tooltipText is part of the interface
  // Add other properties if your cards need them (e.g., icon, onClick)
}

interface KpiCardsGridProps {
  cardsData: KpiCardData[];
}

export default function KpiCardsGrid({ cardsData }: KpiCardsGridProps) {
  if (!cardsData || cardsData.length === 0) {
    return <p>Nenhum dado de KPI para exibir.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-4">
      {cardsData.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          value={card.value}
          tooltipText={card.tooltipText}
          // Pass other props if Card component expects them, e.g., onClick
        />
      ))}
    </div>
  );
}
