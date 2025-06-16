"use client";
import { useState, useEffect } from "react";
import GraficoLinha from "./components/grafico_linha";
import GraficoGenero from "./components/grafico_genero";
import GraficoFaixaEtaria from "./components/grafico_faixa_etaria";
import GraficoCategoria from "./components/grafico_categoria";
import GraficoEscolaridade from "./components/grafico_escolaridade";
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

  const [dadosDemograficos, setDadosDemograficos] = useState([]);
  const [dadosFaixaEtaria, setDadosFaixaEtaria] = useState([]);

  const [percentualMasculino, setPercentualMasculino] = useState(0);
  const [percentualFeminino, setPercentualFeminino] = useState(0);

  const [dadosCargo, setDadosCargo] = useState([]);

  interface DadosLinha {
    month: string;
    Ativos: number;
    Contratações: number;
    Demissões: number;
  }

  const [dadosEmpresas, setDadosEmpresas] = useState<DadosLinha[]>([]);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const response = await fetch("/api/dashboards-demografico", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            start_date: "2024-01-01",
            end_date: "2024-12-31",
          }),
        });

        if (!response.ok) {
          throw new Error("Erro na requisição: " + response.statusText);
        }

        const resultado = await response.json();
        console.log("Dados recebidos:", resultado);

        const funcionarios = resultado.dados.flatMap(
          (empresa) => empresa.funcionarios || []
        );

        const startDate = new Date("2024-01-01");
        const endDate = new Date("2024-12-31");
        const monthlyDataMap = new Map<
          string,
          { Ativos: number; Contratações: number; Demissões: number }
        >();

        // Inicializa o mapa com todos os meses do ano (formato 'Jan/24', 'Fev/24', etc.)
        const monthsInOrder: string[] = [];
        for (
          let d = new Date(startDate);
          d <= endDate;
          d.setMonth(d.getMonth() + 1)
        ) {
          const monthKey = `${d.toLocaleString("pt-BR", { month: "short" }).replace(".", "")}/${d.getFullYear().toString().slice(-2)}`;
          monthlyDataMap.set(monthKey, {
            Ativos: 0,
            Contratações: 0,
            Demissões: 0,
          });
          monthsInOrder.push(monthKey);
        }

        // Processa as contratações e demissões
        for (const funcionario of funcionarios) {
          if (funcionario.admissao) {
            const admissaoDate = new Date(funcionario.admissao);
            // Certifique-se que a data está dentro do período de interesse
            if (admissaoDate >= startDate && admissaoDate <= endDate) {
              const monthKey = `${admissaoDate.toLocaleString("pt-BR", { month: "short" }).replace(".", "")}/${admissaoDate.getFullYear().toString().slice(-2)}`;
              const data = monthlyDataMap.get(monthKey);
              if (data) {
                data.Contratações++;
              }
            }
          }
          if (funcionario.demissao) {
            const demissaoDate = new Date(funcionario.demissao);
            // Certifique-se que a data está dentro do período de interesse
            if (demissaoDate >= startDate && demissaoDate <= endDate) {
              const monthKey = `${demissaoDate.toLocaleString("pt-BR", { month: "short" }).replace(".", "")}/${demissaoDate.getFullYear().toString().slice(-2)}`;
              const data = monthlyDataMap.get(monthKey);
              if (data) {
                data.Demissões++;
              }
            }
          }
        }

        // Calcula Ativos mensalmente
        // Iterar sobre os meses em ordem para calcular os ativos corretamente
        for (const monthKey of monthsInOrder) {
          const currentMonthDate = new Date(
            parseInt(`20${monthKey.split("/")[1]}`),
            new Date(
              Date.parse(monthKey.split("/")[0] + " 1, 2000")
            ).getMonth(),
            1
          );
          const nextMonthDate = new Date(
            currentMonthDate.getFullYear(),
            currentMonthDate.getMonth() + 1,
            1
          ); // Start of next month

          let activeForThisMonth = 0;
          for (const funcionario of funcionarios) {
            const admissaoDate = new Date(funcionario.admissao);
            const demissaoDate = funcionario.demissao
              ? new Date(funcionario.demissao)
              : null;

            // Um funcionário está ativo se ele foi admitido até o final do mês atual E
            // não foi demitido, OU foi demitido após o final do mês atual
            const hiredByEndOfMonth = admissaoDate < nextMonthDate; // Admissão antes do início do próximo mês
            const notTerminatedByEndOfMonth =
              !demissaoDate || demissaoDate >= nextMonthDate; // Demissão no próximo mês ou depois, ou sem demissão

            if (hiredByEndOfMonth && notTerminatedByEndOfMonth) {
              activeForThisMonth++;
            }
          }
          const data = monthlyDataMap.get(monthKey);
          if (data) {
            data.Ativos = activeForThisMonth;
          }
        }

        // Converte o mapa para um array de objetos no formato esperado pelo Recharts
        const dadosParaGraficoLinha: DadosLinha[] = monthsInOrder.map(
          (monthKey) => ({
            month: monthKey,
            Ativos: monthlyDataMap.get(monthKey)?.Ativos || 0,
            Contratações: monthlyDataMap.get(monthKey)?.Contratações || 0,
            Demissões: monthlyDataMap.get(monthKey)?.Demissões || 0,
          })
        );

        setDadosEmpresas(dadosParaGraficoLinha);

        // Gênero
        const total = funcionarios.length;
        const totalMasculino = funcionarios.filter(
          (f) => f.sexo === "M"
        ).length;
        const totalFeminino = funcionarios.filter((f) => f.sexo === "F").length;

        const percMasculino = total ? (totalMasculino / total) * 100 : 0;
        const percFeminino = total ? (totalFeminino / total) * 100 : 0;

        setPercentualMasculino(percMasculino);
        setPercentualFeminino(percFeminino);

        // Escolaridade
        const escolaridadeMap = new Map<string, number>();
        for (const funcionario of funcionarios) {
          const esc = funcionario.escolaridade || "Não informado";
          escolaridadeMap.set(esc, (escolaridadeMap.get(esc) || 0) + 1);
        }

        const dadosEscolaridade = Array.from(escolaridadeMap.entries()).map(
          ([escolaridade, total]) => ({
            escolaridade,
            total,
          })
        );
        setDadosDemograficos(dadosEscolaridade);

        // Cargo
        const cargoMap = new Map<string, number>();
        for (const funcionario of funcionarios) {
          const cargo = funcionario.cargo || "Não informado";
          cargoMap.set(cargo, (cargoMap.get(cargo) || 0) + 1);
        }

        const dadosCargo = Array.from(cargoMap.entries()).map(
          ([cargo, total]) => ({
            cargo,
            total,
          })
        );

        setDadosCargo(dadosCargo);
        // Faixa Etária
        const getFaixaEtaria = (idade: number) => {
          if (idade <= 25) return "00 a 25";
          if (idade <= 35) return "26 a 35";
          if (idade <= 45) return "36 a 45";
          if (idade <= 55) return "46 a 55";
          return "55+";
        };

        const calcularIdade = (dataNascimento: string) => {
          const hoje = new Date();
          const nascimento = new Date(dataNascimento);
          let idade = hoje.getFullYear() - nascimento.getFullYear();
          const mes = hoje.getMonth() - nascimento.getMonth();
          if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
          }
          return idade;
        };

        const faixaEtariaMap = new Map<string, number>();
        for (const funcionario of funcionarios) {
          const dataNascimento = funcionario.data_nascimento;
          if (dataNascimento) {
            const idade = calcularIdade(dataNascimento);
            const faixa = getFaixaEtaria(idade);
            faixaEtariaMap.set(faixa, (faixaEtariaMap.get(faixa) || 0) + 1);
          }
        }

        const dadosFaixa = Array.from(faixaEtariaMap.entries()).map(
          ([name, colaboradores]) => ({ name, colaboradores })
        );
        setDadosFaixaEtaria(dadosFaixa);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchDados();
  }, []);

  return (
    <div className="bg-gray-100 h-full p-4 overflow-y-auto">
      {/* Cabeçalho e Filtros */}
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
                {[
                  "Ativos",
                  "Contratações",
                  "Demissões",
                  "Más Contratações",
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
        </div>
      </div>

      <div className="h-px bg-gray-300 my-6"></div>

      {/* Gráficos principais */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="space-y-4">
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

            <div className="flex-1 min-h-[300px] md:min-h-[300px] bg-white rounded shadow">
              <GraficoLinha dados={dadosEmpresas} />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="bg-gray-100 h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="aspect-square w-full h-[300px]">
                <GraficoGenero
                  masculinoPercentual={percentualMasculino}
                  femininoPercentual={percentualFeminino}
                />
              </div>
              <div className="aspect-square w-full h-[300px]">
                <GraficoFaixaEtaria dados={dadosFaixaEtaria} />
              </div>
              <div className="aspect-square w-full h-[300px]">
                <GraficoCategoria />
              </div>
              <div className="aspect-square w-full h-[300px]">
                <GraficoEscolaridade dados={dadosDemograficos} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Parte inferior: tabela e gráfico de cargo */}
      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <div className="w-full lg:w-1/2 bg-white rounded shadow">
          <TabelaColaboradores />
        </div>
        <div className="w-full lg:w-1/2 bg-white rounded shadow">
          <GraficoCargo dados={dadosCargo} />
        </div>
      </div>
    </div>
  );
}
