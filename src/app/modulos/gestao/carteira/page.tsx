"use client";
import { useState, useEffect } from "react";
import Card from "./components/card";
import PieChartComponent from "./components/PieChart"; // Importando o PieChartComponent
import RamoAtividadeChart from "./components/RamoAtividade";
import Evolucao from "./components/evolucao";
import Modal from "./components/modal";
import AniversariantesParceiros from "./components/aniversario-parceria";
import AniversariantesSocios from "./components/socios-aniversariantes";
import { Cairo } from "next/font/google";
import ModalRegimeTributario from "./components/modal-regime-tributario"; // Modal correto para o gráfico

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

// erro tipagem
interface Empresa {
  situacao: string;
  regime_tributario: string;
}

interface Regime {
  name: string;
  value: number;
  empresas: Empresa[];
}

export default function Carteira() {
  const [selectedOption, setSelectedOption] = useState<string>("Selecionar Todos");
  const [isModalOpen, setIsModalOpen] = useState<string | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [Socios, setSocios] = useState<Empresa[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [regimesData, setRegimesData] = useState<Regime[]>([]); 

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  const handleOpenModal = () => {
    setIsModalOpen("Empresas por Regime Tributário");
  };

useEffect(() => {
  const fetchAniversariosData = async () => {
    try {
      const response = await fetch("/api/analise-carteira/aniversarios-socios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: "2024-01-01", // teste
          end_date: "2025-12-31",
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data); 

      if (Array.isArray(data)) {
        setSocios(data);

      } else {
        setError("Estrutura de dados inesperada");
      }
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

        const groupedByRegime = data.Empresas.reduce((acc: { [key: string]: Regime }, empresa: Empresa) => {
          const regime = empresa.regime_tributario;
          if (!acc[regime]) acc[regime] = { name: regime, value: 0, empresas: [] };
          acc[regime].value += 1;
          acc[regime].empresas.push(empresa); // Adiciona a empresa ao regime
          return acc;
        }, {});

        const regimes: Regime[] = Object.values(groupedByRegime).map((item) => ({
          name: (item as Regime).name,
          value: (item as Regime).value,
          empresas: (item as Regime).empresas, // Passa as empresas filtradas
        }));

        setRegimesData(regimes);

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

  console.log(empresas);

  const cardsData = [
    { title: "Clientes Ativos", value: clientesAtivos.length, icon: "/assets/icons/Add user 02.svg" },
    { title: "Novos Clientes", value: 150, icon: "/assets/icons/Add user 03.svg" },
    { title: "Clientes Inativos", value: clientesInativos.length, icon: "/assets/icons/Add user 01.svg" },
    { title: "Sem movimento / Baixados", value: 0, icon: "/assets/icons/no user 01.svg" },
    { title: "Aniversário de Parceria", value: 50, icon: "/assets/icons/clock 01.svg" },
    { title: "Sócio(s) Aniversariante(s)", value: Socios.length, icon: "/assets/icons/business user 01.svg" }
  ];

  return (
    <div className="bg-gray-100 min-h-screen relative">
      <div className="h-[85px] flex flex-row items-center p-4 gap-8 border-b border-black/10 bg-gray-100">
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

            <button className="p-2 rounded-lg border border-gray-300 bg-white shadow-md hover:bg-gray-100 transition w-32 text-[#9CA3AF]">
              Data inicial
            </button>
            <button className="p-2 rounded-lg border border-gray-300 bg-white shadow-md hover:bg-gray-100 transition w-32 text-[#9CA3AF]">
              Data final
            </button>
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
            onClick={handleOpenModal}
          />
        ))}
      </div>

      <Modal isOpen={isModalOpen === "Empresas por Regime Tributário"} onClose={() => setIsModalOpen(null)}>
        <ModalRegimeTributario />
      </Modal>

      <Modal isOpen={isModalOpen === "Aniversário de Parceria"} onClose={() => setIsModalOpen(null)}>
        <AniversariantesParceiros />
      </Modal>

      <Modal isOpen={isModalOpen === "Sócio(s) Aniversariante(s)"} onClose={() => setIsModalOpen(null)}>
        <AniversariantesSocios />
      </Modal>

      <div className="flex flex-row gap-2 p-4 justify-between items-center h-[381px]">
        <div className="bg-card text-card-foreground shadow w-full h-full rounded-sm overflow-auto">
          <PieChartComponent 
          data={regimesData}
          onClick={() => handleOpenModal()} />
        </div>
        <div className="bg-card text-card-foreground shadow w-full h-full rounded-sm overflow-auto">
          <div>
            <RamoAtividadeChart />
          </div>
        </div>
      </div>

      <div className="mt-4 p-4">
        <Evolucao />
      </div>
    </div>
  );
}
