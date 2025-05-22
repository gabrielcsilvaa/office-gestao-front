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
      {/*------------------------------------------------------- Título e botões---------------------------------- */}

      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Dashboard Demográfico</h1>

        {/* ------------------------------Priemeiro botão--------------------------------; */}
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

      {/* ---------------------------------------------------------------------Filtros -----------------------------------------------*/}

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

      {/* ---------------------------------------cards---------------------------------------------- */}

      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded border-l-4 border-red-500 shadow-sm">
          <div className="text-2xl font-bold text-black-500">53,7%</div>
          <div className="text-sm text-gray-500">Turnover</div>
        </div>

        <div className="bg-white p-4 rounded border-l-4 border-green-500 shadow-sm">
          <div className="text-2xl font-bold text-black-500">2.919</div>
          <div className="text-sm text-gray-500">Ativos</div>
        </div>

        <div className="bg-white p-4 rounded border-l-4 border-green-500 shadow-sm">
          <div className="text-2xl font-bold text-black-500">1.741</div>
          <div className="text-sm text-gray-500">Contratações</div>
        </div>

        <div className="bg-white p-4 rounded border-l-4 border-red-500 shadow-sm">
          <div className="text-2xl font-bold text-black-500">1.456</div>
          <div className="text-sm text-gray-500">Demissões</div>
        </div>

        <div className="bg-white p-4 rounded border-l-4 border-red-500 shadow-sm">
          <div className="text-2xl font-bold text-black-700">1.777</div>
          <div className="text-sm text-gray-500">Períodos de Afastamento</div>
        </div>
      </div>

      {/* ---------------------------------grafico de linha----------------------------- */}
      <GraficoLinha></GraficoLinha>

      {/* --------------------------------graficos de colaboradores ---------------------------------- */}

      <GraficosGenero></GraficosGenero>

      <GraficoFaixaEtaria></GraficoFaixaEtaria>

      <GraficoCategoria></GraficoCategoria>

      <GraficoEscolaridade></GraficoEscolaridade>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          Colaboradores por Gênero
        </div>
        <div className="bg-white p-4 rounded shadow">
          Colaboradores por Faixa Etária
        </div>
        <div className="bg-white p-4 rounded shadow">
          Colaboradores por Categoria
        </div>
        <div className="bg-white p-4 rounded shadow">
          Colaboradores por Escolaridade
        </div>
      </div>
    </div>
  );
}


// -------------------------------------------------tabelas------------------------------------------------