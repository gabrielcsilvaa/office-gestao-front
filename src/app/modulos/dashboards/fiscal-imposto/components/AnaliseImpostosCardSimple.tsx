import React, { useState, useRef } from 'react';
import Image from "next/image";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

interface AnaliseImpostosItem {
  imposto: string;
  impostoDevido: string;
  periodicidade: string;
  saldoAnteriorRecuperar: string;
  movimentoCredor: string;
  saldoRecuperar: string;
  percentual: string;
  cargaTributariaEfetiva: string;
}

interface AnaliseImpostosCardProps {
  title: string;
  items: AnaliseImpostosItem[];
  onMaximize?: () => void;
}

const AnaliseImpostosCardSimple: React.FC<AnaliseImpostosCardProps> = ({ 
  title, 
  items,
  onMaximize 
}) => {
  const [visibleCount, setVisibleCount] = useState(10);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) {
      setVisibleCount(prev => Math.min(prev + 10, items.length));
    }
  };

  return (
    <div className="w-full h-[489px] bg-white rounded-lg shadow-md relative overflow-hidden">
      {/* Barra vertical ao lado do título */}
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
      
      {/* Header com título e ícone de maximizar */}
      <div className="flex justify-between items-start pt-[14px] px-5 mb-3 flex-shrink-0">
        <div className="flex-grow overflow-hidden mr-3">
          <div title={title} className={`text-black text-xl font-semibold leading-normal ${cairo.className} whitespace-nowrap overflow-hidden text-ellipsis`}>
            {title}
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="cursor-pointer p-1">
            <Image
              src="/assets/icons/icon-maximize.svg"
              alt="Maximize"
              width={16}
              height={16}
              className="opacity-60 hover:opacity-100"
              onClick={onMaximize}
            />
          </div>
        </div>
      </div>

      {/* Conteúdo do card */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className={`flex-1 px-5 pb-5 min-h-0 overflow-y-auto ${cairo.className}`}
      >
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.slice(0, visibleCount).map((item, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg shadow-md bg-white">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {/* Linha 1: Imposto */}
                  <div className="flex flex-col col-span-2">
                    <span className="text-gray-800 font-medium text-sm">
                      {item.imposto}
                    </span>
                    <span className="text-gray-500 font-light text-xs">Imposto</span>
                  </div>
                  <div className="col-span-2 h-px bg-gray-200"></div>
                  
                  {/* Linha 2: Imposto Devido e Periodicidade */}
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-medium text-sm">
                      {item.impostoDevido}
                    </span>
                    <span className="text-gray-500 font-light text-xs">Imposto Devido</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-medium text-sm">
                      {item.periodicidade}
                    </span>
                    <span className="text-gray-500 font-light text-xs">Periodicidade</span>
                  </div>
                  
                  {/* Linha 3: Saldo Anterior a Recuperar e Movimento Credor */}
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-medium text-sm">
                      {item.saldoAnteriorRecuperar}
                    </span>
                    <span className="text-gray-500 font-light text-xs">Saldo Anterior a Recuperar</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-medium text-sm">
                      {item.movimentoCredor}
                    </span>
                    <span className="text-gray-500 font-light text-xs">Movimento Credor</span>
                  </div>
                  
                  {/* Linha 4: Saldo a Recuperar e Percentual */}
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-medium text-sm">
                      {item.saldoRecuperar}
                    </span>
                    <span className="text-gray-500 font-light text-xs">Saldo a Recuperar</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-medium text-sm">
                      {item.percentual}
                    </span>
                    <span className="text-gray-500 font-light text-xs">Percentual</span>
                  </div>
                  
                  {/* Linha 5: Carga Tributária Efetiva */}
                  <div className="flex flex-col col-span-2">
                    <span className="text-gray-800 font-medium text-sm">
                      {item.cargaTributariaEfetiva}
                    </span>
                    <span className="text-gray-500 font-light text-xs">Carga Tributária Efetiva</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`flex items-center justify-center h-full text-gray-500 text-center ${cairo.className}`}>
            Selecione um período para visualizar os dados
          </div>
        )}
      </div>
    </div>
  );
};

export default AnaliseImpostosCardSimple;
