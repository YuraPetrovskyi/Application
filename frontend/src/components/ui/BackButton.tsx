import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  /** Explicit navigation target. Defaults to navigate(-1). */
  to?: string;
  /** Button label. Defaults to "Back". */
  label?: string;
}

/**
 * On desktop (md+): inline text button with arrow, sits above page content.
 * On mobile: fixed pill button in the bottom-left corner — always visible during scroll.
 */
export default function BackButton({ to, label = "Back" }: BackButtonProps) {
  const navigate = useNavigate();
  const handleClick = () => (to ? navigate(to) : navigate(-1));

  return (
    <>
      {/* Desktop — inline */}
      <button
        onClick={handleClick}
        className="hidden md:flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
      >
        <ArrowLeft size={16} />
        {label}
      </button>

      {/* Mobile — fixed bottom-left pill */}
      <button
        onClick={handleClick}
        className="md:hidden fixed bottom-6 left-6 z-30 flex items-center gap-2 bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
        aria-label={label}
      >
        <ArrowLeft size={15} />
        {label}
      </button>
    </>
  );
}
