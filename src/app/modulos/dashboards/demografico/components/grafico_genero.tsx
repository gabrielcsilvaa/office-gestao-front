"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const GraficoGenero = ({
  masculinoPercentual = 63,
  femininoPercentual = 37,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsModalOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, handleKeyDown]);

  const Grafico = () => (
    <div style={{ width: "100%", height: 250 }}>
      <h3
        style={{
          textAlign: "center",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        Colaboradores por Gênero
      </h3>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "calc(100% - 40px)",
        }}
      >
        {/* Masculino */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{ fontSize: "1.1em", fontWeight: "bold", color: "#007bff" }}
          >
            {masculinoPercentual.toFixed(2)}%
          </span>
          <Image
            src="/assets/icons/man.svg"
            alt="Ícone masculino"
            width={60}
            height={60}
          />
        </div>

        <div style={{ width: "1px", backgroundColor: "#ccc", height: "70%" }} />

        {/* Feminino */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{ fontSize: "1.1em", fontWeight: "bold", color: "#ff69b4" }}
          >
            {femininoPercentual.toFixed(2)}%
          </span>
          <Image
            src="/assets/icons/woman.svg"
            alt="Ícone feminino"
            width={60}
            height={60}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="relative bg-white rounded shadow p-2 h-[300px]">
        {/* Botão de maximizar */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-2 right-2 z-10"
        >
          <Image
            src="/assets/icons/icon-maximize.svg"
            alt="Maximizar"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>

        <Grafico />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-4 rounded-lg shadow-lg w-[90vw] h-[80vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão de fechar */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-black hover:text-white-700 text-sm rounded"
              aria-label="Fechar modal"
            >
              ✕
            </button>

            {/* Gráfico no modal */}
            <div className="h-full flex items-center justify-center">
              <Grafico />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GraficoGenero;
