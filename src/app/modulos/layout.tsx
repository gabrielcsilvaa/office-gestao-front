"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "../globals.css";
import { Header, Header2 } from "../../components/header/index";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Verifica a URL atual para não afetar a página Home (Login)
    const isLoginPage = window.location.pathname === "/";

    // Se não for a página de login, verifica se o token está presente no localStorage
    if (!isLoginPage) {
      const token = localStorage.getItem("token");

      if (!token) {
        // Se não houver token, redireciona para a página de login
        router.push("/");
      }
    }
  }, [router]);

  return (
    <html lang="pt-br">
      <body className={`antialiased`}>
        <div className="flex h-screen">
          {/* Exibe o Header para as páginas protegidas */}
          <div>
            <Header />
          </div>
          <div className="w-full">
            <Header2 />
            {/* Renderiza o conteúdo da página */}
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
