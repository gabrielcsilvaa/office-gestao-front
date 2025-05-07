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
    <header
      className={`text-white fixed lg:relative z-40 w-[255px] h-full flex flex-col gap-2 px-2 py-4 bg-[var(--left-menu-gray)]`}
    >
      <Image
        src="/assets/logos/office.svg"
        alt="Ícone"
        width={220}
        height={84}
      />
      {/* Adicione os itens de navegação ou outros componentes */}
      <nav className={`mt-6 text-[17px] ${cairo.className}`}>
        <ul>
          <li className="mb-4">
            <Link
              href="/modulos/gestao/carteira"
              className="hover:text-gray-400"
            >
              <span className="inline-flex items-center text-lg">
                <Image
                  src="/assets/icons/Frame Carteira.svg"
                  alt="Ícone"
                  width={22}
                  height={22}
                  className="mr-2" // margem à esquerda para espaçamento entre o texto e o ícone
                />
                Análise de Carteira
              </span>
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/modulos/gestao/clientes"
              className="hover:text-gray-400"
            >
              <span className="inline-flex items-center text-lg">
                <Image
                  src="/assets/icons/Frame Clientes.svg"
                  alt="Ícone"
                  width={22}
                  height={22}
                  className="mr-2" // margem à esquerda para espaçamento entre o texto e o ícone
                />
                Análise de Clientes
              </span>
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/modulos/gestao/usuarios"
              className="hover:text-gray-400"
            >
              <span className="inline-flex items-center text-lg">
                <Image
                  src="/assets/icons/Frame 28.svg"
                  alt="Ícone"
                  width={22}
                  height={22}
                  className="mr-2" // margem à esquerda para espaçamento entre o texto e o ícone
                />
                Análise de Usuários
              </span>
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/modulos/gestao/escritorio"
              className="hover:text-gray-400"
            >
              <span className="inline-flex items-center text-lg">
                <Image
                  src="/assets/icons/Frame Escritorio.svg"
                  alt="Ícone"
                  width={22}
                  height={22}
                  className="mr-2" // margem à esquerda para espaçamento entre o texto e o ícone
                />
                Análise de Escritório
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
    <header className="flex items-center p-2 h-16 bg-white border-[1px] border-[#E5E5E5]">
      <nav className="flex w-full justify-between items-center">
        <span
          className={`${cairo.className} font-[700] text-[32px] text-[var(--left-menu-gray)]`}
        >
          Módulo Gestão
        </span>

        <div className="flex gap-2 ml-auto">
          <Image
            src="/assets/icons/Frame 33.svg"
            alt="Ícone"
            width={40}
            height={40}
          />
          <Image
            src="/assets/icons/Frame 34.svg"
            alt="Ícone"
            width={40}
            height={40}
          />
          <Image
            src="/assets/icons/Frame 35.svg"
            alt="Ícone"
            width={40}
            height={40}
          />
          <Image
            src="/assets/icons/Frame 36.svg"
            alt="Ícone"
            width={40}
            height={40}
          />
        </div>
      </nav>
    </header>
  );
}
