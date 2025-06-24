"use client";
import { Cairo } from "next/font/google";
import { useState } from "react";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export default function DashboardFiscal() {  return (    <div className={`min-h-screen bg-gray-50 ${cairo.className}`}>
      {/* Header de Filtros */}
      <div className="relative z-10 flex flex-row items-center justify-start gap-8 p-4 border-b border-black/10 bg-gray-100">
        <h1 className={`text-[32px] leading-8 font-700 text-black ${cairo.className}`}>Dashboard Fiscal</h1>
        
        {/* Área dos filtros será adicionada aqui */}
        <div className="mt-4">
          <p className="text-gray-500 text-sm">Filtros serão adicionados aqui...</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Conteúdo será adicionado aqui */}
        <div className="text-center text-gray-500 mt-20">
          <p>Dashboard Fiscal em desenvolvimento...</p>
        </div>
      </div>
    </div>
  );
}