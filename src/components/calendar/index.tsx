import { useState } from "react";
import DatePicker from "react-datepicker";

import { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale/pt-BR";
registerLocale("pt-BR", ptBR);

import "react-datepicker/dist/react-datepicker.css";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

interface CalendarProps {
  onStartDateChange: (date: string | null) => void;
  onEndDateChange: (date: string | null) => void;
}

// Função que aplica máscara dd/mm/yyyy no input
function maskDate(value: string | undefined | null) {
  if (!value) return "";
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4);
}

// Função para converter string dd/mm/yyyy em Date ou null se inválido
function parseDate(value: string): Date | null {
  const parts = value.split("/");
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts;
  if (dd.length !== 2 || mm.length !== 2 || yyyy.length !== 4) return null;

  const date = new Date(`${yyyy}-${mm}-${dd}`);
  if (isNaN(date.getTime())) return null;

  // Validação extra: garantir que dia, mês e ano batem com o date criado
  if (
    date.getDate() !== Number(dd) ||
    date.getMonth() + 1 !== Number(mm) ||
    date.getFullYear() !== Number(yyyy)
  ) {
    return null;
  }

  return date;
}

// Função para formatar Date para dd/mm/yyyy
function formatDateToInput(date: Date | null) {
  if (!date) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// Função para formatar Date para yyyy-mm-dd para enviar no callback
function formatDateISO(date: Date | null) {
  if (!date) return null;
  return date.toISOString().split("T")[0];
}

export default function Calendar({
  onStartDateChange,
  onEndDateChange,
}: CalendarProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Estados para armazenar o valor do input como string mascarada
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleStartChangeRaw = (
    event?:
      | React.MouseEvent<HTMLElement>
      | React.KeyboardEvent<HTMLElement>
      | undefined
  ) => {
    if (!event) return;

    // O target pode não ser um HTMLInputElement, mas aqui assumimos que sim
    const input = event.target as HTMLInputElement;
    const masked = maskDate(input.value);
    setStartInput(masked);

    if (masked.length === 10) {
      const parsed = parseDate(masked);
      setStartDate(parsed);
    } else {
      setStartDate(null);
    }
  };
  
  const handleEndChangeRaw = (
    event?:
      | React.MouseEvent<HTMLElement>
      | React.KeyboardEvent<HTMLElement>
      | undefined
  ) => {
    if (!event) return;

    // O target pode não ser um HTMLInputElement, mas aqui assumimos que sim
    const input = event.target as HTMLInputElement;
    const masked = maskDate(input.value);
    setEndInput(masked);

    if (masked.length === 10) {
      const parsed = parseDate(masked);
      setEndDate(parsed);
    } else {
      setEndDate(null);
    }
  };

  const handleStartChange = (date: Date | null) => {
    setStartDate(date);
    setStartInput(formatDateToInput(date));
  };

  const handleEndChange = (date: Date | null) => {
    setEndDate(date);
    setEndInput(formatDateToInput(date));
  };

  const handleSearch = () => {
    if (startDate && endDate) {
      onStartDateChange(formatDateISO(startDate));
      onEndDateChange(formatDateISO(endDate));
    }
  };

  return (
    <div className="flex gap-2">
      {/* Campo Data Inicial */}
      <div className="relative">
        <DatePicker
          selected={startDate}
          onChange={handleStartChange}
          onChangeRaw={handleStartChangeRaw}
          value={startInput}
          onClickOutside={() => setShowStartPicker(false)}
          onSelect={() => setShowStartPicker(false)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Data inicial"
          className={`${cairo.className} p-2 rounded-lg border border-gray-400 bg-white shadow-lg transition w-30 text-sm ${
            startInput ? "text-black font-medium" : "text-[#000000]"
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
          onChange={handleEndChange}
          onChangeRaw={handleEndChangeRaw}
          value={endInput}
          onClickOutside={() => setShowEndPicker(false)}
          onSelect={() => setShowEndPicker(false)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Data final"
          className={`${cairo.className} p-2 rounded-lg border border-gray-400 bg-white shadow-lg transition w-30 text-sm ${
            endInput ? "text-black font-medium" : "text-[#000000]"
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
