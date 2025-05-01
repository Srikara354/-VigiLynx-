import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const baseClasses =
      'block w-full rounded-xl shadow-sm border border-gray-200 bg-white text-gray-900 text-base px-5 py-3 focus:ring-2 focus:ring-gray-300 focus:border-gray-900 transition-all duration-200';
    const inputClasses = {
      default: '',
      error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-base font-medium text-gray-900 mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseClasses} ${
            error ? inputClasses.error : inputClasses.default
          } ${className}`}
          {...props}
        />
        {(error || helperText) && (
          <p
            className={`mt-2 text-sm ${
              error ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);