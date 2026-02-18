import { useState, useCallback, useRef } from 'react';
import { Editor } from './components/Editor';
import { StyleSelector } from './components/StyleSelector';
import { ModelSelector } from './components/ModelSelector';
import { IntensitySelector } from './components/IntensitySelector';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useCopyToClipboard } from './hooks/useCopyToClipboard';
import { rephraseDirect } from './api';
import type { StyleType, ModelType, IntensityType } from './types';
import { DEFAULT_STYLE, DEFAULT_MODEL, DEFAULT_INTENSITY } from './types';

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
      onComplete: () => setIsLoading(false),
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
    if (output) copyToClipboard(output);
  }, [output, copyToClipboard]);

  useKeyboardShortcuts({
    onRephrase: handleRephrase,
    onClear: handleClear,
    onCopy: handleCopy,
    disabled: isLoading,
  });

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background">
      <header className="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-4 border-b border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h1 className="text-lg font-semibold tracking-tight">HumanWrite</h1>
            </div>
            <StyleSelector value={style} onChange={setStyle} />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
            <IntensitySelector value={intensity} onChange={setIntensity} />
            <ModelSelector value={model} onChange={setModel} />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <section className="flex-1 flex flex-col min-h-[40vh] lg:min-h-0 lg:border-r border-border/50">
          <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 border-b border-border/30">
            <div className="label-badge">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Input
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="btn-secondary hidden sm:flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear
              </button>
              <button
                type="button"
                onClick={handleRephrase}
                disabled={!input.trim() || isLoading}
                className="btn-primary flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Rephrasing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Rephrase</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
            <Editor
              value={input}
              onChange={setInput}
              placeholder="Paste or type your text here. Press Cmd+Enter to rephrase..."
              className="h-full min-h-[200px]"
            />
          </div>
        </section>

        <section className="flex-1 flex flex-col min-h-[40vh] lg:min-h-0">
          <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 border-b border-border/30">
            <div className="label-badge">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Output
            </div>
            {output && (
              <button
                type="button"
                onClick={handleCopy}
                className={`btn-secondary flex items-center gap-1.5 ${copied ? 'active' : ''}`}
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            )}
          </div>
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
            <Editor
              value={output}
              readOnly
              placeholder={isLoading ? 'Crafting your rephrased text...' : 'Your rephrased text will appear here...'}
              className="h-full min-h-[200px]"
            />
          </div>
        </section>
      </main>

      <footer className="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-3 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-text/80">
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <span className="hidden sm:flex items-center gap-1.5">
              <kbd className="kbd">⌘</kbd><kbd className="kbd">Enter</kbd>
              <span className="opacity-60">Rephrase</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <kbd className="kbd">⌘</kbd><kbd className="kbd">X</kbd>
              <span className="opacity-60">Clear</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <kbd className="kbd">⌘</kbd><kbd className="kbd">Shift</kbd><kbd className="kbd">C</kbd>
              <span className="opacity-60">Copy</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
            <span>No data stored. Stateless processing.</span>
          </div>
        </div>
      </footer>

      {error && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-950/90 border border-red-500/30 text-red-300 text-sm backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="p-1 hover:bg-red-500/20 rounded">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}