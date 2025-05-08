"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

interface CardProps {
  title: string;
  value: number;
  icon: string;
  anniversaryData?: { name: string; startDate: string; duration: string }[];
  onClick?: () => void;
}

export default function Card({ title, value, icon, anniversaryData = [], onClick }: CardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsModalOpen(!isModalOpen);
    if (onClick) onClick();
  };

  return (
    <>
      <div
        className="cursor-pointer py-2 px-4 flex flex-row justify-between items-center w-full h-20 bg-white rounded-md shadow-md"
        onClick={handleModalToggle}
      >
        <div className="py-2 flex flex-col items-start justify-between">
          <span className={`text-base ${cairo.className} text-left text-gray-500 font-semibold`}>{title}</span>
          <span className={`text-xl ${cairo.className} font-semibold text-black text-left`}>{value}</span>
        </div>
        <div className="flex justify-center p-2">
          <Image src={icon} alt={title} width={40} height={40} />
        </div>
      </div>

      {/* Modal for Partnership Anniversary */}
      {isModalOpen && anniversaryData.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" onClick={handleModalToggle}>
          <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-semibold mb-4">Aniversário de Parceria</h2>
            <ul className="overflow-y-auto max-h-96">
              {anniversaryData.map((data, index) => (
                <li key={index} className="mb-2">
                  <div className="flex justify-between items-center py-2 px-4 bg-gray-100 rounded-md">
                    <span className="text-gray-700 font-medium">{data.name}</span>
                    <span className="text-gray-500 text-sm">
                      {data.startDate} - {data.duration}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <button className="mt-4 w-full bg-gray-800 text-white py-2 rounded-md" onClick={handleModalToggle}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
} 