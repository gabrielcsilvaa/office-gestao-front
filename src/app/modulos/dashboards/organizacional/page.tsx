import { Cairo } from "next/font/google";
import Image from "next/image";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export default function DashboardOrganizacional() {
  return (
    <div className="bg-[#f7f7f8] min-h-screen">
      <div className="h-auto flex flex-col items-start p-4 gap-4 border-b border-black/10 bg-gray-100"> {/* Modified for vertical stacking and left alignment */}
        {/* Left Group: Title, Reset Icon, Bar, KPI Buttons */}
        <div className="flex items-center gap-8">
          <h1 className="text-[32px] leading-8 __className_50a8b1 font-700 text-black text-left">
            Dashboard Organizacional
          </h1>
          <Image
              src="/assets/icons/icon-reset-kpi.svg"
              alt="Reset KPI Icon"
              width={20}
              height={20}
              className="cursor-pointer"
          />
          <div className="w-[1px] h-[30px] bg-[#373A40]" />
          <div className="flex items-center gap-4">
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

        {/* Right Group: Filter Icon, Bar, Select Buttons */}
        <div className="flex flex-row items-center gap-8"> {/* Container for filter elements */}
          <Image
            src="/assets/icons/icon-filter.svg"
            alt="Filter Icon"
            width={20}
            height={20}
            className="cursor-pointer"
          />
          <div className="w-[1px] h-[30px] bg-[#373A40]" /> {/* Vertical separator */}
          <div className="flex items-center gap-4"> {/* Group for select buttons */}
            {/* Centro de Custo Dropdown */}
            <div
              role="combobox"
              aria-haspopup="listbox"
              tabIndex={0}
              aria-expanded={false}
              aria-label="Centro de Custo"
              className={`w-60 px-4 h-[36px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`}
            >
              <span className="flex-grow">Centro de Custo</span>
              <svg className="w-5 h-5 ml-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Departamento Dropdown */}
            <div
              role="combobox"
              aria-haspopup="listbox"
              tabIndex={0}
              aria-expanded={false}
              aria-label="Departamento"
              className={`w-60 px-4 h-[36px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`}
            >
              <span className="flex-grow">Departamento</span>
              <svg className="w-5 h-5 ml-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Colaborador/Diretor/Autônomo Dropdown */}
            <div
              role="combobox"
              aria-haspopup="listbox"
              tabIndex={0}
              aria-expanded={false}
              aria-label="Colaborador/Diretor/Autônomo"
              className={`w-69 px-4 h-[36px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`}
            >
              <span className="flex-grow whitespace-nowrap">Colaborador/Diretor/Autônomo</span>
              <svg className="w-5 h-5 ml-2 flex-shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Serviço Dropdown */}
            <div
              role="combobox"
              aria-haspopup="listbox"
              tabIndex={0}
              aria-expanded={false}
              aria-label="Serviço"
              className={`w-52 px-4 h-[36px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`}
            >
              <span className="flex-grow">Serviço</span>
              <svg className="w-5 h-5 ml-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {/* Placeholder for the rest of the dashboard content */}
      <div className="p-4">
        {/* Filter section has been moved to the header */}
      </div>
    </div>
  );
}