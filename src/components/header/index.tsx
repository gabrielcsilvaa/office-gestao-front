export function Header() {
  return (
    <header className="w-64 bg-gray-800 text-white p-4 h-full">
      <div className="text-xl font-bold mb-6">Meu Menu</div>
      {/* Adicione os itens de navegação ou outros componentes */}
      <nav>
        <ul>
          <li className="mb-4">
            <a href="#" className="hover:text-gray-400">
              Início
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:text-gray-400">
              Clientes
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:text-gray-400">
              Relatórios
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:text-gray-400">
              Configurações
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
