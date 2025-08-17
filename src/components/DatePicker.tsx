import React, { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  minDate?: Date;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  minDate,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDisplayValue = () => {
    if (!value) return placeholder;
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (value.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (value.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return value.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: value.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className="text-xs font-normal px-2 py-0.5 rounded-sm border transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] cursor-pointer bg-gray-50 dark:bg-[#2c2c2e] border-gray-200 dark:border-[#3a3a3c] text-gray-700 dark:text-[#a1a1a6] hover:bg-gray-100 dark:hover:bg-[#3a3a3c] flex items-center gap-1"
          >
            <span>{formatDisplayValue()}</span>
            <ChevronDownIcon className="w-3 h-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto overflow-hidden p-0 bg-white dark:bg-[#2c2c2e] border-gray-200/60 dark:border-[#3a3a3c] shadow-sm" 
          align="start"
        >
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChange(date);
              setIsOpen(false);
            }}
            disabled={(date) => minDate ? date < minDate : date < new Date(new Date().setHours(0, 0, 0, 0))}
            className="rounded-md border-0"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};