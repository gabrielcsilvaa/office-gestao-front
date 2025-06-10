"use client";
import { useState } from "react";
import GraficoLinha from "./components/grafico_linha";
import GraficosGenero from "./components/grafico_genero";
import GraficoFaixaEtaria from "./components/grafico_faixa_etaria";
import GraficoCategoria from "./components/grafico_categoria";
import  GraficoEscolaridade  from "./components/grafico_escolaridade";
import GraficoCargo from "./components/grafico_cargo";
import TabelaColaboradores from "./components/tabela_colaboradores";
import { RotateCcw } from "lucide-react";

export default function Demografico() {
  const [botaoSelecionado, setBotaoSelecionado] = useState("");
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
    // Container principal da página.
    <div className="bg-gray-100 h-full p-4 overflow-y-auto">

      {/* Seção do Cabeçalho e Filtros */}
      <div className="bg-gray-100 py-2 mb-6">
        <div className="px-6"> {/* Wrapper interno para o conteúdo do cabeçalho */}
          {/* Título e Botões agrupados à esquerda */}
          <div className="flex flex-col md:flex-row md:items-center flex-wrap gap-4 mb-6 ">            
            <h1 className="text-2xl font-bold whitespace-nowrap ">Dashboard Demográfico</h1>
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
                    className={`px-4 py-2 rounded border text-sm transition-all ${
                      botaoSelecionado === nome
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-gray-50"
                    }`}
                  >
                    {nome}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-col md:flex-row md:items-center flex-wrap gap-4">
            <select
              className="w-full md:w-[232px] p-2 border rounded text-black-700 bg-white"
              value={filtros.centroCusto}
              onChange={(e) =>
                setFiltros((prev) => ({ ...prev, centroCusto: e.target.value }))
              }
            >
              <option value="" disabled hidden>Centro de Custo</option>
              <option value="1">Opção 1</option>
              <option value="2">Opção 2</option>
            </select>
            <select
              className="w-full md:w-[232px] p-2 border rounded text-black-700 bg-white"
              value={filtros.departamento}
              onChange={(e) =>
                setFiltros((prev) => ({ ...prev, departamento: e.target.value }))
              }
            >
              <option value="" disabled hidden>Departamento</option>
              <option value="1">Opção 1</option>
              <option value="2">Opção 2</option>
            </select>
            <select
              className="w-full md:w-[232px] p-2 border rounded text-black-700 bg-white"
              value={filtros.tipoColaborador}
              onChange={(e) =>
                setFiltros((prev) => ({ ...prev, tipoColaborador: e.target.value }))
              }
            >
              <option value="" disabled hidden>Colaborador/Diretor/Autônomo</option>
              <option value="1">Opção 1</option>
              <option value="2">Opção 2</option>
            </select>
            <select
              className="w-full md:w-[232px] p-2 border rounded text-black-700 bg-white"
              value={filtros.servico}
              onChange={(e) =>
                setFiltros((prev) => ({ ...prev, servico: e.target.value }))
              }
            >
              <option value="" disabled hidden>Serviço</option>
              <option value="1">Opção 1</option>
              <option value="2">Opção 2</option>
            </select>
          </div>
        </div> {/* Fim do wrapper interno `px-6` */}
      </div> {/* Fim da Seção do Cabeçalho e Filtros */}

              
      <div className="h-px bg-gray-300 my-6"></div>

      {/* Linha com cards e gráficos laterais */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Cards + Gráfico de Linha */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
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
                <div className="text-sm text-gray-500">Períodos de Afastamento</div>
              </div>
            </div>

            {/* Gráfico de linha */}
            <div className="flex-1 min-h-[300px] md:min-h-[300px]  bg-white rounded shadow">
              <GraficoLinha />
            </div>
          </div>
        </div>

        {/* Gráficos de colaboradores */}
        <div className="w-full  lg:w-1/2">
          <div className="bg-gray-100    h-full  ">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
              <div className="aspect-square w-full h-[300px]">
                <GraficosGenero />
              </div>
              <div className="aspect-square w-full h-[300px]">
                <GraficoFaixaEtaria />
              </div>
              <div className="aspect-square w-full h-[300px]">
                <GraficoCategoria />
              </div>
              <div className="aspect-square w-full h-[300px]">
                <GraficoEscolaridade />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Parte inferior: Tabela e gráfico de cargos */}
      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <div className="w-full lg:w-1/2  bg-white rounded shadow">
          <TabelaColaboradores />
        </div>
        <div className="w-full lg:w-1/2  bg-white rounded shadow">
          <GraficoCargo />
        </div>
      </div> 
    </div>
  );
}