# PRD: HumanWrite — Lightweight AI Rephrasing That Sounds Human

---

## 1) Master Context

### Product Principles
- Preserve meaning. Improve expression.
- Sound like a human, not a thesaurus.
- Fast enough to feel local (Obsidian-like responsiveness).
- Zero-friction workflow: paste → rephrase → done.
- Minimal UI. No distractions. No feature bloat.
- User always controls style + model.

### Voice & Tone Philosophy
We are not “rewriting text”.
We are **re-expressing intent the way a person naturally would**:
- Sentence rhythm varies.
- Structure adapts to context.
- Over-optimization is avoided.
- Slight imperfection is allowed (humans aren’t robotic).

### Quality Bar
Output should pass:
> “Would I believe a thoughtful human wrote this?”

### Risk & Compliance Guardrails
- No data stored by default.
- Stateless processing.
- No training on user inputs.
- Session-level processing only.
- Safety filtering applied after generation.

---

## 2) Problem & Goals

### Problem Statement
Existing paraphrasing tools replace words, not thinking.
They generate text that looks different but feels artificial.

Users want:
- Natural rewrites
- Tone control
- Speed
- Trustworthy meaning retention
- A tool that feels like part of their writing flow

### Target Users
- Professionals rewriting emails / docs
- Students refining writing clarity
- Product / marketing teams
- Non-native English speakers
- Writers using AI but wanting authenticity

### Success Metrics
- ≥80% first-output acceptance rate (no edits needed)
- Median rewrite time <2s
- Daily repeat usage ≥50%
- “Feels human” rating ≥4.5 / 5

---

## 3) Requirements

### Functional

#### 3.1 Core Rephrasing
- Rewrite text while preserving:
  - Meaning
  - Intent
  - Context
  - Emotional tone
- Avoid synonym-swapping patterns.
- Allow structural transformation where needed.

#### 3.2 Style Selection (User Must Choose One)

| Style | Description | Use Case |
|------|-------------|----------|
Ceremonial | Formal, elevated language | Speeches, announcements |
Demonstrative | Clear explanation-driven | Tutorials, walkthroughs |
Informative | Neutral, knowledge-first | Reports, summaries |
Persuasive | Convincing, directional | Sales, proposals |
Conversational | Natural, relaxed (default) | Everyday writing |
Impromptu | Loose, spontaneous | Notes, thoughts |
Humorous | Light wit, human tone | Casual content |

Each style modifies:
- Syntax looseness
- Sentence cadence
- Formality level
- Emotional coloration

#### 3.3 Model Selection (User Chooses)

Users can toggle model based on need:

| Model | Use Case |
|------|----------|
gpt-5-mini | Higher quality, nuanced rewriting |
gpt-5-nano | Ultra-fast, lightweight rewriting |

System does NOT auto-switch.
User remains in control.

#### 3.4 Keyboard-First Workflow

| Shortcut | Action |
|----------|--------|
Cmd/Ctrl + Enter | Rephrase |
Cmd/Ctrl + X | Clear Input |
Cmd/Ctrl + Shift + C | Copy Output |

No mouse required.

#### 3.5 Split Editor Layout
- Left: Input
- Right: Output
- Instant streaming rewrite.
- No popups, no modals.

#### 3.6 Rewrite Intensity (Subtle Control)
- Light Polish
- Natural Rewrite (default)
- Deep Rewrite

---

### Non-Functional

- App must feel instantaneous.
- Bundle target: <250KB JS.
- First token <400ms.
- No login required.
- Offline-capable UI shell.
- Stateless backend calls.

---

## 4) Solution Space & Constraints

### Proposed Approach

A thin orchestration layer:
UI → Prompt Builder → Model → Humanization Pass → Stream Back

No heavy pipelines.
No embeddings required.
No memory layer.

### Prompt Strategy
We guide models to:
- Reconstruct meaning, not substitute words.
- Prefer restructuring over synonymizing.
- Maintain natural human cadence.

### Technical Constraints
- Must support streaming responses.
- Must remain deployable on edge runtimes.
- Avoid multi-model chaining to reduce latency.

### Legal / Compliance Constraints
- Ephemeral request handling.
- No persistence unless explicitly enabled later.
- GDPR-aligned by design.

---

## 5) Design System Appendix

## UI Direction: Inspired by Obsidian

Minimal. Calm. Text-first.

### Colors

| Token | Value |
|------|-------|
Background | #141414 |
Surface | #1E1E1E |
Border | #2A2A2A |
Primary Text | #E4E4E7 |
Muted Text | #A1A1AA |
Accent | #7C3AED |

### Typography
- Font: Inter / System UI
- Base Size: 15px
- Line Height: 1.6
- No exaggerated hierarchy.

### Components
- Plain editor surface
- Subtle divider
- Dropdown selectors (style + model)
- No cards, shadows, or marketing UI.

### Interaction Rules
- No animation >120ms.
- Immediate visual feedback.
- Fully keyboard navigable.
- Accessible contrast ratios.

---

## 6) Plan & Architecture Notes

### High-Level Architecture

Frontend (React / Solid / Vanilla)
→ Edge Function
→ OpenAI API Call (selected model)
→ Stream Tokens
→ Render Incrementally

### API Invocation (Dynamic)

Model chosen at runtime:

- gpt-5-mini → quality mode
- gpt-5-nano → speed mode

### Data Flow

User Input
→ Style Conditioning Prompt
→ Model Rewrite
→ Lightweight Post-Processor (artifact cleanup)
→ Stream to UI

No storage.
No background processing.

---

## 7) Tasks (Ordered)

1. Build minimal Obsidian-like editor shell.
2. Implement keyboard-driven UX.
3. Add style selector logic.
4. Add model selector toggle.
5. Create prompt-conditioning templates per style.
6. Integrate OpenAI streaming API.
7. Implement rewrite intensity parameterization.
8. Add artifact-cleaning post-process.
9. Optimize latency + bundle size.
10. Conduct realism evaluation testing.

---

## 8) Acceptance Criteria & QA

### Functional
- Rewrites must preserve meaning ≥95%.
- Styles must produce clearly distinct outputs.
- No detectable synonym-replacement patterns.

### Performance
- First token <400ms.
- 500-word rewrite <2 seconds (nano mode).

### UX
- User can operate entire app via keyboard.
- Load time feels instant.
- No visual clutter.

### Human Realism Test
Blind test vs traditional paraphrasers:
Users must prefer HumanWrite output ≥70% of time.

---

## Vision

A tool that disappears.

Not another AI app.
Not another editor.

Just a place where your writing becomes clearer,
more natural,
and still unmistakably yours.
