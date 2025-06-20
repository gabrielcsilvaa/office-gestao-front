"use client";
import { useState, useEffect } from "react";
import GraficoLinha from "./components/grafico_linha";
import GraficoGenero from "./components/grafico_genero";
import GraficoFaixaEtaria from "./components/grafico_faixa_etaria";
import GraficoCategoria from "./components/grafico_categoria";
import GraficoEscolaridade from "./components/grafico_escolaridade";
import GraficoCargo from "./components/grafico_cargo";
import TabelaColaboradores from "./components/tabela_colaboradores";
import Menu from "./components/menu";
import { useCallback


 } from "react";
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

  const handleSelecionarBotao = useCallback((nome: string) => {
  setBotaoSelecionado(nome);
}, []);


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

  const [colaboradores, setColaboradores] = useState([]);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const today = new Date();
        const currentYear = today.getFullYear();
        const startDate = new Date(currentYear, 0, 1);
        const endDate = today;

        const formatApiDate = (date: Date) => date.toISOString().split("T")[0];
        const apiStartDate = formatApiDate(startDate);
        const apiEndDate = formatApiDate(endDate);

        const response = await fetch("/api/dashboards-demografico", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            start_date: apiStartDate,
            end_date: apiEndDate,
          }),
        });

        if (!response.ok)
          throw new Error("Erro na requisição: " + response.statusText);

        const resultado = await response.json();
        const colaboradoresExtraidos = resultado.dados.flatMap((empresa: any) =>
          empresa.funcionarios.map((func: any) => ({
            nome: func.nome,
            departamento: func.departamento || "Não informado",
            faturamento: "-",
          }))
        );

        setColaboradores(colaboradoresExtraidos);

        const categoriaContagem: { [key: string]: number } = {};
        resultado.dados.forEach((empresa: any) => {
          empresa.funcionarios.forEach((funcionario: any) => {
            const categoria = funcionario.categoria || "Não Informado";
            categoriaContagem[categoria] =
              (categoriaContagem[categoria] || 0) + 1;
          });
        });

        const dadosCategoria = Object.entries(categoriaContagem).map(
          ([categoria, total]) => ({
            name: categoria,
            colaboradores: total,
          })
        );
        setDadosCategoria(dadosCategoria);

        const empresas = resultado.dados || [];
        let ativos = 0,
          contratacoes = 0,
          demissoes = 0,
          afastamentos = 0;

        empresas.forEach((empresa: any) => {
          empresa.funcionarios.forEach((func: any) => {
            const admissao = new Date(func.admissao);
            const demissao = func.demissao ? new Date(func.demissao) : null;

            if (!demissao) ativos++;
            if (admissao >= startDate && admissao <= endDate) contratacoes++;
            if (demissao && demissao >= startDate && demissao <= endDate)
              demissoes++;

            if (Array.isArray(func.afastamentos)) {
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

        // Dados detalhados para gráficos
        const funcionarios = resultado.dados.flatMap(
          (empresa: any) => empresa.funcionarios
        );

        // Gênero
        const total = funcionarios.length;
        const totalMasculino = funcionarios.filter(
          (f: any) => f.sexo === "M"
        ).length;
        const totalFeminino = funcionarios.filter(
          (f: any) => f.sexo === "F"
        ).length;

        setPercentualMasculino((totalMasculino / total) * 100 || 0);
        setPercentualFeminino((totalFeminino / total) * 100 || 0);

        // Escolaridade
        const escolaridadeMap = new Map<string, number>();
        funcionarios.forEach((f: any) => {
          const esc = f.escolaridade || "Não informado";
          escolaridadeMap.set(esc, (escolaridadeMap.get(esc) || 0) + 1);
        });

        const dadosEscolaridade = Array.from(escolaridadeMap.entries()).map(
          ([escolaridade, total]) => ({ escolaridade, total })
        );
        setDadosDemograficos(dadosEscolaridade);

        // Cargo
        const cargoMap = new Map<string, number>();
        funcionarios.forEach((f: any) => {
          const cargo = f.cargo || "Não informado";
          cargoMap.set(cargo, (cargoMap.get(cargo) || 0) + 1);
        });

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
        funcionarios.forEach((f: any) => {
          if (f.data_nascimento) {
            const idade = calcularIdade(f.data_nascimento);
            const faixa = getFaixaEtaria(idade);
            faixaEtariaMap.set(faixa, (faixaEtariaMap.get(faixa) || 0) + 1);
          }
        });

        const dadosFaixa = Array.from(faixaEtariaMap.entries()).map(
          ([name, colaboradores]) => ({ name, colaboradores })
        );
        setDadosFaixaEtaria(dadosFaixa);

        // Gráfico linha mensal (Ativos, Contratações e Demissões)
        // Inicializa os dados mensais
        const monthlyDataMap = new Map<
          string,
          { Ativos: number; Contratações: number; Demissões: number }
        >();

        const formatMonthKey = (date: Date): string =>
          `${date.toLocaleString("pt-BR", { month: "short" }).replace(".", "")}/${date
            .getFullYear()
            .toString()
            .slice(-2)}`;

        // Gerar os meses em ordem
        const monthsInOrder: string[] = [];
        const monthDates: Date[] = [];

        for (
          let d = new Date(startDate);
          d <= endDate;
          d.setMonth(d.getMonth() + 1)
        ) {
          const newDate = new Date(d); // Evita mutação de referência
          const monthKey = formatMonthKey(newDate);
          monthsInOrder.push(monthKey);
          monthDates.push(new Date(newDate)); // Salva o Date original
          monthlyDataMap.set(monthKey, {
            Ativos: 0,
            Contratações: 0,
            Demissões: 0,
          });
        }

        // Contar contratações e demissões
        for (const funcionario of funcionarios) {
          const admissaoDate = new Date(funcionario.admissao);
          const demissaoDate = funcionario.demissao
            ? new Date(funcionario.demissao)
            : null;

          for (let i = 0; i < monthDates.length; i++) {
            const monthEnd = new Date(
              monthDates[i].getFullYear(),
              monthDates[i].getMonth() + 1,
              0,
              23,
              59,
              59,
              999
            );
            const monthKey = monthsInOrder[i];

            // Contratação naquele mês
            if (
              admissaoDate.getFullYear() === monthDates[i].getFullYear() &&
              admissaoDate.getMonth() === monthDates[i].getMonth()
            ) {
              monthlyDataMap.get(monthKey)!.Contratações++;
            }

            // Demissão naquele mês
            if (
              demissaoDate &&
              demissaoDate.getFullYear() === monthDates[i].getFullYear() &&
              demissaoDate.getMonth() === monthDates[i].getMonth()
            ) {
              monthlyDataMap.get(monthKey)!.Demissões++;
            }

            // Verifica se funcionário estava ativo naquele mês
            const ativoNesseMes =
              admissaoDate <= monthEnd &&
              (!demissaoDate || demissaoDate > monthEnd);

            if (ativoNesseMes) {
              monthlyDataMap.get(monthKey)!.Ativos++;
            }
          }
        }

        // Converte para array para o gráfico
        const dadosParaGraficoLinha = monthsInOrder.map((monthKey) => ({
          month: monthKey,
          Ativos: monthlyDataMap.get(monthKey)!.Ativos,
          Contratações: monthlyDataMap.get(monthKey)!.Contratações,
          Demissões: monthlyDataMap.get(monthKey)!.Demissões,
        }));

        setDadosEmpresas(dadosParaGraficoLinha);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchDados();
  }, []);

  return (
    <div className="bg-gray-100 h-full p-4 overflow-y-auto">


<Menu
  filtros={filtros}
  setFiltros={setFiltros}
  botaoSelecionado={botaoSelecionado}
  setBotaoSelecionado={handleSelecionarBotao}
  resetarFiltros={resetarFiltros}
/>



      {/* Cabeçalho e Filtros */}
      {/* <div className="bg-gray-100 py-2 mb-6">
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
          {/* <div className="flex flex-col md:flex-row md:items-center flex-wrap gap-4">
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
      </div> */} 


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
          <TabelaColaboradores colaboradores={colaboradores} />
        </div>
        <div className="w-full lg:w-1/2 bg-white rounded shadow">
          <GraficoCargo dados={dadosCargo} />
        </div>
      </div>
    </div>
  );
}
