import React, { ReactNode, useEffect, useState } from "react";
import Organograma from "./organogramaGen";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  codiEmp: string | null | number;
}

interface SocioEmpresa {
  codi_emp: number;
  nome_emp: string;
  cnpj: string;
}

interface DadoSocio {
  socio: string;
  CPF: string;
  empresas: SocioEmpresa[];
}

interface SocioEmpresaCompleta {
  codi_emp: number;
  nome_emp: string;
  cnpj: string;
  socios: string[];
  dados: DadoSocio[];
}

export default function ModalSocio({
  isOpen,
  onClose,
  codiEmp,
  children,
}: ModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [clientData, setClientData] = useState<SocioEmpresaCompleta | null>(
    null
  );

  useEffect(() => {
    if (codiEmp == null) {
      setClientData(null);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchClientData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/analise-clientes/socios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ codi_emp: codiEmp }),
        });

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.statusText}`);
        }

        const data = await response.json();
        setClientData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [codiEmp]);

  if (!isOpen) return null;

  return (
    <div className="border-0 fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto">
      <div className="w-full max-w-[80vw] bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Modal Título</h2>
          <button
            onClick={onClose}
            className="text-xl font-bold text-gray-500 hover:text-gray-800"
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>

        <div className="mt-4">
          {loading && (
            <div className="flex justify-center items-center h-[70vh] bg-gray-200">
              <div className="loader">
                {/* tela de carregamento */}
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-600 font-semibold">
              Erro ao carregar dados: {error}
            </p>
          )}

          {!loading && !error && clientData && (
            <>
              <p className="mb-4 font-semibold">
                Empresa: {clientData.nome_emp} (CNPJ: {clientData.cnpj})
              </p>
              <Organograma data={clientData} />
            </>
          )}

          {!loading && !error && !clientData && (
            <p>Nenhuma empresa selecionada.</p>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
