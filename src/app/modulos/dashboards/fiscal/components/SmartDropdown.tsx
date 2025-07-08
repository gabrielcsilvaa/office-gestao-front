"use client";
import { Dropdown } from "./Dropdown";
import { VirtualizedDropdown } from "./VirtualizedDropdown";

interface SmartDropdownProps {
  options: string[];
  label: string;
  widthClass: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  disabled?: boolean;
  areDatesSelected?: boolean;
  // Limite para ativar virtualização automaticamente
  virtualizationThreshold?: number;
}

export const SmartDropdown: React.FC<SmartDropdownProps> = ({
  options,
  virtualizationThreshold = 100, // Ativa virtualização com mais de 100 itens
  ...props
}) => {
  // Se há muitas opções, usa o dropdown virtualizado
  if (options.length > virtualizationThreshold) {
    return (
      <VirtualizedDropdown
        {...props}
        options={options}
        itemHeight={44}
        maxVisibleItems={8}
        overscan={3}
      />
    );
  }

  // Para listas pequenas, usa o dropdown normal
  return (
    <Dropdown
      {...props}
      options={options}
    />
  );
};
