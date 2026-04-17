import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm text-text-secondary mb-2">{label}</label>}
      <input className={`input ${className}`} {...props} />
    </div>
  );
}
