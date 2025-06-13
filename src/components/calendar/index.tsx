import { useState, useEffect } from "react";
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
  initialStartDate?: string | null; // reintroduzido
  initialEndDate?: string | null;   // reintroduzido
}

// Função que aplica máscara dd/mm/yyyy no input
function maskDate(value: string | undefined | null) {
  if (!value) return "";
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4);
}

// Novo helper para criar Date local a partir de string "yyyy-mm-dd"
function parseISODate(value: string): Date {
  const [yyyy, mm, dd] = value.split("-");
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}

// Função para converter string dd/mm/yyyy em Date ou null se inválido
function parseDate(value: string): Date | null {
  const parts = value.split("/");
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts;
  if (dd.length !== 2 || mm.length !== 2 || yyyy.length !== 4) return null;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  if (isNaN(d.getTime())) return null;
  // Validação extra: garantir que dia, mês e ano batem com o date criado
  if (
    d.getDate() !== Number(dd) ||
    d.getMonth() + 1 !== Number(mm) ||
    d.getFullYear() !== Number(yyyy)
  ) return null;
  return d;
}

// Função para formatar Date para dd/mm/yyyy
function formatDateToInput(date: Date | null) {
  if (!date) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// Ajuste em formatDateISO: manter como está ou usar local (já sem UTC)
function formatDateISO(date: Date | null) {
  if (!date) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function Calendar({
  onStartDateChange,
  onEndDateChange,
  initialStartDate = null,
  initialEndDate = null,
}: CalendarProps) {
  // inicialização via props usando parseISODate
  const [startDate, setStartDate] = useState<Date | null>(() =>
    initialStartDate ? parseISODate(initialStartDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(() =>
    initialEndDate ? parseISODate(initialEndDate) : null
  );
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");

  // REINTRODUZIR estados para controlar abertura do picker
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // quando props mudam, atualiza input interno
  useEffect(() => {
    if (initialStartDate) {
      const d = parseISODate(initialStartDate);
      setStartDate(d);
      setStartInput(formatDateToInput(d));
    }
  }, [initialStartDate]);
  useEffect(() => {
    if (initialEndDate) {
      const d = parseISODate(initialEndDate);
      setEndDate(d);
      setEndInput(formatDateToInput(d));
    }
  }, [initialEndDate]);

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
