"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Calendar() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

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
          className={`p-2 rounded-lg border border-gray-300 bg-white shadow-md  transition w-40 text-sm ${
            startDate ? "text-black font-medium" : "text-[#9CA3AF]"
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
          className={`p-2 rounded-lg border border-gray-300 bg-white shadow-md transition w-40 text-sm ${
            endDate ? "text-black font-medium" : "text-[#9CA3AF]"
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
        />
      </div>
    </div>
  );
}
