import { buildPrompt, cleanOutput } from './prompts';
import type { StyleType, IntensityType, ModelType } from './types';

interface RephraseOptions {
  input: string;
  style: StyleType;
  intensity: IntensityType;
  model: ModelType;
  onToken: (token: string) => void;
  onComplete: () => void;
  onError: (error: string) => void;
}

export async function rephraseStreaming(options: RephraseOptions): Promise<void> {
  const { input, style, intensity, model, onToken, onComplete, onError } = options;

  const prompt = buildPrompt(input, style, intensity);

  try {
    const response = await fetch('/api/rephrase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response stream available');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);

          if (data === '[DONE]') {
            onComplete();
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;

            if (content) {
              const cleaned = cleanOutput(content);
              if (cleaned) {
                onToken(cleaned);
              }
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    onError(error instanceof Error ? error.message : 'An unexpected error occurred');
  }
}

export async function rephraseDirect(options: RephraseOptions): Promise<void> {
  const { input, style, intensity, model, onToken, onComplete, onError } = options;

  const prompt = buildPrompt(input, style, intensity);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: model === 'gpt-5-mini' ? 'gpt-4o-mini' : 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Request failed: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response stream available');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let hasStartedOutput = false;

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);

          if (data === '[DONE]') {
            onComplete();
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;

            if (content) {
              if (!hasStartedOutput) {
                hasStartedOutput = true;
              }
              onToken(content);
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    onError(error instanceof Error ? error.message : 'An unexpected error occurred');
  }
}