"use client";
import Card from "./Card";

interface KpiCardData {
  title: string;
  value: string;
  tooltipText?: string;
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
        />
      ))}
    </div>
  );
}
