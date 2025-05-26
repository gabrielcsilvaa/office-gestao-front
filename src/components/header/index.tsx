import Link from "next/link";
import Image from "next/image";
import "../../app/globals.css";
import { Cairo } from "next/font/google";

import { useState, useEffect } from "react";
// Fonte Cairo configurada
const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export function Header() {
  const [isHovered, setIsHovered] = useState(false);

  // Detecta se o mouse está na área próxima da esquerda da tela
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (e.clientX <= 20) {
        setIsHovered(true);
      } else if (e.clientX > 180) {
        // 180 é a largura máxima do sidebar expandido
        setIsHovered(false);
      }
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* Zona invisível que detecta mouse perto da borda esquerda */}
      {!isHovered && (
        <div
          className="flex flex-col justify-center fixed top-0 left-0 h-full w-6 z-50"
          // Pode adicionar cursor para indicar que aparece o menu
          style={{ cursor: "pointer" }}
          onMouseEnter={() => setIsHovered(true)}
        >
          <div className={`bg-[var(--left-menu-gray)] rounded-r-lg p-2 text-lg  text-white`}>{`<`}</div>
        </div>
      )}

      {/* Sidebar que aparece/oculta */}
      <header
        className={`${cairo.className}
          fixed top-0 left-0 h-full z-40 bg-[var(--left-menu-gray)] 
          flex flex-col gap-2 px-2 py-4 
          text-white
          transition-all duration-400 ease-in-out
          overflow-hidden
          ${isHovered ? "w-[180px] opacity-100 pointer-events-auto" : "w-0 opacity-0 pointer-events-none"}
        `}
      >
        {isHovered && (
          <>
            <Link href="/modulos/gestao/carteira">
              <Image
                src={`/assets/logos/${process.env.NEXT_PUBLIC_LOGO_ESCRITORIO?.trim()}`}
                alt="Ícone"
                width={200}
                height={100}
              />
            </Link>
            <nav className={`mt-6 text-[15px]`}>
              <ul>
                <li className="mb-4">
                  <Link
                    href="/modulos/gestao/carteira"
                    className="hover:text-gray-400"
                  >
                    <span className="inline-flex items-center">
                      <Image
                        src="/assets/icons/Frame Carteira.svg"
                        alt="Ícone"
                        width={22}
                        height={22}
                        className="mr-2"
                      />
                      Carteira Clientes
                    </span>
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="/modulos/gestao/clientes"
                    className="hover:text-gray-400"
                  >
                    <span className="inline-flex items-center">
                      <Image
                        src="/assets/icons/Frame Clientes.svg"
                        alt="Ícone"
                        width={22}
                        height={22}
                        className="mr-2"
                      />
                      Custo Operacional
                    </span>
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="/modulos/gestao/usuarios"
                    className="hover:text-gray-400"
                  >
                    <span className="inline-flex items-center">
                      <Image
                        src="/assets/icons/Frame 28.svg"
                        alt="Ícone"
                        width={22}
                        height={22}
                        className="mr-2"
                      />
                      Desempenho de usuários
                    </span>
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="/modulos/gestao/escritorio"
                    className="hover:text-gray-400"
                  >
                    <span className="inline-flex items-center">
                      <Image
                        src="/assets/icons/Frame Escritorio.svg"
                        alt="Ícone"
                        width={22}
                        height={22}
                        className="mr-2"
                      />
                      Perfil Escritório
                    </span>
                  </Link>
                </li>
              </ul>
            </nav>
          </>
        )}
      </header>
    </>
  );
}

export function Header2() {
  return (
    <header className="flex items-center p-2 h-12 bg-white border-[1px] border-[#E5E5E5]">
      <nav className="flex w-full justify-between items-center">
        <span
          className={`${cairo.className} font-[700] text-[28px] text-[var(--left-menu-gray)]`}
        >
          Módulo Gestão
        </span>

        <div className="flex gap-2 ml-auto">
          <Image
            src="/assets/icons/Frame 33.svg"
            alt="Ícone"
            width={35}
            height={35}
          />
          <Image
            src="/assets/icons/Frame 34.svg"
            alt="Ícone"
            width={35}
            height={35}
          />
          <Image
            src="/assets/icons/Frame 35.svg"
            alt="Ícone"
            width={35}
            height={35}
          />
          <Image
            src="/assets/icons/Frame 36.svg"
            alt="Ícone"
            width={35}
            height={35}
          />
        </div>
      </nav>
    </header>
  );
}
