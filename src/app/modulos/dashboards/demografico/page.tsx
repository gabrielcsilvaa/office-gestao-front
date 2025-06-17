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

  const [cardsData, setCardsData] = useState({
    ativos: 0,
    contratacoes: 0,
    demissoes: 0,
    afastamentos: 0,
    turnover: "0.0",
  });

  interface DadosLinha {
    month: string;
    Ativos: number;
    Contratações: number;
    Demissões: number;
  }

  const [dadosEmpresas, setDadosEmpresas] = useState<DadosLinha[]>([]);
  const [dadosCategoria, setDadosCategoria] = useState([]);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        // --- 1. Definir as datas de início e fim dinamicamente ---
        const today = new Date();
        const currentYear = today.getFullYear();
        // start_date será 01 de janeiro do ano atual
        const startDate = new Date(currentYear, 0, 1); // Mês 0 é Janeiro
        // end_date será o dia atual
        const endDate = today;

        // Formatar as datas para o formato "YYYY-MM-DD" para a API
        const formatApiDate = (date: Date) => date.toISOString().split("T")[0];

        const apiStartDate = formatApiDate(startDate);
        const apiEndDate = formatApiDate(endDate);

        const response = await fetch("/api/dashboards-demografico", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            start_date: apiStartDate, // Usar a data de início dinâmica
            end_date: apiEndDate, // Usar a data de fim dinâmica (hoje)
          }),
        });

        if (!response.ok) {
          throw new Error("Erro na requisição: " + response.statusText);
        }

        const resultado = await response.json();
        console.log("Dados recebidos:", resultado);

        // Contar colaboradores por categoria
        const categoriaContagem: { [key: string]: number } = {};

        resultado.dados.forEach((empresa: any) => {
          empresa.funcionarios.forEach((funcionario: any) => {
            const categoria = funcionario.categoria || "Não Informado";
            categoriaContagem[categoria] =
              (categoriaContagem[categoria] || 0) + 1;
          });
        });

        // Transformar em array para o gráfico
        const dadosCategoria = Object.entries(categoriaContagem).map(
          ([categoria, total]) => ({
            name: categoria,
            colaboradores: total,
          })
        );

        setDadosCategoria(dadosCategoria);

        const empresas = resultado.dados || [];

        let ativos = 0;
        let contratacoes = 0;
        let demissoes = 0;
        let afastamentos = 0;

        empresas.forEach((empresa: any) => {
          empresa.funcionarios.forEach((func: any) => {
            const admissao = new Date(func.admissao);
            const demissao = func.demissao ? new Date(func.demissao) : null;

            // Ativos
            if (!demissao) ativos++;

            // Contratações no período
            if (admissao >= startDate && admissao <= endDate) {
              contratacoes++;
            }

            // Demissões no período
            if (demissao && demissao >= startDate && demissao <= endDate) {
              demissoes++;
            }

            // Afastamentos no período
            if (func.afastamentos && Array.isArray(func.afastamentos)) {
              func.afastamentos.forEach((afast: any) => {
                const ini = new Date(afast.data_inicio);
                const fim = afast.data_fim ? new Date(afast.data_fim) : null;

                const dentroPeriodo =
                  (ini >= startDate && ini <= endDate) ||
                  (fim && fim >= startDate && fim <= endDate);

                if (dentroPeriodo) afastamentos++;
              });
            }
          });
        });

        const turnover = (demissoes / (ativos + demissoes)) * 100;

        setCardsData({
          ativos,
          contratacoes,
          demissoes,
          afastamentos,
          turnover: `${turnover.toFixed(1)}%`,
        });

        interface Funcionario {
          id_empregado: number;
          nome: string;
          data_nascimento: string;
          cpf: string;
          sexo: "M" | "F";
          escolaridade: string;
          departamento: string;
          admissao: string;
          demissao: string | null;
          salario: string;
          venc_ferias: string | null;
          cargo: string;
          categoria: number;
          afastamentos: { data_inicio: string; data_fim: string | null }[];
        }

        const funcionarios: Funcionario[] =
          resultado.dados?.flatMap(
            (empresa: { funcionarios?: Funcionario[] }) =>
              empresa.funcionarios || []
          ) || [];

        const monthlyDataMap = new Map<
          string,
          { Ativos: number; Contratações: number; Demissões: number }
        >();

        const monthsInOrder: string[] = [];
        // Loop do primeiro dia do ano até o mês atual
        for (
          let d = new Date(startDate);
          d <= endDate;
          d.setMonth(d.getMonth() + 1)
        ) {
          // Garante que não criamos meses futuros além do mês atual
          if (
            d.getMonth() > today.getMonth() &&
            d.getFullYear() === today.getFullYear()
          ) {
            break;
          }
          const monthKey = `${d.toLocaleString("pt-BR", { month: "short" }).replace(".", "")}/${d.getFullYear().toString().slice(-2)}`;
          monthlyDataMap.set(monthKey, {
            Ativos: 0,
            Contratações: 0,
            Demissões: 0,
          });
          monthsInOrder.push(monthKey);
        }

        // Processa as contratações e demissões (sem alterações na lógica interna, pois já usa as datas do funcionário)
        for (const funcionario of funcionarios) {
          if (funcionario.admissao) {
            const admissaoDate = new Date(funcionario.admissao);
            // Certifique-se que a data está dentro do período de interesse (do ano atual até hoje)
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
            // Certifique-se que a data está dentro do período de interesse (do ano atual até hoje)
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

            // Um funcionário está ativo se ele foi admitido ATÉ o final do mês atual E
            // não foi demitido, OU foi demitido APÓS o final do mês atual
            const hiredByEndOfMonth = admissaoDate < nextMonthDate;
            const notTerminatedByEndOfMonth =
              !demissaoDate || demissaoDate >= nextMonthDate;

            if (hiredByEndOfMonth && notTerminatedByEndOfMonth) {
              activeForThisMonth++;
            }
          }
          const data = monthlyDataMap.get(monthKey);
          if (data) {
            data.Ativos = activeForThisMonth;
          }
        }

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
                <div className="text-2xl font-bold text-black">
                  {cardsData.turnover}
                </div>
                <div className="text-sm text-gray-500">Turnover</div>
              </div>
              <div className="bg-white p-4 rounded border-l-4 border-green-500 shadow-sm">
                <div className="text-2xl font-bold text-black">
                  {cardsData.ativos}
                </div>
                <div className="text-sm text-gray-500">Ativos</div>
              </div>
              <div className="bg-white p-4 rounded border-l-4 border-green-500 shadow-sm">
                <div className="text-2xl font-bold text-black">
                  {cardsData.contratacoes}
                </div>
                <div className="text-sm text-gray-500">Contratações</div>
              </div>
              <div className="bg-white p-4 rounded border-l-4 border-red-500 shadow-sm">
                <div className="text-2xl font-bold text-black">
                  {cardsData.demissoes}
                </div>
                <div className="text-sm text-gray-500">Demissões</div>
              </div>
              <div className="bg-white p-4 rounded border-l-4 border-red-500 shadow-sm">
                <div className="text-2xl font-bold text-black">
                  {cardsData.afastamentos}
                </div>
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
                <GraficoCategoria dados={dadosCategoria} />
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
