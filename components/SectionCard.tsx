"use client";

import type { ReactNode } from "react";

export const SectionCard = ({
  title,
  subtitle,
  children,
  collapsible,
  isOpen = true,
  onToggle,
  compact,
  actions,
  id
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  collapsible?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  compact?: boolean;
  actions?: ReactNode;
  id?: string;
}) => {
  const padding = compact ? "p-4" : "p-5";
  const contentSpacing = compact ? "space-y-3" : "space-y-4";
  return (
    <section
      id={id}
      className={`rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur ${padding}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {collapsible ? (
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={isOpen}
              className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600 hover:border-fuchsia-300 hover:text-fuchsia-600"
            >
              <span className="sr-only">Toggle section</span>
              <svg
                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.584l3.71-4.354a.75.75 0 1 1 1.14.976l-4.25 5a.75.75 0 0 1-1.14 0l-4.25-5a.75.75 0 0 1 .02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          ) : null}
        </div>
      </div>
      {isOpen ? <div className={`mt-4 ${contentSpacing}`}>{children}</div> : null}
    </section>
  );
};
