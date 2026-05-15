import { Search } from "lucide-react";
import { Box } from "./box";
import { Input } from "./input";
import { useState, useEffect } from "react";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  debounce?: number;
}

const SearchBar = ({
  placeholder = "Search...",
  value,
  onChange,
  className,
  debounce = 400,
}: SearchBarProps) => {
  const [input, setInput] = useState(value ?? "");

  useEffect(() => {
    const timer = setTimeout(() => onChange?.(input), debounce);
    return () => clearTimeout(timer);
  }, [input, debounce]);

  return (
    <Box className={`relative flex-1 max-w-sm ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="pl-9"
      />
    </Box>
  );
};

export default SearchBar;