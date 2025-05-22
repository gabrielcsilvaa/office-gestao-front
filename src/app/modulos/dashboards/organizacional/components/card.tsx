"use client";
import React from "react";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

interface CardProps {
  title: string;
  value: string; // Value is now a string to accommodate formatted currency
  onClick?: () => void;
}

export default function Card({ title, value, onClick }: CardProps) {
  return (
    <div
      className="cursor-pointer py-2 px-4 flex flex-row items-center w-full h-20 bg-white rounded-md shadow-md"
      onClick={onClick}
    >
      <div className="py-2 flex flex-col items-start justify-center flex-grow">
        <span
          className={`text-sm ${cairo.className} text-left text-gray-500`}
        >
          {title}
        </span>
        <span className={`text-lg ${cairo.className} block`}>{value}</span>
      </div>
    </div>
  );
}
