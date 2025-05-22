import { Cairo } from "next/font/google";
import SelecaoIndicadores from "./components/SelecaoIndicadores";
import SecaoFiltros from "./components/SecaoFiltros";
import Card from "./components/card";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export default function DashboardOrganizacional() {
  const cardsData = [
    { title: "Proventos", value: "R$ 5.811.200,00" },
    { title: "Descontos", value: "-R$ 1.470.700,00" },
    { title: "Líquido", value: "R$ 4.340.600,00" },
    { title: "Custo Total Estimado", value: "R$ 6.452.500,00" },
    { title: "Custo Médio Mensal", value: "R$ 2.300,00" },
    { title: "Receita Média Mensal", value: "R$ 14.000,00" },
  ];

  return (
    <div className="bg-[#f7f7f8] min-h-screen">
      <div className="h-auto flex flex-col items-start p-4 gap-4 border-b border-black/10 bg-gray-100">
        <SelecaoIndicadores />
        <SecaoFiltros />
      </div>
      <div className="p-4">
        <div className="grid grid-cols-6 gap-4">
          {" "}
          {/* Container for the cards */}
          {cardsData.map((card, index) => (
            <Card key={index} title={card.title} value={card.value} />
          ))}
        </div>
      </div>
    </div>
  );
}