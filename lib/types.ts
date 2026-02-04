export type Format = "markdown" | "notion" | "gdocs" | "text";
export type PhrasingMode = "verbatim" | "assisted";

export type SectionKey =
  | "role"
  | "mvpGoal"
  | "targetUser"
  | "coreFlow"
  | "scope"
  | "implementation"
  | "outOfScope"
  | "context"
  | "instruction"
  | "vision"
  | "designPrinciples"
  | "uxDetails"
  | "codeQuality"
  | "constraints";

export type Requirement = {
  id: string;
  name: string;
  priority: "Must" | "Should" | "Could";
  acceptanceCriteria: string[];
};

export type PrdData = {
  projectName: string;
  roleTitle: string;
  yearsExperience: string;
  companyContext: string;
  frameworkStack: string;
  discipline: string;

  primaryUserOutcome: string;
  coreMechanism: string;
  keyFeatures: string[];
  explicitNonGoal: string;
  coreValue: string;

  keyBehavior: string;
  painPoint: string;
  problemContext: string;

  flowAction1: string;
  flowSystemResponse: string;
  flowAction2: string;
  flowSystemResult: string;
  flowFinalConfirmation: string;
  flowTimeExpectation: string;

  scopeEntryPoint: string;
  scopeInteractionRule: string;
  scopeStructure: string;
  scopeUserElements: string;
  scopeOutputFormat: string;
  scopeStorage: string;
  scopePlatforms: string;

  coreFlowName: string;
  coreFlowEntryPoint: string;
  coreFlowInterface: string;
  coreFlowInterfaceOptions: string;
  coreFlowOptions: string[];
  coreFlowConfirmation: string;

  secondaryFlowName: string;
  secondaryNavigation: string;
  secondaryLayout: string;
  secondaryOrganisation: string;

  techFramework: string;
  techStyling: string;
  techStorage: string;

  outOfScope: string[];

  coreSkillArea: string;
  synergyTooling: string;
  microInteractionOptional: string;

  implementationType: string;
  instructionDiscipline: string;

  capabilityShowcase: string[];
  designDirection: string;

  hierarchy: string;
  contrast: string;
  balance: string;
  movement: string;
  componentArchitecture: string;

  interactiveFeatures: string[];
  pressStates: string;
  transitionAnimations: string;
  microInteractions: string[];

  bestPractices: string;
  modernFrameworkUsage: string;
  reusableComponents: string;
  performanceOptimization: string;
  accessibility: string;
};

export type ListFieldKey =
  | "keyFeatures"
  | "coreFlowOptions"
  | "outOfScope"
  | "capabilityShowcase"
  | "interactiveFeatures"
  | "microInteractions";

export type StringFieldKey = Exclude<keyof PrdData, ListFieldKey>;
