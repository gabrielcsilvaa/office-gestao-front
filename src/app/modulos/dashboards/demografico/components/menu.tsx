"use client";

import Calendar from "@/components/calendar";
import { RotateCcw } from "lucide-react";
import React from "react";

interface MenuProps {
  filtros: {
    empresa: string;
    startDate: Date | null;
    endDate: Date | null;
    departamento: string;
    cargo: string;
    categoria: string;
  };
  setFiltros: React.Dispatch<
    React.SetStateAction<{
      empresa: string;
      departamento: string;
      cargo: string;
      categoria: string;
    }>
  >;
  botaoSelecionado: string;
  setBotaoSelecionado: (botao: string) => void;
  resetarFiltros: () => void;
  resetarBotoes: () => void;
  empresas: string[];
  departamentos: string[];
  cargos: string[];
  categorias: string[];
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (dateString: string | null) => void;
  onEndDateChange: (dateString: string | null) => void;
}

const Menu: React.FC<MenuProps> = ({
  filtros,
  setFiltros,
  botaoSelecionado,
  setBotaoSelecionado,
  resetarFiltros,
  resetarBotoes,
  empresas,
  departamentos,
  cargos,
  categorias,
  onStartDateChange,
  onEndDateChange,
  startDate,
  endDate,


}) => {
  const [isEmpresaOpen, setIsEmpresaOpen] = React.useState(false);
  const [empresaSearch, setIsEmpresaSearch] = React.useState("");

  const [isDepartamentoOpen, setIsDepartamentoOpen] = React.useState(false);
  const [departamentoSearch, setDepartamentoSearch] = React.useState("");

  const [isCargoOpen, setIsCargoOpen] = React.useState(false);
  const [cargoSearch, setCargoSearch] = React.useState("");

  const [isCategoriaOpen, setIsCategoriaOpen] = React.useState(false);
  const [categoriaSearch, setCategoriaSearch] = React.useState("");



  return (
    <div className="bg-gray-100 py-2 mb-6">
      <div className="px-6">
        {/* TOPO: Título, botões status e calendário */}
        <div className="flex flex-col md:flex-row md:items-center justify-between flex-wrap gap-4 mb-6">
          {/* ESQUERDA: Título + botões de status */}
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-2xl font-bold whitespace-nowrap">
              Painel Demográfico
            </h1>

            {/* Reset status */}
            <button
              onClick={resetarBotoes}
              className="flex items-center gap-2 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
              title="Redefinir status (Ativos, etc.)"
            >
              <RotateCcw size={18} />
              <span className="text-xs hidden sm:inline">Redefinir status</span>
            </button>

            <div className="w-px h-6 bg-gray-400 hidden md:block" />

            {/* Botões de status */}
            <div className="flex flex-wrap gap-2">
              {["Ativos", "Contratações", "Demissões", "Más Contratações"].map(
                (nome) => (
                  <button
                    key={nome}
                    onClick={() => setBotaoSelecionado(nome)}
                    className={`px-4 py-2 rounded border text-sm transition-all ${botaoSelecionado === nome
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-gray-50"
                      }`}
                  >
                    {nome}
                  </button>
                )
              )}
            </div>
          </div>

          {/* DIREITA: Calendário */}
          <div className="ml-auto">
            <Calendar
              onStartDateChange={onStartDateChange}
              onEndDateChange={onEndDateChange}
            />
          </div>
        </div>

        {/* SELECTS + BOTÃO RESET FILTROS */}
        <div className="flex flex-col md:flex-row md:items-center flex-wrap gap-4">
          {/* EMPRESA */}

          <div className="relative w-full md:w-[232px]">
            {/* Botão principal do dropdown */}
            <div
              onClick={() => setIsEmpresaOpen(!isEmpresaOpen)}
              className="flex justify-between items-center p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-50 transition"
            >
              <span className={filtros.empresa ? "text-black" : "text-gray-400"}>
                {filtros.empresa || "Selecione uma empresa"}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${isEmpresaOpen ? "rotate-180" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Dropdown de opções */}
            {isEmpresaOpen && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md overflow-hidden">
                {(!startDate || !endDate) ? (
                  // Se datas não estão selecionadas
                  <div className="px-4 py-8 text-center">
                    <svg className="mx-auto w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-500">Selecione as datas para</p>
                    <p className="text-sm text-gray-500">carregar as empresas</p>
                  </div>
                ) : (
                  <>
                    {/* Campo de busca */}
                    <div className="relative p-3 bg-gray-50 border-b border-gray-200">
                      <svg
                        className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                        />
                      </svg>
                      {/* Campo de busca com padding à esquerda */}
                      <input
                        type="text"
                        placeholder="Buscar empresa..."
                        value={empresaSearch}
                        onChange={(e) => setIsEmpresaSearch(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    {/* Lista de empresas */}
                    <div className="max-h-48 overflow-y-auto">
                      {empresas.filter(empresa =>
                        empresa.toLowerCase().includes(empresaSearch.toLowerCase())
                      ).length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <div className="relative mx-auto w-12 h-12 mb-3">
                            <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-8 h-0.5 bg-gray-300 rotate-45 rounded-full" />
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Nenhuma empresa encontrada</p>
                          <p className="text-xs text-gray-400">
                            {empresaSearch ? "Tente buscar por outro termo" : "Refine sua pesquisa"}
                          </p>
                        </div>
                      ) : (
                        empresas
                          .filter(empresa =>
                            empresa.toLowerCase().includes(empresaSearch.toLowerCase())
                          )
                          .map((empresa) => (
                            <div
                              key={empresa}
                              onClick={() => {
                                setFiltros((prev) => ({ ...prev, empresa }));
                                setIsEmpresaOpen(false);
                                setIsEmpresaSearch("");
                              }}
                              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 transition ${filtros.empresa === empresa ? "bg-gray-100 font-medium" : ""
                                }`}
                            >
                              {empresa}
                            </div>
                          ))
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          {/* DEPARTAMENTO */}
          <div className="relative w-full md:w-[232px]">
            <div onClick={() => setIsDepartamentoOpen(!isDepartamentoOpen)} className="flex justify-between items-center p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-50 transition">
              <span className={filtros.departamento ? "text-black" : "text-gray-400"}>
                {filtros.departamento || "Departamento"}
              </span>
              <svg className={`w-4 h-4 text-gray-500 transition-transform ${isDepartamentoOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {isDepartamentoOpen && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md overflow-hidden">
                {(!startDate || !endDate) ? (
                  <div className="px-4 py-8 text-center">
                    <svg className="mx-auto w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-500">Selecione as datas para</p>
                    <p className="text-sm text-gray-500">carregar os departamentos</p>
                  </div>
                ) : (
                  <>
                    <div className="relative p-3 bg-gray-50 border-b border-gray-200">
                      <svg className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Buscar departamento..."
                        value={departamentoSearch}
                        onChange={(e) => setDepartamentoSearch(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {departamentos.filter(departamento => departamento.toLowerCase().includes(departamentoSearch.toLowerCase())).length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <div className="relative mx-auto w-12 h-12 mb-3">
                            <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-8 h-0.5 bg-gray-300 rotate-45 rounded-full"></div>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Nenhum departamento encontrado</p>
                          <p className="text-xs text-gray-400">{departamentoSearch ? "Tente buscar por outro termo" : "Refine sua pesquisa"}</p>
                        </div>
                      ) : (
                        departamentos.filter(departamento => departamento.toLowerCase().includes(departamentoSearch.toLowerCase())).map((departamento) => (
                          <div
                            key={departamento}
                            onClick={() => {
                              setFiltros((prev) => ({ ...prev, departamento }));
                              setIsDepartamentoOpen(false);
                              setDepartamentoSearch("");
                            }}
                            className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 transition ${filtros.departamento === departamento ? "bg-gray-100 font-medium" : ""}`}
                          >
                            {departamento}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* CARGO */}
          <div className="relative w-full md:w-[232px]">
            <div onClick={() => setIsCargoOpen(!isCargoOpen)} className="flex justify-between items-center p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-50 transition">
              <span className={filtros.cargo ? "text-black" : "text-gray-400"}>
                {filtros.cargo || "Selecione um cargo"}
              </span>
              <svg className={`w-4 h-4 text-gray-500 transition-transform ${isCargoOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {isCargoOpen && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md overflow-hidden">
                {(!startDate || !endDate) ? (
                  <div className="px-4 py-8 text-center">
                    <svg className="mx-auto w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-500">Selecione as datas para</p>
                    <p className="text-sm text-gray-500">carregar os cargos</p>
                  </div>
                ) : (
                  <>
                    <div className="relative p-3 bg-gray-50 border-b border-gray-200">
                      <svg className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Buscar cargo..."
                        value={cargoSearch}
                        onChange={(e) => setCargoSearch(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {cargos.filter(cargo => cargo.toLowerCase().includes(cargoSearch.toLowerCase())).length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <p className="text-sm font-medium text-gray-600 mb-1">Nenhum cargo encontrado</p>
                          <p className="text-xs text-gray-400">{cargoSearch ? "Tente buscar por outro termo" : "Refine sua pesquisa"}</p>
                        </div>
                      ) : (
                        cargos.filter(cargo => cargo.toLowerCase().includes(cargoSearch.toLowerCase())).map((cargo) => (
                          <div
                            key={cargo}
                            onClick={() => {
                              setFiltros((prev) => ({ ...prev, cargo }));
                              setIsCargoOpen(false);
                              setCargoSearch("");
                            }}
                            className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 transition ${filtros.cargo === cargo ? "bg-gray-100 font-medium" : ""}`}
                          >
                            {cargo}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          {/* CATEGORIA */}
          <div className="relative w-full md:w-[232px]">
            <div onClick={() => setIsCategoriaOpen(!isCategoriaOpen)} className="flex justify-between items-center p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-50 transition">
              <span className={filtros.categoria ? "text-black" : "text-gray-400"}>
                {filtros.categoria || "Selecione uma categoria"}
              </span>
              <svg className={`w-4 h-4 text-gray-500 transition-transform ${isCategoriaOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {isCategoriaOpen && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md overflow-hidden">
                {(!startDate || !endDate) ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-gray-500">Selecione as datas para</p>
                    <p className="text-sm text-gray-500">carregar as categorias</p>
                  </div>
                ) : (
                  <>
                    <div className="relative p-3 bg-gray-50 border-b border-gray-200">
                      <svg className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Buscar categoria..."
                        value={categoriaSearch}
                        onChange={(e) => setCategoriaSearch(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {categorias.filter(categoria => categoria.toLowerCase().includes(categoriaSearch.toLowerCase())).length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <p className="text-sm font-medium text-gray-600 mb-1">Nenhuma categoria encontrada</p>
                          <p className="text-xs text-gray-400">{categoriaSearch ? "Tente buscar por outro termo" : "Refine sua pesquisa"}</p>
                        </div>
                      ) : (
                        categorias.filter(categoria => categoria.toLowerCase().includes(categoriaSearch.toLowerCase())).map((categoria) => (
                          <div
                            key={categoria}
                            onClick={() => {
                              setFiltros((prev) => ({ ...prev, categoria }));
                              setIsCategoriaOpen(false);
                              setCategoriaSearch("");
                            }}
                            className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 transition ${filtros.categoria === categoria ? "bg-gray-100 font-medium" : ""}`}
                          >
                            {categoria}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* RESET FILTROS (na mesma linha dos selects) */}
          <button
            onClick={resetarFiltros}
            className="flex items-center gap-2 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
            title="Resetar filtros (empresa, cargo, etc.)"
          >
            <RotateCcw size={18} />
            <span className="text-xs hidden sm:inline">Redefinir Filtros</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Menu);
