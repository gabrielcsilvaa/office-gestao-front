"use client";

import { RotateCcw } from "lucide-react";
import React from "react";

interface MenuProps {
  filtros: {
    centroCusto: string;
    departamento: string;
    tipoColaborador: string;
    servico: string;
  };
  setFiltros: React.Dispatch<
    React.SetStateAction<{
      centroCusto: string;
      departamento: string;
      tipoColaborador: string;
      servico: string;
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
}

const Menu: React.FC<MenuProps> = ({
  filtros,
  setFiltros,
  botaoSelecionado,
  setBotaoSelecionado,
  resetarFiltros,

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
            {/* Dados exibidos abaixo dos botões */}
            {/* <div className="mt-4">
              {botaoSelecionado === "Ativos" && (
                <span className="text-xl font-semibold">
                  Ativos: {cardsData.ativos}
                </span>
              )}
              {botaoSelecionado === "Contratações" && (
                <span className="text-xl font-semibold">
                  Contratações: {cardsData.contratacoes}
                </span>
              )}
              {botaoSelecionado === "Demissões" && (
                <span className="text-xl font-semibold">
                  Demissões: {cardsData.demissoes}
                </span>
              )}
              {botaoSelecionado === "Más Contratações" && (
                <span className="text-xl font-semibold">
                  Turnover: {cardsData.turnover}
                </span>
              )}
            </div> */}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center flex-wrap gap-4">
          <select
            className="w-full md:w-[232px] p-2 border rounded text-black-700 bg-white"
            value={filtros.centroCusto}
            onChange={(e) =>
              setFiltros((prev) => ({
                ...prev,
                centroCusto: e.target.value,
              }))
            }
          >
            <option value="" disabled hidden>
              Centro de Custo
            </option>
            <option value="1">Opção 1</option>
            <option value="2">Opção 2</option>
          </select>

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
            <option value="1">Opção 1</option>
            <option value="2">Opção 2</option>
          </select>

          <select
            className="w-full md:w-[232px] p-2 border rounded text-black-700 bg-white"
            value={filtros.tipoColaborador}
            onChange={(e) =>
              setFiltros((prev) => ({
                ...prev,
                tipoColaborador: e.target.value,
              }))
            }
          >
            <option value="" disabled hidden>
              Colaborador/Diretor/Autônomo
            </option>
            <option value="1">Opção 1</option>
            <option value="2">Opção 2</option>
          </select>

          <select
            className="w-full md:w-[232px] p-2 border rounded text-black-700 bg-white"
            value={filtros.servico}
            onChange={(e) =>
              setFiltros((prev) => ({
                ...prev,
                servico: e.target.value,
              }))
            }
          >
            <option value="" disabled hidden>
              Serviço
            </option>
            <option value="1">Opção 1</option>
            <option value="2">Opção 2</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Menu);
