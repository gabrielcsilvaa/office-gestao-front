"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});


export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Função que realiza a autenticação
  const fetchLoginAuth = async () => {
    try {
      const body = {
        user: email, // Usando email do formulário
        password: password, // Usando senha do formulário
      };

      // Fazendo a requisição de login
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }

      const data = await response.json();

      // Verificando a resposta da API
      if (data.result === true) {
        // Login bem-sucedido, armazenando token no localStorage
        localStorage.setItem("token", "fake-jwt-token"); // Substitua por um token real, se necessário

        // Redirecionando para a página principal
        router.push("/modulos/gestao/carteira");
      } else {
        // Login falhou, exibe erro
        setError("Credenciais inválidas.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message); // Exibindo a mensagem de erro
      } else {
        setError("Erro desconhecido");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] px-4">
      <div className="w-full max-w-[1000px] shadow-[-10px_-10px_15px_rgba(0,_0,_0,_0.35),_10px_10px_15px_rgba(0,_0,_0,_0.35)] rounded-[30px] bg-white h-auto lg:h-[625px] overflow-hidden flex flex-col lg:flex-row">
        {/* Formulário */}
        <div className="w-full lg:w-1/2 h-full flex flex-col gap-4 items-center justify-center px-6 py-10">
          <b className={`text-3xl ${cairo.className} text-black text-center w-full`}>
            Login
          </b>
          <span className={`text-sm font-medium ${cairo.className} text-black text-center w-full`}>
            utilize seu email e senha para acessar a plataforma
          </span>
          {error && <div className="text-red-500">{error}</div>}{" "}
          {/* Exibe erros */}
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
            <span className={`text-sm font-medium ${cairo.className} text-black`}>
              Esqueceu a senha?
            </span>
          </a>
          <button
            onClick={fetchLoginAuth} // Chama a função de login ao clicar
            className={`w-40 rounded-lg bg-[#373A40] h-9 text-sm text-white ${cairo.className}`}
          >
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
