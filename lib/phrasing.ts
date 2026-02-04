import type { PhrasingMode, PrdData, StringFieldKey } from "./types";

const sentenceFields = new Set<StringFieldKey>([
  "hierarchy",
  "contrast",
  "balance",
  "movement",
  "componentArchitecture",
  "pressStates",
  "transitionAnimations",
  "bestPractices",
  "modernFrameworkUsage",
  "reusableComponents",
  "performanceOptimization",
  "accessibility"
]);

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const ensurePeriod = (value: string) =>
  /[.!?]$/.test(value.trim()) ? value.trim() : `${value.trim()}.`;

export const formatString = (
  field: StringFieldKey,
  value: string,
  mode: PhrasingMode
) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "TBD";
  }
  if (mode === "verbatim") {
    return trimmed;
  }
  if (sentenceFields.has(field)) {
    return ensurePeriod(capitalize(trimmed));
  }
  return capitalize(trimmed);
};

export const formatListItem = (value: string, mode: PhrasingMode) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  return mode === "assisted" ? capitalize(trimmed) : trimmed;
};

export const resolveString = (
  data: PrdData,
  field: StringFieldKey,
  mode: PhrasingMode,
  fallback?: string
) => {
  const raw = data[field];
  if (!raw.trim() && fallback) {
    return formatString(field, fallback, mode);
  }
  return formatString(field, raw, mode);
};
