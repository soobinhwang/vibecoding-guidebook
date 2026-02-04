"use client";

import { useMemo, useState } from "react";
import { Field } from "@/components/Field";
import { ListEditor } from "@/components/ListEditor";
import { SectionCard } from "@/components/SectionCard";
import { PrdProvider, usePrd } from "@/components/PrdProvider";
import { sectionConfigs } from "@/lib/sections";
import type { ListFieldKey, Format, PhrasingMode } from "@/lib/types";
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

  const output = useMemo(() => renderForFormat(state, format), [state, format]);
  const plainText = useMemo(() => renderPlainText(state), [state]);

  const updateList = (field: ListFieldKey) => (values: string[]) =>
    dispatch({ type: "setList", field, value: values });


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
      <header className="bg-transparent">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-left text-slate-900">
          <h1 className="inline-flex items-center gap-2 text-3xl font-semibold md:text-4xl">
            <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
              PRD Genrator for Solo Vibe Builders
            </span>
            <span className="inline-flex h-3.5 w-3.5 items-center justify-center">
              <span className="block h-3 w-3 rotate-45 bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-rose-500" />
            </span>
          </h1>
          <div className="inline-grid gap-4 rounded-2xl border border-slate-200/70 bg-slate-100 px-4 py-3 text-xs text-slate-600 sm:grid-cols-2">
            <div>
              <div className="font-semibold text-slate-700">Who this is for</div>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                <li>Builders who care about scalable, consistent outcomes</li>
                <li>
                  Solo builders who want a solid structure from day one to keep the project
                  manageable
                </li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-slate-700">How to use</div>
              <ol className="mt-2 list-decimal space-y-1 pl-4">
                <li>Export as .md</li>
                <li>Add it to your build folder</li>
                <li>In your agent rules, add: Read this first</li>
                <li className="whitespace-nowrap">
                  Reading order depends on your IDE, so make this the first instruction
                </li>
              </ol>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-2 lg:items-start">
        <section className="space-y-6 lg:sticky lg:top-6 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-3">
          <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div>
              <h2 className="text-lg font-semibold text-slate-900">Your PRD Setup</h2>
              <p className="mt-3 text-sm text-slate-500 pb-6">
                Pick the sections you want and the writing style.
              </p>
              </div>
              <button
                type="button"
                onClick={() => setTemplateOpen((prev) => !prev)}
                aria-expanded={templateOpen}
                className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600 hover:border-fuchsia-300 hover:text-fuchsia-600"
              >
                <span className="sr-only">Toggle section</span>
                <svg
                  className={`h-4 w-4 transition-transform ${templateOpen ? "rotate-180" : ""}`}
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
            </div>
            {templateOpen ? (
              <div className="mt-6 space-y-4 pb-4">
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
                <div className="flex flex-wrap gap-2">
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
              </div>
            ) : null}

            {enabledSections.role ? (
              <div className="border-t border-slate-200/70 pt-6">
                <h3 className="text-base font-semibold text-slate-900">AI Agent Role</h3>
                <div className="mt-4 space-y-4">
                  <Field
                    label="Project name"
                    value={data.projectName}
                    onChange={(value) => dispatch({ type: "setField", field: "projectName", value })}
                    placeholder="i.e. Project Mercury"
                  />
                  <Field
                    label="Your title"
                    value={data.roleTitle}
                    onChange={(value) => dispatch({ type: "setField", field: "roleTitle", value })}
                    placeholder="i.e. Product Designer"
                  />
                  <Field
                    label="Years of experience"
                    value={data.yearsExperience}
                    onChange={(value) => dispatch({ type: "setField", field: "yearsExperience", value })}
                    placeholder="i.e. 5"
                  />
                  <Field
                    label="Where you’ve worked"
                    value={data.companyContext}
                    onChange={(value) => dispatch({ type: "setField", field: "companyContext", value })}
                    placeholder="i.e. early-stage startups"
                  />
                  <Field
                    label="Tools or platform"
                    value={data.frameworkStack}
                    onChange={(value) => dispatch({ type: "setField", field: "frameworkStack", value })}
                    placeholder="i.e. Web app"
                  />
                  <Field
                    label="Core skill area"
                    value={data.discipline}
                    onChange={(value) => dispatch({ type: "setField", field: "discipline", value })}
                    placeholder="i.e. product design"
                  />
                </div>
              </div>
            ) : null}

            {enabledSections.mvpGoal ? (
              <div className="border-t border-slate-200/70 pt-6">
                <h3 className="text-base font-semibold text-slate-900">MVP Goal</h3>
                <div className="mt-4 space-y-4">
                  <Field
                    label="What should users accomplish?"
                    value={data.primaryUserOutcome}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "primaryUserOutcome", value })
                    }
                    placeholder="i.e. ship a polished MVP in under a week"
                  />
                  <Field
                    label="How does it help them?"
                    value={data.coreMechanism}
                    onChange={(value) => dispatch({ type: "setField", field: "coreMechanism", value })}
                    placeholder="i.e. a guided PRD flow that keeps scope tight"
                  />
                  <ListEditor
                    label="Key benefits"
                    values={data.keyFeatures}
                    onChange={updateList("keyFeatures")}
                    placeholders={[
                      "i.e. reduces friction with a guided template",
                      "i.e. keeps scope explicit and focused"
                    ]}
                    placeholder="i.e. fast, clear, and focused"
                  />
                  <Field
                    label="What this is NOT"
                    value={data.explicitNonGoal}
                    onChange={(value) => dispatch({ type: "setField", field: "explicitNonGoal", value })}
                    placeholder="i.e. fully automated PRD writing"
                  />
                  <Field
                    label="Core value it provides"
                    value={data.coreValue}
                    onChange={(value) => dispatch({ type: "setField", field: "coreValue", value })}
                    placeholder="i.e. clarity and momentum for solo builders"
                  />
                </div>
              </div>
            ) : null}

            {enabledSections.targetUser ? (
              <div className="border-t border-slate-200/70 pt-6">
                <h3 className="text-base font-semibold text-slate-900">Target User</h3>
                <div className="mt-4 space-y-4">
                  <Field
                    label="What they do regularly"
                    value={data.keyBehavior}
                    onChange={(value) => dispatch({ type: "setField", field: "keyBehavior", value })}
                    placeholder="i.e. ship fast and iterate often"
                  />
                  <Field
                    label="Main pain point"
                    value={data.painPoint}
                    onChange={(value) => dispatch({ type: "setField", field: "painPoint", value })}
                    placeholder="i.e. unclear scope before building"
                  />
                  <Field
                    label="When this happens"
                    value={data.problemContext}
                    onChange={(value) => dispatch({ type: "setField", field: "problemContext", value })}
                    placeholder="i.e. early MVP definition for new ideas"
                  />
                </div>
              </div>
            ) : null}

            {enabledSections.coreFlow ? (
              <div className="border-t border-slate-200/70 pt-6">
                <h3 className="text-base font-semibold text-slate-900">Core Flow (Happy Path)</h3>
                <div className="mt-4 space-y-4">
                  <Field
                    label="Step 1 (user)"
                    value={data.flowAction1}
                    onChange={(value) => dispatch({ type: "setField", field: "flowAction1", value })}
                    placeholder="i.e. enters the product idea"
                  />
                  <Field
                    label="Step 2 (system)"
                    value={data.flowSystemResponse}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "flowSystemResponse", value })
                    }
                    placeholder="i.e. shows the PRD template with guidance"
                  />
                  <Field
                    label="Step 3 (user)"
                    value={data.flowAction2}
                    onChange={(value) => dispatch({ type: "setField", field: "flowAction2", value })}
                    placeholder="i.e. fills in the key fields"
                  />
                  <Field
                    label="Step 4 (system)"
                    value={data.flowSystemResult}
                    onChange={(value) => dispatch({ type: "setField", field: "flowSystemResult", value })}
                    placeholder="i.e. generates a live PRD preview"
                  />
                  <Field
                    label="Step 5 (user)"
                    value={data.flowFinalConfirmation}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "flowFinalConfirmation", value })
                    }
                    placeholder="i.e. copies or downloads the PRD"
                  />
                  <Field
                    label="Expected time to finish"
                    value={data.flowTimeExpectation}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "flowTimeExpectation", value })
                    }
                    placeholder="i.e. a few minutes"
                  />
                </div>
              </div>
            ) : null}

            {enabledSections.scope ? (
              <div className="border-t border-slate-200/70 pt-6">
                <h3 className="text-base font-semibold text-slate-900">What’s In Scope</h3>
                <div className="mt-4 space-y-4">
                  <Field
                    label="How users start"
                    value={data.scopeEntryPoint}
                    onChange={(value) => dispatch({ type: "setField", field: "scopeEntryPoint", value })}
                    placeholder="i.e. landing page with PRD form"
                  />
                  <Field
                    label="Core interaction rule"
                    value={data.scopeInteractionRule}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "scopeInteractionRule", value })
                    }
                    placeholder="i.e. one structured field per prompt"
                  />
                  <Field
                    label="Structure or constraints"
                    value={data.scopeStructure}
                    onChange={(value) => dispatch({ type: "setField", field: "scopeStructure", value })}
                    placeholder="i.e. fixed PRD sections with toggles"
                  />
                  <Field
                    label="What users can create"
                    value={data.scopeUserElements}
                    onChange={(value) => dispatch({ type: "setField", field: "scopeUserElements", value })}
                    placeholder="i.e. custom text entries"
                  />
                  <Field
                    label="Primary output format"
                    value={data.scopeOutputFormat}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "scopeOutputFormat", value })
                    }
                    placeholder="i.e. live Markdown preview"
                  />
                  <Field
                    label="Where it’s saved"
                    value={data.scopeStorage}
                    onChange={(value) => dispatch({ type: "setField", field: "scopeStorage", value })}
                    placeholder="i.e. browser local storage"
                  />
                  <Field
                    label="Supported platforms"
                    value={data.scopePlatforms}
                    onChange={(value) => dispatch({ type: "setField", field: "scopePlatforms", value })}
                    placeholder="i.e. web"
                  />
                </div>
              </div>
            ) : null}

            {enabledSections.implementation ? (
              <div className="border-t border-slate-200/70 pt-6">
                <h3 className="text-base font-semibold text-slate-900">How It Works</h3>
                <div className="mt-4 space-y-4">
                  <Field
                    label="Main flow name"
                    value={data.coreFlowName}
                    onChange={(value) => dispatch({ type: "setField", field: "coreFlowName", value })}
                    placeholder="i.e. Primary Action Flow"
                  />
                  <Field
                    label="Where this flow starts"
                    value={data.coreFlowEntryPoint}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "coreFlowEntryPoint", value })
                    }
                    placeholder="i.e. homepage CTA"
                  />
                  <Field
                    label="Main screen pattern"
                    value={data.coreFlowInterface}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "coreFlowInterface", value })
                    }
                    placeholder="i.e. two-column layout"
                  />
                  <Field
                    label="What appears on this screen"
                    value={data.coreFlowInterfaceOptions}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "coreFlowInterfaceOptions", value })
                    }
                    placeholder="i.e. section toggles + format selector"
                  />
                  <ListEditor
                    label="Choices users can make"
                    values={data.coreFlowOptions}
                    onChange={updateList("coreFlowOptions")}
                    placeholders={["i.e. option 1", "i.e. option 2", "i.e. option 3"]}
                    placeholder="i.e. a choice users can make"
                  />
                  <Field
                    label="Final confirmation step"
                    value={data.coreFlowConfirmation}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "coreFlowConfirmation", value })
                    }
                    placeholder="i.e. confirm export format"
                  />
                  <Field
                    label="Secondary flow name"
                    value={data.secondaryFlowName}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "secondaryFlowName", value })
                    }
                    placeholder="i.e. Saved PRDs"
                  />
                  <Field
                    label="Navigation style"
                    value={data.secondaryNavigation}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "secondaryNavigation", value })
                    }
                    placeholder="i.e. tabs or filters"
                  />
                  <Field
                    label="Layout structure"
                    value={data.secondaryLayout}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "secondaryLayout", value })
                    }
                    placeholder="i.e. list of saved PRDs"
                  />
                  <Field
                    label="How it’s organized"
                    value={data.secondaryOrganisation}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "secondaryOrganisation", value })
                    }
                    placeholder="i.e. recency or project type"
                  />
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field
                      label="Framework"
                      value={data.techFramework}
                      onChange={(value) =>
                        dispatch({ type: "setField", field: "techFramework", value })
                      }
                      placeholder="i.e. Next.js"
                    />
                    <Field
                      label="Styling"
                      value={data.techStyling}
                      onChange={(value) =>
                        dispatch({ type: "setField", field: "techStyling", value })
                      }
                      placeholder="i.e. Tailwind CSS"
                    />
                    <Field
                      label="Storage"
                      value={data.techStorage}
                      onChange={(value) =>
                        dispatch({ type: "setField", field: "techStorage", value })
                      }
                      placeholder="i.e. localStorage"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {enabledSections.outOfScope ? (
              <div className="border-t border-slate-200/70 pt-6">
                <h3 className="text-base font-semibold text-slate-900">What’s Out of Scope</h3>
                <div className="mt-4 space-y-4">
                  <ListEditor
                    label="Not included in MVP"
                    values={data.outOfScope}
                    onChange={updateList("outOfScope")}
                    placeholders={[
                      "i.e. automation beyond template guidance",
                      "i.e. team collaboration workflows",
                      "i.e. AI-generated product strategy",
                      "i.e. backend integrations"
                    ]}
                    placeholder="i.e. something we won’t build yet"
                  />
                </div>
              </div>
            ) : null}

            {enabledSections.context ? (
              <div className="border-t border-slate-200/70 pt-6">
                <h3 className="text-base font-semibold text-slate-900">Project Context</h3>
                <div className="mt-4 space-y-4">
                  <Field
                    label="What skill this shows"
                    value={data.coreSkillArea}
                    onChange={(value) => dispatch({ type: "setField", field: "coreSkillArea", value })}
                    placeholder="i.e. frontend craft"
                  />
                  <Field
                    label="Tooling to highlight"
                    value={data.synergyTooling}
                    onChange={(value) => dispatch({ type: "setField", field: "synergyTooling", value })}
                    placeholder="i.e. Next.js + Tailwind"
                  />
                  <Field
                    label="Optional microinteraction note"
                    value={data.microInteractionOptional}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "microInteractionOptional", value })
                    }
                    placeholder="i.e. haptics / sound / animation"
                  />
                </div>
              </div>
            ) : null}

            {enabledSections.instruction ? (
              <div className="border-t border-slate-200/70 pt-6">
                <h3 className="text-base font-semibold text-slate-900">Instruction to the Agent</h3>
                <div className="mt-4 space-y-4">
                  <Field
                    label="Type of guidance to generate"
                    value={data.implementationType}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "implementationType", value })
                    }
                    placeholder="i.e. frontend"
                  />
                  <Field
                    label="Focus area (optional)"
                    value={data.instructionDiscipline}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "instructionDiscipline", value })
                    }
                    placeholder="i.e. interaction design"
                    helper="Leave blank to reuse your role focus."
                  />
                </div>
              </div>
            ) : null}

            {enabledSections.vision ? (
              <div className="border-t border-slate-200/70 pt-6">
                <h3 className="text-base font-semibold text-slate-900">1. Vision & Core Concepts</h3>
                <div className="mt-4 space-y-4">
                  <ListEditor
                    label="What this should showcase"
                    values={data.capabilityShowcase}
                    onChange={updateList("capabilityShowcase")}
                    placeholders={[
                      "i.e. design clarity",
                      "i.e. interaction polish",
                      "i.e. system thinking",
                      "i.e. visual hierarchy"
                    ]}
                    placeholder="i.e. a capability to showcase"
                  />
                  <Field
                    label="Design direction"
                    value={data.designDirection}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "designDirection", value })
                    }
                    placeholder="i.e. minimal, calm, expressive"
                  />
                </div>
              </div>
            ) : null}

            {enabledSections.designPrinciples ? (
              <div className="border-t border-slate-200/70 pt-6">
                <h3 className="text-base font-semibold text-slate-900">2. Design Principles</h3>
                <div className="mt-4 space-y-4">
                  <Field
                    label="Hierarchy"
                    value={data.hierarchy}
                    onChange={(value) => dispatch({ type: "setField", field: "hierarchy", value })}
                    placeholder="i.e. describe the typographic and layout hierarchy"
                    multiline
                  />
                  <Field
                    label="Contrast"
                    value={data.contrast}
                    onChange={(value) => dispatch({ type: "setField", field: "contrast", value })}
                    placeholder="i.e. describe contrast without visual noise"
                    multiline
                  />
                  <Field
                    label="Balance"
                    value={data.balance}
                    onChange={(value) => dispatch({ type: "setField", field: "balance", value })}
                    placeholder="i.e. describe balance and weight distribution"
                    multiline
                  />
                  <Field
                    label="Movement"
                    value={data.movement}
                    onChange={(value) => dispatch({ type: "setField", field: "movement", value })}
                    placeholder="i.e. describe motion and attention guidance"
                    multiline
                  />
                  <Field
                    label="Component structure"
                    value={data.componentArchitecture}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "componentArchitecture", value })
                    }
                    placeholder="i.e. describe reusable component structure"
                    multiline
                  />
                </div>
              </div>
            ) : null}

            {enabledSections.uxDetails ? (
              <div className="border-t border-slate-200/70 pt-6">
                <h3 className="text-base font-semibold text-slate-900">3. UX & Interaction Details</h3>
                <div className="mt-4 space-y-4">
                  <ListEditor
                    label="Key interactions"
                    values={data.interactiveFeatures}
                    onChange={updateList("interactiveFeatures")}
                    placeholders={[
                      "i.e. live PRD preview updates",
                      "i.e. section toggles",
                      "i.e. format switcher"
                    ]}
                    placeholder="i.e. an interaction that matters"
                  />
                  <Field
                    label="Press / touch feedback"
                    value={data.pressStates}
                    onChange={(value) => dispatch({ type: "setField", field: "pressStates", value })}
                    placeholder="i.e. describe button feedback and hover states"
                    multiline
                  />
                  <Field
                    label="Transitions"
                    value={data.transitionAnimations}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "transitionAnimations", value })
                    }
                    placeholder="i.e. describe transitions for focus shifts"
                    multiline
                  />
                  <ListEditor
                    label="Microinteractions"
                    values={data.microInteractions}
                    onChange={updateList("microInteractions")}
                    placeholders={[
                      "i.e. click feedback",
                      "i.e. loading indicators",
                      "i.e. form validation feedback",
                      "i.e. scroll-based motion"
                    ]}
                    placeholder="i.e. a small delight moment"
                  />
                </div>
              </div>
            ) : null}

            {enabledSections.codeQuality ? (
              <div className="border-t border-slate-200/70 pt-6">
                <h3 className="text-base font-semibold text-slate-900">4. Code Quality & Performance</h3>
                <div className="mt-4 space-y-4">
                  <Field
                    label="Best practices"
                    value={data.bestPractices}
                    onChange={(value) => dispatch({ type: "setField", field: "bestPractices", value })}
                    placeholder="i.e. state management, navigation, integrations"
                    multiline
                  />
                  <Field
                    label="Modern framework usage"
                    value={data.modernFrameworkUsage}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "modernFrameworkUsage", value })
                    }
                    placeholder="i.e. describe modern patterns and tooling"
                    multiline
                  />
                  <Field
                    label="Reusable components"
                    value={data.reusableComponents}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "reusableComponents", value })
                    }
                    placeholder="i.e. describe component strategy"
                    multiline
                  />
                  <Field
                    label="Performance"
                    value={data.performanceOptimization}
                    onChange={(value) =>
                      dispatch({ type: "setField", field: "performanceOptimization", value })
                    }
                    placeholder="i.e. describe performance optimisations"
                    multiline
                  />
                  <Field
                    label="Accessibility"
                    value={data.accessibility}
                    onChange={(value) => dispatch({ type: "setField", field: "accessibility", value })}
                    placeholder="i.e. describe accessibility considerations"
                    multiline
                  />
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="space-y-6 lg:sticky lg:top-6 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pl-3">
          <div className="rounded-2xl border border-slate-200/70 bg-slate-900 p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-white">Live PRD</h2>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Format
                </label>
                <select
                  value={format}
                  onChange={(event) =>
                    dispatch({ type: "setFormat", format: event.target.value as Format })
                  }
                  className="rounded-full border border-slate-700/80 bg-slate-800 px-3 py-1 text-sm text-slate-100 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                >
                  {(Object.keys(FormatLabel) as Format[]).map((key) => (
                    <option key={key} value={key}>
                      {FormatLabel[key]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-100"
              >
                Copy
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="rounded-full border border-slate-600 bg-transparent px-4 py-2 text-sm font-semibold text-slate-100 shadow-sm hover:border-fuchsia-300 hover:text-fuchsia-300"
              >
                Download
              </button>
            </div>
            <div className="mt-5 max-h-[calc(100vh-20rem)] overflow-y-auto rounded-2xl border border-slate-700/80 bg-slate-950 p-5 text-slate-100">
              {format === "gdocs" ? (
                <div
                  className="prose prose-invert max-w-none text-sm text-slate-100"
                  dangerouslySetInnerHTML={{ __html: output }}
                />
              ) : (
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-slate-100">
                  {output}
                </pre>
              )}
            </div>
          </div>
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
