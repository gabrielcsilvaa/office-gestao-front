"use client";
import { useState } from "react";
import GraficoLinha from "./components/grafico_linha";
import GraficosGenero from "./components/grafico_genero";
import GraficoFaixaEtaria from "./components/grafico_faixa_etaria";
import GraficoCategoria from "./components/grafico_categoria";
import { GraficoEscolaridade } from "./components/grafico_escolaridade";

export default function Demografico() {
  const [botaoSelecionado, setBotaoSelecionado] = useState("Ativos");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Título e botões */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Dashboard Demográfico</h1>
        <div className="flex gap-2 flex-wrap">
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
              className={`px-4 py-2 rounded transition-all ${
                botaoSelecionado === nome
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {nome}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <select className="w-full p-2 border rounded text-gray-700">
          <option disabled selected hidden>
            Centro de Custo
          </option>
          <option value="1">Opção 1</option>
          <option value="2">Opção 2</option>
        </select>

        <select className="w-full p-2 border rounded text-gray-700">
          <option disabled selected hidden>
            Departamento
          </option>
          <option value="1">Opção 1</option>
          <option value="2">Opção 2</option>
        </select>

        <select className="w-full p-2 border rounded text-gray-700">
          <option disabled selected hidden>
            Colaborador/Diretor/Autônomo
          </option>
          <option value="1">Opção 1</option>
          <option value="2">Opção 2</option>
        </select>

        <select className="w-full p-2 border rounded text-gray-700">
          <option disabled selected hidden>
            Serviço
          </option>
          <option value="1">Opção 1</option>
          <option value="2">Opção 2</option>
        </select>
      </div>

{/* Gráfico de linha com gráficos de colaboradores agrupados à direita */}
<div className="flex flex-col lg:flex-row gap-4 mt-6">
  {/* Bloco com cards + gráfico de linha */}
  <div className="w-full lg:w-2/3 flex flex-col gap-4">
    {/* Cards de indicadores */}
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
        <div className="text-sm text-gray-500">Períodos de Afastamento</div>
      </div>
    </div>

    {/* Gráfico de linha */}
    <div className="bg-white p-4 rounded shadow">
      <GraficoLinha />
    </div>
  </div>

 {/* Gráficos de colaboradores agrupados em 2x2 no mesmo card à direita */}
<div className="w-full lg:w-1/3">
  <div className="bg-white p-4 rounded shadow">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <GraficosGenero />
      </div>
      <div>
        <GraficoFaixaEtaria />
      </div>
      <div>
        <GraficoCategoria />
      </div>
      <div>
        <GraficoEscolaridade />
      </div>
    </div>
  </div>
  </div>
</div>
</div>

   );
}



    
  
