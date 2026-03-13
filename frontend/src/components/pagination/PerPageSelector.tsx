interface PerPageSelectorProps {
  value: number;
  options?: number[];
  onChange: (value: number) => void;
}

export default function PerPageSelector({
  value,
  options = [6, 12, 24],
  onChange,
}: PerPageSelectorProps) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-sm text-gray-400 hidden sm:inline">Show</span>
      {options.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          aria-pressed={value === n}
          className={`w-10 h-9 rounded-lg text-sm font-medium border transition-colors ${
            value === n
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
