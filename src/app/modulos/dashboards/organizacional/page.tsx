import { Cairo } from "next/font/google";
import Image from "next/image";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export default function DashboardOrganizacional() {
  return (
    <div className="bg-[#f7f7f8] min-h-screen">
      <div className="h-[70px] flex flex-row items-center p-4 gap-8 border-b border-black/10 bg-gray-100">
        <h1 className="text-[32px] leading-8 __className_50a8b1 font-700 text-black text-left">
          Dashboard Organizacional
        </h1>
        <Image
            src="/assets/icons/icon-reset-kpi.svg"
            alt="Reset KPI Icon"
            width={20}
            height={20}
            className="cursor-pointer" // Added cursor-pointer
        />
        <div className="w-[1px] h-[30px] bg-[#373A40]" />
        <div className="flex items-center gap-4"> {/* New div to group buttons with gap-4 */}
          <button
            className={`w-auto px-6 h-[36px] flex items-center justify-center bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`} 
          >
            Informativos
          </button>
          <button
            className={`w-auto px-6 h-[36px] flex items-center justify-center bg-neutral-700 rounded-md border border-neutral-700 text-white text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`} 
          >
            Proventos
          </button>
          <button
            className={`w-auto px-6 h-[36px] flex items-center justify-center bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`} 
          >
            Descontos
          </button>
          <button
            className={`w-auto px-6 h-[36px] flex items-center justify-center bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`} 
          >
            Líquidos
          </button>
          <button
            className={`w-auto px-6 h-[36px] flex items-center justify-center bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`} 
          >
            Custo Total
          </button>
        </div>
      </div>
      {/* Placeholder for the rest of the dashboard content */}
      <div className="p-4">
      </div>
    </div>
  );
}