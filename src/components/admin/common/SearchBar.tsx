"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
}

export function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  onSearch,
}: SearchBarProps) {
  return (
    <div className="relative group">
      <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch?.(value);
          }
        }}
        className="w-full rounded-xl border border-white/20 bg-white/5 backdrop-blur-lg py-3.5 pl-14 pr-6 text-sm font-medium text-white placeholder:text-gray-400 shadow-lg transition-all duration-300 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:shadow-xl hover:border-white/30"
      />
    </div>
  );
}
