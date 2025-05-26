import Link from "next/link";
import "../../app/globals.css";
import { Cairo } from "next/font/google";
import Image from "next/image";

// Defina a fonte como uma variável
const cairo = Cairo({
  weight: ["500", "600", "700"], // Você pode especificar os pesos que deseja (normal e negrito)
  subsets: ["latin"],
});

export function Header() {
  return (
    <header className="text-white fixed lg:relative z-40 w-[180px] h-full flex flex-col gap-2 px-2 py-4 bg-[var(--left-menu-gray)]">
      <Link href="/modulos/gestao/carteira">
        <Image
          src={`/assets/logos/${process.env.NEXT_PUBLIC_LOGO_ESCRITORIO?.trim()}`}
          alt="Ícone"
          width={200}
          height={100}
        />
      </Link>
      {/* Adicione os itens de navegação ou outros componentes */}
      <nav className={`mt-6 text-[15px] ${cairo.className}`}>
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
                  className="mr-2" // margem à esquerda para espaçamento entre o texto e o ícone
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
                  className="mr-2" // margem à esquerda para espaçamento entre o texto e o ícone
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
                  className="mr-2" // margem à esquerda para espaçamento entre o texto e o ícone
                />
                Desempenho de usuarios
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
                  className="mr-2" // margem à esquerda para espaçamento entre o texto e o ícone
                />
                Perfil Escritório
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
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
