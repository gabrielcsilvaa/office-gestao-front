import React from "react";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  weight: ["500", "600", "700"], // Você pode especificar os pesos que deseja (normal e negrito)
  subsets: ["latin"],
});

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className={`${cairo.className} flex justify-between mt-4`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="cursor-pointer disabled:cursor-default bg-gray-300 hover:bg-gray-500 disabled:hover:bg-gray-300 text-black p-2 rounded-md disabled:opacity-50"
      >
        Anterior
      </button>
      <span className="self-center">{`Página ${currentPage} de ${totalPages}`}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="cursor-pointer disabled:cursor-default bg-gray-300 hover:bg-gray-500 disabled:hover:bg-gray-300 text-black p-2 rounded-md disabled:opacity-50"
      >
        Próximo
      </button>
    </div>
  );
};

export default Pagination;
