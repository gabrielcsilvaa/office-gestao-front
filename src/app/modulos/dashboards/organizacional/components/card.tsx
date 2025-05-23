"use client";
import React from "react";
import { Cairo } from "next/font/google";
import Image from "next/image"; // Import Image

const cairo = Cairo({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

interface CardProps {
  title: string;
  value: string; // Value is now a string to accommodate formatted currency
  tooltipText?: string; // New prop for tooltip content
  onClick?: () => void;
}

export default function Card({ title, value, tooltipText, onClick }: CardProps) {
  return (
    <div
      className="cursor-pointer py-2 px-4 flex flex-col w-full h-20 bg-white rounded-md shadow-md relative" // Removed 'group' from here as hover is on icon's div
      onClick={onClick}
    >
      {tooltipText && (
        <div className="absolute top-1 right-1 group"> {/* Added 'group' here for icon-specific hover */}
          <Image
            src="/assets/icons/icon-question-mark.svg"
            alt="Info"
            width={14} // Changed to 8
            height={14} // Changed to 8
            className="opacity-50 group-hover:opacity-100" 
          />
          <div 
            className="absolute bottom-full right-0 mb-1 w-max max-w-xs p-2 bg-black text-white text-xs rounded-md shadow-lg 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none"
            // Tooltip positioning: bottom-full to appear above, right-0 to align with the icon's right edge.
            // mb-1 for a small margin. max-w-xs to constrain width.
          >
            {tooltipText}
            {/* Optional: Add a small arrow for the tooltip if desired */}
            {/* <div className="absolute top-full right-1/2 transform translate-x-1/2 w-2 h-2 bg-black rotate-45"></div> */}
          </div>
        </div>
      )}
      <div className="flex flex-col items-start justify-center flex-grow mt-1"> {/* Adjusted margin slightly if needed */}
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
