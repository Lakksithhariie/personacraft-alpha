import { useState, useCallback, useRef } from 'react';
import { Editor } from './components/Editor';
import { StyleSelector } from './components/StyleSelector';
import { ModelSelector } from './components/ModelSelector';
import { IntensitySelector } from './components/IntensitySelector';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useCopyToClipboard } from './hooks/useCopyToClipboard';
import { rephraseDirect } from './api';
import type {
  StyleType,
  ModelType,
  IntensityType,
} from './types';
import {
  DEFAULT_STYLE,
  DEFAULT_MODEL,
  DEFAULT_INTENSITY,
} from './types';

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [style, setStyle] = useState<StyleType>(DEFAULT_STYLE);
  const [model, setModel] = useState<ModelType>(DEFAULT_MODEL);
  const [intensity, setIntensity] = useState<IntensityType>(DEFAULT_INTENSITY);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, copyToClipboard] = useCopyToClipboard();
  const outputRef = useRef<string>('');

  const handleRephrase = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setOutput('');
    outputRef.current = '';

    await rephraseDirect({
      input,
      style,
      intensity,
      model,
      onToken: (token) => {
        outputRef.current += token;
        setOutput(outputRef.current);
      },
      onComplete: () => {
        setIsLoading(false);
      },
      onError: (err) => {
        setError(err);
        setIsLoading(false);
      },
    });
  }, [input, style, intensity, model, isLoading]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError(null);
    outputRef.current = '';
  }, []);

  const handleCopy = useCallback(() => {
    if (output) {
      copyToClipboard(output);
    }
  }, [output, copyToClipboard]);

  useKeyboardShortcuts({
    onRephrase: handleRephrase,
    onClear: handleClear,
    onCopy: handleCopy,
    disabled: isLoading,
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-primary-text">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-8">
          <h1 className="text-lg font-medium tracking-tight">HumanWrite</h1>
          <StyleSelector value={style} onChange={setStyle} />
        </div>
        <div className="flex items-center gap-6">
          <IntensitySelector value={intensity} onChange={setIntensity} />
          <ModelSelector value={model} onChange={setModel} />
        </div>
      </header>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col border-r border-border">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border">
            <span className="text-xs text-muted-text uppercase tracking-wider">Input</span>
            <button
              type="button"
              onClick={handleRephrase}
              disabled={!input.trim() || isLoading}
              className="btn-primary text-sm"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Rephrasing...
                </span>
              ) : (
                'Rephrase'
              )}
            </button>
          </div>
          <div className="flex-1 p-4">
            <Editor
              value={input}
              onChange={setInput}
              placeholder="Paste your text here and press Cmd+Enter to rephrase..."
              className="h-full"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border">
            <span className="text-xs text-muted-text uppercase tracking-wider">Output</span>
            {output && (
              <button
                type="button"
                onClick={handleCopy}
                className={`text-xs px-2 py-1 rounded transition-colors duration-100 ${
                  copied
                    ? 'bg-accent/20 text-accent'
                    : 'text-muted-text hover:text-primary-text hover:bg-surface'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <div className="flex-1 p-4">
            <Editor
              value={output}
              readOnly
              placeholder={isLoading ? 'Rephrasing...' : 'Rephrased text will appear here...'}
              className="h-full"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

      <footer className="px-6 py-2 border-t border-border text-xs text-muted-text">
        <div className="flex items-center justify-between">
          <span>
            <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px]">Cmd</kbd>+<kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px]">Enter</kbd> Rephrase
            <span className="mx-2 text-border">|</span>
            <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px]">Cmd</kbd>+<kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px]">X</kbd> Clear
            <span className="mx-2 text-border">|</span>
            <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px]">Cmd</kbd>+<kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px]">Shift</kbd>+<kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px]">C</kbd> Copy
          </span>
          <span>No data stored. Stateless processing.</span>
        </div>
      </footer>
    </div>
  );
}