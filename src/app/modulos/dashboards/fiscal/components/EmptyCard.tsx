import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Cairo } from "next/font/google";
import MapComponent from './MapComponent';

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

  useEffect(() => {
    console.log('🎯 EmptyCard: Card "Valor por Local" montado');
    console.log('📊 Visualização inicial:', selectedView);
  }, []);

  useEffect(() => {
    console.log('🔄 EmptyCard: Visualização alterada para:', selectedView);
  }, [selectedView]);

  // Dados fictícios de localização para demonstração
  const locationData: LocationData[] = [
    { id: '1', name: 'São Paulo - SP', lat: -23.5505, lng: -46.6333, value: 1250000, quantity: 15420 },
    { id: '2', name: 'Rio de Janeiro - RJ', lat: -22.9068, lng: -43.1729, value: 980000, quantity: 12350 },
    { id: '3', name: 'Belo Horizonte - MG', lat: -19.9191, lng: -43.9386, value: 750000, quantity: 9800 },
    { id: '4', name: 'Brasília - DF', lat: -15.7942, lng: -47.8825, value: 650000, quantity: 8200 },
    { id: '5', name: 'Salvador - BA', lat: -12.9714, lng: -38.5014, value: 580000, quantity: 7650 },
    { id: '6', name: 'Fortaleza - CE', lat: -3.7172, lng: -38.5433, value: 520000, quantity: 6900 },
    { id: '7', name: 'Curitiba - PR', lat: -25.4284, lng: -49.2733, value: 480000, quantity: 6200 },
    { id: '8', name: 'Recife - PE', lat: -8.0476, lng: -34.8770, value: 450000, quantity: 5800 }
  ];
  return (
    <div className="w-full bg-white rounded-lg shadow-md relative overflow-hidden h-[400px]">
      {/* Barra vertical ao lado do título */}
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
      
      {/* Header com título e ícone de maximizar */}
      <div className="flex justify-between items-start pt-[14px] px-5 mb-2 flex-shrink-0">
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

      {/* Switch Quantidade/Valor */}
      <div className="px-5 mb-3 flex-shrink-0">
        <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setSelectedView('quantidade')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${cairo.className} ${
              selectedView === 'quantidade'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Quantidade
          </button>
          <button
            onClick={() => setSelectedView('valor')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${cairo.className} ${
              selectedView === 'valor'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Valor
          </button>
        </div>
      </div>

      {/* Conteúdo do card - Mapa */}
      <div className="flex-1 px-5 pb-5 min-h-0">
        <div className="h-full w-full rounded-lg overflow-hidden">
          {(() => {
            console.log('🎨 EmptyCard: Renderizando MapComponent');
            console.log('📍 Dados de localização:', locationData.length, 'locais');
            console.log('👁️ Tipo atual:', selectedView);
            return <MapComponent locations={locationData} viewType={selectedView} />;
          })()}
        </div>
      </div>
    </div>
  );
};

export default EmptyCard;
