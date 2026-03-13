import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text displayed above the input */
  label?: string;
  /** Validation error message displayed below the input */
  error?: string;
}

/**
 * Base input component with optional label and inline error message.
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
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
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
        <input
          id={inputId}
          ref={ref}
          className={[
            "w-full border rounded-lg px-4 py-2.5 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
            error ? "border-red-400" : "border-gray-300",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
