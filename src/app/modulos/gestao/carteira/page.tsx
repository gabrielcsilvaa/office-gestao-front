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
// Tipagem corrigida
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

interface Socio {
  nome: string;
  aniversario: string;
}

export default function Carteira() {
  const [selectedOption, setSelectedOption] = useState<string>("Selecionar Todos");
  const [isModalOpen, setIsModalOpen] = useState<string | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [socios, setSocios] = useState<Socio[]>([]); // Corrigido a tipagem
  const [parceria, setParceria] = useState<Parceria[]>([]); // Corrigido a tipagem
  const [novosClientes, setNovosClientes] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [regimesData, setRegimesData] = useState<Regime[]>([]);
  const [aniversariosParceria, setAniversariosParceria] = useState<number>(50);
  const [ramoAtividadeData, setRamoAtividadeData] = useState<Array<{ name: string; value: number }>>([]);
  const [evolucaoData, setEvolucaoData] = useState<Array<{ name: string; value: number }>>([]);
  const [startDate, setStartDate] = useState<string | null>("2024-01-01");
  const [endDate, setEndDate] = useState<string | null>("2024-12-31");

  const handleStartDateChange = (date: string | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: string | null) => {
    setEndDate(date);
  };


  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  const handleOpenModal = (title: string) => {
    setIsModalOpen(title);
  };



  useEffect(() => {
    const fetchNovosClientes = async () => {
      try {
        const body = {
          start_date: startDate, 
          end_date: endDate ,
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
        const totalNovosClientes = data.reduce((total: number, item: { value: number }) => total + item.value, 0);
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
        const body = { start_date: "2024-01-01", end_date: "2024-12-31" };
        const response = await fetch("/api/analise-carteira/aniversario-parceria", {
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
        setAniversariosParceria(data.aniversarios.aniversariante_cadastro.total);
        setParceria(data.aniversarios.aniversariante_cadastro.empresas);

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
  }, []);


useEffect(() => {
  const fetchAniversariosData = async () => {
    try {
      const response = await fetch("/api/analise-carteira/aniversarios-socios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: "2024-01-01",
          end_date: "2025-12-31",
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }

      const data = await response.json();

      // Transformar os dados para o formato correto
      const sociosFormatados = data.map((item: { socio: string; data_nascimento: string }) => {
        const idade = new Date().getFullYear() - new Date(item.data_nascimento).getFullYear();
        return {
          id: Math.random(), // Use um ID real se disponível
          nome: item.socio,
          data_nascimento: item.data_nascimento,
          idade,
        };
      });

      setSocios(sociosFormatados);
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
}, []);


  console.log("onsdfdsnflskndsflsnOI", parceria)

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await fetch("/api/analise-carteira", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.statusText}`);
        }

        const data = await response.json();
        setEmpresas(data.Empresas);

        // Process regime data
        const groupedByRegime = data.Empresas.reduce((acc: { [key: string]: Regime }, empresa: Empresa) => {
          const regime = empresa.regime_tributario;
          if (!acc[regime]) acc[regime] = { name: regime, value: 0, empresas: [] };
          acc[regime].value += 1;
          acc[regime].empresas.push(empresa);
          return acc;
        }, {});

        const regimes: Regime[] = Object.values(groupedByRegime).map((item) => ({
          name: (item as Regime).name,
          value: (item as Regime).value,
          empresas: (item as Regime).empresas,
        }));

        setRegimesData(regimes);

        // Process ramo atividade data
        const ramoAtividadeCount = data.Empresas.reduce((acc: { [key: string]: number }, empresa: Empresa) => {
          const ramo = empresa.ramo_atividade || 'Não especificado';
          acc[ramo] = (acc[ramo] || 0) + 1;
          return acc;
        }, {});

        const ramoAtividadeArray = Object.entries(ramoAtividadeCount)
          .map(([name, value]) => ({ name, value: Number(value) }))
          .sort((a, b) => b.value - a.value);

        setRamoAtividadeData(ramoAtividadeArray);

        //data teste para o card evoluçao
        const startEvolucao = new Date("2024-01-01");
        const endEvolucao = new Date("2025-12-01");

        const counts: { [key: string]: number } = {};
        data.Empresas.forEach((empresa: Empresa) => {
          if (empresa.data_cadastro) {
            const dataCadastro = new Date(empresa.data_cadastro);
            if (dataCadastro >= startEvolucao && dataCadastro <= endEvolucao) {
              const key = dataCadastro.toLocaleString('default', { month: 'short', year: 'numeric' }); 
              counts[key] = (counts[key] || 0) + 1;
            }
          }
        });

        // Ordenar por data
        const evolucaoArray = Object.entries(counts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => {
            const [aMonth, aYear] = a.name.split('/');
            const [bMonth, bYear] = b.name.split('/');
            const aDate = new Date(`${aMonth} 1, ${aYear}`);
            const bDate = new Date(`${bMonth} 1, ${bYear}`);
            return aDate.getTime() - bDate.getTime();
          });

        setEvolucaoData(evolucaoArray);

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

    fetchClientData();
  }, []); 

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  const clientesAtivos = empresas.filter((item) => item.situacao === "A");
  const clientesInativos = empresas.filter((item) => item.situacao === "I");
  const clientesBaixados = empresas.filter((item) => item.motivo_inatividade === 2);
  const clientesTransferidas = empresas.filter((item) => item.motivo_inatividade === 3);

  const cardsData = [
    { title: "Clientes Ativos", value: clientesAtivos.length, icon: "/assets/icons/Add user 02.svg" },
    { title: "Novos Clientes", value: novosClientes, icon: "/assets/icons/Add user 03.svg" },
    { title: "Clientes Inativos", value: clientesInativos.length, icon: "/assets/icons/Add user 01.svg" },
    { title: "Bloqueados / Baixados", value: clientesBaixados.length + clientesTransferidas.length, icon: "/assets/icons/no user 01.svg" },
    { title: "Aniversário de Parceria", value: aniversariosParceria, icon: "/assets/icons/clock 01.svg" },
    { title: "Sócio(s) Aniversariante(s)", value: socios.length, icon: "/assets/icons/business user 01.svg" }
  ];

  return (
    <div className="bg-gray-100 min-h-screen relative">
      <div className="h-[70px] flex flex-row items-center p-4 gap-8 border-b border-black/10 bg-gray-100">
        <div className="flex items-center gap-4">
          <h1 className={`text-[32px] leading-8 ${cairo.className} font-700 text-black text-left`}>
            Carteira de Clientes
          </h1>

          <div className="flex items-center gap-2 ml-4">
            <select
              value={selectedOption}
              onChange={handleSelectChange}
              className="flex items-center justify-center p-2 shadow-md bg-white w-[334px] h-[36px] rounded-md"
            >
              <option>Selecionar Todos</option>
              <option>Opção 1</option>
              <option>Opção 2</option>
            </select>

            <Calendar
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
              />
          </div>
        </div>
      </div>

      <div className="w-full h-[112px] flex flex-row p-4 gap-8">
        {cardsData.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            onClick={() => handleOpenModal(card.title)}
          />
        ))}
      </div>

      <Modal isOpen={isModalOpen === "Empresas por Regime Tributário"} onClose={() => setIsModalOpen(null)}>
        <ModalRegimeTributario dados={empresas} onClose={() => setIsModalOpen(null)}/>
      </Modal>

      <Modal isOpen={isModalOpen === "Aniversário de Parceria"} onClose={() => setIsModalOpen(null)}>
        <AniversariantesParceiros dados={parceria} onClose={() => setIsModalOpen(null)} />
      </Modal>

      <Modal isOpen={isModalOpen === "Sócio(s) Aniversariante(s)"} onClose={() => setIsModalOpen(null)}>
        <AniversariantesSocios dados={socios} onClose={() => setIsModalOpen(null)} />
      </Modal>

      <div className="flex flex-col md:flex-row gap-4 p-4">
        <div 
          className="bg-white shadow rounded-md w-full md:w-1/2 h-[381px] flex items-center justify-center overflow-hidden cursor-pointer"
        >
          <PieChartComponent data={regimesData}
            dados={regimesData} 
            onClick={() => handleOpenModal("Empresas por Regime Tributário")}  
            />
        </div>
        <div 
          className="bg-white shadow rounded-md w-full md:w-1/2 h-[381px] flex items-center justify-center overflow-hidden"
        >
          <RamoAtividade data={ramoAtividadeData} />
        </div>
      </div>

      <div className="mt-4 p-4">
        <Evolucao data={evolucaoData} />
      </div>
    </div>
  );
}
