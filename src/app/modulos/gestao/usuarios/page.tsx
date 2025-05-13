"use client";
import { Cairo } from "next/font/google";
import React, { useState } from "react";

import UserChart from "./components/chart";
import Calendar from "@/components/calendar";

import ListaUsuario from "./components/modal_lista_usuario";
import AtividadeUsuario from "./components/modal_atividade_usuario";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export default function Usuarios() {
  const [selectedOption, setSelectedOption] = useState("Selecionar Todos");
  const [mostrarListaUsuarios, setMostrarListaUsuarios] = useState(false);
  const [mostrarAtividadeUsuario, setMostrarAtividadeUsuarios] =
    useState(false);

  const abrirListaUsuarios = () => setMostrarListaUsuarios(true);
  const fecharListaUsuarios = () => setMostrarListaUsuarios(false);

  const abrirAtividadeUsuarios = () => setMostrarAtividadeUsuarios(true);
  const fecharAtividadeUsuarios = () => setMostrarAtividadeUsuarios(false);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="bg-gray-100 max-h-screen max-w-screen">
      <div className="h-[85px] flex flex-row items-center p-4 gap-8 border-b border-black/10 bg-gray-100">
        <div className="flex items-center gap-4">
          <h1
            className={`text-[32px] leading-8 ${cairo.className} font-700 text-black text-left`}
          >
            Análise de Usuários
          </h1>

          <div className="flex items-center gap-2 ml-4 relative">
            <select
              value={selectedOption}
              onChange={handleSelectChange}
              className="flex items-center justify-center p-2 shadow-md bg-white w-[334px] h-[36px] rounded-md"
            >
              <option>Selecionar Todos</option>
              <option>Opção 1</option>
              <option>Opção 2</option>
            </select>

            <div className="ml-5">
              <Calendar
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="justify-center">
        <div className="w-full flex gap-[17px]  p-3">
          <div className="usuarios-card  p-3">
            <p className="text-xs text-gray-500">
              Total de Atividades Realizadas
            </p>
            <p className="text-xl font-semibold text-black">3.463.508</p>
          </div>

          <div className="usuarios-card p-3">
            <p className="text-xs text-gray-500">Importações totais</p>
            <p className="text-xl font-semibold text-black">2.236.636</p>
          </div>

          <div className="usuarios-card p-3">
            <p className="text-xs text-gray-500">
              Total de Atividades por Módulos
            </p>
            <p className="text-xl font-semibold text-black">1.133.734</p>
          </div>

          <div className="usuarios-card p-3">
            <p className="text-xs text-gray-500">
              Total de Lançamentos Manuais
            </p>
            <p className="text-xl font-semibold text-black">93.138</p>
          </div>

          <div className="usuarios-card p-3">
            <p className="text-xs text-gray-500">Total de Horas Ativas</p>
            <p className="text-xl font-semibold text-black">34.662.66 h</p>
          </div>
        </div>

        <div>
          <UserChart />

          <div className="w-full flex justify-center">
            <div className="grid grid-cols-2 gap-4 p-3">
              <button
                onClick={abrirListaUsuarios}
                className="bg-white border border-gray-300 w-[500px] h-[70px]  hover:bg-gray-100  "
              >
                Lista de Usuários
              </button>

              <button
                onClick={abrirAtividadeUsuarios}
                className="bg-white border border-gray-300 w-[500px] h-[70px]  hover:bg-gray-100 "
              >
                Atividade por Usuário
              </button>

              <button className="bg-white border border-gray-300 w-[500px] h-[70px] hover:bg-gray-100">
                Atividade Por Módulo
              </button>
              <button className="bg-white border border-gray-300 w-[500px] h-[70px] hover:bg-gray-100">
                Atividade Por Cliente
              </button>
            </div>
          </div>
        </div>
      </div>

      <ListaUsuario
        mostrarMensagem={mostrarListaUsuarios}
        fecharMensagem={fecharListaUsuarios}
      />
      <AtividadeUsuario
        mostrarMensagem={mostrarAtividadeUsuario}
        fecharMensagem={fecharAtividadeUsuarios}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}
