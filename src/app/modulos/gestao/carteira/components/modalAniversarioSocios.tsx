import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import Image from "next/image";

interface Socio {
  id: number;
  nome: string;
  data_nascimento: string;
  idade?: number; // Tornando idade opcional já que vamos calculá-la
}

interface AniversariantesSociosProps {
  dados: Socio[];
  onClose: () => void;
}

export default function AniversariantesSocios({
  dados,
  onClose,
}: AniversariantesSociosProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Socio;
    direction: "asc" | "desc";
  }>({
    key: "nome",
    direction: "asc",
  });

  const [searchQuery, setSearchQuery] = useState<string>("");

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

  // Função para calcular a idade com tratamento de segurança
  const calcularIdade = (dataNascimento: string): number => {
    if (!dataNascimento) return 0;

    const hoje = new Date();
    const nascimento = new Date(dataNascimento);

    if (isNaN(nascimento.getTime())) return 0;

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();

    if (
      mesAtual < mesNascimento ||
      (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())
    ) {
      idade--;
    }

    return idade;
  };

  // Função para exportar para PDF
  const exportToPDF = (data: Socio[], fileName: string) => {
    const doc = new jsPDF();
    
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    
    const tableData = data.map((socio) => [
      socio.nome.toUpperCase(),
      formatDateBr(socio.data_nascimento),
      calcularIdade(socio.data_nascimento)
    ]);

    const tableHeaders = ['Nome', 'Data de Nascimento', 'Idade'];

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
        1: { cellWidth: 30, halign: 'right' },
        2: { cellWidth: 20, halign: 'right' },
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: 4, right: 2 },
      didDrawPage: function(data) {
        doc.setFontSize(8);
        doc.text('Página ' + data.pageNumber, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    doc.save(`${fileName}.pdf`);
  };

  // Função para exportar para Excel
  const exportToExcel = (data: Socio[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(data.map((socio) => ({
      Nome: socio.nome,
      "Data de Nascimento": formatDateBr(socio.data_nascimento),
      Idade: calcularIdade(socio.data_nascimento),
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Aniversariantes");
    
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  // Função para ordenar os dados
  const sortData = (key: keyof Socio) => {
    const direction = sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

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
      "REAL - COMERCIO E INDUSTRIA",
      "REAL - POSTO DE COMBUSTIVEL",
      "REAL - COMERCIO E SERVIÇO",
      "MATRIZ PRESUMIDO - COM, SERV E IND",
      "FILIAL PRESUMIDO - COM, SERV E IND",
      "FOLHA PROFESSOR",
      "ATIVIDADE IMOB RET PMCMV",
      "SIMPLES TRANSPORTADORA",
  ];

  // Filtrando empresas a partir da lista de exclusões
  const filteredSocios = dados.filter(socio => !empresasExcluidas.includes(socio.nome));

  // Ordenação dos dados com tratamento de tipos
  const sortedSocios = filteredSocios.sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.key === "idade") {
      const aIdade = calcularIdade(a.data_nascimento);
      const bIdade = calcularIdade(b.data_nascimento);
      return sortConfig.direction === "asc" ? aIdade - bIdade : bIdade - aIdade;
    }

    if (sortConfig.key === "data_nascimento") {
      const aDate = new Date(aValue as string);
      const bDate = new Date(bValue as string);
      return sortConfig.direction === "asc"
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  return (
    <div className="max-h-[90vh] flex flex-col gap-4 overflow-x-auto w-full">
      <div className="flex items-center justify-between p-4 bg-white shadow rounded-md mb-4">
        <h1 className="text-2xl font-bold font-cairo text-gray-800">
          Sócios Aniversariantes
        </h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Pesquisar por nome..."
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

      {/* Botões de exportação */}
      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={() => exportToPDF(sortedSocios, "Aniversariantes_Socios")}
          className="p-1 rounded border border-gray-300 hover:bg-green-100 mt-auto "
          style={{ width: 36, height: 36 }}
        >
        <Image
          src="/assets/icons/pdf.svg"
          alt="Ícone pdf"
          width={24}
          height={24}
          draggable={false}
        />
        </button>

        <button
          onClick={() => exportToExcel(sortedSocios, "Aniversariantes_Socios")}
          className="p-1 rounded border border-gray-300 hover:bg-green-100 mt-auto "
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
          <tr className="bg-gray-200 border-b border-gray-400">
            <th className="px-4 py-2 border-r">#</th>
            <th
              className="px-4 py-2 cursor-pointer border-r"
              onClick={() => sortData("nome")}
            >
              Sócio {sortConfig.key === "nome" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
            </th>
            <th
              className="px-4 py-2 cursor-pointer border-r"
              onClick={() => sortData("data_nascimento")}
            >
              Data de Nascimento {sortConfig.key === "data_nascimento" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
            </th>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => sortData("idade")}
            >
              Idade {sortConfig.key === "idade" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
            </th>
          </tr>
        </thead>
        <tbody className="text-center">
          {sortedSocios.map((socio, index) => {
            const idade = calcularIdade(socio.data_nascimento);
            return (
              <tr key={socio.id} className="border-b border-gray-300">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{socio.nome.toUpperCase()}</td>
                <td className="px-4 py-2">{formatDateBr(socio.data_nascimento)}</td>
                <td className="px-4 py-2">{idade} anos</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
