import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import Image from "next/image";

interface Socio {
  id: number;
  nome: string;
  cnpj: string;
  data_nascimento: string;
  idade?: number;
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
    key: "data_nascimento",  // Alterado para 'data_nascimento'
    direction: "asc",  // Inicializa ordenando de forma ascendente
  });

  const [searchQuery, setSearchQuery] = useState<string>("");

  // Função para formatar a data
  const formatDateBr = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const ano = date.getFullYear();

    return `${dia}/${mes}/${ano}`;
  };

  // Função para calcular a idade
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

    const pageWidth  = doc.internal.pageSize.getWidth();

    const tableWidth = 60 + 40 + 30;

    const marginLR = (pageWidth - tableWidth) / 2;

    const marginTop = 10;

    let currentY = marginTop;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Aniversário de Socio",
      pageWidth / 2,
      currentY,
      { align: "center" }
    );
    currentY += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(
      `Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`,
      marginLR,
      currentY
    );


    const tableHeaders = ['Nome', 'Data de Nascimento', 'Idade'];

    autoTable(doc, {
      startY: currentY,
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
        0: { cellWidth: 60, fontStyle: 'bold' },
        1: { cellWidth: 40, halign: 'center' },
        2: { cellWidth: 30, halign: 'center' },
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: marginLR, right: marginLR },
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

  const filteredSocios = dados.filter((socio) => {
    const searchValue = searchQuery.toLowerCase();
    return (
      (socio.nome && socio.nome.toLowerCase().includes(searchValue)) ||
      (socio.cnpj && socio.cnpj.toLowerCase().includes(searchValue))
    );
  });

    const isAniversarioHoje = (dataNascimento: string): boolean => {
    if (!dataNascimento) return false;

    const hoje = new Date();
    const nascimento = new Date(dataNascimento);

    if (isNaN(nascimento.getTime())) return false;

    return (
      hoje.getDate() === nascimento.getDate() &&
      hoje.getMonth() === nascimento.getMonth()
    );
  };

  const sortedSocios = filteredSocios.sort((a, b) => {
    const aDate = new Date(a.data_nascimento);
    const bDate = new Date(b.data_nascimento);

    const aDay = aDate.getDate();
    const bDay = bDate.getDate();

    if (sortConfig.key === "data_nascimento") {
      return sortConfig.direction === "asc"
        ? aDay - bDay
        : bDay - aDay;
    }

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.key === "idade") {
      const aIdade = calcularIdade(a.data_nascimento);
      const bIdade = calcularIdade(b.data_nascimento);
      return sortConfig.direction === "asc" ? aIdade - bIdade : bIdade - aIdade;
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
        <h1 className="text-2xl font-bold font-cairo text-gray-800">Sócios Aniversariantes</h1>
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
            const isBirthday = isAniversarioHoje(socio.data_nascimento);
            const idade = calcularIdade(socio.data_nascimento);
            const rowClass = isBirthday
              ? "bg-green-100 text-green-700 font-semibold"
              : index % 2 === 0
                ? "bg-white"
                : "bg-gray-100";
            return (
              <tr
                key={socio.id}
                className={`${rowClass} border-b border-gray-300`}
              >
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
