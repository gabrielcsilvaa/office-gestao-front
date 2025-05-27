import React from "react";
import Image from "next/image";

const GraficoGenero = ({
  masculinoPercentual = 63,
  femininoPercentual = 37,
}) => {
  return (
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
          height: "calc(100% - 40px)", // ocupa o restante do espaço
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
            style={{
              fontSize: "1.1em",
              fontWeight: "bold",
              color: "#007bff",
            }}
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

        {/* Divisória */}
        <div
          style={{
            width: "1px",
            backgroundColor: "#ccc",
            height: "70%",
          }}
        />

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
            style={{
              fontSize: "1.1em",
              fontWeight: "bold",
              color: "#ff69b4",
            }}
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
};

export default GraficoGenero;
