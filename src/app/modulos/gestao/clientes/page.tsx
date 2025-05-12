"use client";
import { Cairo } from "next/font/google";
import { useState, useEffect } from "react";
import { EmpresaAnalise } from "./interface/interfaces";
import { ListaEmpresas } from "./components/tableCreator";
const cairo = Cairo({
  weight: ["500", "600", "700"], // Você pode especificar os pesos que deseja (normal e negrito)
  subsets: ["latin"],
});

export default function Clientes() {
  const [value, setValue] = useState("");
  const [clientData, setClientData] = useState<EmpresaAnalise[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const body = { start_date: "2024-01-01", end_date: "2024-12-31" };
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
        setClientData(data);
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
  }, []); // executa uma vez no mount

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className=" max-h-screen bg-gray-100">
      <div className="h-[85px] flex flex-row items-center p-4 gap-8 border-b border-black/10 bg-gray-100">
        <div className="flex items-center gap-4">
          <h1
            className={`text-[32px] leading-8 ${cairo.className} font-700 text-black text-left`}
          >
            Análise de Clientes
          </h1>

          <div className="flex items-center gap-2 ml-4 ">
            {/*SELEÇÃO DE DATAS  */}
            <button
              className="p-2 rounded-lg border border-gray-300 bg-white shadow-md hover:bg-gray-100 transition w-32 text-[#9CA3AF]"
              onClick={() => console.log("Data inicial clicked")}
            >
              Data inicial
            </button>
            <button
              className="p-2 rounded-lg border border-gray-300 bg-white shadow-md hover:bg-gray-100 transition w-32 text-[#9CA3AF]"
              onClick={() => console.log("Data final clicked")}
            >
              Data final
            </button>
            {/*SELEÇÃO DE DATAS  */}
            <input
              type="text"
              id="inputText"
              value={value}
              onChange={handleChange}
              className="bg-white border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Buscar Empresa"
            />
          </div>
        </div>
      </div>

      {/* <div className="flex justify-between items-center w-full p-4">
 
      </div> */}

      <div className="h-[calc(95vh-85px)] w-full overflow-y-auto p-4">
        <div className="w-max min-w-full shadow-black shadow-lg">
          <div className="overflow-x-auto p-4 bg-white shadow-md rounded-lg">
            {clientData && <ListaEmpresas empresas={clientData} />}
          </div>
        </div>
      </div>
    </div>
  );
}
