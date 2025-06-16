"use client";

import Image from "next/image";
import { Cairo } from "next/font/google";
import { signIn } from "next-auth/react";
import { useState } from "react";

const cairo = Cairo({
    weight: ["500", "600", "700"],
    subsets: ["latin"],
});

export default function Login() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function fetchLoginAuth(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        const body = {
            email: formData.get("email"),
            password: formData.get("password"),
        };

        const result = await signIn("credentials", {
            ...body,
            callbackUrl: "/modulos/gestao/carteira",
            redirect: false,
        });

        setLoading(false);

        if (result && !result.ok) {
            setError("Email ou senha inválidos");
        } else if (result && result.url) {
            window.location.href = result.url;
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] px-4">
            <div className="w-full max-w-[1000px] shadow-[-10px_-10px_15px_rgba(0,_0,_0,_0.35),_10px_10px_15px_rgba(0,_0,_0,_0.35)] rounded-[30px] bg-white h-auto lg:h-[625px] overflow-hidden flex flex-col lg:flex-row">
                {/* Formulário */}
                <form
                    onSubmit={fetchLoginAuth}
                    className="w-full lg:w-1/2 h-full flex flex-col gap-4 items-center justify-center px-6 py-10"
                >
                    <b
                        className={`text-3xl ${cairo.className} text-black text-center w-full`}
                    >
                        Login
                    </b>
                    <span
                        className={`text-sm font-medium ${cairo.className} text-black text-center w-full`}
                    >
                        Utilize seu email e senha para acessar a plataforma
                    </span>
                    {error && (
                        <div className="text-red-500 text-center w-full">{error}</div>
                    )}
                    <input
                        name="email"
                        type="email"
                        className="w-full rounded-lg bg-[#F0F8FF] h-12 px-4 py-2 placeholder:text-[#373A4080]"
                        placeholder="Email"
                        required
                        disabled={loading}
                    />
                    <input
                        name="password"
                        type="password"
                        className="w-full rounded-lg bg-[#F0F8FF] h-12 px-4 py-2 placeholder:text-[#373A4080]"
                        placeholder="Senha"
                        required
                        disabled={loading}
                    />
                    <a href="" className="w-full text-center">
                        <span
                            className={`text-sm font-medium ${cairo.className} text-black`}
                        >
                            Esqueceu a senha?
                        </span>
                    </a>
                    <button
                        type="submit"
                        className={`cursor-pointer w-40 rounded-lg bg-[#373A40] h-9 text-sm text-white ${cairo.className} flex items-center justify-center`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                                Carregando...
                            </span>
                        ) : (
                            "Entrar"
                        )}
                    </button>
                </form>

                {/* Lateral com logo */}
                <div className="w-full lg:w-1/2 h-72 lg:h-full bg-[#373A40] rounded-tl-[50px] lg:rounded-tl-[150px] lg:rounded-bl-[100px] flex items-center justify-center">
                    <Image
                        src={`/assets/logos/${process.env.NEXT_PUBLIC_LOGO_ESCRITORIO?.trim()}`}
                        alt="Logo do sistema"
                        width={300}
                        height={104}
                    />
                </div>
            </div>
        </div>
    );
}
