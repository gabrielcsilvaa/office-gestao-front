"use client";
import React, { useState, useRef, useLayoutEffect } from "react";
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
  const iconRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [positionClass, setPositionClass] = useState(
    "-translate-x-1/2 left-1/2",
  ); // Default to centered

  useLayoutEffect(() => {
    if (iconRef.current && tooltipRef.current) {
      const iconRect = iconRef.current.getBoundingClientRect();
      const tooltipWidth = tooltipRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;

      // Calculate the centered position
      const centeredLeft = iconRect.left + iconRect.width / 2 - tooltipWidth / 2;
      const centeredRight = centeredLeft + tooltipWidth;

      // Check for viewport overflow
      if (centeredRight > viewportWidth) {
        // If it overflows right, align to the right of the icon container
        setPositionClass("right-0");
      } else if (centeredLeft < 0) {
        // If it overflows left, align to the left of the icon container
        setPositionClass("left-0");
      } else {
        // Otherwise, center it
        setPositionClass("-translate-x-1/2 left-1/2");
      }
    }
  }, [tooltipText]); // Rerun when tooltipText changes, as it affects width

  return (
    <div
      className="cursor-pointer py-2 px-4 flex flex-col w-full h-20 bg-white rounded-md shadow-md relative" 
      onClick={onClick}
    >
      {tooltipText && (
        <div ref={iconRef} className="absolute top-1 right-1 group">
          {" "}
          {/* Added ref */}
          <Image
            src="/assets/icons/icon-question-mark.svg"
            alt="Info"
            width={14} 
            height={14} 
            className="opacity-50 group-hover:opacity-100" 
          />
          <div
            ref={tooltipRef}
            className={`absolute bottom-full mb-1 w-max max-w-xs p-2 bg-black text-white text-xs rounded-md shadow-lg 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none 
                       ${positionClass}`}
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
        <span className={`text-lg ${cairo.className} block`}>{value}</span>
      </div>
    </div>
  );
}
