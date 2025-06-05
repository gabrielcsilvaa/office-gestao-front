import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import Image from "next/image";

interface Parceria {
  codi_emp: number;
  nome: string;
  cnpj: string;
  data_cadastro: string;
  data_inicio_atividades: string;
}

interface AniversariantesParceirosProps {
  dados: Parceria[];
  onClose: () => void;
}

export default function AniversariantesParceiros({
  dados,
  onClose,
}: AniversariantesParceirosProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Parceria;
    direction: "asc" | "desc";
  }>({
    key: "nome",
    direction: "asc",
  });

  const [searchQuery, setSearchQuery] = useState<string>("");

  // Lista de empresas a serem excluídas
  const empresasExcluidas = [
    "EMPRESA EXEMPLO REAL LTDA",
    "EMPRESA EXEMPLO PRESUMIDO LTDA",
    "EMPRESA EXEMPLO SIMPLES NACIONAL LTDA",
    "EMPRESA DESONERAÇÃO DA EMPRESA DESONERAÇÃO DA",
    "EMPRESA DESONERAÇÃO DA FOLHA",
    "EMPRESA DOMÉSTICO",
    "EMPRESA MODELO - EVENTOS E-SOCIAL",
    "EMPRESA MODELO CONTÁBIL SPED",
    "EMPRESA MODELO PLANO DE CONTAS CONTABIL", 
    "SILVEIRA FONTENELE - EMPRESA MODELO",
    "EMPRESA SIMPLES - COMERCIO",
    "EMPRESA SIMPLES - COMERCIO E SERVIÇO",
    "EMPRESA SIMPLES - COMERCIO E IND",
    "EMPRESA SIMPLES - COMERCIO, SERV E IND",
    "EMPRESA SIMPLES - INDUSTRIA",
    "EMPRESA SIMPLES - MEI",
    "EMPRESA SIMPLES - SERVIÇO", 
    "LUCRO PRESUMIDO - COM, SERV E IND", 
    "LUCRO PRESUMIDO - COMERCIO",
    "LUCRO PRESUMIDO - COMERCIO E INDUSTRIA",
    "LUCRO PRESUMIDO - COMERCIO E SERVIÇO",
    "LUCRO PRESUMIDO - INDUSTRIA",
    "LUCRO PRESUMIDO - POSTO DE COMBUSTIVEL",
    "LUCRO PRESUMIDO - SERVIÇO",
    "LUCRO PRESUMIDO - TRANSPORTADORA",
    "LUCRO REAL - COM, SERV E IND",
    "LUCRO REAL - INDUSTRIA",
    "LUCRO REAL - SERVIÇO",
    "LUCRO REAL - TRANSPORTADORA",
    "LUCRO REAL- COMERCIO",
    "MODELO LUCRO PRESUMIDO - COM SERV",
    "MODELO LUCRO PRESUMIDO - SERVIÇO",
    "MODELO SIMPLES NACIONAL - COM SERV",
    "MODELO SIMPLES NACIONAL - COM SERV IND",
    "MODELO SIMPLES NACIONAL - COMERCIO",
    "MODELO SIMPLES NACIONAL - SERVIÇO",
  ];

  // Função para formatar a data com tratamento de segurança
  const formatDateBr = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const ano = date.getFullYear();

    return `${dia}/${mes}/${ano}`;
  };

  const calculateYears = (dateString: string): number => {
    if (!dateString) return 0;

    const startDate = new Date(dateString);
    const today = new Date();

    if (isNaN(startDate.getTime())) return 0;

    const years = today.getFullYear() - startDate.getFullYear();
    const months = today.getMonth() - startDate.getMonth();
    const isCompleteYear =
      months < 0 || (months === 0 && today.getDate() < startDate.getDate());

    return isCompleteYear ? years - 1 : years;
  };

  // Função para ordenar os dados
  const sortData = (key: keyof Parceria) => {
    const direction = sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const searchQueryNormalized = searchQuery.toLowerCase().trim();
  const cnpjQuery = searchQuery.replace(/\D/g, "");

  // Função para filtrar as datas considerando apenas o dia (comparação por dia)
  const filterByDay = (data: string) => {
    const date = new Date(data);
    return date.getDate(); // Retorna apenas o dia
  };

  // Filtrando os dados de acordo com a pesquisa e a lógica do filtro por dia
  const filteredClientes = dados
    .filter((empresa) => {
      const nomeEmpresa = empresa.nome.toLowerCase();
      const nomeMatch = nomeEmpresa.includes(searchQueryNormalized);

      const cnpjEmpresa = empresa.cnpj.replace(/\D/g, "");
      const cnpjMatch = cnpjQuery ? cnpjEmpresa.includes(cnpjQuery) : false;

      // Filtragem pelo dia de cadastro e início de atividades
      const dataCadastroDia = filterByDay(empresa.data_cadastro);
      const dataInicioDia = filterByDay(empresa.data_inicio_atividades);

      return (
        (nomeMatch || cnpjMatch) &&
        (dataCadastroDia || dataInicioDia)
      );
    })
    // Excluir empresas da lista
    .filter((empresa) => !empresasExcluidas.includes(empresa.nome));

  // Ordenação dos dados com tratamento de tipos
  const sortedClientes = filteredClientes.sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    // Ordenando pela data de cadastro ou início de atividades com base no dia
    if (sortConfig.key === "data_cadastro" || sortConfig.key === "data_inicio_atividades") {
      const aDate = new Date(aValue as string);
      const bDate = new Date(bValue as string);

      // Compara apenas pelo dia (ignorando o mês e o ano)
      const aDay = aDate.getDate();
      const bDay = bDate.getDate();
      return sortConfig.direction === "asc"
        ? aDay - bDay
        : bDay - aDay;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  // Função para exportar para PDF
  const exportToPDF = (data: Parceria[], fileName: string) => {
    const doc = new jsPDF();
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    
    const tableData = data.map((parceria) => [
      parceria.nome,
      formatDateBr(parceria.data_cadastro),
      calculateYears(parceria.data_cadastro),
      formatDateBr(parceria.data_inicio_atividades),
      calculateYears(parceria.data_inicio_atividades)
    ]);

    const tableHeaders = ['Nome', 'Data Cadastro', 'Anos de Parceria', 'Data Início Atividades', 'Anos de Atividade'];

    autoTable(doc, {
      startY: 50,
      head: [tableHeaders],
      body: tableData,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 1,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
        textColor: [50, 50, 50],
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 40, halign: 'right' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 40, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' },
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: 4, right: 2 },
      didDrawPage: function (data) {
        doc.setFontSize(8);
        doc.text('Página ' + data.pageNumber, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    doc.save(`${fileName}.pdf`);
  };

  // Função para exportar para Excel
  const exportToExcel = (data: Parceria[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(data.map((parceria) => ({
      Nome: parceria.nome,
      "Data Cadastro": formatDateBr(parceria.data_cadastro),
      "Anos de Parceria": calculateYears(parceria.data_cadastro),
      "Data Início Atividades": formatDateBr(parceria.data_inicio_atividades),
      "Anos de Atividade": calculateYears(parceria.data_inicio_atividades)
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Aniversariantes");

    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <div className="max-h-[90vh] flex flex-col gap-4 overflow-x-auto w-full">
      <div className="flex items-center justify-between p-4 bg-white shadow rounded-md mb-4">
        <h1 className="text-2xl font-bold font-cairo text-gray-800">
          Aniversário de Parceria
        </h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Pesquisar por nome ou CNPJ..."
            className="border border-gray-300 rounded-md p-2 w-96 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fechar modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={() => exportToPDF(sortedClientes, "Aniversariantes_Parcerias")}
          className="p-1 rounded border border-gray-300 hover:bg-green-100 mt-auto"
          style={{ width: 36, height: 36 }}
        >
          <Image
            src="/assets/icons/pdf.svg"
            alt="Ícone PDF"
            width={24}
            height={24}
            draggable={false}
          />
        </button>

        <button
          onClick={() => exportToExcel(sortedClientes, "Aniversariantes_Parcerias")}
          className="p-1 rounded border border-gray-300 hover:bg-green-100 mt-auto"
          style={{ width: 36, height: 36 }}
        >
          <Image
            src="/assets/icons/excel.svg"
            alt="Ícone Excel"
            width={24}
            height={24}
            draggable={false}
          />
        </button>
      </div>

      {/* Tabela */}
      <table className="w-full border border-gray-300 text-sm font-cairo">
        <thead>
          <tr className="bg-gray-200 border-b-[1px] border-gray-400">
            <th className="px-4 py-2 border-r">#</th>
            <th
              className="px-4 py-2 cursor-pointer border-r"
              onClick={() => sortData("nome")}
            >
              Empresa{" "}
              {sortConfig.key === "nome" &&
                (sortConfig.direction === "asc" ? " ↑" : " ↓")}
            </th>
            <th className="px-4 py-2 border-r">CNPJ</th>
            <th
              className="px-4 py-2 cursor-pointer border-r"
              onClick={() => sortData("data_cadastro")}
            >
              Data de Cadastro{" "}
              {sortConfig.key === "data_cadastro" &&
                (sortConfig.direction === "asc" ? " ↑" : " ↓")}
            </th>            
            <th className="px-4 py-2 border-r">Anos de Parceria</th>
            <th
              className="px-4 py-2 cursor-pointer border-r"
              onClick={() => sortData("data_inicio_atividades")}
            >
              Data de Início de Atividades{" "}
              {sortConfig.key === "data_inicio_atividades" &&
                (sortConfig.direction === "asc" ? " ↑" : " ↓")}
            </th>            
            <th className="px-4 py-2">Anos de Atividade</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {sortedClientes.map((empresa, index) => {
            const anosParceria = calculateYears(empresa.data_cadastro);
            const anosAtividade = calculateYears(empresa.data_inicio_atividades);

            return (
              <tr key={empresa.codi_emp} className="border-b border-gray-300">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{empresa.nome}</td>
                <td className="px-4 py-2">{empresa.cnpj}</td>
                <td className="px-4 py-2">{formatDateBr(empresa.data_cadastro)}</td>
                <td className="px-4 py-2">{anosParceria} {anosParceria === 1 ? "ano" : "anos"}</td>
                <td className="px-4 py-2">{formatDateBr(empresa.data_inicio_atividades)}</td>
                <td className="px-4 py-2">{anosAtividade} {anosAtividade === 1 ? "ano" : "anos"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
