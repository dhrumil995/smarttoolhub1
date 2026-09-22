export type PageId =
  | 'home'
  | 'generator'
  | 'compatibility'
  | 'troubleshooting'
  | 'library'
  | 'workflow-detail'
  | 'pricing'
  | 'privacy'
  | 'terms'
  | 'contact';

export type PersonaType = 'creators' | 'students' | 'freelancers' | 'beginners' | 'developers';

export interface ShortcutKey {
  mac?: string;
  ios?: string;
  description: string;
}

export interface WorkflowStep {
  stepNumber: number;
  title: string;
  instruction: string;
  shortcuts?: ShortcutKey[];
  callout?: string;
}

export interface OfficialDocLink {
  title: string;
  url: string;
  lastReviewed: string;
}

export interface WorkflowItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  persona: PersonaType;
  category: 'Content Creation' | 'Productivity & Focus' | 'Cross-Device File Sync' | 'Study & Research' | 'Audio & Video Production' | 'Developer & Automation';
  devicesRequired: {
    device: string;
    minOS: string;
    hardwareNotes?: string;
  }[];
  appsUsed: string[];
  isBuiltInOnly: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  setupTimeMinutes: number;
  requiredSettings: string[];
  steps: WorkflowStep[];
  commonProblems: {
    issue: string;
    solution: string;
  }[];
  privacyNotes: string[];
  alternativeWorkflow: {
    title: string;
    description: string;
    tradeOff: string;
  };
  officialDocLinks: OfficialDocLink[];
  lastReviewedDate: string;
  tags: string[];
  featured?: boolean;
}

export interface CompatibilityFeature {
  id: string;
  name: string;
  category: 'Continuity' | 'Audio & Camera' | 'Display & Input' | 'Ecosystem Intelligence';
  description: string;
  requiredMac: string;
  requiredIos: string;
  requiredIpad: string;
  networkPreconditions: string[];
  appleAccountRules: string;
  hardwareChips: string; // e.g. "Apple Silicon M1+ or Intel with T2"
  officialSupportUrl: string;
  lastReviewedDate: string;
  troubleshootSlug?: string;
}

export interface TroubleshootingDiagnosticStep {
  step: number;
  title: string;
  details: string;
  command?: string;
}

export interface TroubleshootingIssue {
  id: string;
  title: string;
  feature: string;
  category: 'AirDrop & Sharing' | 'Universal Clipboard & Handoff' | 'Sidecar & Displays' | 'Continuity Camera & Mic' | 'iPhone Mirroring' | 'Shortcuts & Automations';
  symptoms: string[];
  quickFixSteps: string[];
  deepDiagnostics: TroubleshootingDiagnosticStep[];
  officialDocUrl: string;
  lastReviewedDate: string;
}

export interface GeneratorFormData {
  devices: string[];
  osVersions: string;
  task: string;
  currentApps: string[];
  toolPreference: 'built-in' | 'third-party' | 'hybrid';
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface GeneratedWorkflowOutput {
  goalSummary: string;
  estimatedSetupTime: string;
  difficulty: string;
  requiredDevices: {
    device: string;
    minOS: string;
    hardwareNotes?: string;
  }[];
  requiredSettings: string[];
  steps: WorkflowStep[];
  commonProblems: {
    issue: string;
    solution: string;
  }[];
  privacyNotes: string[];
  alternativeWorkflow: {
    title: string;
    description: string;
    tradeOff: string;
  };
  relatedWorkflows: string[];
  officialSupportLinks: {
    title: string;
    url: string;
  }[];
}

export interface AIDiagnosticResult {
  rootCauseAnalysis: string;
  quickFix: string[];
  terminalCommands: {
    command: string;
    description: string;
    riskLevel: 'safe' | 'caution' | 'sudo';
  }[];
  preconditionChecklist: string[];
  officialAdvice: string;
}

export interface AIAutomationScriptResult {
  scriptType: 'applescript' | 'zsh' | 'shortcuts-spec';
  title: string;
  code: string;
  instructions: string[];
  safetyNotes: string;
}
