"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] px-4">
      <div className="w-full max-w-[1000px] shadow-[-10px_-10px_15px_rgba(0,_0,_0,_0.35),_10px_10px_15px_rgba(0,_0,_0,_0.35)] rounded-[30px] bg-white h-auto lg:h-[625px] overflow-hidden flex flex-col lg:flex-row">
        {/* Formulário */}
        <div className="w-full lg:w-1/2 h-full flex flex-col gap-4 items-center justify-center px-6 py-10">
          <b className="text-3xl font-cairo text-black text-center w-full">
            Login
          </b>
          <span className="text-sm font-medium font-cairo text-black text-center w-full">
            utilize seu email e senha para acessar a plataforma
          </span>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-[#F0F8FF] h-12 px-4 py-2 placeholder:text-[#373A4080]"
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-[#F0F8FF] h-12 px-4 py-2 placeholder:text-[#373A4080]"
            placeholder="Senha"
          />

          <a href="" className="w-full text-center">
            <span className="text-sm font-medium font-cairo text-black">
              Esqueceu a senha?
            </span>
          </a>

          <button className="w-40 rounded-lg bg-[#373A40] h-9 text-sm text-white font-cairo">
            Entrar
          </button>
        </div>

        {/* Lateral com logo */}
        <div className="w-full lg:w-1/2 h-72 lg:h-full bg-[#373A40] rounded-tl-[50px] lg:rounded-tl-[150px] lg:rounded-bl-[100px] flex items-center justify-center">
          <Image
            src="/assets/logos/office.svg"
            alt="Logo do sistema"
            width={300}
            height={104}
          />
        </div>
      </div>
    </div>
  );
}
