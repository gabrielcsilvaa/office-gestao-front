import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-between mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-gray-300 text-black p-2 rounded-md disabled:opacity-50"
      >
        Anterior
      </button>
      <span className="self-center">{`Página ${currentPage} de ${totalPages}`}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="bg-gray-300 text-black p-2 rounded-md disabled:opacity-50"
      >
        Próximo
      </button>
    </div>
  );
};

export default Pagination;
