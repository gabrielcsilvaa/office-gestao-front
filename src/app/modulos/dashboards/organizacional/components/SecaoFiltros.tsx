"use client";

import { Cairo } from "next/font/google";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const cairo = Cairo({
	weight: ["500", "600", "700"],
	subsets: ["latin"],
});

export default function SecaoFiltros() {
	const [isCentroCustoOpen, setIsCentroCustoOpen] = useState(false);
	const [selectedCentroCustoOptions, setSelectedCentroCustoOptions] = useState<string[]>([]);
	const centroCustoOptions = ["Todos", "Administrativo", "Comercial", "Produção", "Logística"];
	const centroCustoRef = useRef<HTMLDivElement>(null);

	const [isDepartamentoOpen, setIsDepartamentoOpen] = useState(false);
	const [selectedDepartamentoOptions, setSelectedDepartamentoOptions] = useState<string[]>([]);
	const departamentoOptions = ["Todos", "Financeiro", "Recursos Humanos", "TI", "Marketing"];
	const departamentoRef = useRef<HTMLDivElement>(null);

	const [isColaboradorOpen, setIsColaboradorOpen] = useState(false);
	const [selectedColaboradorOptions, setSelectedColaboradorOptions] = useState<string[]>([]);
	const colaboradorOptions = ["Todos", "Ana Silva (Colaborador)", "Carlos Pereira (Diretor)", "Beatriz Costa (Autônomo)"];
	const colaboradorRef = useRef<HTMLDivElement>(null);

	const [isServicoOpen, setIsServicoOpen] = useState(false);
	const [selectedServicoOptions, setSelectedServicoOptions] = useState<string[]>([]);
	const servicoOptions = ["Todos", "Consultoria XPTO", "Desenvolvimento Y", "Manutenção Z"];
	const servicoRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (centroCustoRef.current && !centroCustoRef.current.contains(event.target as Node)) {
				setIsCentroCustoOpen(false);
			}
			if (departamentoRef.current && !departamentoRef.current.contains(event.target as Node)) {
				setIsDepartamentoOpen(false);
			}
			if (colaboradorRef.current && !colaboradorRef.current.contains(event.target as Node)) {
				setIsColaboradorOpen(false);
			}
			if (servicoRef.current && !servicoRef.current.contains(event.target as Node)) {
				setIsServicoOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);


	const handleMultiSelectOption = (
		option: string,
		setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>
	) => {
		setSelectedOptions(prevSelected => {
			if (option === "Todos") {
				// If "Todos" is clicked
				if (prevSelected.length === 1 && prevSelected[0] === "Todos") {
					return []; // Deselect all if "Todos" was the only one selected
				} else {
					return ["Todos"]; // Otherwise, select only "Todos"
				}
			} else {
				// If any other option is clicked
				let newSelectedOptions = [...prevSelected];
				if (newSelectedOptions.includes(option)) {
					// Deselect the option
					newSelectedOptions = newSelectedOptions.filter(item => item !== option);
				} else {
					// Select the option
					newSelectedOptions.push(option);
				}
				// Remove "Todos" if any other option is now part of the selection
				newSelectedOptions = newSelectedOptions.filter(item => item !== "Todos");
				return newSelectedOptions;
			}
		});
	};

	const getDisplayText = (selected: string[], defaultLabel: string): string => {
		if (selected.includes("Todos")) return "Todos";
		if (selected.length === 0) return defaultLabel;
		if (selected.length === 1) return selected[0];
		return `${selected.length} selecionados`;
	};

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
				<div className="relative" ref={centroCustoRef}>
					<div
						role="combobox"
						aria-haspopup="listbox"
						tabIndex={0}
						aria-expanded={isCentroCustoOpen}
						aria-label="Centro de Custo"
						onClick={() => setIsCentroCustoOpen(!isCentroCustoOpen)}
						className={`w-60 px-4 h-[36px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`}
					>
						<span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
							{getDisplayText(selectedCentroCustoOptions, "Centro de Custo")}
						</span>
						<svg className="w-5 h-5 ml-2 flex-shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
						</svg>
					</div>
					{isCentroCustoOpen && (
						<div className="absolute mt-1 w-60 bg-white border border-neutral-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
							{centroCustoOptions.map((option) => (
								<div
									key={option}
									onClick={() => handleMultiSelectOption(option, setSelectedCentroCustoOptions)}
									className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${selectedCentroCustoOptions.includes(option) ? 'bg-blue-50' : ''}`}
								>
									{option}
									{selectedCentroCustoOptions.includes(option) && (
										<svg className="w-4 h-4 fill-current text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
											<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
										</svg>
									)}
								</div>
							))}
						</div>
					)}
				</div>

				{/* Departamento Dropdown */}
				<div className="relative" ref={departamentoRef}>
					<div
						role="combobox"
						aria-haspopup="listbox"
						tabIndex={0}
						aria-expanded={isDepartamentoOpen}
						aria-label="Departamento"
						onClick={() => setIsDepartamentoOpen(!isDepartamentoOpen)}
						className={`w-60 px-4 h-[36px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`}
					>
						<span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
							{getDisplayText(selectedDepartamentoOptions, "Departamento")}
						</span>
						<svg className="w-5 h-5 ml-2 flex-shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
						</svg>
					</div>
					{isDepartamentoOpen && (
						<div className="absolute mt-1 w-60 bg-white border border-neutral-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
							{departamentoOptions.map((option) => (
								<div
									key={option}
									onClick={() => handleMultiSelectOption(option, setSelectedDepartamentoOptions)}
									className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${selectedDepartamentoOptions.includes(option) ? 'bg-blue-50' : ''}`}
								>
									{option}
									{selectedDepartamentoOptions.includes(option) && (
										<svg className="w-4 h-4 fill-current text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
											<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
										</svg>
									)}
								</div>
							))}
						</div>
					)}
				</div>

				{/* Colaborador/Diretor/Autônomo Dropdown */}
				<div className="relative" ref={colaboradorRef}>
					<div
						role="combobox"
						aria-haspopup="listbox"
						tabIndex={0}
						aria-expanded={isColaboradorOpen}
						aria-label="Colaborador/Diretor/Autônomo"
						onClick={() => setIsColaboradorOpen(!isColaboradorOpen)}
						className={`w-60 px-4 h-[36px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`}
					>
						<span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
							{getDisplayText(selectedColaboradorOptions, "Colaborador/Diretor/Autônomo")}
						</span>
						<svg className="w-5 h-5 ml-2 flex-shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
						</svg>
					</div>
					{isColaboradorOpen && (
						<div className="absolute mt-1 w-60 bg-white border border-neutral-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
							{colaboradorOptions.map((option) => (
								<div
									key={option}
									onClick={() => handleMultiSelectOption(option, setSelectedColaboradorOptions)}
									className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${selectedColaboradorOptions.includes(option) ? 'bg-blue-50' : ''}`}
								>
									{option}
									{selectedColaboradorOptions.includes(option) && (
										<svg className="w-4 h-4 fill-current text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
											<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
										</svg>
									)}
								</div>
							))}
						</div>
					)}
				</div>

				{/* Serviço Dropdown */}
				<div className="relative" ref={servicoRef}>
					<div
						role="combobox"
						aria-haspopup="listbox"
						tabIndex={0}
						aria-expanded={isServicoOpen}
						aria-label="Serviço"
						onClick={() => setIsServicoOpen(!isServicoOpen)}
						className={`w-60 px-4 h-[36px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`}
					>
						<span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
							{getDisplayText(selectedServicoOptions, "Serviço")}
						</span>
						<svg className="w-5 h-5 ml-2 flex-shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
						</svg>
					</div>
					{isServicoOpen && (
						<div className="absolute mt-1 w-60 bg-white border border-neutral-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
							{servicoOptions.map((option) => (
								<div
									key={option}
									onClick={() => handleMultiSelectOption(option, setSelectedServicoOptions)}
									className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${selectedServicoOptions.includes(option) ? 'bg-blue-50' : ''}`}
								>
									{option}
									{selectedServicoOptions.includes(option) && (
										<svg className="w-4 h-4 fill-current text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
											<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
										</svg>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
