import { useState } from "react";
import { Cairo } from "next/font/google";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import Image from "next/image";

const cairo = Cairo({
  weight: ["500", "600", "700"], 
  subsets: ["latin"],
});

interface regimeTributario {
  id: number;
  nome_empresa: string;
  regime_tributario: string;
  cnpj: string;
  data_cadastro: string;
  responsavel_legal: string;
  data_inatividade: string;
}

interface ListaEmpresasRegimeTributarioProps {
  dados: regimeTributario[];
  onClose: () => void;
}

const formatCNPJ = (cnpj: string | null | undefined) => {
  if (!cnpj) return "";
  const onlyDigits = cnpj.replace(/\D/g, "");
  if (onlyDigits.length === 11) {
    return onlyDigits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (onlyDigits.length === 14) {
    return onlyDigits.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }
  return cnpj;
};

// Função para exportar para PDF
const exportToPDF = (data: regimeTributario[], fileName: string) => {
  const doc = new jsPDF();
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  
  const tableData = data.map((empresa) => [
    empresa.nome_empresa,
    formatCNPJ(empresa.cnpj),
    empresa.regime_tributario,
    empresa.responsavel_legal,
  ]);

  const pageWidth  = doc.internal.pageSize.getWidth();

  const tableWidth = 50 + 40 + 30 + 40;

  const marginLR = (pageWidth - tableWidth) / 2;

  const marginTop = 10;

  let currentY = marginTop;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(
    "Empresas por Regime Tributário",
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

  const tableHeaders = ['Nome Empresa', 'CNPJ', 'Regime Tributário', 'Responsável Legal'];

  autoTable(doc, {
    startY: currentY + 4,
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
      1: { cellWidth: 40, halign: 'center' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 40, halign: 'left' },
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { left: marginLR, right: marginLR },
    didDrawPage: function (data) {
      doc.setFontSize(8);
      doc.text('Página ' + data.pageNumber, data.settings.margin.left, doc.internal.pageSize.height - 10);
    }
  });

  doc.save(`${fileName}.pdf`);
};

const exportToExcel = (data: regimeTributario[], fileName: string) => {
  const ws = XLSX.utils.json_to_sheet(data.map((empresa) => ({
    Nome: empresa.nome_empresa,
    CNPJ: formatCNPJ(empresa.cnpj),
    Regime: empresa.regime_tributario,
    ResponsavelLegal: empresa.responsavel_legal || "Sem Responsável Legal",
  })));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Empresas");

  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export default function ListaEmpresasRegimeTributario({
  dados,
  onClose,
}: ListaEmpresasRegimeTributarioProps) {
  const [regimeSelecionado, setRegimeSelecionado] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filtrarEmpresas = () => {
    if (!dados) return [];

    let filteredEmpresas = dados.filter(
      (empresa) => empresa.data_inatividade === null
    );

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
    filteredEmpresas = filteredEmpresas.filter(
      (empresa) => !empresasExcluidas.includes(empresa.nome_empresa)
    );

    if (regimeSelecionado) {
      filteredEmpresas = filteredEmpresas.filter(
        (empresa) => empresa.regime_tributario === regimeSelecionado
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      const cnpjQuery = searchQuery.replace(/\D/g, "");

      filteredEmpresas = filteredEmpresas.filter((empresa) => {
        const nomeEmpresa = empresa.nome_empresa?.toLowerCase() || "";
        const nomeMatch = nomeEmpresa.includes(query);

        const cnpjEmpresa = empresa.cnpj?.replace(/\D/g, "") || "";
        const cnpjMatch = cnpjQuery ? cnpjEmpresa.includes(cnpjQuery) : false;

        return nomeMatch || cnpjMatch;
      });
    }

    return filteredEmpresas;
  };

  const empresasFiltradas = filtrarEmpresas();

  return (
    <div className="max-h-[90vh] flex flex-col gap-4 overflow-x-auto w-full">
      <div className="flex items-center justify-between p-4 bg-white shadow rounded-md mb-4">
        <h1 className={`text-2xl font-bold ${cairo.className} text-gray-800`}>
          Empresas por Regime Tributário
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

      <div className="flex justify-between items-center gap-4 p-4 bg-white shadow rounded-md mb-4">
        {/* Filtros de Regime Tributário */}
        <div className="flex flex-wrap gap-2">
          {[
            "Todos",
            "Simples Nacional",
            "Lucro Presumido",
            "Lucro Real",
            "Doméstica",
            "Isenta de IRPJ",
            "Regime Especial de Tributação",
            "Imune do IRPJ",
            "MEI",
            "N/D",
          ].map((regime) => (
            <button
              key={regime}
              className={`px-4 py-2 rounded-md shadow-md ${
                regimeSelecionado === regime || (regime === "Todos" && !regimeSelecionado)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:bg-blue-500 hover:text-white transition`}
              onClick={() =>
                setRegimeSelecionado(regime === "Todos" ? null : regime)
              }
            >
              {regime}
            </button>
          ))}
        </div>

        {/* Botões de exportação */}
        <div className="flex gap-4">
          <button
            onClick={() => exportToPDF(empresasFiltradas, "Empresas_Regime_Tributario")}
            className="p-1 rounded border border-gray-300 hover:bg-green-100 mt-auto cursor-pointer"
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
            onClick={() => exportToExcel(empresasFiltradas, "Empresas_Regime_Tributario")}
            className="p-1 rounded border border-gray-300 hover:bg-green-100 mt-auto cursor-pointer"
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
      </div>

      {/* Tabela de empresas */}
      <table className="w-full border border-gray-300 text-sm font-cairo">
        <thead>
          <tr className="bg-gray-200 border-b border-gray-400">
            <th className="px-4 py-2 border-r">#</th>
            <th className="px-4 py-2 border-r">Nome Empresa</th>
            <th className="px-4 py-2 border-r">Regime</th>
            <th className="px-4 py-2 border-r">CNPJ</th>
            <th className="px-4 py-2">Responsável Legal</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {empresasFiltradas?.map((empresa, index) => (
            <tr key={empresa.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} border-b border-gray-300`}>
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{empresa.nome_empresa}</td>
              <td className="px-4 py-2">{empresa.regime_tributario}</td>
              <td className="px-4 py-2">{formatCNPJ(empresa.cnpj)}</td>
              <td className="px-4 py-2">{empresa.responsavel_legal || "Sem Responsável Legal"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
