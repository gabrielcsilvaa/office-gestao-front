export interface Escritorio {
  escritorio: number;
  id_cliente: number;
  valor_contrato: number | string | null;
}

export function maxValueContrato(escritorios: Escritorio[]) {
  let maiorValor = 0;

  for (const escritorio of escritorios) {
    const raw = escritorio.valor_contrato;

    if (raw !== null) {
      const valor = parseFloat(String(raw));
      if (!isNaN(valor) && valor > maiorValor) {
        maiorValor = valor;
      }
    }
  }

  return maiorValor;
}
