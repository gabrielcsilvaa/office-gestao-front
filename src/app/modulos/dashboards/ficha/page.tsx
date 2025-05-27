"use client";
import { Cairo } from "next/font/google";
import SecaoFiltros from "./components/SecaoFiltros";

export default function FichaPessoalPage() {
  return (
    <div className="p-4">
      <div className="flex flex-row items-center justify-start gap-8 mb-4">
        <h1 className="text-[32px] leading-8 __className_50a8b1 font-700 text-black text-left">Dashboard de Ficha Pessoal</h1>
        <SecaoFiltros />
      </div>
      {/* O restante do conteúdo do seu dashboard virá aqui */}
      <p className="mt-4"></p>
    </div>
  );
}
