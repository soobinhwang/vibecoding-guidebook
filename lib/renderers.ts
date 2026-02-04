import type { PrdState } from "./state";
import type { Format, PrdData, PhrasingMode } from "./types";
import { formatListItem, resolveString } from "./phrasing";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const listOrTbd = (items: string[], mode: PhrasingMode) => {
  const formatted = items.map((item) => formatListItem(item, mode)).filter(Boolean);
  return formatted.length ? formatted : ["TBD"];
};

const listOrEmpty = (items: string[], mode: PhrasingMode) => {
  const formatted = items.map((item) => formatListItem(item, mode)).filter(Boolean);
  return formatted.length ? formatted : [];
};

const resolveInstructionDiscipline = (data: PrdData) =>
  data.instructionDiscipline.trim() || data.discipline.trim();

const resolveSynergyTooling = (data: PrdData) =>
  data.synergyTooling.trim() || data.frameworkStack.trim();

export const renderMarkdown = (state: PrdState) => {
  const { data, phrasing, enabledSections } = state;
  const lines: string[] = [];

  const projectName = resolveString(data, "projectName", phrasing);
  lines.push(`# ${projectName} – Frontend Implementation Planning PRD`);
  lines.push("");
  lines.push("---");
  lines.push("");

  if (enabledSections.role) {
    lines.push("## Role", "");
    lines.push(
      `You are a **${resolveString(data, "roleTitle", phrasing)}** with **${resolveString(
        data,
        "yearsExperience",
        phrasing
      )}** years of experience at **${resolveString(data, "companyContext", phrasing)}**.`
    );
    lines.push("");
    lines.push(
      "You possess deep judgement and technical insight into creating digital experiences that:"
    );
    lines.push("");
    lines.push("* evoke emotion");
    lines.push("* enhance brand value");
    lines.push("* communicate quality through restraint and precision");
    lines.push("");
    lines.push(
      `You excel at maximising the potential of **${resolveString(
        data,
        "frameworkStack",
        phrasing
      )}** to deliver results that are both aesthetically refined and technically robust.`
    );
    lines.push("");
    lines.push(
      "Your goal is to create implementations that go beyond simple features —"
    );
    lines.push("delivering experiences that leave a strong, lasting impression and clearly demonstrate");
    lines.push(
      `advanced **${resolveString(data, "discipline", phrasing)}** capabilities.`
    );
    lines.push("");
  }

  if (enabledSections.mvpGoal) {
    lines.push("## MVP Goal", "");
    lines.push(
      `Help users **${resolveString(data, "primaryUserOutcome", phrasing)}**`
    );
    lines.push(
      `by **${resolveString(data, "coreMechanism", phrasing)}**.`
    );
    lines.push("");
    lines.push("The product provides:");
    lines.push("");
    listOrTbd(data.keyFeatures, phrasing).forEach((feature) => {
      lines.push(`* **${feature}**`);
    });
    lines.push("");
    lines.push(
      `The goal is **not** **${resolveString(data, "explicitNonGoal", phrasing)}**,`
    );
    lines.push(`but to **${resolveString(data, "coreValue", phrasing)}**.`);
    lines.push("");
  }

  if (enabledSections.targetUser) {
    lines.push("## Target User", "");
    lines.push("Users who:");
    lines.push("");
    lines.push(`* **${resolveString(data, "keyBehavior", phrasing)}**`);
    lines.push(`* struggle with **${resolveString(data, "painPoint", phrasing)}**`);
    lines.push(
      `* in the context of **${resolveString(data, "problemContext", phrasing)}**`
    );
    lines.push("");
  }

  if (enabledSections.coreFlow) {
    lines.push("## Core Flow (Happy Path)", "");
    lines.push(`1. User **${resolveString(data, "flowAction1", phrasing)}**`);
    lines.push(
      `2. The system **${resolveString(data, "flowSystemResponse", phrasing)}**`
    );
    lines.push(
      `3. User **${resolveString(data, "flowAction2", phrasing)}**`
    );
    lines.push(`4. System **${resolveString(data, "flowSystemResult", phrasing)}**`);
    lines.push(
      `5. User **${resolveString(data, "flowFinalConfirmation", phrasing)}**`
    );
    lines.push("");
    lines.push("This flow must be:");
    lines.push("");
    lines.push("* fast");
    lines.push("* explicit");
    lines.push(
      `* completable in **${resolveString(data, "flowTimeExpectation", phrasing)}**`
    );
    lines.push("");
  }

  if (enabledSections.scope) {
    lines.push("## MVP Scope (In)", "");
    lines.push(`* **${resolveString(data, "scopeEntryPoint", phrasing)}**`);
    lines.push(`* **${resolveString(data, "scopeInteractionRule", phrasing)}**`);
    lines.push(`* **${resolveString(data, "scopeStructure", phrasing)}**`);
    lines.push(`* **${resolveString(data, "scopeUserElements", phrasing)}**`);
    lines.push(`* **${resolveString(data, "scopeOutputFormat", phrasing)}**`);
    lines.push(`* **${resolveString(data, "scopeStorage", phrasing)}**`);
    lines.push(`* **${resolveString(data, "scopePlatforms", phrasing)}**`);
    lines.push("");
  }

  if (enabledSections.implementation) {
    lines.push("## Implementation Details", "");
    lines.push(`### ${resolveString(data, "coreFlowName", phrasing)}`, "");
    lines.push(`* **Entry Point**:`);
    lines.push(
      `  User enters via **${resolveString(data, "coreFlowEntryPoint", phrasing)}**`
    );
    lines.push("");
    lines.push(`* **Interface**:`);
    lines.push(
      `  **${resolveString(
        data,
        "coreFlowInterface",
        phrasing
      )}** appears with **${resolveString(
        data,
        "coreFlowInterfaceOptions",
        phrasing
      )}**`
    );
    lines.push("");
    lines.push("* **Options**:");
    listOrTbd(data.coreFlowOptions, phrasing).forEach((option) => {
      lines.push(`  * **${option}**`);
    });
    lines.push("");
    lines.push(`* **Confirmation**:`);
    lines.push(
      `  After completion, the system asks **${resolveString(
        data,
        "coreFlowConfirmation",
        phrasing
      )}**`
    );
    lines.push("");
    lines.push(`### ${resolveString(data, "secondaryFlowName", phrasing)}`, "");
    lines.push(`* **Navigation**:`);
    lines.push(
      `  **${resolveString(data, "secondaryNavigation", phrasing)}**`
    );
    lines.push("");
    lines.push(`* **Layout**:`);
    lines.push(`  **${resolveString(data, "secondaryLayout", phrasing)}**`);
    lines.push("");
    lines.push(`* **Organisation**:`);
    lines.push(`  Content grouped by **${resolveString(
      data,
      "secondaryOrganisation",
      phrasing
    )}**`);
    lines.push("");
    lines.push("### Technology Stack", "");
    lines.push(`* **Framework**: ${resolveString(data, "techFramework", phrasing)}`);
    lines.push(`* **Styling**: ${resolveString(data, "techStyling", phrasing)}`);
    lines.push(`* **Storage**: ${resolveString(data, "techStorage", phrasing)}`);
    lines.push("");
  }

  if (enabledSections.outOfScope) {
    lines.push("## Explicitly Out of Scope", "");
    listOrTbd(data.outOfScope, phrasing).forEach((item) => {
      lines.push(`* **${item}**`);
    });
    lines.push("");
    lines.push("> This section is frozen.");
    lines.push("> No features outside this scope should be implemented during MVP development.");
    lines.push("");
  }

  if (enabledSections.context) {
    lines.push("## Context", "");
    lines.push(
      `This project is an opportunity to demonstrate **${resolveString(
        data,
        "coreSkillArea",
        phrasing
      )}** through`
    );
    lines.push("how things are designed and implemented — not merely *what* features exist.");
    lines.push("");
    lines.push("Key considerations:");
    lines.push("");
    lines.push("* **Demonstrating Capability**");
    lines.push("  The implementation should clearly reflect the maker’s level through:");
    lines.push("  * code structure");
    lines.push("  * interaction quality");
    lines.push("  * design judgement");
    lines.push("  * overall UX depth");
    lines.push("");
    lines.push("* **Core of User Experience (UX)**");
    lines.push("  The product should feel:");
    lines.push("  * intuitive");
    lines.push("  * calm");
    lines.push("  * satisfying");
    lines.push("    Thoughtful interactions and attention to detail should elevate perceived quality.");
    lines.push("");
    lines.push("* **Synergy of Tools & Frameworks**");
    lines.push(
      `  **${resolveString(
        data,
        "synergyTooling",
        phrasing,
        resolveSynergyTooling(data)
      )}** should be leveraged to build:`
    );
    lines.push("  * scalable systems");
    lines.push("  * consistent patterns");
    lines.push("  * maintainable structures");
    lines.push("    while maintaining cross-platform or cross-context consistency.");
    lines.push("");
    lines.push("* **Application of Design Principles**");
    lines.push("  Principles such as:");
    lines.push("  * Hierarchy");
    lines.push("  * Contrast");
    lines.push("  * Balance");
    lines.push("  * Movement");
    lines.push("    should guide attention and clarify information — never be decorative.");
    lines.push("");
    lines.push("* **Power of Microinteractions**");
    lines.push("  Subtle press states, transitions, motion, and feedback provide:");
    lines.push("  * clarity");
    lines.push("  * responsiveness");
    lines.push("  * emotional quality");
    const optionalMicro = listOrEmpty(
      [data.microInteractionOptional],
      phrasing
    );
    if (optionalMicro.length) {
      lines.push(`    **${optionalMicro[0]}** may be used where appropriate.`);
    } else {
      lines.push("    **[OPTIONAL: haptics / sound / animation]** may be used where appropriate.");
    }
    lines.push("");
  }

  if (enabledSections.instruction) {
    lines.push("## Instruction", "");
    lines.push(
      `Generate **${resolveString(
        data,
        "implementationType",
        phrasing
      )}** guidelines that demonstrate`
    );
    lines.push(
      `strong **${resolveString(
        data,
        "instructionDiscipline",
        phrasing,
        resolveInstructionDiscipline(data)
      )}** and interaction design capabilities.`
    );
    lines.push("");
    lines.push("* Do **not** generate a complete application.");
    lines.push("* Focus on planning, structure, and representative components.");
    lines.push("");
    lines.push("Follow the sections below carefully.");
    lines.push("");
  }

  if (enabledSections.vision) {
    lines.push("## 1. Define Project Vision and Core Concepts", "");
    lines.push("### Set Goals", "");
    lines.push("Clearly define which capabilities this project is intended to showcase:");
    lines.push("");
    listOrTbd(data.capabilityShowcase, phrasing).forEach((capability) => {
      lines.push(`* **${capability}**`);
    });
    lines.push("");
    lines.push("### Theme and Concept", "");
    lines.push("Propose an original visual and interaction concept, such as:");
    lines.push("");
    lines.push(`* **${resolveString(data, "designDirection", phrasing)}**`);
    lines.push("");
  }

  if (enabledSections.designPrinciples) {
    lines.push("## 2. Design Structure Based on Design Principles", "");
    lines.push("### Hierarchy", "");
    lines.push(resolveString(data, "hierarchy", phrasing));
    lines.push("");
    lines.push("### Contrast", "");
    lines.push(resolveString(data, "contrast", phrasing));
    lines.push("");
    lines.push("### Balance", "");
    lines.push(resolveString(data, "balance", phrasing));
    lines.push("");
    lines.push("### Movement", "");
    lines.push(resolveString(data, "movement", phrasing));
    lines.push("");
    lines.push("### Component-Based Architecture", "");
    lines.push(resolveString(data, "componentArchitecture", phrasing));
    lines.push("");
  }

  if (enabledSections.uxDetails) {
    lines.push("## 3. Implement Interactive Features and Detailed UX Elements", "");
    lines.push("### Interactive Features", "");
    listOrTbd(data.interactiveFeatures, phrasing).forEach((feature) => {
      lines.push(`* ${feature}`);
    });
    lines.push("");
    lines.push("### Press / Touch States", "");
    lines.push(resolveString(data, "pressStates", phrasing));
    lines.push("");
    lines.push("### Transition Animations", "");
    lines.push(resolveString(data, "transitionAnimations", phrasing));
    lines.push("");
    lines.push("### Microinteractions", "");
    listOrTbd(data.microInteractions, phrasing).forEach((item) => {
      lines.push(`* ${item}`);
    });
    lines.push("");
  }

  if (enabledSections.codeQuality) {
    lines.push("## 4. Code Quality and Performance Optimisation", "");
    lines.push("### Best Practices", "");
    lines.push(resolveString(data, "bestPractices", phrasing));
    lines.push("");
    lines.push("### Modern Framework Usage", "");
    lines.push(resolveString(data, "modernFrameworkUsage", phrasing));
    lines.push("");
    lines.push("### Reusable Components", "");
    lines.push(resolveString(data, "reusableComponents", phrasing));
    lines.push("");
    lines.push("### Performance Optimisation", "");
    lines.push(resolveString(data, "performanceOptimization", phrasing));
    lines.push("");
    lines.push("### Accessibility", "");
    lines.push(resolveString(data, "accessibility", phrasing));
    lines.push("");
  }

  if (enabledSections.constraints) {
    lines.push("## Constraints", "");
    lines.push("* Do not generate full application code.");
    lines.push("* All design principles must be reflected in implementation decisions.");
    lines.push("* All UX elements must be intentional and explained.");
    lines.push("* Code must be readable, maintainable, and extensible.");
    lines.push("* Introduce a clear “wow” factor without unnecessary complexity.");
    lines.push("* The final output should feel **premium, calm, and confident**.");
    lines.push("");
  }

  return lines.join("\n");
};

export const renderPlainText = (state: PrdState) => {
  const markdown = renderMarkdown(state);
  return markdown
    .replace(/^#{1,3}\s?(.*)$/gm, (_, text) => String(text).toUpperCase())
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^\*\s/gm, "- ")
    .replace(/^>\s?/gm, "")
    .replace(/---/g, "--------------------------------");
};

export const renderNotion = (state: PrdState) => renderMarkdown(state);

export const renderGdocs = (state: PrdState) => {
  const { data, phrasing, enabledSections } = state;
  const html: string[] = [];

  const h1 = (text: string) => html.push(`<h1>${escapeHtml(text)}</h1>`);
  const h2 = (text: string) => html.push(`<h2>${escapeHtml(text)}</h2>`);
  const h3 = (text: string) => html.push(`<h3>${escapeHtml(text)}</h3>`);
  const p = (text: string) => html.push(`<p>${text}</p>`);
  const ul = (items: string[]) =>
    html.push(`<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`);
  const ol = (items: string[]) =>
    html.push(`<ol>${items.map((item) => `<li>${item}</li>`).join("")}</ol>`);
  const strong = (text: string) => `<strong>${escapeHtml(text)}</strong>`;

  h1(`${resolveString(data, "projectName", phrasing)} – Frontend Implementation Planning PRD`);
  html.push("<hr />");

  if (enabledSections.role) {
    h2("Role");
    p(
      `You are a ${strong(resolveString(data, "roleTitle", phrasing))} with ${strong(
        resolveString(data, "yearsExperience", phrasing)
      )} years of experience at ${strong(resolveString(data, "companyContext", phrasing))}.`
    );
    p("You possess deep judgement and technical insight into creating digital experiences that:");
    ul(["evoke emotion", "enhance brand value", "communicate quality through restraint and precision"]);
    p(
      `You excel at maximising the potential of ${strong(
        resolveString(data, "frameworkStack", phrasing)
      )} to deliver results that are both aesthetically refined and technically robust.`
    );
    p(
      `Your goal is to create implementations that go beyond simple features — delivering experiences that leave a strong, lasting impression and clearly demonstrate advanced ${strong(
        resolveString(data, "discipline", phrasing)
      )} capabilities.`
    );
  }

  if (enabledSections.mvpGoal) {
    h2("MVP Goal");
    p(
      `Help users ${strong(resolveString(data, "primaryUserOutcome", phrasing))} by ${strong(
        resolveString(data, "coreMechanism", phrasing)
      )}.`
    );
    p("The product provides:");
    ul(listOrTbd(data.keyFeatures, phrasing).map((item) => strong(item)));
    p(
      `The goal is not ${strong(resolveString(data, "explicitNonGoal", phrasing))}, but to ${strong(
        resolveString(data, "coreValue", phrasing)
      )}.`
    );
  }

  if (enabledSections.targetUser) {
    h2("Target User");
    p("Users who:");
    ul([
      strong(resolveString(data, "keyBehavior", phrasing)),
      `struggle with ${strong(resolveString(data, "painPoint", phrasing))}`,
      `in the context of ${strong(resolveString(data, "problemContext", phrasing))}`
    ]);
  }

  if (enabledSections.coreFlow) {
    h2("Core Flow (Happy Path)");
    ol([
      `User ${strong(resolveString(data, "flowAction1", phrasing))}`,
      `The system ${strong(resolveString(data, "flowSystemResponse", phrasing))}`,
      `User ${strong(resolveString(data, "flowAction2", phrasing))}`,
      `System ${strong(resolveString(data, "flowSystemResult", phrasing))}`,
      `User ${strong(resolveString(data, "flowFinalConfirmation", phrasing))}`
    ]);
    p("This flow must be:");
    ul(["fast", "explicit", `completable in ${strong(resolveString(data, "flowTimeExpectation", phrasing))}`]);
  }

  if (enabledSections.scope) {
    h2("MVP Scope (In)");
    ul([
      strong(resolveString(data, "scopeEntryPoint", phrasing)),
      strong(resolveString(data, "scopeInteractionRule", phrasing)),
      strong(resolveString(data, "scopeStructure", phrasing)),
      strong(resolveString(data, "scopeUserElements", phrasing)),
      strong(resolveString(data, "scopeOutputFormat", phrasing)),
      strong(resolveString(data, "scopeStorage", phrasing)),
      strong(resolveString(data, "scopePlatforms", phrasing))
    ]);
  }

  if (enabledSections.implementation) {
    h2("Implementation Details");
    h3(resolveString(data, "coreFlowName", phrasing));
    ul([
      `<strong>Entry Point</strong>: User enters via ${strong(
        resolveString(data, "coreFlowEntryPoint", phrasing)
      )}`,
      `<strong>Interface</strong>: ${strong(
        resolveString(data, "coreFlowInterface", phrasing)
      )} appears with ${strong(resolveString(data, "coreFlowInterfaceOptions", phrasing))}`,
      `<strong>Options</strong>: ${listOrTbd(data.coreFlowOptions, phrasing)
        .map((item) => strong(item))
        .join(", ")}`,
      `<strong>Confirmation</strong>: After completion, the system asks ${strong(
        resolveString(data, "coreFlowConfirmation", phrasing)
      )}`
    ]);
    h3(resolveString(data, "secondaryFlowName", phrasing));
    ul([
      `<strong>Navigation</strong>: ${strong(resolveString(data, "secondaryNavigation", phrasing))}`,
      `<strong>Layout</strong>: ${strong(resolveString(data, "secondaryLayout", phrasing))}`,
      `<strong>Organisation</strong>: Content grouped by ${strong(
        resolveString(data, "secondaryOrganisation", phrasing)
      )}`
    ]);
    h3("Technology Stack");
    ul([
      `<strong>Framework</strong>: ${strong(resolveString(data, "techFramework", phrasing))}`,
      `<strong>Styling</strong>: ${strong(resolveString(data, "techStyling", phrasing))}`,
      `<strong>Storage</strong>: ${strong(resolveString(data, "techStorage", phrasing))}`
    ]);
  }

  if (enabledSections.outOfScope) {
    h2("Explicitly Out of Scope");
    ul(listOrTbd(data.outOfScope, phrasing).map((item) => strong(item)));
    p("This section is frozen. No features outside this scope should be implemented during MVP development.");
  }

  if (enabledSections.context) {
    h2("Context");
    p(
      `This project is an opportunity to demonstrate ${strong(
        resolveString(data, "coreSkillArea", phrasing)
      )} through how things are designed and implemented — not merely what features exist.`
    );
    p("Key considerations:");
    ul([
      `<strong>Demonstrating Capability</strong>: The implementation should clearly reflect the maker’s level through code structure, interaction quality, design judgement, overall UX depth.`,
      `<strong>Core of User Experience (UX)</strong>: The product should feel intuitive, calm, satisfying. Thoughtful interactions and attention to detail should elevate perceived quality.`,
      `<strong>Synergy of Tools & Frameworks</strong>: ${strong(
        resolveString(data, "synergyTooling", phrasing, resolveSynergyTooling(data))
      )} should be leveraged to build scalable systems, consistent patterns, maintainable structures while maintaining cross-platform or cross-context consistency.`,
      `<strong>Application of Design Principles</strong>: Hierarchy, Contrast, Balance, Movement should guide attention and clarify information — never be decorative.`,
      `<strong>Power of Microinteractions</strong>: Subtle press states, transitions, motion, and feedback provide clarity, responsiveness, emotional quality. ${
        listOrEmpty([data.microInteractionOptional], phrasing)[0]
          ? `${strong(listOrEmpty([data.microInteractionOptional], phrasing)[0])} may be used where appropriate.`
          : "Optional haptics / sound / animation may be used where appropriate."
      }`
    ]);
  }

  if (enabledSections.instruction) {
    h2("Instruction");
    p(
      `Generate ${strong(resolveString(data, "implementationType", phrasing))} guidelines that demonstrate strong ${strong(
        resolveString(
          data,
          "instructionDiscipline",
          phrasing,
          resolveInstructionDiscipline(data)
        )
      )} and interaction design capabilities.`
    );
    ul([
      "Do not generate a complete application.",
      "Focus on planning, structure, and representative components."
    ]);
    p("Follow the sections below carefully.");
  }

  if (enabledSections.vision) {
    h2("1. Define Project Vision and Core Concepts");
    h3("Set Goals");
    p("Clearly define which capabilities this project is intended to showcase:");
    ul(listOrTbd(data.capabilityShowcase, phrasing).map((item) => strong(item)));
    h3("Theme and Concept");
    p("Propose an original visual and interaction concept, such as:");
    ul([strong(resolveString(data, "designDirection", phrasing))]);
  }

  if (enabledSections.designPrinciples) {
    h2("2. Design Structure Based on Design Principles");
    h3("Hierarchy");
    p(escapeHtml(resolveString(data, "hierarchy", phrasing)));
    h3("Contrast");
    p(escapeHtml(resolveString(data, "contrast", phrasing)));
    h3("Balance");
    p(escapeHtml(resolveString(data, "balance", phrasing)));
    h3("Movement");
    p(escapeHtml(resolveString(data, "movement", phrasing)));
    h3("Component-Based Architecture");
    p(escapeHtml(resolveString(data, "componentArchitecture", phrasing)));
  }

  if (enabledSections.uxDetails) {
    h2("3. Implement Interactive Features and Detailed UX Elements");
    h3("Interactive Features");
    ul(listOrTbd(data.interactiveFeatures, phrasing).map(escapeHtml));
    h3("Press / Touch States");
    p(escapeHtml(resolveString(data, "pressStates", phrasing)));
    h3("Transition Animations");
    p(escapeHtml(resolveString(data, "transitionAnimations", phrasing)));
    h3("Microinteractions");
    ul(listOrTbd(data.microInteractions, phrasing).map(escapeHtml));
  }

  if (enabledSections.codeQuality) {
    h2("4. Code Quality and Performance Optimisation");
    h3("Best Practices");
    p(escapeHtml(resolveString(data, "bestPractices", phrasing)));
    h3("Modern Framework Usage");
    p(escapeHtml(resolveString(data, "modernFrameworkUsage", phrasing)));
    h3("Reusable Components");
    p(escapeHtml(resolveString(data, "reusableComponents", phrasing)));
    h3("Performance Optimisation");
    p(escapeHtml(resolveString(data, "performanceOptimization", phrasing)));
    h3("Accessibility");
    p(escapeHtml(resolveString(data, "accessibility", phrasing)));
  }

  if (enabledSections.constraints) {
    h2("Constraints");
    ul([
      "Do not generate full application code.",
      "All design principles must be reflected in implementation decisions.",
      "All UX elements must be intentional and explained.",
      "Code must be readable, maintainable, and extensible.",
      "Introduce a clear wow factor without unnecessary complexity.",
      "The final output should feel premium, calm, and confident."
    ]);
  }

  return html.join("");
};

export const renderForFormat = (state: PrdState, format: Format) => {
  switch (format) {
    case "markdown":
      return renderMarkdown(state);
    case "notion":
      return renderNotion(state);
    case "gdocs":
      return renderGdocs(state);
    case "text":
      return renderPlainText(state);
    default:
      return renderMarkdown(state);
  }
};

export const getMimeType = (format: Format) => {
  switch (format) {
    case "gdocs":
      return "text/html";
    case "text":
      return "text/plain";
    default:
      return "text/markdown";
  }
};
