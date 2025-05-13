import { useState } from "react";
import DatePicker from "react-datepicker";

import { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale/pt-BR";
registerLocale("pt-BR", ptBR);

import "react-datepicker/dist/react-datepicker.css";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  weight: ["500", "600", "700"], // Você pode especificar os pesos que deseja (normal e negrito)
  subsets: ["latin"],
});

interface CalendarProps {
  onStartDateChange: (date: string | null) => void;
  onEndDateChange: (date: string | null) => void;
}

export default function Calendar({
  onStartDateChange,
  onEndDateChange,
}: CalendarProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatDate = (date: Date | null) => {
    if (date) {
      return date.toISOString().split("T")[0]; // Formata para 'yyyy-mm-dd'
    }
    return null;
  };

  const handleSearch = () => {
    // Quando o botão "Pesquisar" for clicado, passamos as datas formatadas para o componente pai
    if (startDate && endDate) {
      onStartDateChange(formatDate(startDate));
      onEndDateChange(formatDate(endDate));
    }
  };

  return (
    <div className="flex gap-4">
      {/* Campo Data Inicial */}
      <div className="relative">
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
            setShowStartPicker(false);
            setShowEndPicker(true); // Abre o final
          }}
          onClickOutside={() => setShowStartPicker(false)}
          onSelect={() => setShowStartPicker(false)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Data inicial"
          className={`${cairo.className} p-2 rounded-lg border border-gray-400 bg-white shadow-lg  transition w-30 text-sm ${
            startDate ? "text-black font-medium" : "text-[#000000]"
          }`}
          showPopperArrow={false}
          open={showStartPicker}
          onInputClick={() => {
            setShowStartPicker(true);
            setShowEndPicker(false);
          }}
          shouldCloseOnSelect={true}
          autoComplete="off"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          locale="pt-BR"
        />
      </div>

      {/* Campo Data Final */}
      <div className="relative">
        <DatePicker
          selected={endDate}
          onChange={(date) => {
            setEndDate(date);
            setShowEndPicker(false);
          }}
          onClickOutside={() => setShowEndPicker(false)}
          onSelect={() => setShowEndPicker(false)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Data final"
          className={`${cairo.className} p-2 rounded-lg border border-gray-400 bg-white shadow-lg transition w-30 text-sm ${
            endDate ? "text-black font-medium" : "text-[#000000]"
          }`}
          showPopperArrow={false}
          open={showEndPicker}
          onInputClick={() => {
            setShowEndPicker(true);
            setShowStartPicker(false);
          }}
          shouldCloseOnSelect={true}
          autoComplete="off"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          locale="pt-BR"
        />
      </div>

      {/* Botão Pesquisar */}
      <button
        onClick={handleSearch}
        className={`${cairo.className} bg-[#373A40] text-white p-2 w-40 rounded-md hover:bg-blue-600 hover:cursor-pointer text-sm`}
      >
        Pesquisar
      </button>
    </div>
  );
}
