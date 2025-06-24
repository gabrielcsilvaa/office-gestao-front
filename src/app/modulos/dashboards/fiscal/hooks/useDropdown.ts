"use client";
import { useState } from 'react';

export const useDropdown = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleToggleDropdown = (dropdownName: string) => {
    setOpenDropdown(prev => (prev === dropdownName ? null : dropdownName));
  };

  return {
    openDropdown,
    handleToggleDropdown,
  };
};
