// Função para formatar as datas
export const formatDate = (date: Date | null) => {
  if (date) {
    return date.toISOString().split("T")[0]; // Formata para 'yyyy-mm-dd'
  }
  return null;
};
