"use client";

import { Cairo } from "next/font/google";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const cairo = Cairo({
	weight: ["500", "600", "700"],
	subsets: ["latin"],
});

interface FuncionarioOpcao {
	id_empregado: number;
	nome: string;
}

interface SecaoFiltrosProps {
	selectedEmpresa: string;
	onChangeEmpresa: (empresa: string) => void;
	selectedColaborador: string;
	onChangeColaborador: (colaborador: string) => void;
	empresaOptionsList?: string[];
	areDatesSelected?: boolean;
	colaboradorOptionsList?: FuncionarioOpcao[];
	isEmpresaSelected?: boolean;
}

export default function SecaoFiltros({
	selectedEmpresa,
	onChangeEmpresa,
	selectedColaborador,
	onChangeColaborador,
	empresaOptionsList = [],
	areDatesSelected = false,
	colaboradorOptionsList = [], 
	isEmpresaSelected = false,   
}: SecaoFiltrosProps) {
	const [isEmpresaOpen, setIsEmpresaOpen] = useState(false);
	const empresaRef = useRef<HTMLDivElement>(null);

	const [isColaboradorOpen, setIsColaboradorOpen] = useState(false);
	const colaboradorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (empresaRef.current && !empresaRef.current.contains(event.target as Node)) {
				setIsEmpresaOpen(false);
			}
			if (colaboradorRef.current && !colaboradorRef.current.contains(event.target as Node)) {
				setIsColaboradorOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

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
				<div className="relative" ref={empresaRef}>
					<div
						role="combobox"
						aria-haspopup="listbox"
						tabIndex={0}
						aria-expanded={isEmpresaOpen}
						aria-label="Empresa"
						onClick={() => setIsEmpresaOpen(!isEmpresaOpen)}
						className={`w-60 px-4 h-[36px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`}
					>
						<span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
							{selectedEmpresa || "Empresa"}
						</span>
						<svg className="w-5 h-5 ml-2 fill-current" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
						</svg>
					</div>
					{isEmpresaOpen && (
						<div className="absolute mt-1 w-60 bg-white border border-neutral-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
							{!areDatesSelected ? (
								<div className="px-4 py-2 text-sm text-gray-500">
									Selecione as datas para carregar as empresas.
								</div>
							) : empresaOptionsList.length === 0 ? (
								<div className="px-4 py-2 text-sm text-gray-500">
									Nenhuma empresa encontrada.
								</div>
							) : (
								empresaOptionsList.map(option => (
									<div
										key={option}
										onClick={() => { onChangeEmpresa(option); setIsEmpresaOpen(false); }}
										className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${selectedEmpresa === option ? 'bg-blue-50' : ''}`}
									>
										{option}
										{selectedEmpresa === option && (
											<svg className="w-4 h-4 fill-current text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
											</svg>
										)}
									</div>
								))
							)}
						</div>
					)}
				</div>

				<div className="relative" ref={colaboradorRef}>
					<div
						role="combobox"
						aria-haspopup="listbox"
						tabIndex={0}
						aria-expanded={isColaboradorOpen}
						aria-label="Colaborador/Diretor/Autônomo"
						onClick={() => setIsColaboradorOpen(!isColaboradorOpen)}
						className={`w-80 px-4 h-[36px] flex items-center justify-between bg-white rounded-md border border-neutral-700 text-gray-500 text-sm font-semibold leading-tight ${cairo.className} hover:bg-[var(--color-neutral-700)] hover:text-white cursor-pointer`}
					>
						<span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
							{selectedColaborador || "Colaborador/Diretor/Autônomo"}
						</span>
						<svg className="w-5 h-5 ml-2 flex-shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
						</svg>
					</div>
					{isColaboradorOpen && (
						<div className="absolute mt-1 w-80 bg-white border border-neutral-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
							{!isEmpresaSelected ? (
								<div className="px-4 py-2 text-sm text-gray-500">
									Selecione uma empresa para carregar os colaboradores.
								</div>
							) : colaboradorOptionsList.length === 0 ? (
								<div className="px-4 py-2 text-sm text-gray-500">
									Nenhum colaborador encontrado para esta empresa.
								</div>
							) : (
								colaboradorOptionsList.map(option => (
									<div
										key={option.id_empregado} // Use unique id_empregado for key
										onClick={() => {
											// Pass employee name to handler, assuming selectedColaborador stores the name
											onChangeColaborador(selectedColaborador === option.nome ? "" : option.nome);
											setIsColaboradorOpen(false);
										}}
										className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${selectedColaborador === option.nome ? 'bg-blue-50' : ''}`}
									>
										{option.nome} {/* Display employee name */}
										{selectedColaborador === option.nome && (
											<svg className="w-4 h-4 fill-current text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
											</svg>
										)}
									</div>
								))
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
