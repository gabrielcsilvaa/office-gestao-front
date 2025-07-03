"use client";
import { useState, useEffect, useCallback } from "react"; // Adicionado useCallback
import GraficoLinha from "./components/grafico_linha";
import GraficoGenero from "./components/grafico_genero";
import GraficoFaixaEtaria from "./components/grafico_faixa_etaria";
import GraficoCategoria from "./components/grafico_categoria";
import GraficoEscolaridade from "./components/grafico_escolaridade";
import GraficoCargo from "./components/grafico_cargo";
import TabelaColaboradores from "./components/tabela_colaboradores";
import Menu from "./components/menu";
import React from "react";
import Calendar from "@/components/calendar";
import { gerarMesesEntreDatas } from "@/utils/formatadores";

// Ajuste na função filtrarFuncionarios para maior flexibilidade
const filtrarFuncionarios = (
  funcionarios: any[],
  filtroBotao: string, // Renomeado para evitar conflito com 'filtro'
  startDate: Date,
  endDate: Date,
  filtrosSelecionados: {
    empresa: string;
    departamento: string;
    cargo: string;
    categoria: string;
  }
) => {
  let funcionariosFiltrados = funcionarios.filter((func: any) => {
    // Verifica se tem empresa (mantido para robustez)
    if (!("empresa" in func)) {
      console.warn("Funcionário sem empresa:", func);
      return false;
    }

    // Filtros de empresa, departamento, cargo e categoria (sempre aplicados)
    if (
      filtrosSelecionados.empresa &&
      func.empresa !== filtrosSelecionados.empresa
    )
      return false;
    if (
      filtrosSelecionados.departamento &&
      func.departamento !== filtrosSelecionados.departamento
    )
      return false;
    if (filtrosSelecionados.cargo && func.cargo !== filtrosSelecionados.cargo)
      return false;
    if (
      filtrosSelecionados.categoria &&
      func.categoria !== filtrosSelecionados.categoria
    )
      return false;

    return true; // Retorna true para continuar filtrando pelos botões
  });

  // Aplica o filtro do botão (Ativos, Contratações, Demissões, Más Contratações)
  // APENAS aos dados que irão para os gráficos.
  // Os cards serão calculados a partir dos dados BRUTOS do período.
  switch (filtroBotao) {
    case "Ativos":
      return funcionariosFiltrados.filter((func) => {
        const admissao = new Date(func.admissao);
        const demissaoData = func.demissao ? new Date(func.demissao) : null;
        // Ativo no FINAL do período endDate
        return admissao <= endDate && (!demissaoData || demissaoData > endDate);
      });
    case "Contratações":
      return funcionariosFiltrados.filter((func) => {
        const admissao = new Date(func.admissao);
        return admissao >= startDate && admissao <= endDate;
      });
    case "Demissões":
      return funcionariosFiltrados.filter((func) => {
        const demissaoData = func.demissao ? new Date(func.demissao) : null;
        return demissaoData && demissaoData >= startDate && demissaoData <= endDate;
      });
    case "Más Contratações":
      return funcionariosFiltrados.filter((func) => {
        const admissao = new Date(func.admissao);
        const demissaoData = func.demissao ? new Date(func.demissao) : null;
        const hoje = new Date();
        const dataReferenciaDemissao = demissaoData || hoje;
        const tempoEmpresaMs = dataReferenciaDemissao.getTime() - admissao.getTime();
        const mesesEmpresa = tempoEmpresaMs / (1000 * 60 * 60 * 24 * (365.25 / 12)); // Meses mais precisos
        return mesesEmpresa < 3;
      });
    default:
      return funcionariosFiltrados; // Retorna todos os funcionários filtrados por selects
  }
};

export default function Demografico() {
  const [botaoSelecionado, setBotaoSelecionado] = useState("");
  const [filtros, setFiltros] = useState({
    empresa: "",
    departamento: "",
    cargo: "",
    categoria: "",
  });

  const resetarFiltros = () => {
    setBotaoSelecionado("");
    setFiltros({
      empresa: "",
      departamento: "",
      cargo: "",
      categoria: "",
    });
  };

  const [todosFuncionariosAPI, setTodosFuncionariosAPI] = useState<any[]>([]); // Armazena todos os dados da API para o período

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

  //Estados de data
  const [startDate, setStartDate] = useState<Date | null>(null); // Alterado para Date
  const [endDate, setEndDate] = useState<Date | null>(null);     // Alterado para Date

  const handleStartDateChange = (dateString: string | null) => {
    setStartDate(dateString ? new Date(dateString) : null);
  };

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
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
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

        console.log("🔍 Iniciando fetch com:");
        console.log("Start:", startDate);
        console.log("End:", endDate);
        console.log("Botão selecionado:", botaoSelecionado);
        console.log("Filtros:", filtros);

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

        const todosFuncionariosRespostaAPI = resultado.dados.flatMap(
          (empresa: any) =>
            empresa.funcionarios.map((func: any) => ({
              ...func,
              empresa: empresa.nome_empresa, // adiciona nome_empresa ao funcionário
            }))
        );
        // Armazena todos os funcionários do período, sem filtros de botão
        setTodosFuncionariosAPI(todosFuncionariosRespostaAPI);

        // --- CÁLCULO DOS CARDS (SEMPRE GERAL DO PERÍODO SELECIONADO) ---
        let ativosCard = 0,
          contratacoesCard = 0,
          demissoesCard = 0,
          afastamentosCard = 0;

        todosFuncionariosRespostaAPI.forEach((func: any) => {
          const admissao = new Date(func.admissao);
          const demissaoData = func.demissao ? new Date(func.demissao) : null;

          // Ativos: Considera quem está ativo no FINAL do período endDate
          if (admissao <= endDate && (!demissaoData || demissaoData > endDate)) {
            ativosCard++;
          }
          // Contratações: Ocorreram DENTRO do período startDate e endDate
          if (admissao >= startDate && admissao <= endDate) {
            contratacoesCard++;
          }
          // Demissões: Ocorreram DENTRO do período startDate e endDate
          if (demissaoData && demissaoData >= startDate && demissaoData <= endDate) {
            demissoesCard++;
          }

          if (Array.isArray(func.afastamentos)) {
            func.afastamentos.forEach((afast: any) => {
              const ini = new Date(afast.data_inicio);
              const fim = afast.data_fim ? new Date(afast.data_fim) : null;
              // Afastamento ativo em ALGUM momento dentro do período selecionado
              const dentroPeriodo =
                (ini <= endDate && (!fim || fim >= startDate)); // Afastamento se sobrepõe ao período
              if (dentroPeriodo) afastamentosCard++;
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

        // --- FILTROS PARA OS SELECTS (APENAS COM BASE EM TODOS OS DADOS DA API) ---
        // Isso garante que as opções nos selects não mudem conforme o filtro de botão
        const empresasUnicas = Array.from(
          new Set(
            todosFuncionariosRespostaAPI.map(
              (f: any) => f.empresa || "Não informado"
            )
          )
        );
        const departamentosUnicos = Array.from(
          new Set(
            todosFuncionariosRespostaAPI.map(
              (f: any) => f.departamento || "Não informado"
            )
          )
        );
        const cargosUnicos = Array.from(
          new Set(
            todosFuncionariosRespostaAPI.map((f: any) => f.cargo || "Não informado")
          )
        );
        const categoriasUnicas = Array.from(
          new Set(
            todosFuncionariosRespostaAPI.map(
              (f: any) => f.categoria || "Não informado"
            )
          )
        );

        setEmpresas(empresasUnicas);
        setDepartamentos(departamentosUnicos);
        setCargos(cargosUnicos);
        setCategorias(categoriasUnicas);

        // --- CÁLCULO DOS DADOS PARA OS GRÁFICOS (APLICA TODOS OS FILTROS) ---
        const funcionariosParaGraficos = filtrarFuncionarios(
          todosFuncionariosRespostaAPI, // Usa todos os dados da API
          botaoSelecionado,
          startDate,
          endDate,
          filtros
        );

        // Colaboradores para a tabela
        const colaboradoresExtraidos = funcionariosParaGraficos.map(
          (func: any) => ({
            nome: func.nome,
            departamento: func.departamento || "Não informado",
            faturamento: "-", // Verifique a fonte deste dado
          })
        );
        setColaboradores(colaboradoresExtraidos);

        // Categoria (para gráficos)
        const categoriaContagem: { [key: string]: number } = {};
        funcionariosParaGraficos.forEach((funcionario: any) => {
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
        console.log("Dados de categoria:", dadosCategoria);
        setDadosCategoria(dadosCategoria);

        // Gênero (para gráficos)
        const totalGraficos = funcionariosParaGraficos.length;
        const totalMasculino = funcionariosParaGraficos.filter(
          (f: any) => f.sexo === "M"
        ).length;
        const totalFeminino = funcionariosParaGraficos.filter(
          (f: any) => f.sexo === "F"
        ).length;
        setPercentualMasculino((totalMasculino / totalGraficos) * 100 || 0);
        setPercentualFeminino((totalFeminino / totalGraficos) * 100 || 0);

        // Escolaridade (para gráficos)
        const escolaridadeMap = new Map<string, number>();
        funcionariosParaGraficos.forEach((f: any) => {
          const esc = f.escolaridade || "Não informado";
          escolaridadeMap.set(esc, (escolaridadeMap.get(esc) || 0) + 1);
        });
        const dadosEscolaridade = Array.from(escolaridadeMap.entries()).map(
          ([escolaridade, total]) => ({ escolaridade, total })
        );
        console.log("Dados de escolaridade:", dadosEscolaridade);
        setDadosDemograficos(dadosEscolaridade);

        // Cargo (para gráficos)
        const cargoMap = new Map<string, number>();
        funcionariosParaGraficos.forEach((f: any) => {
          const cargo = f.cargo || "Não informado";
          cargoMap.set(cargo, (cargoMap.get(cargo) || 0) + 1);
        });
        const dadosCargo = Array.from(cargoMap.entries()).map(
          ([cargo, total]) => ({ cargo, total })
        );
        console.log("Dados de cargo:", dadosCargo);
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
        funcionariosParaGraficos.forEach((f: any) => {
          if (f.data_nascimento) {
            const idade = calcularIdade(f.data_nascimento);
            const faixa = getFaixaEtaria(idade);
            faixaEtariaMap.set(faixa, (faixaEtariaMap.get(faixa) || 0) + 1);
          }
        });
        const dadosFaixa = Array.from(faixaEtariaMap.entries()).map(
          ([name, colaboradores]) => ({ name, colaboradores })
        );
        console.log("Dados de faixa etária:", dadosFaixa);
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
        for (const func of funcionariosParaGraficos) {
          const admissaoDate = new Date(func.admissao);
          const demissaoDate = func.demissao ? new Date(func.demissao) : null;

          for (let i = 0; i < monthDates.length; i++) {
            const monthStart = new Date(monthDates[i].getFullYear(), monthDates[i].getMonth(), 1);
            const monthEnd = new Date(monthDates[i].getFullYear(), monthDates[i].getMonth() + 1, 0, 23, 59, 59, 999);
            const monthKey = monthsInOrder[i];

            // Contratações no mês (se a admissão estiver no mês atual do loop)
            if (
              admissaoDate >= monthStart && admissaoDate <= monthEnd
            ) {
              monthlyDataMap.get(monthKey)!.Contratações++;
            }

            // Demissões no mês (se a demissão estiver no mês atual do loop)
            if (
              demissaoDate &&
              demissaoDate >= monthStart && demissaoDate <= monthEnd
            ) {
              monthlyDataMap.get(monthKey)!.Demissões++;
            }

            // Ativos no final do mês (para o gráfico de linha)
            // Um funcionário está ativo em um mês se ele foi admitido ATÉ o final do mês
            // E (não foi demitido OU foi demitido DEPOIS do final do mês)
            const ativoNesseMes =
              admissaoDate <= monthEnd && (!demissaoDate || demissaoDate > monthEnd);
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
        console.log(" Dados gerados para o gráfico de linha:", dadosParaGraficoLinha);
        setDadosEmpresas(dadosParaGraficoLinha);

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchDados();
  }, [botaoSelecionado, startDate, endDate, filtros, ]); // Adicionei todosFuncionariosAPI aqui

  // Este useEffect para atualizar os selects com base nos dados da API,
  // mas sem que os filtros do usuário removam as opções
  useEffect(() => {
    if (!todosFuncionariosAPI.length) return;

    // Apenas filtra por empresa se um filtro de empresa estiver aplicado
    const funcionariosParaSelects = filtros.empresa
      ? todosFuncionariosAPI.filter(
          (func) => func.empresa === filtros.empresa
        )
      : todosFuncionariosAPI;

    const departamentosUnicos = Array.from(
      new Set(funcionariosParaSelects.map((f) => f.departamento || "Não informado"))
    );
    const cargosUnicos = Array.from(
      new Set(funcionariosParaSelects.map((f) => f.cargo || "Não informado"))
    );
    const categoriasUnicas = Array.from(
      new Set(funcionariosParaSelects.map((f) => f.categoria || "Não informado"))
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
          resetarFiltros={resetarFiltros}
          empresas={empresas}
          departamentos={departamentos}
          cargos={cargos}
          categorias={categorias}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />

        {/* <Calendar
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        /> */}
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
                <GraficoFaixaEtaria dados={dadosFaixaEtaria} />
              </div>
              <div className="aspect-[4/3]  w-full h-[300px]">
                <GraficoCategoria dados={dadosCategoria} />
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