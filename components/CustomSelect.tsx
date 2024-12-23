
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}
const CustomSelect: React.FC<CustomSelectProps> = ({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Select an option',
  disabled = false,
  className
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div 
      className={cn("container mx-auto flex justify-center", className)} 
      ref={selectRef}
    >
      <div className="relative w-full max-w-xs">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-disabled={disabled}
          className={cn(
            "w-full bg-white/15 backdrop-blur-lg rounded-full p-2 flex items-center justify-between px-4 group transition-all",
            !disabled && "hover:bg-white/20",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span className="text-white/90 group-hover:text-white transition-colors truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            className={cn(
              "w-5 h-5 text-white/70 group-hover:text-white transition-all duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && !disabled && (
          <div 
            role="listbox"
            aria-label={placeholder}
            className="absolute z-50 w-full mt-2 bg-white/15 backdrop-blur-lg rounded-2xl py-2 shadow-lg"
          >
            {options.map((option) => (
              <button
                key={option.value}
                role="option"
                aria-selected={value === option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 flex items-center justify-between hover:bg-white/20 transition-colors group"
              >
                <span className="text-white/90 group-hover:text-white transition-colors truncate">
                  {option.label}
                </span>
                {value === option.value && (
                  <Check className="w-4 h-4 text-white/70 group-hover:text-white transition-colors flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;