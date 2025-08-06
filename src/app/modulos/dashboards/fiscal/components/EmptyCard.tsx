'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Cairo } from "next/font/google";
import dynamic from 'next/dynamic';
import { processDataForMap, getKpiConfig, MapStateData } from '@/utils/mapDataProcessor';

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


const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

interface EmptyCardProps {
  title: string;
  onMaximize?: () => void;
  data?: {
    saidas?: any[];
    servicos?: any[];
    entradas?: any[];
  } | null;
  kpiSelecionado?: string;
  startDate?: string | null;
  endDate?: string | null;
}

interface LocationData {
  uf: string;
  nome: string;
  lat: number;
  lng: number;
  value: number;
  quantity: number;
}

const EmptyCard: React.FC<EmptyCardProps> = ({ title, onMaximize, data, kpiSelecionado }) => {
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentKpi, setCurrentKpi] = useState(kpiSelecionado || "Receita Bruta Total");

  // Efeito para processar os dados quando chegarem ou quando o KPI mudar
  useEffect(() => {
    if (!data) {
      // Dados de exemplo quando não há dados da API
      console.log("📝 Usando dados de exemplo (sem dados da API)");
      setLocationData([
        { uf: 'CE', nome: 'Ceará', lat: -3.7172, lng: -38.5433, value: 520000, quantity: 6900 }
      ]);
      return;
    }

    const processData = async () => {
      setIsProcessing(true);
      
      try {
        console.log(`🎯 [DEBUG] Processando dados para KPI: "${currentKpi}"`);
        console.log(`📊 [DEBUG] Dados recebidos:`, {
          saidas: data.saidas?.length || 0,
          servicos: data.servicos?.length || 0,
          entradas: data.entradas?.length || 0
        });

        // 🗺️ USAR O NOVO PROCESSADOR DE DADOS GEOGRÁFICOS
        // Este é o coração da análise geoestratégica interativa
        const mapStateData: MapStateData[] = processDataForMap(data, currentKpi);

        console.log(`📍 [DEBUG] Estados processados:`, mapStateData.map(s => `${s.uf}(${s.valorPrincipal})`));

        // Converter MapStateData para o formato esperado pelo MapComponent
        const mapData: LocationData[] = mapStateData.map(state => ({
          uf: state.uf,
          nome: state.nome,
          lat: state.lat,
          lng: state.lng,
          value: state.valorPrincipal,
          quantity: state.contagem
        }));

        setLocationData(mapData);
        
        // Log da configuração ativa
        const config = getKpiConfig(currentKpi);
        if (config) {
          console.log(`✅ [DEBUG] Mapa atualizado para "${currentKpi}"`);
          console.log(`📊 [DEBUG] Legenda: ${config.legend}`);
          console.log(`🎨 [DEBUG] Tema: ${config.color}`);
          console.log(`📍 [DEBUG] Estados identificados: ${mapData.length}`);
          console.log(`🔢 [DEBUG] Valores por estado:`, mapData.map(m => `${m.uf}: R$ ${m.value.toFixed(2)}`));
        }

      } catch (error) {
        console.error('❌ [ERROR] Erro ao processar dados geográficos:', error);
        // Em caso de erro, usar dados de exemplo
        setLocationData([
          { uf: 'CE', nome: 'Ceará', lat: -3.7172, lng: -38.5433, value: 520000, quantity: 6900 }
        ]);
      } finally {
        setIsProcessing(false);
      }
    };

    processData();
  }, [data, currentKpi]); // Re-processar quando dados ou KPI mudarem

  // Sincronizar KPI selecionado externamente
  useEffect(() => {
    if (kpiSelecionado && kpiSelecionado !== currentKpi) {
      setCurrentKpi(kpiSelecionado);
    }
  }, [kpiSelecionado, currentKpi]);
  return (
    <div className="w-full bg-white rounded-lg shadow-md relative overflow-hidden h-[500px]">
      {/* Barra vertical ao lado do título */}
      <div className="w-6 h-0 left-[10px] top-[17px] absolute origin-top-left rotate-90 bg-zinc-300 outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
      
      {/* Header com título, KPI ativo, switch e ícone de maximizar */}
      <div className="flex justify-between items-center pt-[14px] px-5 mb-3 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div title={title} className={`text-black text-xl font-semibold leading-normal ${cairo.className} whitespace-nowrap`}>
            {title}
          </div>
          
          {/* Indicador do KPI Ativo */}
          {currentKpi && (
            <div className="flex items-center space-x-2">
              <span className={`text-sm text-gray-600 ${cairo.className}`}>
                {currentKpi}
              </span>
            </div>
          )}
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

      {/* Conteúdo do card - Mapa com Legenda */}
      <div className="flex-1 px-5 pb-5 min-h-0">
        <div className="h-full w-full rounded-lg overflow-hidden bg-gray-50 relative" style={{ minHeight: '420px', height: '420px' }}>
          {/* Overlay de processamento */}
          {isProcessing && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-gray-600 mb-2">� Processando análise para "{currentKpi}"...</div>
                <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              </div>
            </div>
          )}
          
          {/* Legenda do KPI Ativo */}
          {!isProcessing && currentKpi && (() => {
            const config = getKpiConfig(currentKpi);
            return config ? (
              <div className="absolute top-3 left-3 z-20 bg-white bg-opacity-90 rounded-lg px-3 py-2 shadow-md">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: config.color }}
                  ></div>
                  <span className={`text-xs text-gray-700 ${cairo.className}`}>
                    {config.legend}
                  </span>
                </div>
              </div>
            ) : null;
          })()}
          
          {/* Contador de Estados */}
          {!isProcessing && locationData.length > 0 && (
            <div className="absolute top-3 right-3 z-20 bg-white bg-opacity-90 rounded-lg px-3 py-2 shadow-md">
              <span className={`text-xs text-gray-700 ${cairo.className}`}>
                {locationData.length} estado{locationData.length !== 1 ? 's' : ''} identificado{locationData.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          
          <MapComponent locations={locationData} kpiSelecionado={currentKpi} />
        </div>
      </div>
    </div>
  );
};

export default EmptyCard;
