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
import React from "react";
import { gerarMesesEntreDatas } from "@/utils/formatadores";

// --- Definições de Tipos (Interfaces) ---

type FiltrosSelecionados = {
  empresa: string;
  departamento: string;
  cargo: string;
  categoria: string;
};

type Afastamento = {
  data_inicio: string;
  data_fim?: string | null; // Pode ser nulo ou indefinido
};

type Funcionario = {
  nome: string;
  empresa: string;
  departamento: string;
  cargo: string;
  categoria: string;
  admissao: string;
  demissao?: string | null; // Pode ser nulo ou indefinido
  afastamentos?: Afastamento[]; // Pode ser indefinido
  sexo?: string; // Pode ser indefinido
  escolaridade?: string; // Pode ser indefinido
  data_nascimento?: string; // Pode ser indefinido
};

// Dados para os cards
interface CardsData {
  ativos: number;
  contratacoes: number;
  demissoes: number;
  afastamentos: number;
  turnover: string;
}

// Dados para o gráfico de linha de empresas
interface DadosLinhaEmpresa {
  month: string;
  Ativos: number;
  Contratações: number;
  Demissões: number;
}

// Dados para o gráfico de categoria
interface DadosCategoria {
  name: string;
  colaboradores: number;
}

// Dados para a tabela de colaboradores
interface ColaboradorTabela {
  nome: string;
  departamento: string;
  faturamento: string;
}

// Dados para o gráfico de escolaridade (dadosDemograficos)
interface DadosEscolaridade {
  escolaridade: string;
  total: number;
}

// Dados para o gráfico de cargo
interface DadosCargo {
  cargo: string;
  total: number;
}

// Dados para o gráfico de faixa etária
interface DadosFaixaEtaria {
  name: string;
  colaboradores: number;
}

// --- Função filtrarFuncionarios ---
const filtrarFuncionarios = (
  funcionarios: Funcionario[],
  filtroBotao: string,
  startDate: Date,
  endDate: Date,
  filtrosSelecionados: FiltrosSelecionados
): Funcionario[] => {
  return funcionarios.filter((func) => {
    const { empresa, departamento, cargo, categoria } = filtrosSelecionados;

    if (empresa && func.empresa !== empresa) return false;
    if (departamento && func.departamento !== departamento) return false;
    if (cargo && func.cargo !== cargo) return false;
    if (categoria && func.categoria !== categoria) return false;

    const admissao = new Date(func.admissao);
    const demissao = func.demissao ? new Date(func.demissao) : null;

    switch (filtroBotao) {
      case "Ativos":
        return admissao <= endDate && (!demissao || demissao >= endDate);

      case "Contratações":
        return admissao >= startDate && admissao <= endDate;

      case "Demissões":
        return (
          demissao !== null && demissao >= startDate && demissao <= endDate
        );

      case "Más Contratações":
        if (!demissao) return false;
        const diasNaEmpresa =
          (demissao.getTime() - admissao.getTime()) / (1000 * 60 * 60 * 24);
        return (
          diasNaEmpresa < 90 && admissao >= startDate && admissao <= endDate
        );

      default:
        return admissao <= endDate && (!demissao || demissao >= startDate);
    }
  });
};

// --- Componente Principal Demografico ---
export default function Demografico() {
  const [botaoSelecionado, setBotaoSelecionado] = useState<string>("");
  const [filtros, setFiltros] = useState<FiltrosSelecionados>({
    empresa: "",
    departamento: "",
    cargo: "",
    categoria: "",
  });

  const resetarBotoes = () => {
    setBotaoSelecionado("");
  };

  const resetarFiltrosSelects = () => {
    setFiltros({
      empresa: "",
      departamento: "",
      cargo: "",
      categoria: "",
    });
  };

  // Armazena todos os dados da API para o período
  const [todosFuncionariosAPI, setTodosFuncionariosAPI] = useState<
    Funcionario[]
  >([]);

  // Estados para os dados dos gráficos
  const [dadosDemograficos, setDadosDemograficos] = useState<
    DadosEscolaridade[]
  >([]);
  const [dadosFaixaEtaria, setDadosFaixaEtaria] = useState<DadosFaixaEtaria[]>(
    []
  );
  const [percentualMasculino, setPercentualMasculino] = useState<number>(0);
  const [percentualFeminino, setPercentualFeminino] = useState<number>(0);
  const [dadosCargo, setDadosCargo] = useState<DadosCargo[]>([]);
  const [dadosCategoria, setDadosCategoria] = useState<DadosCategoria[]>([]);
  const [colaboradores, setColaboradores] = useState<ColaboradorTabela[]>([]);

  // Estado para os dados dos cards
  const [cardsData, setCardsData] = useState<CardsData>({
    ativos: 0,
    contratacoes: 0,
    demissoes: 0,
    afastamentos: 0,
    turnover: "0.0",
  });

  // Estado para o gráfico de linha de empresas
  const [dadosEmpresas, setDadosEmpresas] = useState<DadosLinhaEmpresa[]>([]);

  // Estados de data
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleStartDateChange = (dateString: string | null) => {
    setStartDate(dateString ? new Date(dateString) : null);
  };

  // Estados para as opções dos selects de filtro
  const [empresas, setEmpresas] = useState<string[]>([]);
  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [cargos, setCargos] = useState<string[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);

  const handleEndDateChange = (dateString: string | null) => {
    setEndDate(dateString ? new Date(dateString) : null);
  };

  // Garante que as datas sejam objetos Date para comparações
  useEffect(() => {
    if (startDate && endDate) {
      console.log(startDate);
      console.log(endDate);
      // gerarMesesEntreDatas espera strings, então converta de volta se precisar
      // Ou ajuste gerarMesesEntreDatas para receber Date
      const datas = gerarMesesEntreDatas(
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );
      console.log("Meses entre datas:", datas);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const fetchDados = async () => {
      if (!startDate || !endDate) {
        return;
      }
      try {
        // Formata as datas para envio à API se necessário (geralmente YYYY-MM-DD)
        const apiStartDate = startDate.toISOString().split("T")[0];
        const apiEndDate = endDate.toISOString().split("T")[0];


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

        const todosFuncionariosRespostaAPI: Funcionario[] =
          resultado.dados.flatMap(
            (empresa: {
              nome_empresa: string;
              funcionarios: Omit<Funcionario, "empresa">[];
            }) =>
              empresa.funcionarios.map((func) => ({
                ...func,
                empresa: empresa.nome_empresa,
              }))
          );
        // Armazena todos os funcionários do período, sem filtros de botão
        setTodosFuncionariosAPI(todosFuncionariosRespostaAPI);

        // Decide se o gráfico de linha deve usar dados filtrados por botão ou não
        // Decide quais funcionários usar para o gráfico de linha

        const funcionariosParaCards = filtros.empresa
          ? todosFuncionariosRespostaAPI.filter(
            (f) => f.empresa === filtros.empresa
          )
          : todosFuncionariosRespostaAPI;

        // Usa a mesma base dos cards, a menos que um botão esteja selecionado
        const funcionariosParaGraficoLinha =
          botaoSelecionado === ""
            ? funcionariosParaCards
            : filtrarFuncionarios(
              todosFuncionariosRespostaAPI,
              botaoSelecionado,
              startDate,
              endDate,
              filtros
            );

        // --- CÁLCULO DOS CARDS ---
        // Se tiver empresa selecionada, filtra só ela. Se não, usa todos.

        let ativosCard = 0,
          contratacoesCard = 0,
          demissoesCard = 0,
          afastamentosCard = 0;

        const normalizarData = (data: Date) => {
          const nova = new Date(data);
          nova.setHours(0, 0, 0, 0);
          return nova;
        };

        const start = normalizarData(startDate);
        const end = normalizarData(endDate);

        funcionariosParaCards.forEach((func: Funcionario) => {
          const admissao = normalizarData(new Date(func.admissao));
          const demissaoData = func.demissao
            ? normalizarData(new Date(func.demissao))
            : null;

          const esteveAtivo =
            admissao <= end && (!demissaoData || demissaoData >= end);
          console.log(
            `Contratado no período: ${func.nome} - ${admissao.toLocaleDateString()}`
          );
          if (esteveAtivo) {
            ativosCard++;

            console.log(`Ativo no período: ${func.nome}`);
          }

          if (admissao >= start && admissao <= end) {
            contratacoesCard++;
          }

          if (demissaoData && demissaoData >= start && demissaoData <= end) {
            demissoesCard++;
          }

          if (Array.isArray(func.afastamentos)) {
            console.log(`Afastamentos do ${func.nome}:`, func.afastamentos);

            func.afastamentos.forEach((afast) => {
              const ini = normalizarData(new Date(afast.data_inicio));
              const fim = afast.data_fim
                ? normalizarData(new Date(afast.data_fim))
                : null;
              const sobrepoePeriodo = ini <= end && (!fim || fim >= start);

              if (sobrepoePeriodo) {
                afastamentosCard++;
                console.log("Afastamento contado:", afastamentosCard);
              }
            });
          }
        });

        const turnoverCard =
          (demissoesCard / (ativosCard + demissoesCard)) * 100 || 0;

        setCardsData({
          ativos: ativosCard,
          contratacoes: contratacoesCard,
          demissoes: demissoesCard,
          afastamentos: afastamentosCard,
          turnover: `${turnoverCard.toFixed(1)}%`,
        });

        // --- FILTROS PARA OS SELECTS 
        // Isso garante que as opções nos selects não mudem conforme o filtro de botão
        const empresasUnicas = Array.from(
          new Set(
            todosFuncionariosRespostaAPI.map(
              (f) => f.empresa || "Não informado"
            )
          )
        );
        const departamentosUnicos = Array.from(
          new Set(
            todosFuncionariosRespostaAPI.map(
              (f) => f.departamento || "Não informado"
            )
          )
        );
        const cargosUnicos = Array.from(
          new Set(
            todosFuncionariosRespostaAPI.map(
              (f) => f.cargo || "Não informado"
            )
          )
        );
        const categoriasUnicas = Array.from(
          new Set(
            todosFuncionariosRespostaAPI.map(
              (f) => f.categoria || "Não informado"
            )
          )
        );

        setEmpresas(empresasUnicas);
        setDepartamentos(departamentosUnicos);
        setCargos(cargosUnicos);
        setCategorias(categoriasUnicas);

        // --- CÁLCULO DOS DADOS PARA OS GRÁFICOS (APLICA TODOS OS FILTROS) ---
        const funcionariosParaGraficos = filtrarFuncionarios(
          todosFuncionariosRespostaAPI,
          botaoSelecionado,
          startDate,
          endDate,
          filtros
        );

        // Colaboradores para a tabela
        const colaboradoresExtraidos = funcionariosParaGraficos.map((func) => ({
          nome: func.nome,
          departamento: func.departamento || "Não informado",
          faturamento: "-", // Verifique a fonte deste dado
        }));
        setColaboradores(colaboradoresExtraidos);

        // Categoria (para gráficos)
        const categoriaContagem: { [key: string]: number } = {};
        funcionariosParaGraficos.forEach((funcionario) => {
          const categoria = funcionario.categoria || "Não Informado";
          categoriaContagem[categoria] =
            (categoriaContagem[categoria] || 0) + 1;
        });
        const dadosCategoria = Object.entries(categoriaContagem).map(
          ([categoria, total]) => ({
            name: categoria,
            colaboradores: total,
          })
        );

        setDadosCategoria(dadosCategoria);

        // Gênero (para gráficos)
        const totalGraficos = funcionariosParaGraficos.length;
        const totalMasculino = funcionariosParaGraficos.filter(
          (f) => f.sexo === "M"
        ).length;
        const totalFeminino = funcionariosParaGraficos.filter(
          (f) => f.sexo === "F"
        ).length;
        setPercentualMasculino((totalMasculino / totalGraficos) * 100 || 0);
        setPercentualFeminino((totalFeminino / totalGraficos) * 100 || 0);

        // Escolaridade (para gráficos)
        const escolaridadeMap = new Map<string, number>();
        funcionariosParaGraficos.forEach((f) => {
          const esc = f.escolaridade || "Não informado";
          escolaridadeMap.set(esc, (escolaridadeMap.get(esc) || 0) + 1);
        });
        const dadosEscolaridade = Array.from(escolaridadeMap.entries()).map(
          ([escolaridade, total]) => ({ escolaridade, total })
        );

        setDadosDemograficos(dadosEscolaridade);

        // Cargo (para gráficos)
        const cargoMap = new Map<string, number>();
        funcionariosParaGraficos.forEach((f) => {
          const cargo = f.cargo || "Não informado";
          cargoMap.set(cargo, (cargoMap.get(cargo) || 0) + 1);
        });
        const dadosCargo = Array.from(cargoMap.entries()).map(
          ([cargo, total]) => ({ cargo, total })
        );

        setDadosCargo(dadosCargo);

        // Faixa etária (para gráficos)
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
          if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate()))
            idade--;
          return idade;
        };

        const faixaEtariaMap = new Map<string, number>();
        funcionariosParaGraficos.forEach((f) => {
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

        // Gráfico de linha (dados para Ativos, Contratações, Demissões por mês)
        const monthlyDataMap = new Map<
          string,
          { Ativos: number; Contratações: number; Demissões: number }
        >();

        const formatMonthKey = (date: Date): string =>
          `${date.toLocaleString("pt-BR", { month: "short" }).replace(".", "")}/${date
            .getFullYear()
            .toString()
            .slice(-2)}`;

        const monthsInOrder: string[] = [];
        const monthDates: Date[] = [];

        // Inicializa o mapa com todos os meses do período para garantir que apareçam no gráfico
        for (
          let d = new Date(startDate);
          d <= endDate;
          d.setMonth(d.getMonth() + 1)
        ) {
          const newDate = new Date(d);
          const monthKey = formatMonthKey(newDate);
          monthsInOrder.push(monthKey);
          monthDates.push(new Date(newDate)); // Armazena a data completa para referência
          monthlyDataMap.set(monthKey, {
            Ativos: 0,
            Contratações: 0,
            Demissões: 0,
          });
        }

        // Popula o monthlyDataMap com os dados dos funcionários FILTRADOS para GRÁFICOS
        for (const func of funcionariosParaGraficoLinha) {
          const admissaoDate = new Date(func.admissao);
          const demissaoDate = func.demissao ? new Date(func.demissao) : null;

          for (let i = 0; i < monthDates.length; i++) {
            const monthStart = new Date(
              monthDates[i].getFullYear(),
              monthDates[i].getMonth(),
              1
            );
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

            // Contratações no mês (se a admissão estiver no mês atual do loop)
            if (admissaoDate >= monthStart && admissaoDate <= monthEnd) {
              monthlyDataMap.get(monthKey)!.Contratações++;
            }

            // Demissões no mês (se a demissão estiver no mês atual do loop)
            if (
              demissaoDate &&
              demissaoDate >= monthStart &&
              demissaoDate <= monthEnd
            ) {
              monthlyDataMap.get(monthKey)!.Demissões++;
            }

            // Ativos no final do mês (para o gráfico de linha)
            // Um funcionário está ativo em um mês se ele foi admitido ATÉ o final do mês
            // E (não foi demitido OU foi demitido DEPOIS do final do mês)
            const ativoNesseMes =
              admissaoDate <= monthEnd &&
              (!demissaoDate || demissaoDate > monthEnd);
            if (ativoNesseMes) {
              monthlyDataMap.get(monthKey)!.Ativos++;
            }
          }
        }

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
  }, [botaoSelecionado, startDate, endDate, filtros]); // Adicionei todosFuncionariosAPI aqui

  // Este useEffect para atualizar os selects com base nos dados da API,
  // mas sem que os filtros do usuário removam as opções
  useEffect(() => {
    if (!todosFuncionariosAPI.length) return;

    // Apenas filtra por empresa se um filtro de empresa estiver aplicado
    const funcionariosParaSelects = filtros.empresa
      ? todosFuncionariosAPI.filter((func) => func.empresa === filtros.empresa)
      : todosFuncionariosAPI;

    const departamentosUnicos = Array.from(
      new Set(
        funcionariosParaSelects.map((f) => f.departamento || "Não informado")
      )
    );
    const cargosUnicos = Array.from(
      new Set(funcionariosParaSelects.map((f) => f.cargo || "Não informado"))
    );
    const categoriasUnicas = Array.from(
      new Set(
        funcionariosParaSelects.map((f) => f.categoria || "Não informado")
      )
    );

    setDepartamentos(departamentosUnicos);
    setCargos(cargosUnicos);
    setCategorias(categoriasUnicas);
  }, [filtros.empresa, todosFuncionariosAPI]);

  return (
    <div className="bg-gray-100 h-full p-4 overflow-y-auto">
      <div>
        <Menu
          filtros={filtros}
          setFiltros={setFiltros}
          botaoSelecionado={botaoSelecionado}
          setBotaoSelecionado={setBotaoSelecionado}
          resetarFiltros={resetarFiltrosSelects} // agora só para selects
          resetarBotoes={resetarBotoes}
          empresas={empresas}
          departamentos={departamentos}
          cargos={cargos}
          categorias={categorias}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
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
              <div className=" w-full h-[300px]">
                <GraficoGenero
                  masculinoPercentual={percentualMasculino}
                  femininoPercentual={percentualFeminino}
                />
              </div>
              <div className="aspect-[4/3]  w-full h-[300px]">
                <GraficoFaixaEtaria
                  dados={dadosFaixaEtaria}
                  detalhes={filtrarFuncionarios(
                    todosFuncionariosAPI,
                    botaoSelecionado,
                    startDate ?? new Date(),
                    endDate ?? new Date(),
                    filtros
                  ).filter((f) => f.data_nascimento)}
                />

              </div>
              <div className="aspect-[4/3]  w-full h-[300px]">
                <GraficoCategoria
                  dados={dadosCategoria}
                  detalhes={filtrarFuncionarios(
                    todosFuncionariosAPI,
                    botaoSelecionado,
                    startDate ?? new Date(),
                    endDate ?? new Date(),
                    filtros
                  ).map((f) => ({
                    nome: f.nome,
                    categoria: f.categoria || "Não informado"
                  }))}
                />
              </div>
              <div className="aspect-[4/3]  w-full h-[300px]">
                <GraficoEscolaridade dados={dadosDemograficos} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Parte inferior: tabela e gráfico de cargo */}
      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <div className="w-full lg:w-1/2 bg-white rounded shadow ">
          <TabelaColaboradores colaboradores={colaboradores} />
        </div>
        <div className="w-full lg:w-1/2 bg-white rounded shadow ">
          <GraficoCargo dados={dadosCargo} />
        </div>
      </div>
    </div>
  );
}
