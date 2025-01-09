import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <Input
      type="search"
      placeholder="Search articles..."
      className="max-w-xs"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}