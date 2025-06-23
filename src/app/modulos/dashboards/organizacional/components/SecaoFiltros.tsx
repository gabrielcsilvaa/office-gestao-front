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

interface SecaoFiltrosProps {
	onEmpresaChange?: (empresa: string[]) => void;
	onCentroCustoChange?: (centroCusto: string[]) => void;
	onDepartamentoChange?: (departamento: string[]) => void;
	onServicoChange?: (servico: string[]) => void;
}

const SecaoFiltros = forwardRef<SecaoFiltrosRef, SecaoFiltrosProps>(({ 
	onEmpresaChange,
	onCentroCustoChange,
	onDepartamentoChange,
	onServicoChange 
}, ref) => {
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

	// === FASE 1: PREPARAÇÃO - Estados de busca ===
	const [empresaSearch, setEmpresaSearch] = useState<string>("");
	const [centroCustoSearch, setCentroCustoSearch] = useState<string>("");
	const [departamentoSearch, setDepartamentoSearch] = useState<string>("");
	const [servicoSearch, setServicoSearch] = useState<string>("");

	// Refs para controlar scroll dos dropdowns
	const empresaListRef = useRef<HTMLDivElement>(null);
	const centroCustoListRef = useRef<HTMLDivElement>(null);
	const departamentoListRef = useRef<HTMLDivElement>(null);
	const servicoListRef = useRef<HTMLDivElement>(null);

	// States para salvar posição do scroll
	const [empresaScrollPosition, setEmpresaScrollPosition] = useState(0);
	const [centroCustoScrollPosition, setCentroCustoScrollPosition] = useState(0);
	const [departamentoScrollPosition, setDepartamentoScrollPosition] = useState(0);
	const [servicoScrollPosition, setServicoScrollPosition] = useState(0);

	// Refs para os inputs de pesquisa
	const empresaSearchInputRef = useRef<HTMLInputElement>(null);
	const centroCustoSearchInputRef = useRef<HTMLInputElement>(null);
	const departamentoSearchInputRef = useRef<HTMLInputElement>(null);
	const servicoSearchInputRef = useRef<HTMLInputElement>(null);

	// === FILTROS DE BUSCA ===
	const filteredEmpresas = empresaOptions.filter(empresa =>
		empresa.toLowerCase().includes(empresaSearch.toLowerCase())
	);

	const filteredCentroCusto = centroCustoOptions.filter(centro =>
		centro.toLowerCase().includes(centroCustoSearch.toLowerCase())
	);

	const filteredDepartamentos = departamentoOptions.filter(depto =>
		depto.toLowerCase().includes(departamentoSearch.toLowerCase())
	);
	const filteredServicos = servicoOptions.filter(servico =>
		servico.toLowerCase().includes(servicoSearch.toLowerCase())
	);

	// === NOTIFICAÇÃO DE MUDANÇAS PARA O COMPONENTE PAI ===
	useEffect(() => {
		onEmpresaChange?.(selectedEmpresaOptions);
	}, [selectedEmpresaOptions, onEmpresaChange]);

	useEffect(() => {
		onCentroCustoChange?.(selectedCentroCustoOptions);
	}, [selectedCentroCustoOptions, onCentroCustoChange]);

	useEffect(() => {
		onDepartamentoChange?.(selectedDepartamentoOptions);
	}, [selectedDepartamentoOptions, onDepartamentoChange]);

	useEffect(() => {
		onServicoChange?.(selectedServicoOptions);
	}, [selectedServicoOptions, onServicoChange]);

	// === FASE 1: useEffects para foco automático nos inputs de pesquisa ===
	useEffect(() => {
		if (isEmpresaOpen && empresaSearchInputRef.current) {
			setTimeout(() => {
				empresaSearchInputRef.current?.focus();
			}, 10);
		}
	}, [isEmpresaOpen]);

	useEffect(() => {
		if (isCentroCustoOpen && centroCustoSearchInputRef.current) {
			setTimeout(() => {
				centroCustoSearchInputRef.current?.focus();
			}, 10);
		}
	}, [isCentroCustoOpen]);

	useEffect(() => {
		if (isDepartamentoOpen && departamentoSearchInputRef.current) {
			setTimeout(() => {
				departamentoSearchInputRef.current?.focus();
			}, 10);
		}
	}, [isDepartamentoOpen]);

	useEffect(() => {
		if (isServicoOpen && servicoSearchInputRef.current) {
			setTimeout(() => {
				servicoSearchInputRef.current?.focus();
			}, 10);
		}
	}, [isServicoOpen]);

	// === FASE 4: useEffects para posicionamento de scroll ===
	useEffect(() => {
		if (isEmpresaOpen && empresaListRef.current) {
			setTimeout(() => {
				if (empresaListRef.current) {
					if (selectedEmpresaOptions.length > 0) {
						const selectedElement = empresaListRef.current.querySelector(`[data-empresa="${selectedEmpresaOptions[0]}"]`);
						if (selectedElement) {
							selectedElement.scrollIntoView({ block: 'start', behavior: 'auto' });
							const currentScroll = empresaListRef.current.scrollTop;
							const itemHeight = 52;
							empresaListRef.current.scrollTop = Math.max(0, currentScroll - itemHeight);
						}
					} else {
						empresaListRef.current.scrollTop = empresaScrollPosition;
					}
				}
			}, 50);
		}
	}, [isEmpresaOpen, selectedEmpresaOptions, empresaScrollPosition]);

	useEffect(() => {
		if (isCentroCustoOpen && centroCustoListRef.current) {
			setTimeout(() => {
				if (centroCustoListRef.current) {
					if (selectedCentroCustoOptions.length > 0) {
						const selectedElement = centroCustoListRef.current.querySelector(`[data-centro="${selectedCentroCustoOptions[0]}"]`);
						if (selectedElement) {
							selectedElement.scrollIntoView({ block: 'start', behavior: 'auto' });
							const currentScroll = centroCustoListRef.current.scrollTop;
							const itemHeight = 52;
							centroCustoListRef.current.scrollTop = Math.max(0, currentScroll - itemHeight);
						}
					} else {
						centroCustoListRef.current.scrollTop = centroCustoScrollPosition;
					}
				}
			}, 50);
		}
	}, [isCentroCustoOpen, selectedCentroCustoOptions, centroCustoScrollPosition]);

	useEffect(() => {
		if (isDepartamentoOpen && departamentoListRef.current) {
			setTimeout(() => {
				if (departamentoListRef.current) {
					if (selectedDepartamentoOptions.length > 0) {
						const selectedElement = departamentoListRef.current.querySelector(`[data-departamento="${selectedDepartamentoOptions[0]}"]`);
						if (selectedElement) {
							selectedElement.scrollIntoView({ block: 'start', behavior: 'auto' });
							const currentScroll = departamentoListRef.current.scrollTop;
							const itemHeight = 52;
							departamentoListRef.current.scrollTop = Math.max(0, currentScroll - itemHeight);
						}
					} else {
						departamentoListRef.current.scrollTop = departamentoScrollPosition;
					}
				}
			}, 50);
		}
	}, [isDepartamentoOpen, selectedDepartamentoOptions, departamentoScrollPosition]);

	useEffect(() => {
		if (isServicoOpen && servicoListRef.current) {
			setTimeout(() => {
				if (servicoListRef.current) {
					if (selectedServicoOptions.length > 0) {
						const selectedElement = servicoListRef.current.querySelector(`[data-servico="${selectedServicoOptions[0]}"]`);
						if (selectedElement) {
							selectedElement.scrollIntoView({ block: 'start', behavior: 'auto' });
							const currentScroll = servicoListRef.current.scrollTop;
							const itemHeight = 52;
							servicoListRef.current.scrollTop = Math.max(0, currentScroll - itemHeight);
						}
					} else {
						servicoListRef.current.scrollTop = servicoScrollPosition;
					}
				}
			}, 50);
		}
	}, [isServicoOpen, selectedServicoOptions, servicoScrollPosition]);
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (empresaRef.current && !empresaRef.current.contains(event.target as Node)) {
				handleCloseEmpresaDropdown();
			}
			if (centroCustoRef.current && !centroCustoRef.current.contains(event.target as Node)) {
				handleCloseCentroCustoDropdown();
			}
			if (departamentoRef.current && !departamentoRef.current.contains(event.target as Node)) {
				handleCloseDepartamentoDropdown();
			}
			if (servicoRef.current && !servicoRef.current.contains(event.target as Node)) {
				handleCloseServicoDropdown();
			}		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);		};
	}, []);

	// === FASE 4: Funções para salvar posição do scroll antes de fechar dropdowns ===
	const handleCloseEmpresaDropdown = () => {
		if (empresaListRef.current) {
			setEmpresaScrollPosition(empresaListRef.current.scrollTop);
		}
		setIsEmpresaOpen(false);
	};

	const handleCloseCentroCustoDropdown = () => {
		if (centroCustoListRef.current) {
			setCentroCustoScrollPosition(centroCustoListRef.current.scrollTop);
		}
		setIsCentroCustoOpen(false);
	};

	const handleCloseDepartamentoDropdown = () => {
		if (departamentoListRef.current) {
			setDepartamentoScrollPosition(departamentoListRef.current.scrollTop);
		}
		setIsDepartamentoOpen(false);
	};

	const handleCloseServicoDropdown = () => {
		if (servicoListRef.current) {
			setServicoScrollPosition(servicoListRef.current.scrollTop);
		}
		setIsServicoOpen(false);
	};

	// Função para resetar todos os filtros
	const resetAllFilters = () => {
		setSelectedEmpresaOptions([]);
		setSelectedCentroCustoOptions([]);
		setSelectedDepartamentoOptions([]);
		setSelectedServicoOptions([]);
		// Limpa pesquisas
		setEmpresaSearch("");
		setCentroCustoSearch("");
		setDepartamentoSearch("");
		setServicoSearch("");
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
	};	const handleCentroCustoSelection = (option: string) => {
		handleMultiSelectOption(option, setSelectedCentroCustoOptions);
		// Reset automático dos filtros dependentes
		setSelectedDepartamentoOptions(["Todos"]);
		setSelectedServicoOptions(["Todos"]);
	};

	const handleDepartamentoSelection = (option: string) => {
		handleMultiSelectOption(option, setSelectedDepartamentoOptions);
		// Reset automático do serviço quando departamento muda
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
						<div className="absolute z-50 mt-1 w-52 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
							{/* Campo de pesquisa aprimorado */}
							<div className="p-3 bg-gray-50 border-b border-gray-200">
								<div className="relative">
									<svg 
										className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
										fill="none" 
										stroke="currentColor" 
										viewBox="0 0 24 24"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
									<input
										ref={empresaSearchInputRef}
										type="text"
										value={empresaSearch}
										onChange={e => setEmpresaSearch(e.target.value)}
										placeholder="Buscar empresa..."
										className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
									/>
									{empresaSearch && (
										<button
											onClick={() => setEmpresaSearch("")}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600"
										>
											<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
											</svg>
										</button>
									)}
								</div>
							</div>

							{/* Lista de opções aprimorada */}
							<div ref={empresaListRef} className="max-h-48 overflow-y-auto">
								{filteredEmpresas.length === 0 ? (
									<div className="px-4 py-8 text-center">
										<div className="relative mx-auto w-12 h-12 mb-3">
											<svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
											</svg>
											<div className="absolute inset-0 flex items-center justify-center">
												<div className="w-8 h-0.5 bg-gray-300 rotate-45 rounded-full"></div>
											</div>
										</div>
										<p className="text-sm font-medium text-gray-600 mb-1">Nenhuma empresa encontrada</p>
										{empresaSearch ? (
											<p className="text-xs text-gray-400">Tente buscar por outro termo</p>
										) : (
											<p className="text-xs text-gray-400">Refine sua pesquisa</p>
										)}
									</div>
								) : (
									<>
										{empresaSearch && (
											<div className="px-3 py-2 bg-blue-50 border-b border-blue-100">
												<p className="text-xs text-blue-600">
													{filteredEmpresas.length} resultado{filteredEmpresas.length !== 1 ? 's' : ''} encontrado{filteredEmpresas.length !== 1 ? 's' : ''}
												</p>
											</div>
										)}
										{filteredEmpresas.map((option) => (
											<div
												key={option}
												data-empresa={option}
												onClick={() => { 
													handleEmpresaSelection(option); 
													handleCloseEmpresaDropdown(); 
													setEmpresaSearch(""); 
												}}
												className={`px-4 py-3 text-sm hover:bg-blue-50 cursor-pointer transition-colors flex items-center justify-between group ${
													selectedEmpresaOptions.includes(option) ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-blue-600'
												}`}
											>
												<span className="truncate">{option}</span>
												{selectedEmpresaOptions.includes(option) && (
													<svg className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" fill="currentColor" viewBox="0 0 20 20">
														<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
													</svg>
												)}
											</div>
										))}
									</>
								)}
							</div>
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
					</div>					{isCentroCustoOpen && (
						<div className="absolute z-50 mt-1 w-52 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
							{/* Campo de pesquisa aprimorado */}
							<div className="p-3 bg-gray-50 border-b border-gray-200">
								<div className="relative">
									<svg 
										className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
										fill="none" 
										stroke="currentColor" 
										viewBox="0 0 24 24"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
									<input
										ref={centroCustoSearchInputRef}
										type="text"
										value={centroCustoSearch}
										onChange={e => setCentroCustoSearch(e.target.value)}
										placeholder="Buscar centro de custo..."
										className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
									/>
									{centroCustoSearch && (
										<button
											onClick={() => setCentroCustoSearch("")}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600"
										>
											<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
											</svg>
										</button>
									)}
								</div>
							</div>

							{/* Lista de opções aprimorada */}
							<div ref={centroCustoListRef} className="max-h-48 overflow-y-auto">
								{selectedEmpresaOptions.length === 0 ? (
									<div className="px-4 py-8 text-center">
										<svg className="mx-auto w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
										</svg>
										<p className="text-sm text-gray-500">Selecione uma empresa para</p>
										<p className="text-sm text-gray-500">carregar os centros de custo</p>
									</div>
								) : filteredCentroCusto.length === 0 ? (
									<div className="px-4 py-8 text-center">
										<div className="relative mx-auto w-12 h-12 mb-3">
											<svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
											</svg>
											<div className="absolute inset-0 flex items-center justify-center">
												<div className="w-8 h-0.5 bg-gray-300 rotate-45 rounded-full"></div>
											</div>
										</div>
										<p className="text-sm font-medium text-gray-600 mb-1">Nenhum centro encontrado</p>
										{centroCustoSearch ? (
											<p className="text-xs text-gray-400">Tente buscar por outro termo</p>
										) : (
											<p className="text-xs text-gray-400">Refine sua pesquisa</p>
										)}
									</div>
								) : (
									<>
										{centroCustoSearch && (
											<div className="px-3 py-2 bg-blue-50 border-b border-blue-100">
												<p className="text-xs text-blue-600">
													{filteredCentroCusto.length} resultado{filteredCentroCusto.length !== 1 ? 's' : ''} encontrado{filteredCentroCusto.length !== 1 ? 's' : ''}
												</p>
											</div>
										)}
										{filteredCentroCusto.map((option) => (											<div
												key={option}
												data-centro={option}
												onClick={() => { 
													handleCentroCustoSelection(option); 
													handleCloseCentroCustoDropdown(); 
													setCentroCustoSearch(""); 
												}}
												className={`px-4 py-3 text-sm hover:bg-blue-50 cursor-pointer transition-colors flex items-center justify-between group ${
													selectedCentroCustoOptions.includes(option) ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-blue-600'
												}`}
											>
												<span className="truncate">{option}</span>
												{selectedCentroCustoOptions.includes(option) && (
													<svg className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" fill="currentColor" viewBox="0 0 20 20">
														<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
													</svg>
												)}
											</div>
										))}
									</>
								)}
							</div>
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
					</div>					{isDepartamentoOpen && (
						<div className="absolute z-50 mt-1 w-52 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
							{/* Campo de pesquisa aprimorado */}
							<div className="p-3 bg-gray-50 border-b border-gray-200">
								<div className="relative">
									<svg 
										className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
										fill="none" 
										stroke="currentColor" 
										viewBox="0 0 24 24"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
									<input
										ref={departamentoSearchInputRef}
										type="text"
										value={departamentoSearch}
										onChange={e => setDepartamentoSearch(e.target.value)}
										placeholder="Buscar departamento..."
										className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
									/>
									{departamentoSearch && (
										<button
											onClick={() => setDepartamentoSearch("")}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600"
										>
											<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
											</svg>
										</button>
									)}
								</div>
							</div>

							{/* Lista de opções aprimorada */}							<div ref={departamentoListRef} className="max-h-48 overflow-y-auto">
								{(selectedCentroCustoOptions.length === 0 || 
								  (selectedCentroCustoOptions.length === 1 && selectedCentroCustoOptions[0] === "Todos")) ? (
									<div className="px-4 py-8 text-center">
										<svg className="mx-auto w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
										</svg>
										<p className="text-sm text-gray-500">Selecione um centro de custo para</p>
										<p className="text-sm text-gray-500">carregar os departamentos</p>
									</div>
								) : filteredDepartamentos.length === 0 ? (
									<div className="px-4 py-8 text-center">
										<div className="relative mx-auto w-12 h-12 mb-3">
											<svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
											</svg>
											<div className="absolute inset-0 flex items-center justify-center">
												<div className="w-8 h-0.5 bg-gray-300 rotate-45 rounded-full"></div>
											</div>
										</div>
										<p className="text-sm font-medium text-gray-600 mb-1">Nenhum departamento encontrado</p>
										{departamentoSearch ? (
											<p className="text-xs text-gray-400">Tente buscar por outro termo</p>
										) : (
											<p className="text-xs text-gray-400">Refine sua pesquisa</p>
										)}
									</div>
								) : (
									<>
										{departamentoSearch && (
											<div className="px-3 py-2 bg-blue-50 border-b border-blue-100">
												<p className="text-xs text-blue-600">
													{filteredDepartamentos.length} resultado{filteredDepartamentos.length !== 1 ? 's' : ''} encontrado{filteredDepartamentos.length !== 1 ? 's' : ''}
												</p>
											</div>
										)}
										{filteredDepartamentos.map((option) => (											<div
												key={option}
												data-departamento={option}
												onClick={() => { 
													handleDepartamentoSelection(option); 
													handleCloseDepartamentoDropdown(); 
													setDepartamentoSearch(""); 
												}}
												className={`px-4 py-3 text-sm hover:bg-blue-50 cursor-pointer transition-colors flex items-center justify-between group ${
													selectedDepartamentoOptions.includes(option) ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-blue-600'
												}`}
											>
												<span className="truncate">{option}</span>
												{selectedDepartamentoOptions.includes(option) && (
													<svg className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" fill="currentColor" viewBox="0 0 20 20">
														<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
												</svg>
												)}
											</div>
										))}
									</>
								)}
							</div>
						</div>
					)}
				</div>				{/* 4. Serviço (atividade específica) */}
				<div className="relative" ref={servicoRef}>
					<div
						role="combobox"
						aria-haspopup="listbox"
						tabIndex={0}
						aria-expanded={isServicoOpen}
						aria-label="Serviço"
						onClick={() => setIsServicoOpen(!isServicoOpen)}
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
						<div className="absolute z-50 mt-1 w-52 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
							{/* Barra de pesquisa */}
							<div className="p-3 bg-gray-50 border-b border-gray-200">
								<div className="relative">
									<svg 
										className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
										fill="none" 
										stroke="currentColor" 
										viewBox="0 0 24 24"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
									<input
										ref={servicoSearchInputRef}
										type="text"
										value={servicoSearch}
										onChange={e => setServicoSearch(e.target.value)}
										placeholder="Buscar serviço..."
										className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
									/>
									{servicoSearch && (
										<button
											onClick={() => setServicoSearch("")}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600"
										>
											<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
											</svg>
										</button>
									)}
								</div>
							</div>

							{/* Lista de opções aprimorada */}							<div ref={servicoListRef} className="max-h-48 overflow-y-auto">
								{(selectedDepartamentoOptions.length === 0 || 
								  (selectedDepartamentoOptions.length === 1 && selectedDepartamentoOptions[0] === "Todos")) ? (
									<div className="px-4 py-8 text-center">
										<svg className="mx-auto w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
										</svg>
										<p className="text-sm text-gray-500">Selecione um departamento para</p>
										<p className="text-sm text-gray-500">carregar os serviços</p>
									</div>
								) : filteredServicos.length === 0 ? (
									<div className="px-4 py-8 text-center">
										<div className="relative mx-auto w-12 h-12 mb-3">
											<svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
											</svg>
											<div className="absolute inset-0 flex items-center justify-center">
												<div className="w-8 h-0.5 bg-gray-300 rotate-45 rounded-full"></div>
											</div>
										</div>
										<p className="text-sm font-medium text-gray-600 mb-1">Nenhum serviço encontrado</p>
										{servicoSearch ? (
											<p className="text-xs text-gray-400">Tente buscar por outro termo</p>
										) : (
											<p className="text-xs text-gray-400">Refine sua pesquisa</p>
										)}
									</div>
								) : (
									<>
										{servicoSearch && (
											<div className="px-3 py-2 bg-blue-50 border-b border-blue-100">
												<p className="text-xs text-blue-600">
													{filteredServicos.length} resultado{filteredServicos.length !== 1 ? 's' : ''} encontrado{filteredServicos.length !== 1 ? 's' : ''}
												</p>
											</div>
										)}
										{filteredServicos.map((option) => (
											<div
												key={option}
												data-servico={option}
												onClick={() => { 
													handleMultiSelectOption(option, setSelectedServicoOptions); 
													handleCloseServicoDropdown(); 
													setServicoSearch(""); 
												}}
												className={`px-4 py-3 text-sm hover:bg-blue-50 cursor-pointer transition-colors flex items-center justify-between group ${
													selectedServicoOptions.includes(option) ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-blue-600'
												}`}
											>
												<span className="truncate">{option}</span>
												{selectedServicoOptions.includes(option) && (
													<svg className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" fill="currentColor" viewBox="0 0 20 20">
														<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
													</svg>
												)}
											</div>
										))}
									</>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
});

SecaoFiltros.displayName = 'SecaoFiltros';

export default SecaoFiltros;
