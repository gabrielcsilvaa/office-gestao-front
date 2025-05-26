"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "../globals.css";
import { Header, Header2 } from "../../components/header/index";

export default function ModulosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const isLoginPage = window.location.pathname === "/";
    if (!isLoginPage) {
      const token = localStorage.getItem("token");
      if (!token) router.push("/");
    }
  }, [router]);

  return (
    // Altura da tela garantida no container raiz
    <div className="flex h-screen antialiased">
      {/* Sidebar */}
      <div>
        <Header />
      </div>

      {/* Conteúdo principal: full width, full height, flex column */}
      <div className="flex flex-col w-full h-full overflow-hidden">
        {/* Header fixo ou controlado */}
        <div className="flex-shrink-0">
          <Header2 />
        </div>

        {/* Conteúdo com scroll controlado */}
        <main className="flex-grow overflow-auto">{children}</main>
      </div>
    </div>
  );
}
