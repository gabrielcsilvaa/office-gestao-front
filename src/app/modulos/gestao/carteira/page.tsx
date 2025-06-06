"use client";
import { useState, useEffect } from "react";
import Card from "./components/card";
import PieChartComponent from "./components/cardRegimeTributario"; // Importando o PieChartComponent
import RamoAtividade from "./components/cardRamoAtividade";
import Evolucao from "./components/cardEvolucao";
import Modal from "./components/modal";
import AniversariantesParceiros from "./components/modalAniversarioParceria";
import AniversariantesSocios from "./components/modalAniversarioSocios";
import { Cairo } from "next/font/google";
import ModalRegimeTributario from "./components/modalRegimeTributario"; // Modal correto para o gráfico
import Calendar from "@/components/calendar";
import ModalEmpresasCard from "./components/modalEmpresasCards";
import ModalRamoAtividade from "./components/modalRamoAtividade";
import Image from "next/image";
import Reload from "@/components/reload";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

interface Parceria {
  codi_emp: number;
  nome: string;
  cnpj: string;
  data_cadastro: string;
  data_inicio_atividades: string;
}

interface Escritorio {
  codigo_escritorio: number;
  id_cliente_contrato: number;
  nome_escritorio: string;
}

interface regimeTributario {
  id: number;
  nome_empresa: string;
  regime_tributario: string;
  cnpj: string;
  data_cadastro: string;
  responsavel_legal: string;
  data_inatividade: string;
  motivo_inatividade: number;
  situacao: string;
  ramo_atividade: string;
  escritorios?: Escritorio[];
  empresas: Empresa[];
}

interface Empresa {
  situacao: string;
  regime_tributario: string;
  motivo_inatividade: number;
  ramo_atividade: string;
  data_cadastro: string;
}

interface Regime {
  name: string;
  value: number;
  empresas: Empresa[];
}

interface EmpresaCompletaNovosCliente {
  id: number;
  nome_empresa: string;
  situacao: string;
  cnpj: string;
  data_cadastro: string;
  responsavel_legal: string;
  data_inatividade: string | null;
  motivo_inatividade: number;
  regime_tributario: string;
}

interface Socio {
  id: number;
  nome: string;
  data_nascimento: string;
  idade?: number; // Tornando idade opcional já que vamos calculá-la
}

export default function Carteira() {
  const [selectedOption, setSelectedOption] =
    useState<string>("Selecionar Todos");
  const [isModalOpen, setIsModalOpen] = useState<string | null>(null);
  const [empresas, setEmpresas] = useState<regimeTributario[]>([]);
  const [socios, setSocios] = useState<Socio[]>([]); // Corrigido a tipagem
  const [parceria, setParceria] = useState<Parceria[]>([]); // Corrigido a tipagem
  const [novosClientes, setNovosClientes] = useState<number>(0);
  const [dadosTotaisClientesNovos, setDadosTotaisClientesNovos] = useState<
    EmpresaCompletaNovosCliente[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [regimesData, setRegimesData] = useState<Regime[]>([]);
  const [aniversariosParceria, setAniversariosParceria] = useState<number>(50);
  const [ramoAtividadeData, setRamoAtividadeData] = useState<
    Array<{ name: string; value: number }>
  >([]);
  const [evolucaoData, setEvolucaoData] = useState<
    Array<{ name: string; value: number }>
  >([]);
  const [startDate, setStartDate] = useState<string | null>("2024-01-01");
  const [endDate, setEndDate] = useState<string | null>("2024-12-31");
  const [isEmpresasCardModalOpen, setIsEmpresasCardModalOpen] = useState(false);
  const [filtrosSelecionados, setFiltrosSelecionados] = useState<string[]>([]);
  const [escritorios, setEscritorios] = useState<string[]>([]);
  const [allEmpresas, setAllEmpresas] = useState<regimeTributario[]>([]);
  const [isModalRamoOpen, setIsModalRamoOpen] = useState(false);

  useEffect(() => {
    if (!empresas || empresas.length === 0) {
      setRegimesData([]);
      setRamoAtividadeData([]);
      setEvolucaoData([]);
      return;
    }

    // Agrupar por regime tributário
    const groupedByRegime = empresas.reduce(
      (acc: { [key: string]: Regime }, empresa) => {
        const regime = empresa.regime_tributario || "Não especificado";
        if (!acc[regime])
          acc[regime] = { name: regime, value: 0, empresas: [] };
        acc[regime].value += 1;
        acc[regime].empresas.push(empresa);
        return acc;
      },
      {}
    );
    setRegimesData(Object.values(groupedByRegime));

    // Processar ramo de atividade
    const ramoAtividadeCount = empresas.reduce(
      (acc: { [key: string]: number }, empresa) => {
        const ramo = empresa.ramo_atividade || "Não especificado";
        acc[ramo] = (acc[ramo] || 0) + 1;
        return acc;
      },
      {}
    );
    setRamoAtividadeData(
      Object.entries(ramoAtividadeCount)
        .map(([name, value]) => ({ name, value: Number(value) }))
        .sort((a, b) => b.value - a.value)
    );

    // Processar dados de evolução
    const formatDate = (date: Date) => date.toISOString().split("T")[0];
    const startEvolucao = startDate ? formatDate(new Date(startDate)) : "";
    const endEvolucao = endDate ? formatDate(new Date(endDate)) : "";

    const counts: { [key: string]: number } = {};
    empresas.forEach((empresa) => {
      if (empresa.data_cadastro) {
        const dataCadastro = formatDate(new Date(empresa.data_cadastro));
        if (dataCadastro >= startEvolucao && dataCadastro <= endEvolucao) {
          const key = new Date(empresa.data_cadastro).toLocaleString(
            "default",
            {
              month: "short",
              year: "numeric",
            }
          );
          counts[key] = (counts[key] || 0) + 1;
        }
      }
    });
    setEvolucaoData(
      Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime())
    );
  }, [empresas, startDate, endDate]);

  const handleCardClick = (title: string) => {
    switch (title) {
      case "Clientes Ativos":
        setFiltrosSelecionados(["A"]);
        setIsEmpresasCardModalOpen(true);
        break;
      case "Novos Clientes":
        setFiltrosSelecionados(["novos-clientes"]);
        setIsEmpresasCardModalOpen(true);
        break;
      case "Clientes Inativos":
        setFiltrosSelecionados(["I"]);
        setIsEmpresasCardModalOpen(true);
        break;
      case "Bloqueados / Baixados":
        setFiltrosSelecionados(["baixados"]);
        setIsEmpresasCardModalOpen(true);
        break;
      case "Transferidas":
        setFiltrosSelecionados(["transferidas"]);
        setIsEmpresasCardModalOpen(true);
        break;
      case "Aniversário de Parceria":
        setIsModalOpen("Aniversário de Parceria");
        break;
      case "Sócio(s) Aniversariante(s)":
        setIsModalOpen("Sócio(s) Aniversariante(s)");
        break;
      default:
        setFiltrosSelecionados([]);
        setIsEmpresasCardModalOpen(true);
    }
  };

  const handleStartDateChange = (date: string | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: string | null) => {
    setEndDate(date);
  };

  const handleOpenModal = (title: string) => {
    setIsModalOpen(title);
  };

  const handleEscritorioSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selected = e.target.value;
    console.log("🔎 escritório selecionado:", selected);
    setSelectedOption(selected);
  };

  const handleOpenModalRamo = () => {
    setIsModalRamoOpen(true);
  };

  useEffect(() => {
    let filtered = allEmpresas;

    if (selectedOption !== "Selecionar Todos") {
      filtered = allEmpresas.filter((emp) =>
        emp.escritorios?.some((s) => s.nome_escritorio === selectedOption)
      );
    }

    setEmpresas(filtered);
    setFiltrosSelecionados(
      selectedOption === "Selecionar Todos" ? [] : [selectedOption]
    );
  }, [allEmpresas, selectedOption]);

  useEffect(() => {
    const fetchNovosClientes = async () => {
      try {
        const body = {
          start_date: startDate,
          end_date: endDate,
        };
        const response = await fetch("/api/analise-carteira/novos-clientes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.statusText}`);
        }

        const data = await response.json();

        // Garantindo que os dados estão no formato correto
        const dadosTotaisClientesNovos = data.flatMap(
          (item: { empresas: EmpresaCompletaNovosCliente[] }) =>
            item.empresas.map((empresa) => ({
              nome_empresa: empresa.nome_empresa,
              cnpj: empresa.cnpj,
              data_cadastro: empresa.data_cadastro,
              situacao: empresa.situacao,
              responsavel_legal: empresa.responsavel_legal || "Sem Responsável",
              motivo_inatividade: empresa.motivo_inatividade || 0,
              regime_tributario:
                empresa.regime_tributario || "Não Especificado",
            }))
        );

        const totalNovosClientes = dadosTotaisClientesNovos.length;

        setDadosTotaisClientesNovos(dadosTotaisClientesNovos);
        setNovosClientes(totalNovosClientes);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNovosClientes();
  }, [startDate, endDate]);

  useEffect(() => {
    const fetchAniversariosDeParceria = async () => {
      try {
        const body = { start_date: startDate, end_date: endDate };
        const response = await fetch(
          "/api/analise-carteira/aniversario-parceria",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.statusText}`);
        }

        const data = await response.json();

        // Filtro para considerar apenas o mês atual
        const hoje = new Date();
        const mesAtual = hoje.getMonth();
        const empresasFiltradas =
          data.aniversarios.aniversariante_cadastro.empresas.filter(
            (empresa: {
              data_cadastro: string;
              data_inicio_atividades: string;
            }) => {
              const dataCadastro = new Date(empresa.data_cadastro);
              const dataInicio = new Date(empresa.data_inicio_atividades);

              const isDataCadastroNoMesAtual =
                dataCadastro.getMonth() === mesAtual;
              const isDataInicioNoMesAtual = dataInicio.getMonth() === mesAtual;

              return isDataCadastroNoMesAtual || isDataInicioNoMesAtual;
            }
          );

        setAniversariosParceria(empresasFiltradas.length);
        setParceria(empresasFiltradas);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAniversariosDeParceria();
  }, [startDate, endDate]);

  useEffect(() => {
    const fetchAniversariosData = async () => {
      try {
        const response = await fetch(
          "/api/analise-carteira/aniversarios-socios",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              start_date: startDate,
              end_date: endDate,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.statusText}`);
        }

        const data = await response.json();

        // Formata os dados recebidos
        const sociosFormatados = data.map(
          (item: { socio: string; data_nascimento: string }) => {
            const idade =
              new Date().getFullYear() -
              new Date(item.data_nascimento).getFullYear();
            return {
              id: Math.random(),
              nome: item.socio,
              data_nascimento: item.data_nascimento,
              idade,
            };
          }
        );

        // Função que filtra só os aniversariantes do mês atual
        const filtrarAniversariantesDoMes = (socios: Socio[]) => {
          const mesAtual = new Date().getMonth();
          return socios.filter((socio) => {
            const data = new Date(socio.data_nascimento);
            return data.getMonth() === mesAtual;
          });
        };

        const sociosAniversariantes =
          filtrarAniversariantesDoMes(sociosFormatados);

        setSocios(sociosAniversariantes);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAniversariosData();
  }, [startDate, endDate]);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const body = {
          start_date: startDate,
          end_date: endDate,
        };
        const response = await fetch("/api/analise-carteira", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.statusText}`);
        }

        const data = await response.json();

        // Garante que 'escritorios' é array para evitar erros
        const empresasWithEscritorios = data.Empresas.map(
          (e: regimeTributario) => ({
            ...e,
            escritorios: Array.isArray(e.escritorios) ? e.escritorios : [],
          })
        );

        // Atualiza os estados com dados completos e exibidos (todos inicialmente)
        setAllEmpresas(empresasWithEscritorios);
        setEmpresas(empresasWithEscritorios);

        // Extrai os nomes únicos dos escritórios para filtro
        const nomesEscritorios = Array.from(
          new Set(
            empresasWithEscritorios.flatMap((empresa: regimeTributario) =>
              empresa.escritorios!.map(
                (escritorio: Escritorio) => escritorio.nome_escritorio
              )
            )
          )
        ).sort() as string[];

        console.log("🏢 Lista de escritórios:", nomesEscritorios);
        setEscritorios(nomesEscritorios);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [startDate, endDate]);

  if (loading)
    return (
      <div>
        <Reload />
      </div>
    );
  if (error) return <div>Erro: {error}</div>;

  const clientesAtivos = empresas.filter((item) => item.situacao === "A");
  const clientesInativos = empresas.filter((item) => item.situacao === "I");
  const clientesBaixados = empresas.filter(
    (item) => item.motivo_inatividade === 2
  );
  const clientesTransferidas = empresas.filter(
    (item) => item.motivo_inatividade === 3
  );

  const cardsData = [
    {
      title: "Clientes Ativos",
      value: clientesAtivos.length,
      icon: "/assets/icons/Add user 02.svg",
    },
    {
      title: "Novos Clientes",
      value: novosClientes,
      icon: "/assets/icons/Add user 03.svg",
    },
    {
      title: "Clientes Inativos",
      value: clientesInativos.length,
      icon: "/assets/icons/Add user 01.svg",
    },
    {
      title: "Bloqueados / Baixados",
      value: clientesBaixados.length + clientesTransferidas.length,
      icon: "/assets/icons/no user 01.svg",
    },
    {
      title: "Aniversário de Parceria",
      value: aniversariosParceria,
      icon: "/assets/icons/clock 01.svg",
    },
    {
      title: "Sócio(s) Aniversariante(s)",
      value: socios.length,
      icon: "/assets/icons/business user 01.svg",
    },
  ];

  return (
    <div className="bg-gray-100 max-h-screen relative">
      <div className="h-[70px] flex flex-row items-center p-4 gap-8 border-b border-black/10 bg-gray-100">
        <div className="flex items-center gap-4">
          <h1
            className={`text-[32px] leading-8 ${cairo.className} font-700 text-black text-left`}
          >
            Carteira de Clientes
          </h1>
          <div className="flex items-center gap-2 ml-4">
            <select
              value={selectedOption}
              onChange={handleEscritorioSelectChange}
              className="flex items-center justify-center p-2 shadow-md bg-white w-[334px] h-[36px] rounded-md"
            >
              <option>Selecionar Todos</option>
              {escritorios.map((escritorio, index) => {
                // Pegando apenas os dois primeiros nomes
                const nomeCurto = escritorio.split(" ").slice(0, 4).join(" ");
                return (
                  <option key={index} value={escritorio}>
                    {nomeCurto}
                  </option>
                );
              })}
            </select>
            <Calendar
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
            />
          </div>
        </div>
      </div>
      <div className="h-full overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="w-full h-[112px] flex flex-row p-4 gap-8">
            {cardsData.map((card, index) => (
              <Card
                key={index}
                title={card.title}
                value={card.value}
                icon={card.icon}
                onClick={() => handleCardClick(card.title)}
              />
            ))}
          </div>
          <Modal
            isOpen={isEmpresasCardModalOpen}
            onClose={() => setIsEmpresasCardModalOpen(false)}
          >
            <ModalEmpresasCard
              dados={empresas}
              onClose={() => setIsEmpresasCardModalOpen(false)}
              filtrosIniciais={filtrosSelecionados}
              dadosNovos={dadosTotaisClientesNovos} // Passando os novos clientes
            />
          </Modal>
          <Modal
            isOpen={isModalOpen === "Empresas por Regime Tributário"}
            onClose={() => setIsModalOpen(null)}
          >
            <ModalRegimeTributario
              dados={empresas}
              onClose={() => setIsModalOpen(null)}
            />
          </Modal>
          <Modal
            isOpen={isModalRamoOpen}
            onClose={() => setIsModalRamoOpen(false)}
          >
            <ModalRamoAtividade
              dados={empresas}
              onClose={() => setIsModalRamoOpen(false)}
            />
          </Modal>
          <Modal
            isOpen={isModalOpen === "Aniversário de Parceria"}
            onClose={() => setIsModalOpen(null)}
          >
            <AniversariantesParceiros
              dados={parceria}
              onClose={() => setIsModalOpen(null)}
            />
          </Modal>
          <Modal
            isOpen={isModalOpen === "Sócio(s) Aniversariante(s)"}
            onClose={() => setIsModalOpen(null)}
          >
            <AniversariantesSocios
              dados={socios}
              onClose={() => setIsModalOpen(null)}
            />
          </Modal>
          <div className="flex flex-col md:flex-row gap-4 p-4">
            <div className="bg-white shadow rounded-md w-full md:w-1/2 h-[381px] flex items-center justify-center overflow-hidden cursor-pointer relative">
              <div
                onClick={() =>
                  handleOpenModal("Empresas por Regime Tributário")
                }
                className="absolute top-2 right-2 cursor-pointer"
              >
                <Image
                  src="/assets/icons/Vector 1275.svg"
                  width={12}
                  height={13.33}
                  alt="seta"
                />
              </div>
              <PieChartComponent
                data={regimesData}
                onClick={() =>
                  handleOpenModal("Empresas por Regime Tributário")
                }
              />
            </div>
            <div
              className="bg-white shadow rounded-md w-full md:w-1/2 h-[381px] flex items-center justify-center overflow-hidden cursor-pointer relative"
              onClick={handleOpenModalRamo}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalRamoOpen(true);
                }}
                className="absolute top-2 right-2 cursor-pointer"
              >
                <Image
                  src="/assets/icons/Vector 1275.svg"
                  width={12}
                  height={14.33}
                  alt="seta"
                />
              </div>
              <RamoAtividade
                data={ramoAtividadeData}
                onClick={() => setIsModalRamoOpen(false)}
              />
            </div>
          </div>
          <div className="px-4 pb-4">
            <Evolucao data={evolucaoData} />
          </div>
        </div>
      </div>
    </div>
  );
}
