import Link from "next/link";
import Image from "next/image";
import "../../app/globals.css";
import { Cairo } from "next/font/google";
import { useRouter } from "next/navigation";
import NotificationModal from "../notificacao/modalNotificaçao";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { DefaultSession } from "next-auth";

// Fonte Cairo configurada
const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      tipo: number;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    tipo: number;
  }
}

interface Socio {
  id: number;
  socio: string;
  data_nascimento: string;
}


export function Header() {
  const { data: session} = useSession();
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
    if (session) {
    console.log("Sessão:", session);
  }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
    
  
    

  }, [session]);

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
          <div
            className={`bg-[var(--left-menu-gray)] rounded-r-lg p-2 text-lg  text-white`}
          >{`<`}</div>
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
                <h1 className="text-lg font-bold w-full ml-2">Gestão</h1>
                <li className="mb-4 mt-4">
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
                        src="/assets/icons/money.svg"
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
                      Desemp. de usuários
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
            
            
            {session?.user.tipo === 1 && (
              <ul>
                <h1 className="text-lg font-bold w-full ml-2">Dashboards</h1>

                <li className="mb-4 mt-4">
                  <Link
                    href="/modulos/dashboards/ficha"
                    className="hover:text-gray-400"
                  >
                    <span className="inline-flex items-center">
                      <Image
                        src="/assets/icons/Ficha.svg"
                        alt="Ícone"
                        width={22}
                        height={22}
                        className="mr-2"
                      />
                      Ficha
                    </span>
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="/modulos/dashboards/organizacional"
                    className="hover:text-gray-400"
                  >
                    <span className="inline-flex items-center">
                      <Image
                        src="/assets/icons/Organizacional.svg"
                        alt="Ícone"
                        width={22}
                        height={22}
                        className="mr-2"
                      />
                      Organizacional
                    </span>
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="/modulos/dashboards/fiscal"
                    className="hover:text-gray-400"
                  >
                    <span className="inline-flex items-center">
                      <Image
                        src="/assets/icons/Fiscal.svg"
                        alt="Ícone"
                        width={22}
                        height={22}
                        className="mr-2"
                      />
                      Fiscal
                    </span>
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="/modulos/gestao/carteira"
                    className="hover:text-gray-400"
                  >
                    <span className="inline-flex items-center">
                      <Image
                        src="/assets/icons/Contabil.svg"
                        alt="Ícone"
                        width={22}
                        height={22}
                        className="mr-2"
                      />
                      Contábil
                    </span>
                  </Link>
                </li>
              </ul>
              )}
            </nav>
          </>
        )}
      </header>
    </>
  );
}

export function Header2() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aniversariantes, setAniversariantes] = useState<Socio[]>([]);

  const router = useRouter();

  const handleNotificationClick = () => {
    setIsModalOpen(true); // Abre o modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Fecha o modal
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut({ redirect: false }); // Não redireciona automaticamente
      router.push("/"); // Redireciona manualmente após logout
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      router.push("/");
    }
  };

  useEffect(() => {
    const fetchAniversariosData = async () => {
      try {
        const response = await fetch(
          "/api/analise-carteira/aniversarios-socios",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              start_date: "2024-01-01", // Data estática
              end_date: "2025-01-01", // Data estática
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Dados de aniversários:", data); // Adicionando o console.log para verificar os dados

        // Aqui você pode decidir o que fazer com os dados, se necessário
        setAniversariantes(data); // Armazenando os dados dos aniversariantes no estado
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error("Erro desconhecido");
        }
      }
    };

    fetchAniversariosData();
  }, []);
  return (
    <>
      <header className="flex items-center p-2 h-12 bg-white border-[1px] border-[#E5E5E5]">
        <nav className="flex w-full justify-between items-center">
          <span
            className={`${cairo.className} font-[700] text-[28px] text-[var(--left-menu-gray)]`}
          >
            Módulo Gestão
          </span>

          <div className="flex gap-2 ml-auto cursor-pointer">
            <Image
              src="/assets/icons/exit.svg"
              alt="Ícone de logout"
              width={35}
              height={35}
              onClick={handleLogout}
            />
            <Image
              src="/assets/icons/Frame 33.svg"
              alt="Ícone de notificação"
              width={35}
              height={35}
              onClick={handleNotificationClick} // Abre o modal
            />
            {/* <Image
            src="/assets/icons/Frame 34.svg"
            alt="Ícone"
            width={35}
            height={35}
          /> */}
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
      <NotificationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        aniversariantes={aniversariantes}
      />
    </>
  );
}
