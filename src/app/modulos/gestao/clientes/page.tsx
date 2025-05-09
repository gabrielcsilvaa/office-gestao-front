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
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center w-full p-4">
        <input
          type="text"
          id="inputText"
          value={value}
          onChange={handleChange}
          className="bg-white border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder="Buscar Empresa"
        />
      </div>

      <div className="h-[calc(82vh-85px)] w-full overflow-y-auto p-4">
        <div className="w-max min-w-full shadow-black shadow-lg">
          <div className="overflow-x-auto p-4 bg-white shadow-md rounded-lg">
            {clientData && <ListaEmpresas empresas={clientData} />}
            {/* COMEÇA A LISTA DE EMPRESAS AQUI */}
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="table-header">Razão Social</th>
                  <th className="table-header">CPF/CNPJ</th>
                  <th className="table-header">Data Cadastro</th>
                  <th className="table-header">Data Criação</th>
                  <th className="table-header">Sócio</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="table-cell">
                    YAKAMOTHO AUTOMACAO E TECNOLOGIA LTDA
                  </td>
                  <td className="table-cell">48.860.094/0001-03</td>
                  <td className="table-cell">11/12/2022</td>
                  <td className="table-cell">11/12/2022</td>
                  <td className="table-cell"></td>
                </tr>
              </tbody>
            </table>
            <table className="table-auto mt-4 mb-7">
              <thead>
                <tr>
                  <th className="table-header"></th>
                  <th className="table-header">mar de 2025</th>
                  <th className="table-header">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="table-cell">Faturamento da Empresa</td>
                  <td className="table-cell">R$ 0,00</td>
                  <td className="table-cell">R$ 0,00</td>
                </tr>
                <tr>
                  <td className="table-cell">Variação de Faturamento</td>
                  <td className="table-cell">0%</td>
                  <td className="table-cell">0,00%</td>
                </tr>
                <tr>
                  <td className="table-cell">Tempo Gasto no Sistema</td>
                  <td className="table-cell">00:32:29</td>
                  <td className="table-cell">00:32:29</td>
                </tr>
                <tr>
                  <td className="table-cell">Lançamentos</td>
                  <td className="table-cell">0</td>
                  <td className="table-cell">0</td>
                </tr>
                <tr>
                  <td className="table-cell">% de Lançamentos Manuais</td>
                  <td className="table-cell">0%</td>
                  <td className="table-cell">0,00%</td>
                </tr>
                <tr>
                  <td className="table-cell">Vínculos de Folhas Ativos</td>
                  <td className="table-cell">0</td>
                  <td className="table-cell">0</td>
                </tr>
                <tr>
                  <td className="table-cell">Notas Fiscais Emitidas</td>
                  <td className="table-cell">0</td>
                  <td className="table-cell">0</td>
                </tr>
                <tr>
                  <td className="table-cell">
                    Total de Notas Fiscais Movimentadas
                  </td>
                  <td className="table-cell">0</td>
                  <td className="table-cell">0</td>
                </tr>
                <tr>
                  <td className="table-cell">Faturamento do Escritório</td>
                  <td className="table-cell">R$ 705,00</td>
                  <td className="table-cell">R$ 705,00</td>
                </tr>
                <tr>
                  <td className="table-cell">Custo Operacional</td>
                  <td className="table-cell">R$ 10,83</td>
                  <td className="table-cell">R$ 10,83</td>
                </tr>
                <tr>
                  <td className="table-total">Rentabilidade Operacional</td>
                  <td className="table-total">R$ 694,80</td>
                  <td className="table-total">R$ 694,80</td>
                </tr>
              </tbody>
            </table>

            {/* COMEÇA A LISTA DE EMPRESAS AQUI */}
            <table className="table-auto">
              <thead>
                <tr>
                  <th className="table-header">Razão Social</th>
                  <th className="table-header">CPF/CNPJ</th>
                  <th className="table-header">Data Cadastro</th>
                  <th className="table-header">Data Criação</th>
                  <th className="table-header">Sócio</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="table-cell">
                    YAKAMOTHO AUTOMACAO E TECNOLOGIA LTDA
                  </td>
                  <td className="table-cell">48.860.094/0001-03</td>
                  <td className="table-cell">11/12/2022</td>
                  <td className="table-cell">11/12/2022</td>
                  <td className="table-cell"></td>
                </tr>
              </tbody>
            </table>
            <table className="table-auto mt-4 mb-7">
              <thead>
                <tr>
                  <th className="table-header"></th>
                  <th className="table-header">mar de 2025</th>
                  <th className="table-header">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="table-cell">Faturamento da Empresa</td>
                  <td className="table-cell">R$ 0,00</td>
                  <td className="table-cell">R$ 0,00</td>
                </tr>
                <tr>
                  <td className="table-cell">Variação de Faturamento</td>
                  <td className="table-cell">0%</td>
                  <td className="table-cell">0,00%</td>
                </tr>
                <tr>
                  <td className="table-cell">Tempo Gasto no Sistema</td>
                  <td className="table-cell">00:32:29</td>
                  <td className="table-cell">00:32:29</td>
                </tr>
                <tr>
                  <td className="table-cell">Lançamentos</td>
                  <td className="table-cell">0</td>
                  <td className="table-cell">0</td>
                </tr>
                <tr>
                  <td className="table-cell">% de Lançamentos Manuais</td>
                  <td className="table-cell">0%</td>
                  <td className="table-cell">0,00%</td>
                </tr>
                <tr>
                  <td className="table-cell">Vínculos de Folhas Ativos</td>
                  <td className="table-cell">0</td>
                  <td className="table-cell">0</td>
                </tr>
                <tr>
                  <td className="table-cell">Notas Fiscais Emitidas</td>
                  <td className="table-cell">0</td>
                  <td className="table-cell">0</td>
                </tr>
                <tr>
                  <td className="table-cell">
                    Total de Notas Fiscais Movimentadas
                  </td>
                  <td className="table-cell">0</td>
                  <td className="table-cell">0</td>
                </tr>
                <tr>
                  <td className="table-cell">Faturamento do Escritório</td>
                  <td className="table-cell">R$ 705,00</td>
                  <td className="table-cell">R$ 705,00</td>
                </tr>
                <tr>
                  <td className="table-cell">Custo Operacional</td>
                  <td className="table-cell">R$ 10,83</td>
                  <td className="table-cell">R$ 10,83</td>
                </tr>
                <tr>
                  <td className="table-total">Rentabilidade Operacional</td>
                  <td className="table-total">R$ 694,80</td>
                  <td className="table-total">R$ 694,80</td>
                </tr>
              </tbody>
            </table>

            {/* COMEÇA A LISTA DE EMPRESAS AQUI */}
            <table className="table-auto">
              <thead>
                <tr>
                  <th className="table-header">Razão Social</th>
                  <th className="table-header">CPF/CNPJ</th>
                  <th className="table-header">Data Cadastro</th>
                  <th className="table-header">Data Criação</th>
                  <th className="table-header">Sócio</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="table-cell">
                    YAKAMOTHO AUTOMACAO E TECNOLOGIA LTDA
                  </td>
                  <td className="table-cell">48.860.094/0001-03</td>
                  <td className="table-cell">11/12/2022</td>
                  <td className="table-cell">11/12/2022</td>
                  <td className="table-cell"></td>
                </tr>
              </tbody>
            </table>
            <table className="table-auto mt-4 mb-7">
              <thead>
                <tr>
                  <th className="table-header"></th>
                  <th className="table-header">mar de 2025</th>
                  <th className="table-header">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="table-cell">Faturamento da Empresa</td>
                  <td className="table-cell">R$ 0,00</td>
                  <td className="table-cell">R$ 0,00</td>
                </tr>
                <tr>
                  <td className="table-cell">Variação de Faturamento</td>
                  <td className="table-cell">0%</td>
                  <td className="table-cell">0,00%</td>
                </tr>
                <tr>
                  <td className="table-cell">Tempo Gasto no Sistema</td>
                  <td className="table-cell">00:32:29</td>
                  <td className="table-cell">00:32:29</td>
                </tr>
                <tr>
                  <td className="table-cell">Lançamentos</td>
                  <td className="table-cell">0</td>
                  <td className="table-cell">0</td>
                </tr>
                <tr>
                  <td className="table-cell">% de Lançamentos Manuais</td>
                  <td className="table-cell">0%</td>
                  <td className="table-cell">0,00%</td>
                </tr>
                <tr>
                  <td className="table-cell">Vínculos de Folhas Ativos</td>
                  <td className="table-cell">0</td>
                  <td className="table-cell">0</td>
                </tr>
                <tr>
                  <td className="table-cell">Notas Fiscais Emitidas</td>
                  <td className="table-cell">0</td>
                  <td className="table-cell">0</td>
                </tr>
                <tr>
                  <td className="table-cell">
                    Total de Notas Fiscais Movimentadas
                  </td>
                  <td className="table-cell">0</td>
                  <td className="table-cell">0</td>
                </tr>
                <tr>
                  <td className="table-cell">Faturamento do Escritório</td>
                  <td className="table-cell">R$ 705,00</td>
                  <td className="table-cell">R$ 705,00</td>
                </tr>
                <tr>
                  <td className="table-cell">Custo Operacional</td>
                  <td className="table-cell">R$ 10,83</td>
                  <td className="table-cell">R$ 10,83</td>
                </tr>
                <tr>
                  <td className="table-total">Rentabilidade Operacional</td>
                  <td className="table-total">R$ 694,80</td>
                  <td className="table-total">R$ 694,80</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
