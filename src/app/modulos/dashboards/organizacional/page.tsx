import { Cairo } from "next/font/google";
import SelecaoIndicadores from "./components/SelecaoIndicadores";
import SecaoFiltros from "./components/SecaoFiltros";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export default function DashboardOrganizacional() {
  return (
    <div className="bg-[#f7f7f8] min-h-screen">
      <div className="h-auto flex flex-col items-start p-4 gap-4 border-b border-black/10 bg-gray-100">
        <SelecaoIndicadores />
        <SecaoFiltros />
      </div>
      <div className="p-4">
      </div>
    </div>
  );
}