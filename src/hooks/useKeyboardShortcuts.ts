import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
  onRephrase: () => void;
  onClear: () => void;
  onCopy: () => void;
  disabled?: boolean;
}

export function useKeyboardShortcuts({
  onRephrase,
  onClear,
  onCopy,
  disabled,
}: KeyboardShortcuts): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) return;

      const isMeta = event.metaKey || event.ctrlKey;

      if (isMeta && event.key === 'Enter') {
        event.preventDefault();
        onRephrase();
        return;
      }

      if (isMeta && event.key === 'x' && !event.shiftKey) {
        event.preventDefault();
        onClear();
        return;
      }

      if (isMeta && event.shiftKey && event.key.toLowerCase() === 'c') {
        event.preventDefault();
        onCopy();
        return;
      }
    },
    [onRephrase, onClear, onCopy, disabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}