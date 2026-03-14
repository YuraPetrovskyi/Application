import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text displayed above the input */
  label?: string;
  /** Validation error message displayed below the input */
  error?: string;
}

/**
 * Base input component with optional label and inline error message.
 * Password inputs automatically get a visibility toggle button.
 * Forwards its ref for seamless use with `react-hook-form`.
 *
 * @example
 * <Input
 *   {...register("email", { required: "Required" })}
 *   label="Email"
 *   type="email"
 *   autoComplete="email"
 *   error={errors.email?.message}
 * />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, type, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            className={[
              "w-full border rounded-lg px-4 py-2.5 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
              isPassword ? "pr-10" : "",
              error ? "border-red-400" : "border-gray-300",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
