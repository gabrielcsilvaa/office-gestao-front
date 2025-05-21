"use client";
import { Cairo } from "next/font/google";
import { useState, useEffect } from "react";
import { EmpresaAnalise } from "./interface/interfaces";
import { ListaEmpresas } from "./components/tableCreator";
import Calendar from "@/components/calendar";
import { formatDate } from "./services/formatDate";
import Pagination from "./components/pagination";
import Reload from "@/components/reload";
const cairo = Cairo({
  weight: ["500", "600", "700"], // Você pode especificar os pesos que deseja (normal e negrito)
  subsets: ["latin"],
});

export default function Clientes() {
  //Dados
  const [value, setValue] = useState("");
  const [clientData, setClientData] = useState<EmpresaAnalise[] | null>(null);
  const [filteredData, setFilteredData] = useState<EmpresaAnalise[] | null>(
    null
  );
  //Loading e Erro
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  //Estados de data
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  //Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //Aguardando colocar data
  const [awaitDateSelection, setAwaitDateSelection] = useState(true); // Tela de seleção de data

  const handleStartDateChange = (date: string | null) => {
    setStartDate(date);
    setAwaitDateSelection(false); // Remove a tela de seleção de data
    setCurrentPage(1);
  };

  const handleEndDateChange = (date: string | null) => {
    setEndDate(date);
    setAwaitDateSelection(false); // Remove a tela de seleção de data
    setCurrentPage(1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);

        // Formata as datas antes de enviar
        const formattedStartDate = formatDate(
          startDate ? new Date(startDate) : null
        );
        const formattedEndDate = formatDate(endDate ? new Date(endDate) : null);

        const body = {
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        };

        const response = await fetch("/api/analise-clientes", {
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
        // Ordenar as empresas por nome alfabético e remover espaços à esquerda
        const sortedData = data.sort(
          (a: EmpresaAnalise, b: EmpresaAnalise) =>
            a.nome_empresa.trimStart().localeCompare(b.nome_empresa.trimStart()) // Aplicar trimStart() para remover espaços à esquerda antes da comparação
        );

        setClientData(sortedData); // Armazena os dados ordenados
        setFilteredData(sortedData); // Inicialmente, os dados filtrados são os mesmos que os dados completos
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

    // Só faz a requisição quando as datas estiverem definidas
    if (startDate && endDate) {
      fetchClientData();
    }
  }, [startDate, endDate]); // Executa quando startDate ou endDate mudam

  // Filtro dinâmico
  useEffect(() => {
    if (clientData) {
      const lowercasedValue = value.toLowerCase(); // Converte o valor digitado para minúsculas
      const filtered = clientData.filter(
        (empresa) =>
          empresa.nome_empresa.toLowerCase().includes(lowercasedValue) // Filtra pelo nome da empresa
      );
      setFilteredData(filtered); // Atualiza os dados filtrados
    }
  }, [value, clientData]); // Executa o filtro sempre que o valor de pesquisa ou os dados mudarem

  //Paginação

  // Função para calcular as empresas a serem exibidas na página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Verifica se filteredData existe e se não é null
  const currentItems = filteredData
    ? filteredData.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = filteredData
    ? Math.ceil(filteredData.length / itemsPerPage)
    : 0;

  return (
    <div className="max-h-screen bg-gray-100">
      <div className="h-[70px] flex flex-row items-end p-2 gap-8 border-b border-black/10 bg-gray-100">
        <div className="flex items-center gap-4">
          <h1
            className={`text-[32px] leading-8 ${cairo.className} font-700 text-black text-left`}
          >
            Análise de Clientes
          </h1>

          <div className="flex items-center gap-2 ml-4">
            {/* SELEÇÃO DE DATAS  */}
            <Calendar
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
            />
            <input
              type="text"
              id="inputText"
              value={value}
              onChange={handleChange}
              className={`${cairo.className} bg-white border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400`}
              placeholder="Buscar Empresa"
            />
          </div>
        </div>
      </div>

      {/* Conteúdo da Tabela e Loading */}
      <div className="h-[calc(95vh-85px)] w-full overflow-y-auto p-4 rounded-lg">
        <div className="w-max min-w-full shadow-gray-300 shadow-md rounded-lg">
          <div className="overflow-x-auto p-4 bg-white shadow-md rounded-lg">
            {awaitDateSelection && (
              <div className="flex justify-center items-center h-[70vh] bg-gray-200">
                <div className={`${cairo.className} text-center p-4`}>
                  <p className="text-xl mb-4">
                    Selecione uma data para carregar os dados
                  </p>
                </div>
              </div>
            )}

            {loading ? (
              <Reload />
            ) : error ? (
              <div
                className={`${cairo.className} not-only-of-type:flex justify-center items-center h-[70vh] bg-gray-200`}
              >
                <div>Erro: Dados não foram encontrados</div>
              </div>
            ) : (
              currentItems && (
                <ListaEmpresas
                  empresas={currentItems}
                  start_date={startDate}
                  end_date={endDate}
                />
              )
            )}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
