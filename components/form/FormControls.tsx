
import React from 'react';

// Generic Form Input
export const FormInput: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; required?: boolean; error?: string }> = ({ label, name, value, onChange, placeholder, required = false, error }) => {
  const baseClasses = "block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm";
  const errorClasses = 'border-red-500 focus:ring-red-500 focus:border-red-500';
  const defaultClasses = 'border-gray-300 focus:ring-[#ffcc00] focus:border-[#ffcc00]';

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`${baseClasses} ${error ? errorClasses : defaultClasses}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && <p id={`${name}-error`} className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

// Generic Form Textarea
export const FormTextarea: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number; required?: boolean; helpText?: React.ReactNode }> = ({ label, name, value, onChange, placeholder, rows = 4, required = false, helpText }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
     {helpText && <p className="text-xs text-gray-500 mt-1 mb-2">{helpText}</p>}
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#ffcc00] focus:border-[#ffcc00] sm:text-sm"
    />
  </div>
);

// Generic Form Select
export const FormSelect: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode; required?: boolean }> = ({ label, name, value, onChange, children, required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#ffcc00] focus:border-[#ffcc00] sm:text-sm"
        >
            {children}
        </select>
    </div>
);

// Generic Form Color Picker
export const FormColorPicker: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, name, value, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        id={`${name}-picker`}
        name={name}
        value={value}
        onChange={onChange}
        className="p-1 h-10 w-10 block bg-white border border-gray-300 rounded-md cursor-pointer"
        aria-label={`${label} color picker`}
      />
      <input
        type="text"
        id={name}
        value={value.toUpperCase()}
        onChange={onChange}
        name={name}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#ffcc00] focus:border-[#ffcc00] sm:text-sm"
        aria-label={`${label} hex code`}
      />
    </div>
  </div>
);
