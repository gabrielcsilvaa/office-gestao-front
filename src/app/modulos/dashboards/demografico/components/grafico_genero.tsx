import React from "react";
import Image from "next/image";

const GraficoGenero = ({
  masculinoPercentual = 63,
  femininoPercentual = 37,
}) => {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "300px",
        height: "250px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h3
        style={{
          textAlign: "center",
          marginTop:"40px",
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
          width: "100%",
          alignItems: "flex-end",
          marginTop: "20px",
        }}
      >
        {/* Masculino */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span
            style={{
              fontSize: "1.2em",
              fontWeight: "bold",
              color: "#007bff",
            }}
          >
            {masculinoPercentual.toFixed(2)}%
          </span>
          <Image
            src={`/assets/icons/man.svg`}
            alt="Ícone"
            width={100}
            height={50}
          />
        </div>

        {/* Divisória */}
        <div
          style={{
            width: "1px",
            backgroundColor: "#ccc",
            height: "80%",
            alignSelf: "center",
          }}
        />

        {/* Feminino */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span
            style={{
              fontSize: "1.2em",
              fontWeight: "bold",
              color: "#ff69b4",
            }}
          >
            {femininoPercentual.toFixed(2)}%
          </span>
          <Image
            src={`/assets/icons/woman.svg`}
            alt="Ícone"
            width={100}
            height={50}
          />
        </div>
      </div>
    </div>
  );
};

export default GraficoGenero;
