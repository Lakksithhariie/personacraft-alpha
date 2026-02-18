import type { StyleType, IntensityType } from './types';

const INTENSITY_INSTRUCTIONS: Record<IntensityType, string> = {
  light: `Apply minimal changes. Fix only obvious issues while preserving most of the original structure. Light touch.`,
  natural: `Rewrite naturally as a person would. Moderate transformation while maintaining the core message.`,
  deep: `Significantly restructure and reimagine the content. Transform it thoroughly while preserving meaning.`,
};

const STYLE_INSTRUCTIONS: Record<StyleType, string> = {
  ceremonial: `Use formal, elevated language. Employ dignified phrasing and ceremonial tone. Structure sentences with gravitas. Use sophisticated vocabulary naturally. Create a sense of importance and occasion.`,
  
  demonstrative: `Write with clear, explanation-driven focus. Guide the reader step by step. Use concrete examples and logical progression. Make complex ideas accessible. Prioritize clarity and instruction.`,
  
  informative: `Adopt a neutral, knowledge-first approach. Present facts objectively. Use straightforward structure. Avoid bias or persuasion. Focus on delivering information efficiently and accurately.`,
  
  persuasive: `Write convincingly with directional intent. Use rhetorical techniques naturally. Build compelling arguments. Create momentum toward a conclusion. Balance logic with emotional appeal.`,
  
  conversational: `Write as if speaking naturally to a friend. Use relaxed, everyday language. Vary sentence rhythm naturally. Include casual connectors. Sound like a real person, not a formal document.`,
  
  impromptu: `Write with spontaneous, loose flow. Allow slight imperfections that feel human. Use informal structure. Capture the feeling of off-the-cuff thought. Avoid over-polishing.`,
  
  humorous: `Inject light wit and human warmth. Use natural humor that doesn't feel forced. Maintain the message while adding personality. Keep it clever but not overbearing. Let personality shine through.`,
};

export function buildPrompt(
  input: string,
  style: StyleType,
  intensity: IntensityType
): string {
  const styleInstruction = STYLE_INSTRUCTIONS[style];
  const intensityInstruction = INTENSITY_INSTRUCTIONS[intensity];

  return `You are a skilled human writer re-expressing text naturally.

CRITICAL RULES:
- Reconstruct meaning, never just substitute synonyms
- Prefer restructuring over synonym-swapping
- Maintain natural human cadence with varied sentence rhythm
- Avoid robotic patterns or over-optimization
- Slight imperfection is allowed—humans aren't robotic
- Preserve emotional tone and intent
- Output ONLY the rephrased text, nothing else

STYLE: ${styleInstruction}

INTENSITY: ${intensityInstruction}

Original text:
${input}

Rephrase the text naturally:`;
}

export function cleanOutput(text: string): string {
  return text
    .replace(/^(Here['']?s the rephrased text:|Rephrased:|Here is the rewritten version:)\s*/i, '')
    .replace(/^[""]|[""]$/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}