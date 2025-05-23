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
    { title: "Proventos", value: "R$ 5.811.200,00", tooltipText: "Total de proventos recebidos no período." },
    { title: "Descontos", value: "-R$ 1.470.700,00", tooltipText: "Total de descontos aplicados no período." },
    { title: "Líquido", value: "R$ 4.340.600,00", tooltipText: "Valor líquido após proventos e descontos." },
    { title: "Custo Total Estimado", value: "R$ 6.452.500,00", tooltipText: "Estimativa do custo total da folha." },
    { title: "Custo Médio Mensal", value: "R$ 2.300,00", tooltipText: "Custo médio mensal por colaborador." },
    { title: "Receita Média Mensal", value: "R$ 14.000,00", tooltipText: "Receita média mensal gerada." },
  ];

  return (
    <div className="bg-[#f7f7f8] min-h-screen">
      <div className="h-auto flex flex-col items-start p-4 gap-4 border-b border-black/10 bg-gray-100">
        <SelecaoIndicadores />
        <SecaoFiltros />
      </div>
      <div className="p-4">
        <div className="grid grid-cols-6 gap-4">
          {cardsData.map((card, index) => (
            <Card key={index} title={card.title} value={card.value} tooltipText={card.tooltipText} />
          ))}
        </div>

        {/* Nova seção com duas divs de meia largura, styled as squares */}
        <div className="mt-4 flex flex-row gap-4"> {/* Container para as duas divs de meia largura */}
          {/* Div da Esquerda (Metade da Largura - Square) */}
          <div className="w-1/2 bg-blue-200 p-4 rounded-md shadow-md h-96 flex flex-col"> {/* Added h-96 and bg-blue-200 */}
            <h3 className="text-lg font-semibold mb-2 text-blue-800">Seção Esquerda</h3>
            {/* Content for the left square can go here */}
          </div>

          {/* Div da Direita (Metade da Largura - Square) */}
          <div className="w-1/2 bg-green-200 p-4 rounded-md shadow-md h-96 flex flex-col"> {/* Added h-96 and bg-green-200 */}
            <h3 className="text-lg font-semibold mb-2 text-green-800">Seção Direita</h3>
            {/* Content for the right square can go here */}
          </div>
        </div>
      </div>
    </div>
  );
}