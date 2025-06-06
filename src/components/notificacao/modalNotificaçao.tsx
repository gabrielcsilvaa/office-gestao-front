// src/components/notificacao/modalNotificaçao.tsx
import React, { useEffect, useRef } from 'react';

interface Socio {
  id: number;
  socio: string;
  data_nascimento: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  aniversariantes?: Socio[]; // Tornando a prop opcional
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  aniversariantes = [],
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose(); 
      }
    };

    if (isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    } else {
      window.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null; 

  const aniversariantesDoDia = aniversariantes.filter(socio => {
    const hoje = new Date();
    const nascimento = new Date(socio.data_nascimento);
    return nascimento.getDate() === hoje.getDate() && nascimento.getMonth() === hoje.getMonth();
  });

  console.log("Aniversariantes do dia:", aniversariantesDoDia);

  return (
    <div
      className="fixed top-[60px] right-4 bg-white p-4 rounded-lg shadow-lg w-72 z-50 transition-all duration-300 ease-in-out border border-gray-300"
      ref={modalRef} // Referência para o modal
    >
      <h2 className="text-lg font-semibold text-black">Aniversariantes do Dia</h2>
      {aniversariantesDoDia.length > 0 ? (
        <ul className="list-disc pl-5">
          {aniversariantesDoDia.map(socio => (
            <li key={socio.id} className="text-gray-700">
              {socio.socio} - {new Date(socio.data_nascimento).toLocaleDateString('pt-BR')}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">Nenhum aniversariante hoje.</p>
      )}
    </div>
  );
};

export default NotificationModal;