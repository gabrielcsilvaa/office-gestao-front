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

export function formatarCpfCnpj(valor?: string | null): string {
  if (!valor) return "N/A";

  const somenteNumeros = valor.replace(/\D/g, "");

  if (somenteNumeros.length === 11) {
    // CPF: 000.000.000-00
    return somenteNumeros.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-$4"
    );
  }

  if (somenteNumeros.length === 14) {
    // CNPJ: 00.000.000/0000-00
    return somenteNumeros.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }

  return valor; // Se não for 11 nem 14 dígitos, retorna como está
}

export function gerarMesesEntreDatas(start_date: string, end_date: string): string[] {
  const MESES_PT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

  const inicio = new Date(start_date);
  const fim = new Date(end_date);

  const resultado: string[] = [];

  const atual = new Date(inicio.getFullYear(), inicio.getMonth(), 1);

  while (atual <= fim) {
    const mes = atual.getMonth(); // 0-11
    const ano = atual.getFullYear();
    resultado.push(`${MESES_PT[mes]}/${ano}`);
    atual.setMonth(atual.getMonth() + 1);
  }

  return resultado;
}
