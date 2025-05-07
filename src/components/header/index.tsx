import Link from "next/link";
import "../../app/globals.css";
import { Cairo } from "next/font/google";

// Defina a fonte como uma variável
const cairo = Cairo({
  weight: ["700", "700"], // Você pode especificar os pesos que deseja (normal e negrito)
  subsets: ["latin"], // Se você precisa de algum subconjunto específico (como latino)
});

export function Header() {
  return (
    <header
      className={`fixed lg:relative z-40 w-[255px] h-full flex flex-col gap-2 px-2 py-4 bg-[var(--left-menu-gray)]`}
    >
      <div className="text-xl font-bold mb-6">Meu Menu</div>
      {/* Adicione os itens de navegação ou outros componentes */}
      <nav className={`${cairo.className}`}>
        <ul>
          <li className="mb-4">
            <Link
              href="/modulos/gestao/carteira"
              className="hover:text-gray-400"
            >
              Análise Carteira
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/modulos/gestao/clientes"
              className="hover:text-gray-400"
            >
              Análise Clientes
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/modulos/gestao/usuarios"
              className="hover:text-gray-400"
            >
              Análise Usuários
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/modulos/gestao/escritorio"
              className="hover:text-gray-400"
            >
              Análise Escritório
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
