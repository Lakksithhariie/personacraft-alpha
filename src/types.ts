export type StyleType =
  | 'ceremonial'
  | 'demonstrative'
  | 'informative'
  | 'persuasive'
  | 'conversational'
  | 'impromptu'
  | 'humorous';

export type ModelType = 'gpt-5-mini' | 'gpt-5-nano';

export type IntensityType = 'light' | 'natural' | 'deep';

export interface StyleOption {
  value: StyleType;
  label: string;
  description: string;
  useCase: string;
}

export interface ModelOption {
  value: ModelType;
  label: string;
  description: string;
}

export interface IntensityOption {
  value: IntensityType;
  label: string;
}

export const STYLES: StyleOption[] = [
  {
    value: 'ceremonial',
    label: 'Ceremonial',
    description: 'Formal, elevated language',
    useCase: 'Speeches, announcements',
  },
  {
    value: 'demonstrative',
    label: 'Demonstrative',
    description: 'Clear explanation-driven',
    useCase: 'Tutorials, walkthroughs',
  },
  {
    value: 'informative',
    label: 'Informative',
    description: 'Neutral, knowledge-first',
    useCase: 'Reports, summaries',
  },
  {
    value: 'persuasive',
    label: 'Persuasive',
    description: 'Convincing, directional',
    useCase: 'Sales, proposals',
  },
  {
    value: 'conversational',
    label: 'Conversational',
    description: 'Natural, relaxed',
    useCase: 'Everyday writing',
  },
  {
    value: 'impromptu',
    label: 'Impromptu',
    description: 'Loose, spontaneous',
    useCase: 'Notes, thoughts',
  },
  {
    value: 'humorous',
    label: 'Humorous',
    description: 'Light wit, human tone',
    useCase: 'Casual content',
  },
];

export const MODELS: ModelOption[] = [
  {
    value: 'gpt-5-mini',
    label: 'GPT-5 Mini',
    description: 'Higher quality, nuanced rewriting',
  },
  {
    value: 'gpt-5-nano',
    label: 'GPT-5 Nano',
    description: 'Ultra-fast, lightweight rewriting',
  },
];

export const INTENSITIES: IntensityOption[] = [
  { value: 'light', label: 'Light Polish' },
  { value: 'natural', label: 'Natural Rewrite' },
  { value: 'deep', label: 'Deep Rewrite' },
];

export const DEFAULT_STYLE: StyleType = 'conversational';
export const DEFAULT_MODEL: ModelType = 'gpt-5-mini';
export const DEFAULT_INTENSITY: IntensityType = 'natural';
