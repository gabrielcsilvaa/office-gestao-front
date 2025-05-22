import { Cairo } from "next/font/google";
import Image from "next/image";

const cairo = Cairo({
	weight: ["500", "600", "700"],
	subsets: ["latin"],
});

export default function SecaoFiltros() {
	return (
		<div className="flex flex-row items-center gap-8">
			<Image
				src="/assets/icons/icon-filter.svg"
				alt="Filter Icon"
				width={20}
				height={20}
				className="cursor-pointer"
			/>
			<div className="w-[1px] h-[30px] bg-[#373A40]" />
			<div className="flex items-center gap-4">
				{/* Centro de Custo Dropdown */}
				<div
					role="combobox"
					aria-haspopup="listbox"
					tabIndex={0}
					aria-expanded={false}
					aria-label="Centro de Custo"
					className={`w-60 px-4 h-[36px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`}
				>
					<span className="flex-grow whitespace-nowrap">Centro de Custo</span>
					<svg className="w-5 h-5 ml-2 flex-shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
					<span className="flex-grow whitespace-nowrap">Departamento</span>
					<svg className="w-5 h-5 ml-2 flex-shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
					className={`w-60 px-4 h-[36px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`}
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
					className={`w-60 px-4 h-[36px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`}
				>
					<span className="flex-grow whitespace-nowrap">Serviço</span>
					<svg className="w-5 h-5 ml-2 flex-shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
						<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
					</svg>
				</div>
			</div>
		</div>
	);
}
