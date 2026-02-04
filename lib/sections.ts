import type { SectionKey } from "./types";

export type SectionConfig = {
  key: SectionKey;
  label: string;
  enabledByDefault: boolean;
};

export const sectionConfigs: SectionConfig[] = [
  { key: "role", label: "Role", enabledByDefault: true },
  { key: "mvpGoal", label: "MVP Goal", enabledByDefault: true },
  { key: "targetUser", label: "Target User", enabledByDefault: true },
  { key: "coreFlow", label: "Core Flow", enabledByDefault: true },
  { key: "scope", label: "MVP Scope (In)", enabledByDefault: true },
  { key: "implementation", label: "Implementation Details", enabledByDefault: true },
  { key: "outOfScope", label: "Explicitly Out of Scope", enabledByDefault: true },
  { key: "context", label: "Context", enabledByDefault: true },
  { key: "instruction", label: "Instruction", enabledByDefault: true },
  { key: "vision", label: "Vision & Core Concepts", enabledByDefault: true },
  { key: "designPrinciples", label: "Design Principles", enabledByDefault: true },
  { key: "uxDetails", label: "UX & Interaction Details", enabledByDefault: true },
  { key: "codeQuality", label: "Code Quality & Performance", enabledByDefault: true },
  { key: "constraints", label: "Constraints", enabledByDefault: true }
];
