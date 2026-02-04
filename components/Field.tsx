"use client";

import type { ChangeEvent } from "react";

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helper?: string;
  multiline?: boolean;
  rows?: number;
  compact?: boolean;
};

export const Field = ({
  label,
  value,
  onChange,
  placeholder,
  helper,
  multiline,
  rows = 3,
  compact
}: FieldProps) => {
  const baseClasses =
    "w-full rounded-xl border border-slate-200 bg-white/80 text-slate-900 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-fuchsia-400";
  const sizeClasses = compact ? "px-3 py-1.5 text-xs" : "px-3 py-2 text-sm";
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-800">{label}</label>
      {multiline ? (
        <textarea
          rows={rows}
          className={`${baseClasses} ${sizeClasses} resize-none`}
          value={value}
          placeholder={placeholder}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
        />
      ) : (
        <input
          className={`${baseClasses} ${sizeClasses}`}
          value={value}
          placeholder={placeholder}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        />
      )}
      {helper ? <p className="text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
};
