import { Cairo } from "next/font/google";
import Image from "next/image";

const cairo = Cairo({
	weight: ["500", "600", "700"],
	subsets: ["latin"],
});

export default function SecaoFiltros() {
	return (
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
	);
}
