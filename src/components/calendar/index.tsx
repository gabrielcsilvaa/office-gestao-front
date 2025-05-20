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

function formatInputValue(value: string): string {
  const nums = value.replace(/\D/g, "");

  if (nums.length <= 2) {
    return nums;
  } else if (nums.length <= 4) {
    return nums.slice(0, 2) + "/" + nums.slice(2);
  } else {
    return nums.slice(0, 2) + "/" + nums.slice(2, 4) + "/" + nums.slice(4, 8);
  }
}

function parseDateFromString(value: string): Date | null {
  const parts = value.split("/");
  if (parts.length !== 3) return null;

  const [dd, mm, yyyy] = parts;
  if (
    dd.length !== 2 ||
    mm.length !== 2 ||
    yyyy.length !== 4 ||
    isNaN(Number(dd)) ||
    isNaN(Number(mm)) ||
    isNaN(Number(yyyy))
  ) {
    return null;
  }

  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  if (date.getDate() !== Number(dd)) return null;

  return date;
}

export default function Calendar({
  onStartDateChange,
  onEndDateChange,
}: CalendarProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatDate = (date: Date | null) => {
    if (date) {
      return date.toISOString().split("T")[0];
    }
    return null;
  };

  const handleSearch = () => {
    if (startDate && endDate) {
      onStartDateChange(formatDate(startDate));
      onEndDateChange(formatDate(endDate));
    }
  };

  // Handler corrigido para onChangeRaw — evento genérico
  const handleStartInputChange = (
    event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
  ) => {
    const input = event?.target as HTMLInputElement | undefined;
    if (!input) return;

    const rawValue = input.value;
    const formatted = formatInputValue(rawValue);
    setStartInput(formatted);

    const parsedDate = parseDateFromString(formatted);
    if (parsedDate) {
      setStartDate(parsedDate);
    } else {
      setStartDate(null);
    }
  };

  const handleEndInputChange = (
    event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
  ) => {
    const input = event?.target as HTMLInputElement | undefined;
    if (!input) return;

    const rawValue = input.value;
    const formatted = formatInputValue(rawValue);
    setEndInput(formatted);

    const parsedDate = parseDateFromString(formatted);
    if (parsedDate) {
      setEndDate(parsedDate);
    } else {
      setEndDate(null);
    }
  };

  return (
    <div className="flex gap-4">
      <div className="relative">
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
            setShowStartPicker(false);
            setShowEndPicker(true);
            if (date)
              setStartInput(
                date
                  .toLocaleDateString("pt-BR")
                  .split("/")
                  .map((v) => v.padStart(2, "0"))
                  .join("/")
              );
          }}
          dateFormat="dd/MM/yyyy"
          placeholderText="Data inicial"
          className={`${cairo.className} p-2 rounded-lg border border-gray-400 bg-white shadow-lg transition w-30 text-sm ${
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
          onChangeRaw={handleStartInputChange}
          value={startInput}
        />
      </div>

      <div className="relative">
        <DatePicker
          selected={endDate}
          onChange={(date) => {
            setEndDate(date);
            setShowEndPicker(false);
            if (date)
              setEndInput(
                date
                  .toLocaleDateString("pt-BR")
                  .split("/")
                  .map((v) => v.padStart(2, "0"))
                  .join("/")
              );
          }}
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
          onChangeRaw={handleEndInputChange}
          value={endInput}
        />
      </div>

      <button
        onClick={handleSearch}
        className={`${cairo.className} bg-[#373A40] text-white p-2 w-40 rounded-md hover:bg-blue-600 hover:cursor-pointer text-sm`}
      >
        Pesquisar
      </button>
    </div>
  );
}
