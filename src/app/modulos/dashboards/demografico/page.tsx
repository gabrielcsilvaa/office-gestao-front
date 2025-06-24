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
import Calendar from "@/components/calendar";
import { gerarMesesEntreDatas } from "@/utils/formatadores";

const filtrarFuncionarios = (

  funcionarios: any[],
  filtro: string,
  startDate: Date,
  endDate: Date
) => {
  if (!filtro || filtro === "") return funcionarios;

  return funcionarios.filter((func: any ) => {
    const admissao = new Date(func.admissao);
    const demissao = func.demissao ? new Date(func.demissao) : null;

    switch (filtro) {
      case "Ativos":
        return !demissao;
      case "Contratações":
        return admissao >= startDate && admissao <= endDate;
      case "Demissões":
        return demissao && demissao >= startDate && demissao <= endDate;
      case "Más Contratações":
        const hoje = new Date();
        const tempoEmpresa = (demissao ?? hoje).getTime() - admissao.getTime();
        const mesesEmpresa = tempoEmpresa / (1000 * 60 * 60 * 24 * 30);
        return mesesEmpresa < 3;
      default:
        return true;
    }
  });
};


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

  const [colaboradores, setColaboradores] = useState([]);

    //Estados de data
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

    const handleStartDateChange = (date: string | null) => {
    setStartDate(date);

  };

  const handleEndDateChange = (date: string | null) => {
    setEndDate(date);

  };
  useEffect(() => {
    if (startDate && endDate) {
    console.log(startDate)
    console.log(endDate)// Ajusta a data final se for menor que a inicial
    const datas = gerarMesesEntreDatas(startDate, endDate);
    console.log("Meses entre datas:", datas);
    }
  }, [startDate, endDate]);

 useEffect(() => {
  const fetchDados = async () => {
    try {

      const formatApiDate = (date: Date) => date.toISOString().split("T")[0];
      const apiStartDate = startDate
      const apiEndDate = endDate

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
      const todosFuncionarios = resultado.dados.flatMap(
        (empresa: any) => empresa.funcionarios
      );
      const funcionariosFiltrados = filtrarFuncionarios(
        todosFuncionarios,
        botaoSelecionado,
        startDate,
        endDate
      );

      const colaboradoresExtraidos = funcionariosFiltrados.map((func: any) => ({
        nome: func.nome,
        departamento: func.departamento || "Não informado",
        faturamento: "-",
      }));

      setColaboradores(colaboradoresExtraidos);

      // Categoria
      const categoriaContagem: { [key: string]: number } = {};
      funcionariosFiltrados.forEach((funcionario: any) => {
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

      // Cards
      let ativos = 0, contratacoes = 0, demissoes = 0, afastamentos = 0;
      todosFuncionarios.forEach((func: any) => {
        const admissao = new Date(func.admissao);
        const demissaoData = func.demissao ? new Date(func.demissao) : null;

        if (!demissaoData) ativos++;
        if (admissao >= startDate && admissao <= endDate) contratacoes++;
        if (demissaoData && demissaoData >= startDate && demissaoData <= endDate) demissoes++;

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

      const turnover = (demissoes / (ativos + demissoes)) * 100;
      setCardsData({
        ativos,
        contratacoes,
        demissoes,
        afastamentos,
        turnover: `${turnover.toFixed(1)}%`,
      });

      // Gênero
      const total = funcionariosFiltrados.length;
      const totalMasculino = funcionariosFiltrados.filter((f: any) => f.sexo === "M").length;
      const totalFeminino = funcionariosFiltrados.filter((f: any) => f.sexo === "F").length;
      setPercentualMasculino((totalMasculino / total) * 100 || 0);
      setPercentualFeminino((totalFeminino / total) * 100 || 0);

      // Escolaridade
      const escolaridadeMap = new Map<string, number>();
      funcionariosFiltrados.forEach((f: any) => {
        const esc = f.escolaridade || "Não informado";
        escolaridadeMap.set(esc, (escolaridadeMap.get(esc) || 0) + 1);
      });
      const dadosEscolaridade = Array.from(escolaridadeMap.entries()).map(
        ([escolaridade, total]) => ({ escolaridade, total })
      );
      setDadosDemograficos(dadosEscolaridade);

      // Cargo
      const cargoMap = new Map<string, number>();
      funcionariosFiltrados.forEach((f: any) => {
        const cargo = f.cargo || "Não informado";
        cargoMap.set(cargo, (cargoMap.get(cargo) || 0) + 1);
      });
      const dadosCargo = Array.from(cargoMap.entries()).map(
        ([cargo, total]) => ({ cargo, total })
      );
      setDadosCargo(dadosCargo);


      
      // Faixa etária
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
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) idade--;
        return idade;
      };

      const faixaEtariaMap = new Map<string, number>();
      funcionariosFiltrados.forEach((f: any) => {
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

      // Gráfico de linha
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

      for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
        const newDate = new Date(d);
        const monthKey = formatMonthKey(newDate);
        monthsInOrder.push(monthKey);
        monthDates.push(new Date(newDate));
        monthlyDataMap.set(monthKey, { Ativos: 0, Contratações: 0, Demissões: 0 });
      }

      for (const func of funcionariosFiltrados) {
        const admissaoDate = new Date(func.admissao);
        const demissaoDate = func.demissao ? new Date(func.demissao) : null;

        for (let i = 0; i < monthDates.length; i++) {
          const monthEnd = new Date(
            monthDates[i].getFullYear(),
            monthDates[i].getMonth() + 1,
            0,
            23, 59, 59, 999
          );
          const monthKey = monthsInOrder[i];

          if (
            admissaoDate.getFullYear() === monthDates[i].getFullYear() &&
            admissaoDate.getMonth() === monthDates[i].getMonth()
          ) {
            monthlyDataMap.get(monthKey)!.Contratações++;
          }

          if (
            demissaoDate &&
            demissaoDate.getFullYear() === monthDates[i].getFullYear() &&
            demissaoDate.getMonth() === monthDates[i].getMonth()
          ) {
            monthlyDataMap.get(monthKey)!.Demissões++;
          }

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
}, [botaoSelecionado,startDate, endDate]);

  return (
    <div className="bg-gray-100 h-full p-4 overflow-y-auto">
      <div>
      <Menu
        filtros={filtros}
        setFiltros={setFiltros}
        botaoSelecionado={botaoSelecionado}
        setBotaoSelecionado={setBotaoSelecionado}
        resetarFiltros={resetarFiltros}
        cardsData={cardsData}
      />
                  <Calendar
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
