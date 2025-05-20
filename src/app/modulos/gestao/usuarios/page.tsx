"use client";
import { Cairo } from "next/font/google";
import React, { useState, useEffect } from "react";

import UserChart from "./components/chart";
import Calendar from "@/components/calendar";

import {
  fetchUserList,
  fetchUserData,
  fetchUserActivities,
  fetchModuleActivities,
} from "./services/api";

import ListaUsuario from "./components/modal_lista_usuario";
import AtividadeUsuario from "./components/modal_atividade_usuario";
import AtividadesModulos from "./components/modal_atividade_modulo";
import AtividadeCliente from "./components/modal_atividade_cliente";
import {
  ActivitiesData,
  dadosUsuarios,
  Modulo,
  UserList,
} from "./interfaces/interface";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export default function Usuarios() {
  const [selectedOption, setSelectedOption] = useState("Selecionar Todos");
  const [mostrarListaUsuarios, setMostrarListaUsuarios] = useState(false);
  const [mostrarAtividadeUsuario, setMostrarAtividadeUsuarios] =
    useState(false);
  const [mostrarAtividadeModulo, setMostrarAtividadeModulo] = useState(false);
  const [mostrarAtividadeCliente, setMostrarAtividadeCliente] = useState(false);

  const abrirListaUsuarios = () => setMostrarListaUsuarios(true);
  const fecharListaUsuarios = () => setMostrarListaUsuarios(false);

  const abrirAtividadeUsuarios = () => setMostrarAtividadeUsuarios(true);
  const fecharAtividadeUsuarios = () => setMostrarAtividadeUsuarios(false);

  const abrirAtividadesModulo = () => setMostrarAtividadeModulo(true);
  const fecharAtividadeModulo = () => setMostrarAtividadeModulo(false);

  const abrirAtividadeCliente = () => setMostrarAtividadeCliente(true);
  const fecharAtividadeCliente = () => setMostrarAtividadeCliente(false);

  //Estados de data
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  //Dados
  const [userList, setUserList] = useState<UserList | null>(null);
  const [activites, setActivities] = useState<ActivitiesData | null>(null);
  const [data, setData] = useState<dadosUsuarios | null>(null);
  const [dataModule, setDataModule] = useState<Modulo | null>(null);

  //Aguardando colocar data
  // const [awaitDateSelection, setAwaitDateSelection] = useState(true); // Tela de seleção de data

  const handleStartDateChange = (date: string | null) => {
    setStartDate(date);
    // setAwaitDateSelection(false); // Remove a tela de seleção de data
  };

  const handleEndDateChange = (date: string | null) => {
    setEndDate(date);
    // setAwaitDateSelection(false); // Remove a tela de seleção de data
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  useEffect(() => {
    if (!startDate || !endDate) return;

    fetchUserList()
      .then(setUserList)
      .catch((e) => console.error(e));

    const dateRange = { start_date: startDate, end_date: endDate };

    fetchUserData(dateRange)
      .then(setData)
      .catch((e) => console.error(e));

    fetchUserActivities(dateRange)
      .then(setActivities)
      .catch((e) => console.error(e));

    fetchModuleActivities(dateRange)
      .then(setDataModule)
      .catch((e) => console.error(e));
  }, [startDate, endDate]);

  // Executa quando startDate ou endDate mudam

  useEffect(() => {
    if (!data) return; // se data for null ou undefined, sai do efeito

    for (const i of data.analises) {
      console.log(i.nome_usuario);
    }
  }, [data]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    console.log(userList);
  }, [userList]);

  useEffect(() => {
    console.log(activites);
  }, [activites]);

  useEffect(() => {
    console.log(dataModule);
  }, [dataModule]);

  // Função auxiliar para converter segundos em um formato detalhado (ex.: 163h 31m 46s)
  const formatTimeDetailed = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
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
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
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
            <p className="text-xl font-semibold text-black">
              {activites?.atividades_totais ?? 0}
            </p>
          </div>

          <div className="usuarios-card p-3">
            <p className="text-xs text-gray-500">Importações totais</p>
            <p className="text-xl font-semibold text-black">
              {data?.totais_gerais?.total_importacoes ?? 0}
            </p>
          </div>

          <div className="usuarios-card p-3">
            <p className="text-xs text-gray-500">
              Total de Lançamentos
            </p>
            <p className="text-xl font-semibold text-black">
              {data?.totais_gerais?.total_lancamentos ?? 0}
            </p>
          </div>

          <div className="usuarios-card p-3">
            <p className="text-xs text-gray-500">
              Total de Lançamentos Manuais
            </p>
            <p className="text-xl font-semibold text-black">
              {data?.totais_gerais?.total_lancamentos_manuais ?? 0}
            </p>
          </div>

          <div className="usuarios-card p-3">
            <p className="text-xs text-gray-500">Total de Horas Ativas</p>
            <p className="text-xl font-semibold text-black">
              {data?.totais_gerais?.total_tempo_gasto
                ? formatTimeDetailed(data.totais_gerais.total_tempo_gasto)
                : "00h 00m 00s"}
            </p>
          </div>
        </div>

        <div>
          <UserChart />

          <div className="w-full flex justify-center">
            <div className="grid grid-cols-2 gap-4 p-3">
              <button
                onClick={abrirListaUsuarios}
                className="bg-white border border-gray-300 w-[500px] h-[70px]  hover:bg-gray-200 font-extrabold shadow-md"
              >
                Lista de Usuários
              </button>

              <button
                onClick={abrirAtividadeUsuarios}
                className="bg-white border border-gray-300 w-[500px] h-[70px]  hover:bg-gray-200 font-extrabold shadow-md"
              >
                Atividade por Usuário
              </button>

              <button
                onClick={abrirAtividadesModulo}
                className="bg-white border border-gray-300 w-[500px] h-[70px] hover:bg-gray-200 font-extrabold shadow-md"
              >
                Atividade Por Módulo
              </button>

              <button
                onClick={abrirAtividadeCliente}
                className="bg-white border border-gray-300 w-[500px] h-[70px] hover:bg-gray-200 font-extrabold shadow-md"
              >
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
      />

      <AtividadesModulos
        mostrarMensagem={mostrarAtividadeModulo}
        fecharMensagem={fecharAtividadeModulo}
      />

      <AtividadeCliente
        mostrarMensagem={mostrarAtividadeCliente}
        fecharMensagem={fecharAtividadeCliente}
      />
    </div>
  );
}
