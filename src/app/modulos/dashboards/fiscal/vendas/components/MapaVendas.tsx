/**
 * COMPONENTE: MAPA DE VENDAS GEOGRÁFICO
 * 
 * Visualização geográfica das vendas usando React-Leaflet
 * com diferentes tipos de visualização e interatividade
 */

"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { DadosGeograficos, TipoVisualizacaoMapa, VendasKpiType } from '../types';
import { formatarValorVendas } from '../utils/vendasKpiUtils';

// Importação dinâmica do mapa para evitar problemas de SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface MapaVendasProps {
  dados: DadosGeograficos[];
  tipoVisualizacao: TipoVisualizacaoMapa;
  kpiSelecionado: VendasKpiType;
  loading?: boolean;
  altura?: string;
}

const MapaVendas: React.FC<MapaVendasProps> = ({
  dados,
  tipoVisualizacao,
  kpiSelecionado,
  loading = false,
  altura = "400px"
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Função para calcular o raio do marcador baseado no valor
  const calcularRaioMarcador = (valor: number, valorMaximo: number): number => {
    const raioMinimo = 5;
    const raioMaximo = 30;
    const proporcao = valorMaximo > 0 ? valor / valorMaximo : 0;
    return raioMinimo + (proporcao * (raioMaximo - raioMinimo));
  };

  // Função para obter a cor baseada no tipo de visualização
  const obterCorMarcador = (valor: number, valorMaximo: number): string => {
    const intensidade = valorMaximo > 0 ? valor / valorMaximo : 0;
    
    if (intensidade > 0.8) return '#1f2937'; // Cinza escuro
    if (intensidade > 0.6) return '#374151'; // Cinza médio-escuro
    if (intensidade > 0.4) return '#6b7280'; // Cinza médio
    if (intensidade > 0.2) return '#9ca3af'; // Cinza claro
    return '#d1d5db'; // Cinza muito claro
  };

  // Função para obter o valor baseado no tipo de visualização
  const obterValorVisualizacao = (dado: DadosGeograficos): number => {
    switch (tipoVisualizacao) {
      case TipoVisualizacaoMapa.VALOR:
        return dado.totalVendas;
      case TipoVisualizacaoMapa.QUANTIDADE:
        return dado.quantidadeVendas;
      case TipoVisualizacaoMapa.CLIENTES:
        return dado.numeroClientes;
      case TipoVisualizacaoMapa.TICKET_MEDIO:
        return dado.ticketMedio;
      default:
        return dado.totalVendas;
    }
  };

  // Função para formatar o valor para exibição
  const formatarValorExibicao = (valor: number, tipo: TipoVisualizacaoMapa): string => {
    switch (tipo) {
      case TipoVisualizacaoMapa.VALOR:
      case TipoVisualizacaoMapa.TICKET_MEDIO:
        return valor.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });
      case TipoVisualizacaoMapa.QUANTIDADE:
      case TipoVisualizacaoMapa.CLIENTES:
        return valor.toLocaleString('pt-BR');
      default:
        return valor.toString();
    }
  };

  if (loading) {
    return (
      <div 
        className="w-full flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ height: altura }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-2"></div>
          <div className="text-gray-500">Carregando mapa...</div>
        </div>
      </div>
    );
  }

  if (!isMounted) {
    return (
      <div 
        className="w-full flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ height: altura }}
      >
        <div className="text-gray-500">Preparando mapa...</div>
      </div>
    );
  }

  if (dados.length === 0) {
    return (
      <div 
        className="w-full flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ height: altura }}
      >
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-2">🗺️</div>
          <div className="text-gray-500">Nenhum dado geográfico disponível</div>
        </div>
      </div>
    );
  }

  // Calcula valores máximos para normalização
  const valorMaximo = Math.max(...dados.map(d => obterValorVisualizacao(d)));

  return (
    <div className="w-full">
      {/* Controles do mapa */}
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="text-sm text-gray-600">
          <strong>Visualização:</strong> {tipoVisualizacao.replace('_', ' ')}
        </div>
        <div className="text-sm text-gray-600">
          <strong>Total de Estados:</strong> {dados.length}
        </div>
      </div>

      {/* Mapa */}
      <div 
        className="rounded-lg overflow-hidden border border-gray-200 shadow-sm"
        style={{ height: altura }}
      >
        <MapContainer
          center={[-15.83, -47.86]} // Centro do Brasil
          zoom={4}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {dados.map((estado) => {
            const valor = obterValorVisualizacao(estado);
            const raio = calcularRaioMarcador(valor, valorMaximo);
            const cor = obterCorMarcador(valor, valorMaximo);
            
            return (
              <CircleMarker
                key={estado.uf}
                center={[estado.lat, estado.lng]}
                radius={raio}
                fillColor={cor}
                color="#ffffff"
                weight={2}
                opacity={0.8}
                fillOpacity={0.7}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-gray-800 mb-2">
                      {estado.estado} ({estado.uf})
                    </h3>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Vendas:</span>
                        <span className="font-medium">
                          {formatarValorExibicao(estado.totalVendas, TipoVisualizacaoMapa.VALOR)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantidade:</span>
                        <span className="font-medium">
                          {formatarValorExibicao(estado.quantidadeVendas, TipoVisualizacaoMapa.QUANTIDADE)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Clientes:</span>
                        <span className="font-medium">
                          {formatarValorExibicao(estado.numeroClientes, TipoVisualizacaoMapa.CLIENTES)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ticket Médio:</span>
                        <span className="font-medium">
                          {formatarValorExibicao(estado.ticketMedio, TipoVisualizacaoMapa.TICKET_MEDIO)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between border-t pt-1 mt-2">
                        <span className="text-gray-600">Participação:</span>
                        <span className="font-medium text-blue-600">
                          {estado.participacao.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Legenda */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Legenda</h4>
        <div className="flex items-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <span>Baixo</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>Médio</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-gray-800"></div>
            <span>Alto</span>
          </div>
          <div className="ml-4 text-gray-500">
            Tamanho e cor do círculo indicam a intensidade
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaVendas;
