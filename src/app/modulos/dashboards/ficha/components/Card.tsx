"use client";
import React from "react";
import { Cairo } from "next/font/google";
import Image from "next/image";

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

interface CardProps {
  title: string;
  value: string;
  tooltipText?: string;
  onClick?: () => void;
}

export default function Card({ title, value, tooltipText, onClick }: CardProps) {
  return (
    <div
      className="cursor-pointer py-2 px-4 flex flex-col w-full min-h-20 bg-white rounded-md shadow-md relative"
      onClick={onClick}
    >
      {tooltipText && (
        <div className="absolute top-1 right-1 group">
          <Image
            src="/assets/icons/icon-question-mark.svg"
            alt="Info"
            width={14}
            height={14}
            className="opacity-50 group-hover:opacity-100"
          />
          <div 
            className="absolute bottom-full right-0 mb-1 w-max max-w-xs p-2 bg-black text-white text-xs rounded-md shadow-lg 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none"
          >
            {tooltipText}
          </div>
        </div>
      )}
      <div className="flex flex-col items-start justify-center flex-grow mt-1">
        <span
          className={`text-sm ${cairo.className} text-left text-gray-500`}
        >
          {title}
        </span>
        <span className="text-lg __className_50a8b1 block">{value}</span>
      </div>
    </div>
  );
}
