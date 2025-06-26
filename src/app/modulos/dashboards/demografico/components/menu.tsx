"use client";

import { RotateCcw } from "lucide-react";
import React from "react";

interface MenuProps {
  filtros: {
    empresa: string;
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
  cardsData: {
    ativos: number;
    contratacoes: number;
    demissoes: number;
    afastamentos: number;
    turnover: string;
  };
  empresas: string[];
  departamentos: string[];
  cargos: string[];
  categorias: string[];
}

const Menu: React.FC<MenuProps> = ({
  filtros,
  setFiltros,
  botaoSelecionado,
  setBotaoSelecionado,
  resetarFiltros,
  empresas,
  departamentos,
  cargos,
  categorias,
}) => {
  console.log("Menu renderizou");

  return (
    <div className="bg-gray-100 py-2 mb-6">
      <div className="px-6">
        <div className="flex flex-col md:flex-row md:items-center flex-wrap gap-4 mb-6">
          <h1 className="text-2xl font-bold whitespace-nowrap">
            Dashboard Demográfico
          </h1>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
            <button
              onClick={resetarFiltros}
              className="flex items-center gap-2 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
              title="Resetar filtros"
            >
              <RotateCcw size={18} />
            </button>
            <div className="w-px h-6 bg-gray-400 hidden md:block" />
            <div className="flex flex-wrap gap-2">
              {["Ativos", "Contratações", "Demissões", "Más Contratações"].map(
                (nome) => (
                  <button
                    key={nome}
                    onClick={() => setBotaoSelecionado(nome)}
                    className={`px-4 py-2 rounded border text-sm transition-all ${
                      botaoSelecionado === nome
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
        </div>

        <div className="flex flex-col md:flex-row md:items-center flex-wrap gap-4">
          {/* EMPRESA */}
          <select
            className="w-full md:w-[232px] p-2 border rounded text-black-700 bg-white"
            value={filtros.empresa}
            onChange={(e) =>
              setFiltros((prev) => ({
                ...prev,
                empresa: e.target.value,
              }))
            }
          >
            <option value="" disabled hidden>
              Empresa
            </option>
            {empresas.map((empresa) => (
              <option key={empresa} value={empresa}>
                {empresa}
              </option>
            ))}
          </select>

          {/* DEPARTAMENTO */}
          <select
            className="w-full md:w-[232px] p-2 border rounded text-black-700 bg-white"
            value={filtros.departamento}
            onChange={(e) =>
              setFiltros((prev) => ({
                ...prev,
                departamento: e.target.value,
              }))
            }
          >
            <option value="" disabled hidden>
              Departamento
            </option>
            {departamentos.map((departamento) => (
              <option key={departamento} value={departamento}>
                {departamento}
              </option>
            ))}
          </select>

          {/* CARGO */}
          <select
            className="w-full md:w-[232px] p-2 border rounded text-black-700 bg-white"
            value={filtros.cargo}
            onChange={(e) =>
              setFiltros((prev) => ({
                ...prev,
                cargo: e.target.value,
              }))
            }
          >
            <option value="" disabled hidden>
              Cargo
            </option>
            {cargos.map((cargo) => (
              <option key={cargo} value={cargo}>
                {cargo}
              </option>
            ))}
          </select>

          {/* CATEGORIA */}
          <select
            className="w-full md:w-[232px] p-2 border rounded text-black-700 bg-white"
            value={filtros.categoria}
            onChange={(e) =>
              setFiltros((prev) => ({
                ...prev,
                categoria: e.target.value,
              }))
            }
          >
            <option value="" disabled hidden>
              Categoria
            </option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Menu);
