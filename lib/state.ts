import type { Format, ListFieldKey, PhrasingMode, PrdData, SectionKey, StringFieldKey } from "./types";
import { sectionConfigs } from "./sections";

export type PrdState = {
  data: PrdData;
  format: Format;
  phrasing: PhrasingMode;
  enabledSections: Record<SectionKey, boolean>;
};

export const STORAGE_KEY = "vibe-prd-generator:v1";

export const initialData: PrdData = {
  projectName: "",
  roleTitle: "",
  yearsExperience: "",
  companyContext: "",
  frameworkStack: "",
  discipline: "",

  primaryUserOutcome: "",
  coreMechanism: "",
  keyFeatures: ["", ""],
  explicitNonGoal: "",
  coreValue: "",

  keyBehavior: "",
  painPoint: "",
  problemContext: "",

  flowAction1: "",
  flowSystemResponse: "",
  flowAction2: "",
  flowSystemResult: "",
  flowFinalConfirmation: "",
  flowTimeExpectation: "",

  scopeEntryPoint: "",
  scopeInteractionRule: "",
  scopeStructure: "",
  scopeUserElements: "",
  scopeOutputFormat: "",
  scopeStorage: "",
  scopePlatforms: "",

  coreFlowName: "",
  coreFlowEntryPoint: "",
  coreFlowInterface: "",
  coreFlowInterfaceOptions: "",
  coreFlowOptions: ["", "", ""],
  coreFlowConfirmation: "",

  secondaryFlowName: "",
  secondaryNavigation: "",
  secondaryLayout: "",
  secondaryOrganisation: "",

  techFramework: "",
  techStyling: "",
  techStorage: "",

  outOfScope: ["", "", "", ""],

  coreSkillArea: "",
  synergyTooling: "",
  microInteractionOptional: "",

  implementationType: "",
  instructionDiscipline: "",

  capabilityShowcase: ["", "", "", ""],
  designDirection: "",

  hierarchy: "",
  contrast: "",
  balance: "",
  movement: "",
  componentArchitecture: "",

  interactiveFeatures: ["", "", ""],
  pressStates: "",
  transitionAnimations: "",
  microInteractions: ["", "", "", ""],

  bestPractices: "",
  modernFrameworkUsage: "",
  reusableComponents: "",
  performanceOptimization: "",
  accessibility: ""
};

export const initialState: PrdState = {
  data: initialData,
  format: "markdown",
  phrasing: "verbatim",
  enabledSections: sectionConfigs.reduce(
    (acc, section) => ({ ...acc, [section.key]: section.enabledByDefault }),
    {} as Record<SectionKey, boolean>
  )
};

export type PrdAction =
  | { type: "hydrate"; payload: Partial<PrdState> }
  | { type: "setField"; field: StringFieldKey; value: string }
  | { type: "setListItem"; field: ListFieldKey; index: number; value: string }
  | { type: "setList"; field: ListFieldKey; value: string[] }
  | { type: "addListItem"; field: ListFieldKey }
  | { type: "removeListItem"; field: ListFieldKey; index: number }
  | { type: "toggleSection"; key: SectionKey }
  | { type: "setFormat"; format: Format }
  | { type: "setPhrasing"; phrasing: PhrasingMode };

const mergeState = (state: PrdState, payload: Partial<PrdState>): PrdState => ({
  ...state,
  ...payload,
  data: { ...state.data, ...payload.data },
  enabledSections: { ...state.enabledSections, ...payload.enabledSections }
});

export const prdReducer = (state: PrdState, action: PrdAction): PrdState => {
  switch (action.type) {
    case "hydrate":
      return mergeState(state, action.payload);
    case "setField":
      return { ...state, data: { ...state.data, [action.field]: action.value } };
    case "setListItem": {
      const next = [...state.data[action.field]];
      next[action.index] = action.value;
      return { ...state, data: { ...state.data, [action.field]: next } };
    }
    case "setList":
      return { ...state, data: { ...state.data, [action.field]: action.value } };
    case "addListItem":
      return {
        ...state,
        data: { ...state.data, [action.field]: [...state.data[action.field], ""] }
      };
    case "removeListItem":
      return {
        ...state,
        data: {
          ...state.data,
          [action.field]: state.data[action.field].filter((_, index) => index !== action.index)
        }
      };
    case "toggleSection":
      return {
        ...state,
        enabledSections: {
          ...state.enabledSections,
          [action.key]: !state.enabledSections[action.key]
        }
      };
    case "setFormat":
      return { ...state, format: action.format };
    case "setPhrasing":
      return { ...state, phrasing: action.phrasing };
    default:
      return state;
  }
};
