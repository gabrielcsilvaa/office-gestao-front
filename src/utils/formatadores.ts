// utils/formatters.ts

export const formatadorBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const formatadorSegParaHor = (segundos: number): string => {
  const horas = Math.floor(segundos / 3600); // Calcula as horas
  const minutos = Math.floor((segundos % 3600) / 60); // Calcula os minutos
  const segundosRestantes = segundos % 60; // Calcula os segundos restantes

  // Formata no estilo HH:mm:ss, preenchendo com 0 se necessário
  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(
    2,
    "0"
  )}:${String(segundosRestantes).padStart(2, "0")}`;
};
