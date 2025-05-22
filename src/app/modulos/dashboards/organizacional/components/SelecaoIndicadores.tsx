"use client"; // Add this directive for useState
import { Cairo } from "next/font/google";
import Image from "next/image";
import { useState } from "react"; // Import useState

const cairo = Cairo({
	weight: ["500", "600", "700"],
	subsets: ["latin"],
});

// Define button labels for easier management
const indicadores = [
	"Informativos",
	"Proventos",
	"Descontos",
	"Líquidos",
	"Custo Total",
];

export default function SecaoFiltros() {
	const [indicadorSelecionado, setIndicadorSelecionado] =
		useState<string>("Proventos"); // Default to "Proventos"

	const handleSelecaoIndicador = (indicador: string) => {
		setIndicadorSelecionado(indicador);
	};

	const baseButtonStyle =
		"w-auto px-6 h-[36px] flex items-center justify-center rounded-md border border-neutral-700 text-sm font-semibold leading-tight hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer";

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
				{indicadores.map((indicador) => (
					<button
						key={indicador}
						className={`${baseButtonStyle} ${cairo.className} ${
							indicadorSelecionado === indicador
								? "bg-neutral-700 text-white" // Selected style
								: "bg-white text-gray-500" // Unselected style
						}`}
						onClick={() => handleSelecaoIndicador(indicador)}
					>
						{indicador}
					</button>
				))}
			</div>
		</div>
	);
}
