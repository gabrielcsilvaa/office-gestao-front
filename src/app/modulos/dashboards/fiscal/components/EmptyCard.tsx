'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Cairo } from "next/font/google";
import dynamic from 'next/dynamic';

// Carregamento dinâmico dos componentes do mapa com estado de carregamento
const MapComponent = dynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="text-gray-500 mb-2">🗺️ Carregando mapa...</div>
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  )
});

const SimpleMap = dynamic(() => import('./SimpleMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="text-gray-500 mb-2">📊 Carregando visualização...</div>
      </div>
    </div>
  )
});

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

interface EmptyCardProps {
  title: string;
  onMaximize?: () => void;
}

type ViewType = 'quantidade' | 'valor';

interface LocationData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  value: number;
  quantity: number;
}

const EmptyCard: React.FC<EmptyCardProps> = ({ title, onMaximize }) => {
  const [selectedView, setSelectedView] = useState<ViewType>('quantidade');

  // Dados fictícios de localização para demonstração - apenas Fortaleza
  const locationData: LocationData[] = [
    { id: '6', name: 'Fortaleza - CE', lat: -3.7172, lng: -38.5433, value: 520000, quantity: 6900 }
  ];
  return (
    <div className="w-full bg-white rounded-lg shadow-md relative overflow-hidden h-[500px]">
      {/* Barra vertical ao lado do título */}
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
      
      {/* Header com título, switch e ícone de maximizar */}
      <div className="flex justify-between items-center pt-[14px] px-5 mb-3 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div title={title} className={`text-black text-xl font-semibold leading-normal ${cairo.className} whitespace-nowrap`}>
            {title}
          </div>
          
          {/* Switch Quantidade/Valor */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedView('quantidade')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${cairo.className} ${
                selectedView === 'quantidade'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Quantidade
            </button>
            <button
              onClick={() => setSelectedView('valor')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${cairo.className} ${
                selectedView === 'valor'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Valor
            </button>
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

      {/* Conteúdo do card - Mapa */}
      <div className="flex-1 px-5 pb-5 min-h-0">
        <div className="h-full w-full rounded-lg overflow-hidden bg-gray-50" style={{ minHeight: '420px', height: '420px' }}>
          <MapComponent locations={locationData} viewType={selectedView} />
        </div>
      </div>
    </div>
  );
};

export default EmptyCard;
