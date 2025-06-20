// 🚀 Componente DetalhesModal - Wrapper padronizado para todos os modais
// Elimina repetição de código e centraliza a lógica de exportação

import React from "react";
import Modal from "../../organizacional/components/Modal";

// 📋 Configuração de exportação para cada tipo de modal
export interface ExportConfig {
  pdfHandler: (data: any[], reportName: string) => void;
  excelHandler: (data: any[], fileName: string) => void;
  reportName: string;
}

interface DetalhesModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  data: any[];
  exportConfig?: ExportConfig;
  children: React.ReactNode;
  cairoClassName: string;
}

const DetalhesModal: React.FC<DetalhesModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  data,
  exportConfig,
  children,
  cairoClassName,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col w-full h-full max-h-[calc(80vh-4rem)]">
        {/* 🏷️ Cabeçalho do Modal */}
        <div className="mb-4">
          <h2 className={`text-2xl font-bold mb-2 ${cairoClassName}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-base text-gray-500 ${cairoClassName}`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* 📤 Botões de Exportação */}
        {exportConfig && (
          <div className="flex gap-4 mb-4 justify-end">
            {/* Botão PDF */}
            <button
              className="p-1 rounded border border-gray-300 hover:bg-green-100 transition-colors"
              style={{ width: 36, height: 36 }}
              onClick={() => exportConfig.pdfHandler(data, exportConfig.reportName)}
              title="Exportar para PDF"
            >
              <img
                src="/assets/icons/pdf.svg"
                alt="Exportar PDF"
                width={24}
                height={24}
                draggable={false}
              />
            </button>

            {/* Botão Excel */}
            <button
              className="p-1 rounded border border-gray-300 hover:bg-green-100 transition-colors"
              style={{ width: 36, height: 36 }}
              onClick={() => exportConfig.excelHandler(data, exportConfig.reportName)}
              title="Exportar para Excel"
            >
              <img
                src="/assets/icons/excel.svg"
                alt="Exportar Excel"
                width={24}
                height={24}
                draggable={false}
              />
            </button>
          </div>
        )}

        {/* 📊 Conteúdo do Modal (Tabela ou Gráfico) */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </Modal>
  );
};

export default DetalhesModal;
