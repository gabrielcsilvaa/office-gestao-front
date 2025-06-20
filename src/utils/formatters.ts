// C:\PROJETO\office-gestao-front\src\utils\formatters.ts
export const formatDate = (date: Date | null) => {
  if (date) {
    return date.toISOString().split("T")[0];
  }
  return null;
};

export const formatDateToBR = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  try {
    const [year, month, day] = dateString.split("-");
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return "N/A";
  } catch (e) {
    return "N/A";
  }
};

export const formatCurrencyValue = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined || value === "") return "N/A";
  const num = parseFloat(String(value));
  if (isNaN(num)) return "N/A";
  return `R$ ${num.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const capitalizeWords = (text: string | null | undefined): string => {
  if (!text) return "N/A";
  
  const romanNumeralPattern = /^(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3}))$/i;

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (word.toLowerCase().startsWith("(o)") || word.toLowerCase().startsWith("(a)")) {
        if (word.match(/\([oa]\)/i)) {
            const parts = word.split(/(\([oa]\))/i); 
            return parts.map((part, index) => {
                if (index === 0 && part.length > 0) { 
                    return part.charAt(0).toUpperCase() + part.slice(1);
                }
                return part;
            }).join('');
        }
      }
      if (romanNumeralPattern.test(word)) {
        return word.toUpperCase();
      }
      if (word.length > 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return "";
    })
    .join(" ");
};

export const calculateAge = (birthDateString: string | null | undefined): string => {
  if (!birthDateString) return "N/A";
  try {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? `${age} anos` : "N/A";
  } catch (e) {
    return "N/A";
  }
};

export const parseCurrency = (currencyString: string): number => {
  if (!currencyString) return 0;
  return parseFloat(
    currencyString
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim()
  );
};

export const diffDays = (start: string, end: string): number =>
  Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000*60*60*24));
