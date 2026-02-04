"use client";

import { useMemo, useState } from "react";
import { Field } from "@/components/Field";
import { ListEditor } from "@/components/ListEditor";
import { SectionCard } from "@/components/SectionCard";
import { PrdProvider, usePrd } from "@/components/PrdProvider";
import { sectionConfigs } from "@/lib/sections";
import type { ListFieldKey, Format, PhrasingMode, SectionKey } from "@/lib/types";
import { renderForFormat, renderPlainText, getMimeType } from "@/lib/renderers";

const FormatLabel: Record<Format, string> = {
  markdown: "Markdown",
  notion: "Notion-friendly",
  gdocs: "Google Docs-friendly",
  text: "Plain text"
};

const PhrasingLabel: Record<PhrasingMode, string> = {
  verbatim: "Verbatim",
  assisted: "Assisted phrasing"
};

const AppContent = () => {
  const { state, dispatch } = usePrd();
  const { data, format, phrasing, enabledSections } = state;
  const [templateOpen, setTemplateOpen] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [accordionMode, setAccordionMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>(() =>
    sectionConfigs.reduce(
      (acc, section) => ({ ...acc, [section.key]: true }),
      {} as Record<SectionKey, boolean>
    )
  );

  const output = useMemo(() => renderForFormat(state, format), [state, format]);
  const plainText = useMemo(() => renderPlainText(state), [state]);

  const updateList = (field: ListFieldKey) => (values: string[]) =>
    dispatch({ type: "setList", field, value: values });

  const setAllExpanded = (open: boolean) => {
    setExpandedSections(
      sectionConfigs.reduce(
        (acc, section) => ({ ...acc, [section.key]: open }),
        {} as Record<SectionKey, boolean>
      )
    );
  };

  const toggleSectionOpen = (key: SectionKey) => {
    setExpandedSections((current) => {
      const nextOpen = !current[key];
      if (accordionMode && nextOpen) {
        return sectionConfigs.reduce(
          (acc, section) => ({ ...acc, [section.key]: section.key === key }),
          {} as Record<SectionKey, boolean>
        );
      }
      return { ...current, [key]: nextOpen };
    });
  };

  const toggleAccordionMode = () => {
    setAccordionMode((prev) => {
      const next = !prev;
      if (!prev && next) {
        setExpandedSections((current) => {
          const firstOpen =
            sectionConfigs.find((section) => current[section.key])?.key ??
            sectionConfigs[0].key;
          return sectionConfigs.reduce(
            (acc, section) => ({ ...acc, [section.key]: section.key === firstOpen }),
            {} as Record<SectionKey, boolean>
          );
        });
      }
      return next;
    });
  };

  const handleCopy = async () => {
    try {
      if (format === "gdocs" && navigator.clipboard && "write" in navigator.clipboard) {
        const htmlBlob = new Blob([output], { type: "text/html" });
        const textBlob = new Blob([plainText], { type: "text/plain" });
        const item = new ClipboardItem({
          "text/html": htmlBlob,
          "text/plain": textBlob
        });
        await navigator.clipboard.write([item]);
        return;
      }
      await navigator.clipboard.writeText(output);
    } catch {
      await navigator.clipboard.writeText(output);
    }
  };

  const handleDownload = () => {
    const mime = getMimeType(format);
    const extension = format === "gdocs" ? "html" : format === "text" ? "txt" : "md";
    const safeName = data.projectName.trim() ? data.projectName.trim().replace(/\s+/g, "-") : "PRD";
    const filename = `PRD-${safeName}-${new Date().toISOString().slice(0, 10)}.${extension}`;
    const blob = new Blob([output], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-10 text-white">
          <div className="inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            Vibe Coding App PRD Generator for Solo Buildrs
          </div>
          <h1 className="text-3xl font-semibold md:text-4xl">
            Vibe Coding App PRD Generator for Solo Buildrs
          </h1>
          <p className="max-w-2xl text-sm text-white/80">
            Fill the left panel, preview the PRD on the right, and export in the format your AI agent prefers.
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-2 lg:items-start">
        <section className="space-y-6 lg:sticky lg:top-6 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-3">
          <SectionCard
            title="Template Controls"
            subtitle="Toggle sections, phrasing, and layout density."
            collapsible
            isOpen={templateOpen}
            onToggle={() => setTemplateOpen((prev) => !prev)}
            compact={compactMode}
          >
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setAllExpanded(true)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:border-fuchsia-300 hover:text-fuchsia-600"
              >
                Expand all
              </button>
              <button
                type="button"
                onClick={() => setAllExpanded(false)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:border-fuchsia-300 hover:text-fuchsia-600"
              >
                Collapse all
              </button>
              <button
                type="button"
                onClick={toggleAccordionMode}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  accordionMode
                    ? "bg-fuchsia-500 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-fuchsia-300 hover:text-fuchsia-600"
                }`}
              >
                Accordion mode
              </button>
              <button
                type="button"
                onClick={() => setCompactMode((prev) => !prev)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  compactMode
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-fuchsia-300 hover:text-fuchsia-600"
                }`}
              >
                Compact view
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {sectionConfigs.map((section) => (
                <label
                  key={section.key}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={enabledSections[section.key]}
                    onChange={() => dispatch({ type: "toggleSection", key: section.key })}
                    className="h-4 w-4 rounded border-slate-300 text-fuchsia-500 focus:ring-fuchsia-400"
                  />
                  {section.label}
                </label>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {(["verbatim", "assisted"] as PhrasingMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => dispatch({ type: "setPhrasing", phrasing: mode })}
                  className={`rounded-full px-4 py-1 text-sm font-semibold transition ${
                    phrasing === mode
                      ? "bg-fuchsia-500 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-fuchsia-300 hover:text-fuchsia-600"
                  }`}
                >
                  {PhrasingLabel[mode]}
                </button>
              ))}
            </div>
          </SectionCard>

          {enabledSections.role ? (
            <SectionCard
              title="Role"
              collapsible
              isOpen={expandedSections.role}
              onToggle={() => toggleSectionOpen("role")}
              compact={compactMode}
            >
              <Field
                label="Project name"
                value={data.projectName}
                onChange={(value) => dispatch({ type: "setField", field: "projectName", value })}
                placeholder="Project Mercury"
                compact={compactMode}
              />
              <Field
                label="Role / Title"
                value={data.roleTitle}
                onChange={(value) => dispatch({ type: "setField", field: "roleTitle", value })}
                placeholder="Frontend Architect"
                compact={compactMode}
              />
              <Field
                label="Years of experience"
                value={data.yearsExperience}
                onChange={(value) => dispatch({ type: "setField", field: "yearsExperience", value })}
                placeholder="8"
                compact={compactMode}
              />
              <Field
                label="Company context"
                value={data.companyContext}
                onChange={(value) => dispatch({ type: "setField", field: "companyContext", value })}
                placeholder="high-growth consumer startups"
                compact={compactMode}
              />
              <Field
                label="Framework / Stack"
                value={data.frameworkStack}
                onChange={(value) => dispatch({ type: "setField", field: "frameworkStack", value })}
                placeholder="Next.js + Tailwind"
                compact={compactMode}
              />
              <Field
                label="Discipline"
                value={data.discipline}
                onChange={(value) => dispatch({ type: "setField", field: "discipline", value })}
                placeholder="frontend"
                compact={compactMode}
              />
            </SectionCard>
          ) : null}

          {enabledSections.mvpGoal ? (
            <SectionCard
              title="MVP Goal"
              collapsible
              isOpen={expandedSections.mvpGoal}
              onToggle={() => toggleSectionOpen("mvpGoal")}
              compact={compactMode}
            >
              <Field
                label="Primary user outcome"
                value={data.primaryUserOutcome}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "primaryUserOutcome", value })
                }
                placeholder="ship polished MVPs in under a week"
                compact={compactMode}
              />
              <Field
                label="Core mechanism / approach"
                value={data.coreMechanism}
                onChange={(value) => dispatch({ type: "setField", field: "coreMechanism", value })}
                placeholder="a guided PRD generator that keeps scope tight"
                compact={compactMode}
              />
              <ListEditor
                label="Key features"
                values={data.keyFeatures}
                onChange={updateList("keyFeatures")}
                placeholders={[
                  "Reduces friction with a smart template",
                  "Keeps scope explicit and focused"
                ]}
                compact={compactMode}
              />
              <Field
                label="Explicit non-goal"
                value={data.explicitNonGoal}
                onChange={(value) => dispatch({ type: "setField", field: "explicitNonGoal", value })}
                placeholder="fully automated PRD writing"
                compact={compactMode}
              />
              <Field
                label="Core value delivered"
                value={data.coreValue}
                onChange={(value) => dispatch({ type: "setField", field: "coreValue", value })}
                placeholder="clarity and momentum for solo builders"
                compact={compactMode}
              />
            </SectionCard>
          ) : null}

          {enabledSections.targetUser ? (
            <SectionCard
              title="Target User"
              collapsible
              isOpen={expandedSections.targetUser}
              onToggle={() => toggleSectionOpen("targetUser")}
              compact={compactMode}
            >
              <Field
                label="Key behaviour / habit"
                value={data.keyBehavior}
                onChange={(value) => dispatch({ type: "setField", field: "keyBehavior", value })}
                placeholder="vibe coding and shipping fast"
                compact={compactMode}
              />
              <Field
                label="Primary pain point"
                value={data.painPoint}
                onChange={(value) => dispatch({ type: "setField", field: "painPoint", value })}
                placeholder="lack a clear plan before building"
                compact={compactMode}
              />
              <Field
                label="When / where this occurs"
                value={data.problemContext}
                onChange={(value) => dispatch({ type: "setField", field: "problemContext", value })}
                placeholder="early MVP definition for new ideas"
                compact={compactMode}
              />
            </SectionCard>
          ) : null}

          {enabledSections.coreFlow ? (
            <SectionCard
              title="Core Flow (Happy Path)"
              collapsible
              isOpen={expandedSections.coreFlow}
              onToggle={() => toggleSectionOpen("coreFlow")}
              compact={compactMode}
            >
              <Field
                label="Action 1"
                value={data.flowAction1}
                onChange={(value) => dispatch({ type: "setField", field: "flowAction1", value })}
                placeholder="enters the product idea"
                compact={compactMode}
              />
              <Field
                label="System response"
                value={data.flowSystemResponse}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "flowSystemResponse", value })
                }
                placeholder="shows the PRD template with guidance"
                compact={compactMode}
              />
              <Field
                label="Action 2 / Decision"
                value={data.flowAction2}
                onChange={(value) => dispatch({ type: "setField", field: "flowAction2", value })}
                placeholder="fills in the key fields"
                compact={compactMode}
              />
              <Field
                label="System result"
                value={data.flowSystemResult}
                onChange={(value) => dispatch({ type: "setField", field: "flowSystemResult", value })}
                placeholder="generates a live PRD preview"
                compact={compactMode}
              />
              <Field
                label="Final confirmation"
                value={data.flowFinalConfirmation}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "flowFinalConfirmation", value })
                }
                placeholder="copies or downloads the PRD"
                compact={compactMode}
              />
              <Field
                label="Time expectation"
                value={data.flowTimeExpectation}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "flowTimeExpectation", value })
                }
                placeholder="a few minutes"
                compact={compactMode}
              />
            </SectionCard>
          ) : null}

          {enabledSections.scope ? (
            <SectionCard
              title="MVP Scope (In)"
              collapsible
              isOpen={expandedSections.scope}
              onToggle={() => toggleSectionOpen("scope")}
              compact={compactMode}
            >
              <Field
                label="Primary entry point"
                value={data.scopeEntryPoint}
                onChange={(value) => dispatch({ type: "setField", field: "scopeEntryPoint", value })}
                placeholder="Landing page with PRD form"
                compact={compactMode}
              />
              <Field
                label="Core interaction rule"
                value={data.scopeInteractionRule}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "scopeInteractionRule", value })
                }
                placeholder="one structured field per prompt"
                compact={compactMode}
              />
              <Field
                label="Predefined structure / constraints"
                value={data.scopeStructure}
                onChange={(value) => dispatch({ type: "setField", field: "scopeStructure", value })}
                placeholder="fixed PRD sections with toggles"
                compact={compactMode}
              />
              <Field
                label="User-created elements"
                value={data.scopeUserElements}
                onChange={(value) => dispatch({ type: "setField", field: "scopeUserElements", value })}
                placeholder="custom text entries"
                compact={compactMode}
              />
              <Field
                label="Primary viewing / output format"
                value={data.scopeOutputFormat}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "scopeOutputFormat", value })
                }
                placeholder="live markdown preview"
                compact={compactMode}
              />
              <Field
                label="Storage or persistence"
                value={data.scopeStorage}
                onChange={(value) => dispatch({ type: "setField", field: "scopeStorage", value })}
                placeholder="local storage"
                compact={compactMode}
              />
              <Field
                label="Platforms supported"
                value={data.scopePlatforms}
                onChange={(value) => dispatch({ type: "setField", field: "scopePlatforms", value })}
                placeholder="Web"
                compact={compactMode}
              />
            </SectionCard>
          ) : null}

          {enabledSections.implementation ? (
            <SectionCard
              title="Implementation Details"
              collapsible
              isOpen={expandedSections.implementation}
              onToggle={() => toggleSectionOpen("implementation")}
              compact={compactMode}
            >
              <Field
                label="Core flow name"
                value={data.coreFlowName}
                onChange={(value) => dispatch({ type: "setField", field: "coreFlowName", value })}
                placeholder="Primary Action Flow"
                compact={compactMode}
              />
              <Field
                label="Entry point (system / UI entry)"
                value={data.coreFlowEntryPoint}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "coreFlowEntryPoint", value })
                }
                placeholder="homepage CTA"
                compact={compactMode}
              />
              <Field
                label="Interface pattern"
                value={data.coreFlowInterface}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "coreFlowInterface", value })
                }
                placeholder="two-column layout"
                compact={compactMode}
              />
              <Field
                label="Interface options"
                value={data.coreFlowInterfaceOptions}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "coreFlowInterfaceOptions", value })
                }
                placeholder="section toggles + format selector"
                compact={compactMode}
              />
              <ListEditor
                label="Options"
                values={data.coreFlowOptions}
                onChange={updateList("coreFlowOptions")}
                placeholders={["Option 1", "Option 2", "Option 3"]}
                compact={compactMode}
              />
              <Field
                label="Confirmation decision"
                value={data.coreFlowConfirmation}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "coreFlowConfirmation", value })
                }
                placeholder="confirm export format"
                compact={compactMode}
              />
              <Field
                label="Secondary flow name"
                value={data.secondaryFlowName}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "secondaryFlowName", value })
                }
                placeholder="Management View"
                compact={compactMode}
              />
              <Field
                label="Navigation model"
                value={data.secondaryNavigation}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "secondaryNavigation", value })
                }
                placeholder="tabs or filters"
                compact={compactMode}
              />
              <Field
                label="Layout structure"
                value={data.secondaryLayout}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "secondaryLayout", value })
                }
                placeholder="list of saved PRDs"
                compact={compactMode}
              />
              <Field
                label="Organisation logic"
                value={data.secondaryOrganisation}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "secondaryOrganisation", value })
                }
                placeholder="recency or project type"
                compact={compactMode}
              />
              <div className="grid gap-4 md:grid-cols-3">
                <Field
                  label="Framework"
                  value={data.techFramework}
                  onChange={(value) =>
                    dispatch({ type: "setField", field: "techFramework", value })
                  }
                  placeholder="Next.js"
                  compact={compactMode}
                />
                <Field
                  label="Styling"
                  value={data.techStyling}
                  onChange={(value) =>
                    dispatch({ type: "setField", field: "techStyling", value })
                  }
                  placeholder="Tailwind CSS"
                  compact={compactMode}
                />
                <Field
                  label="Storage"
                  value={data.techStorage}
                  onChange={(value) =>
                    dispatch({ type: "setField", field: "techStorage", value })
                  }
                  placeholder="localStorage"
                  compact={compactMode}
                />
              </div>
            </SectionCard>
          ) : null}

          {enabledSections.outOfScope ? (
            <SectionCard
              title="Explicitly Out of Scope"
              collapsible
              isOpen={expandedSections.outOfScope}
              onToggle={() => toggleSectionOpen("outOfScope")}
              compact={compactMode}
            >
              <ListEditor
                label="Out of scope items"
                values={data.outOfScope}
                onChange={updateList("outOfScope")}
                placeholders={[
                  "Automation beyond template guidance",
                  "Team collaboration workflows",
                  "AI-generated product strategy",
                  "Backend integrations"
                ]}
                compact={compactMode}
              />
            </SectionCard>
          ) : null}

          {enabledSections.context ? (
            <SectionCard
              title="Context"
              collapsible
              isOpen={expandedSections.context}
              onToggle={() => toggleSectionOpen("context")}
              compact={compactMode}
            >
              <Field
                label="Core skill area"
                value={data.coreSkillArea}
                onChange={(value) => dispatch({ type: "setField", field: "coreSkillArea", value })}
                placeholder="frontend craft"
                compact={compactMode}
              />
              <Field
                label="Framework / tooling to highlight"
                value={data.synergyTooling}
                onChange={(value) => dispatch({ type: "setField", field: "synergyTooling", value })}
                placeholder="Next.js + Tailwind"
                compact={compactMode}
              />
              <Field
                label="Optional microinteraction note"
                value={data.microInteractionOptional}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "microInteractionOptional", value })
                }
                placeholder="haptics / sound / animation"
                compact={compactMode}
              />
            </SectionCard>
          ) : null}

          {enabledSections.instruction ? (
            <SectionCard
              title="Instruction"
              collapsible
              isOpen={expandedSections.instruction}
              onToggle={() => toggleSectionOpen("instruction")}
              compact={compactMode}
            >
              <Field
                label="Implementation type"
                value={data.implementationType}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "implementationType", value })
                }
                placeholder="frontend"
                compact={compactMode}
              />
              <Field
                label="Discipline (optional override)"
                value={data.instructionDiscipline}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "instructionDiscipline", value })
                }
                placeholder="interaction design"
                helper="Leave blank to reuse the Role discipline."
                compact={compactMode}
              />
            </SectionCard>
          ) : null}

          {enabledSections.vision ? (
            <SectionCard
              title="1. Vision & Core Concepts"
              collapsible
              isOpen={expandedSections.vision}
              onToggle={() => toggleSectionOpen("vision")}
              compact={compactMode}
            >
              <ListEditor
                label="Capabilities to showcase"
                values={data.capabilityShowcase}
                onChange={updateList("capabilityShowcase")}
                placeholders={["Capability 1", "Capability 2", "Capability 3", "Capability 4"]}
                compact={compactMode}
              />
              <Field
                label="Design direction"
                value={data.designDirection}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "designDirection", value })
                }
                placeholder="minimal, calm, expressive"
                compact={compactMode}
              />
            </SectionCard>
          ) : null}

          {enabledSections.designPrinciples ? (
            <SectionCard
              title="2. Design Principles"
              collapsible
              isOpen={expandedSections.designPrinciples}
              onToggle={() => toggleSectionOpen("designPrinciples")}
              compact={compactMode}
            >
              <Field
                label="Hierarchy"
                value={data.hierarchy}
                onChange={(value) => dispatch({ type: "setField", field: "hierarchy", value })}
                placeholder="Describe the typographic and layout hierarchy."
                multiline
                compact={compactMode}
              />
              <Field
                label="Contrast"
                value={data.contrast}
                onChange={(value) => dispatch({ type: "setField", field: "contrast", value })}
                placeholder="Describe contrast usage without noise."
                multiline
                compact={compactMode}
              />
              <Field
                label="Balance"
                value={data.balance}
                onChange={(value) => dispatch({ type: "setField", field: "balance", value })}
                placeholder="Describe balance and weight distribution."
                multiline
                compact={compactMode}
              />
              <Field
                label="Movement"
                value={data.movement}
                onChange={(value) => dispatch({ type: "setField", field: "movement", value })}
                placeholder="Describe motion and attention guidance."
                multiline
                compact={compactMode}
              />
              <Field
                label="Component-based architecture"
                value={data.componentArchitecture}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "componentArchitecture", value })
                }
                placeholder="Describe reusable component structure."
                multiline
                compact={compactMode}
              />
            </SectionCard>
          ) : null}

          {enabledSections.uxDetails ? (
            <SectionCard
              title="3. UX & Interaction Details"
              collapsible
              isOpen={expandedSections.uxDetails}
              onToggle={() => toggleSectionOpen("uxDetails")}
              compact={compactMode}
            >
              <ListEditor
                label="Interactive features"
                values={data.interactiveFeatures}
                onChange={updateList("interactiveFeatures")}
                placeholders={[
                  "Live PRD preview updates",
                  "Section toggles",
                  "Format switcher"
                ]}
                compact={compactMode}
              />
              <Field
                label="Press / Touch states"
                value={data.pressStates}
                onChange={(value) => dispatch({ type: "setField", field: "pressStates", value })}
                placeholder="Describe tactile feedback and button states."
                multiline
                compact={compactMode}
              />
              <Field
                label="Transition animations"
                value={data.transitionAnimations}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "transitionAnimations", value })
                }
                placeholder="Describe transitions for focus shifts."
                multiline
                compact={compactMode}
              />
              <ListEditor
                label="Microinteractions"
                values={data.microInteractions}
                onChange={updateList("microInteractions")}
                placeholders={[
                  "Click feedback",
                  "Loading indicators",
                  "Form validation feedback",
                  "Scroll-based motion"
                ]}
                compact={compactMode}
              />
            </SectionCard>
          ) : null}

          {enabledSections.codeQuality ? (
            <SectionCard
              title="4. Code Quality & Performance"
              collapsible
              isOpen={expandedSections.codeQuality}
              onToggle={() => toggleSectionOpen("codeQuality")}
              compact={compactMode}
            >
              <Field
                label="Best practices"
                value={data.bestPractices}
                onChange={(value) => dispatch({ type: "setField", field: "bestPractices", value })}
                placeholder="State management, navigation, integrations."
                multiline
                compact={compactMode}
              />
              <Field
                label="Modern framework usage"
                value={data.modernFrameworkUsage}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "modernFrameworkUsage", value })
                }
                placeholder="Describe modern patterns and tooling."
                multiline
                compact={compactMode}
              />
              <Field
                label="Reusable components"
                value={data.reusableComponents}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "reusableComponents", value })
                }
                placeholder="Describe component strategy."
                multiline
                compact={compactMode}
              />
              <Field
                label="Performance optimisation"
                value={data.performanceOptimization}
                onChange={(value) =>
                  dispatch({ type: "setField", field: "performanceOptimization", value })
                }
                placeholder="Describe optimisations."
                multiline
                compact={compactMode}
              />
              <Field
                label="Accessibility"
                value={data.accessibility}
                onChange={(value) => dispatch({ type: "setField", field: "accessibility", value })}
                placeholder="Describe accessibility considerations."
                multiline
                compact={compactMode}
              />
            </SectionCard>
          ) : null}
        </section>

        <section className="space-y-6 lg:sticky lg:top-6 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pl-3">
          <SectionCard
            title="Live PRD Preview"
            subtitle="Choose a format and export when ready."
            compact={compactMode}
          >
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm font-medium text-slate-700">Format</label>
              <select
                value={format}
                onChange={(event) =>
                  dispatch({ type: "setFormat", format: event.target.value as Format })
                }
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
              >
                {(Object.keys(FormatLabel) as Format[]).map((key) => (
                  <option key={key} value={key}>
                    {FormatLabel[key]}
                  </option>
                ))}
              </select>
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                >
                  Copy
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-fuchsia-300 hover:text-fuchsia-600"
                >
                  Download
                </button>
              </div>
            </div>
            <div className="max-h-[calc(100vh-18rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-900/95 p-4 text-slate-100">
              {format === "gdocs" ? (
                <div
                  className="prose prose-invert max-w-none text-sm"
                  dangerouslySetInnerHTML={{ __html: output }}
                />
              ) : (
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-slate-100">
                  {output}
                </pre>
              )}
            </div>
          </SectionCard>
        </section>
      </main>
    </div>
  );
};

export default function Page() {
  return (
    <PrdProvider>
      <AppContent />
    </PrdProvider>
  );
}
