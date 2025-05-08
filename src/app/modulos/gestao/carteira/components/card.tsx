"use client";
import React from "react";
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
}

export default function Card({ title, value, icon }: CardProps) {
  return (
    <div className="cursor-pointer py-2 px-4 flex flex-row justify-between items-center w-full h-20 bg-white rounded-md shadow-md">
      <div className="py-2 flex flex-col items-start justify-between">
        <span className={`text-base  ${cairo.className} text-left text-gray-500`}>{title}</span>
        <span className={`text-xl  ${cairo.className} block`}>{value}</span>
      </div>
      <Image src={icon} alt={title} width={40} height={40} />
    </div>
  );
}
