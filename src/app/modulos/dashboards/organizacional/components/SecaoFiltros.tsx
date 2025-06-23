"use client";
import { Cairo } from "next/font/google";
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";

const cairo = Cairo({
	weight: ["500", "600", "700"],
	subsets: ["latin"],
});

export interface SecaoFiltrosRef {
	resetAllFilters: () => void;
}

const SecaoFiltros = forwardRef<SecaoFiltrosRef>((props, ref) => {
	// 1. Empresa/Organização (nível mais alto)
	const [isEmpresaOpen, setIsEmpresaOpen] = useState(false);
	const [selectedEmpresaOptions, setSelectedEmpresaOptions] = useState<string[]>([]);
	const empresaOptions = ["Matriz", "Filial São Paulo", "Filial Rio de Janeiro", "Filial Belo Horizonte"];
	const empresaRef = useRef<HTMLDivElement>(null);

	// 2. Centro de Custo (estrutura organizacional)
	const [isCentroCustoOpen, setIsCentroCustoOpen] = useState(false);
	const [selectedCentroCustoOptions, setSelectedCentroCustoOptions] = useState<string[]>([]);
	const centroCustoOptions = ["Todos", "Administrativo", "Comercial", "Produção", "Logística"];
	const centroCustoRef = useRef<HTMLDivElement>(null);

	// 3. Departamento (subdivisão)
	const [isDepartamentoOpen, setIsDepartamentoOpen] = useState(false);
	const [selectedDepartamentoOptions, setSelectedDepartamentoOptions] = useState<string[]>([]);
	const departamentoOptions = ["Todos", "Financeiro", "Recursos Humanos", "TI", "Marketing"];
	const departamentoRef = useRef<HTMLDivElement>(null);

	// 4. Serviço (atividade específica)
	const [isServicoOpen, setIsServicoOpen] = useState(false);
	const [selectedServicoOptions, setSelectedServicoOptions] = useState<string[]>([]);
	const servicoOptions = ["Todos", "Consultoria XPTO", "Desenvolvimento Y", "Manutenção Z"];
	const servicoRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (empresaRef.current && !empresaRef.current.contains(event.target as Node)) {
				setIsEmpresaOpen(false);
			}
			if (centroCustoRef.current && !centroCustoRef.current.contains(event.target as Node)) {
				setIsCentroCustoOpen(false);
			}
			if (departamentoRef.current && !departamentoRef.current.contains(event.target as Node)) {
				setIsDepartamentoOpen(false);
			}
			if (servicoRef.current && !servicoRef.current.contains(event.target as Node)) {
				setIsServicoOpen(false);
			}		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Função para resetar todos os filtros
	const resetAllFilters = () => {
		setSelectedEmpresaOptions([]);
		setSelectedCentroCustoOptions([]);
		setSelectedDepartamentoOptions([]);
		setSelectedServicoOptions([]);
		// Fecha todos os dropdowns
		setIsEmpresaOpen(false);
		setIsCentroCustoOpen(false);
		setIsDepartamentoOpen(false);
		setIsServicoOpen(false);
	};

	// Expõe a função para o componente pai
	useImperativeHandle(ref, () => ({
		resetAllFilters,
	}));

	const handleEmpresaSelection = (option: string) => {
		// Seleção única para empresa
		setSelectedEmpresaOptions([option]);
		
		// Reset automático dos outros filtros para "Todos"
		setSelectedCentroCustoOptions(["Todos"]);
		setSelectedDepartamentoOptions(["Todos"]);
		setSelectedServicoOptions(["Todos"]);
	};

	const handleMultiSelectOption = (
		option: string,
		setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>
	) => {
		setSelectedOptions(prevSelected => {
			if (option === "Todos") {
				if (prevSelected.length === 1 && prevSelected[0] === "Todos") {
					return [];
				} else {
					return ["Todos"];
				}
			} else {
				let newSelectedOptions = [...prevSelected];
				if (newSelectedOptions.includes(option)) {
					newSelectedOptions = newSelectedOptions.filter(item => item !== option);
				} else {
					newSelectedOptions.push(option);
				}
				newSelectedOptions = newSelectedOptions.filter(item => item !== "Todos");
				return newSelectedOptions;
			}
		});	};

	const getDisplayText = (selected: string[], defaultLabel: string): string => {
		if (defaultLabel === "Empresa") {
			// Para empresa, sempre mostrar seleção única ou placeholder
			if (selected.length === 0) return defaultLabel;
			return selected[0];
		}
		// Para outros campos, manter lógica de "Todos"
		if (selected.includes("Todos")) return "Todos";
		if (selected.length === 0) return defaultLabel;
		if (selected.length === 1) return selected[0];
		return `${selected.length} selecionados`;
	};
	return (
		<div className="flex flex-row items-center gap-8">
			<div className="flex items-center gap-4">
				{/* 1. Empresa/Organização (nível mais alto) */}
				<div className="relative" ref={empresaRef}>					<div
						role="combobox"
						aria-haspopup="listbox"
						tabIndex={0}
						aria-expanded={isEmpresaOpen}
						aria-label="Empresa"
						onClick={() => setIsEmpresaOpen(!isEmpresaOpen)}
						className={`w-52 px-4 h-[44px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`}
					>
						<span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
							{getDisplayText(selectedEmpresaOptions, "Empresa")}
						</span>
						<svg className="w-5 h-5 ml-2 flex-shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
						</svg>
					</div>					{isEmpresaOpen && (
						<div className="absolute z-50 mt-1 w-52 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto">
							{empresaOptions.map((option) => (								<div
									key={option}
									onClick={() => handleEmpresaSelection(option)}
									className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${selectedEmpresaOptions.includes(option) ? 'bg-blue-50' : ''}`}
								>
									{option}
									{selectedEmpresaOptions.includes(option) && (
										<svg className="w-4 h-4 fill-current text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
											<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
										</svg>
									)}
								</div>
							))}
						</div>
					)}
				</div>

				{/* 2. Centro de Custo (estrutura organizacional) */}
				<div className="relative" ref={centroCustoRef}>
					<div
						role="combobox"
						aria-haspopup="listbox"
						tabIndex={0}
						aria-expanded={isCentroCustoOpen}
						aria-label="Centro de Custo"
						onClick={() => setIsCentroCustoOpen(!isCentroCustoOpen)}						className={`w-52 px-4 h-[44px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`}
					>
						<span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
							{getDisplayText(selectedCentroCustoOptions, "Centro de Custo")}
						</span>
						<svg className="w-5 h-5 ml-2 flex-shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
						</svg>
					</div>
					{isCentroCustoOpen && (
						<div className="absolute z-50 mt-1 w-52 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto">
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

				{/* 3. Departamento (subdivisão) */}
				<div className="relative" ref={departamentoRef}>
					<div
						role="combobox"
						aria-haspopup="listbox"
						tabIndex={0}
						aria-expanded={isDepartamentoOpen}
						aria-label="Departamento"						onClick={() => setIsDepartamentoOpen(!isDepartamentoOpen)}
						className={`w-52 px-4 h-[44px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`}
					>
						<span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
							{getDisplayText(selectedDepartamentoOptions, "Departamento")}
						</span>
						<svg className="w-5 h-5 ml-2 flex-shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
						</svg>
					</div>
					{isDepartamentoOpen && (
						<div className="absolute z-50 mt-1 w-52 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto">
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

				{/* 4. Serviço (atividade específica) */}
				<div className="relative" ref={servicoRef}>
					<div
						role="combobox"
						aria-haspopup="listbox"
						tabIndex={0}
						aria-expanded={isServicoOpen}
						aria-label="Serviço"						onClick={() => setIsServicoOpen(!isServicoOpen)}
						className={`w-52 px-4 h-[44px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`}
					>
						<span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
							{getDisplayText(selectedServicoOptions, "Serviço")}
						</span>
						<svg className="w-5 h-5 ml-2 flex-shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
						</svg>
					</div>
					{isServicoOpen && (
						<div className="absolute z-50 mt-1 w-52 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto">
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
							))}						</div>
					)}
				</div>
			</div>
		</div>
	);
});

SecaoFiltros.displayName = 'SecaoFiltros';

export default SecaoFiltros;
