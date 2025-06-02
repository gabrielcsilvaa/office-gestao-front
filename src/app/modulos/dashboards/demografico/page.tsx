"use client";
import { useState } from "react";
import GraficoLinha from "./components/grafico_linha";
import GraficosGenero from "./components/grafico_genero";
import GraficoFaixaEtaria from "./components/grafico_faixa_etaria";
import GraficoCategoria from "./components/grafico_categoria";
import { GraficoEscolaridade } from "./components/grafico_escolaridade";
import GraficoCargo from "./components/grafico_cargo";
import TabelaColaboradores from "./components/tabela_colaboradores";
import { RotateCcw } from "lucide-react";

export default function Demografico() {
  const [botaoSelecionado, setBotaoSelecionado] = useState("Ativos");
  const [filtros, setFiltros] = useState({
    centroCusto: "",
    departamento: "",
    tipoColaborador: "",
    servico: "",
  });

  const resetarFiltros = () => {
    setBotaoSelecionado("");
    setFiltros({
      centroCusto: "",
      departamento: "",
      tipoColaborador: "",
      servico: "",
    });
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Título e Botões agrupados à esquerda */}
      <div className="flex flex-col md:flex-row md:items-center flex-wrap gap-4 mb-6"> {/* Removido md:justify-between, adicionado flex-wrap e gap-4 geral */}
        <h1 className="text-2xl font-bold whitespace-nowrap">Dashboard Demográfico</h1>

        {/* Container para todos os botões e a linha vertical */}
        <div className="flex items-center flex-wrap gap-x-4 gap-y-2"> {/* gap-y-2 para quando os itens quebram linha */}
          {/* Botão de reset */}
          <button
            onClick={resetarFiltros}
            className="flex items-center gap-2 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
            title="Resetar filtros"
          >
            <RotateCcw size={18} />
          </button>

          {/* Linha vertical (visível em telas md ou maiores) */}
          <div className="w-px h-6 bg-gray-400 hidden md:block" />

          

          {/* Botões de status */}
          <div className="flex flex-wrap  gap-2">
            {[
              "Ativos",
              "Contratações",
              "Demissões",
              "Más Contratações",
              "Afastamentos",
              "Em Férias",
            ].map((nome) => (
              <button
                key={nome}
                onClick={() => setBotaoSelecionado(nome)}
                className={`px-4 py-2 rounded  border text-sm   transition-all ${
                  botaoSelecionado === nome
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {nome}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center flex-wrap gap-4 mb-6">
        
        <select
          className="w-[232px]  p-2 border rounded text-black-700"
          value={filtros.centroCusto}
          onChange={(e) =>
            setFiltros((prev) => ({ ...prev, centroCusto: e.target.value }))
          }
        >
          <option value="" disabled hidden>
            Centro de Custo
          </option>
          <option value="1">Opção 1</option>
          <option value="2">Opção 2</option>
        </select>

        <select
          className="w-[232px] p-2 border rounded text-gray-700"
          value={filtros.departamento}
          onChange={(e) =>
            setFiltros((prev) => ({ ...prev, departamento: e.target.value }))
          }
        >
          <option value="" disabled hidden>
            Departamento
          </option>
          <option value="1">Opção 1</option>
          <option value="2">Opção 2</option>
        </select>

        <select
          className="w-[232px] p-2 border rounded text-gray-700"
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
          className="w-[232px] p-2 border rounded text-gray-700"
          value={filtros.servico}
          onChange={(e) =>
            setFiltros((prev) => ({ ...prev, servico: e.target.value }))
          }
        >
          <option value="" disabled hidden>
            Serviço
          </option>
          <option value="1">Opção 1</option>
          <option value="2">Opção 2</option>
        </select>
        
      </div>

      {/* Linha com cards e gráficos laterais */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Cards + Gráfico de Linha */}
        <div className="w-full lg:w-1/2 flex flex-col h-full gap-4">
          <div className="space-y-4">
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded border-l-4 border-red-500 shadow-sm">
                <div className="text-2xl font-bold text-black">53,7%</div>
                <div className="text-sm text-gray-500">Turnover</div>
              </div>
              <div className="bg-white p-4 rounded border-l-4 border-green-500 shadow-sm">
                <div className="text-2xl font-bold text-black">2.919</div>
                <div className="text-sm text-gray-500">Ativos</div>
              </div>
              <div className="bg-white p-4 rounded border-l-4 border-green-500 shadow-sm">
                <div className="text-2xl font-bold text-black">1.741</div>
                <div className="text-sm text-gray-500">Contratações</div>
              </div>
              <div className="bg-white p-4 rounded border-l-4 border-red-500 shadow-sm">
                <div className="text-2xl font-bold text-black">1.456</div>
                <div className="text-sm text-gray-500">Demissões</div>
              </div>
              <div className="bg-white p-4 rounded border-l-4 border-red-500 shadow-sm">
                <div className="text-2xl font-bold text-black">1.777</div>
                <div className="text-sm text-gray-500">
                  Períodos de Afastamento
                </div>
              </div>
            </div>

            {/* Gráfico de linha */}
            <div className="flex-1 min-h-[600px]">
              <GraficoLinha />
            </div>
          </div>
        </div>

        {/* Gráficos de colaboradores */}
        <div className="w-full h-[655px] lg:w-1/2">
          <div className="bg-white rounded shadow p-4 h-full">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square w-full h-[300px] border border-gray-300 rounded">
                <GraficosGenero />
              </div>
              <div className="aspect-square w-full h-[300px] border border-gray-300 rounded">
                <GraficoFaixaEtaria />
              </div>
              <div className="aspect-square w-full h-[300px] border border-gray-300 rounded">
                <GraficoCategoria />
              </div>
              <div className="aspect-square w-full h-[300px] border border-gray-300 rounded">
                <GraficoEscolaridade />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Parte inferior: Tabela e gráfico de cargos */}
      <div className="flex flex-col lg:flex-row gap-4 mt-1">
        <div className="w-full lg:w-1/2 p-4 bg-white rounded shadow">
          <TabelaColaboradores />
        </div>
        <div className="w-full lg:w-1/2 p-4 bg-white rounded shadow">
          <GraficoCargo />
        </div>
      </div>
    </div>
  );
}





