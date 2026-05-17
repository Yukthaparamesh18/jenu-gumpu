import React from 'react';

const Input = ({ label, id, type = 'text', error, ...props }) => {
  return (
    <div className="flex flex-col w-full mb-4">
      {label && (
        <label htmlFor={id} className="mb-1 text-sm font-medium text-secondary dark:text-amber-100">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`w-full px-4 py-3 bg-white/50 dark:bg-black/20 border ${
          error ? 'border-red-500' : 'border-amber-200 dark:border-amber-900/50'
        } rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-secondary dark:text-white transition-all backdrop-blur-sm`}
        {...props}
      />
      {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default Input;
