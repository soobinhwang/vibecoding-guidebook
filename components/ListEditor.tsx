"use client";

import type { ChangeEvent } from "react";

type ListEditorProps = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  placeholders?: string[];
  helper?: string;
  buttonLabel?: string;
  compact?: boolean;
};

export const ListEditor = ({
  label,
  values,
  onChange,
  placeholder,
  placeholders,
  helper,
  buttonLabel = "Add item",
  compact
}: ListEditorProps) => {
  const updateItem = (index: number, value: string) => {
    const next = [...values];
    next[index] = value;
    onChange(next);
  };

  const removeItem = (index: number) => {
    const next = values.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-800">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className={`rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-xs font-semibold text-fuchsia-700 hover:bg-fuchsia-100 ${
            compact ? "px-2.5 py-0.5 text-[11px]" : ""
          }`}
        >
          {buttonLabel}
        </button>
      </div>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={`${label}-${index}`} className="flex items-center gap-2">
            <input
              className={`flex-1 rounded-xl border border-slate-200 bg-white/80 text-slate-900 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-fuchsia-400 ${
                compact ? "px-3 py-1.5 text-xs" : "px-3 py-2 text-sm"
              }`}
              value={value}
              placeholder={placeholders?.[index] ?? placeholder}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                updateItem(index, event.target.value)
              }
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className={`rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700 ${
                compact ? "px-2.5 py-0.5 text-[11px]" : ""
              }`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      {helper ? <p className="text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
};
