import { useRef, useEffect } from 'react';
import type { ReactNode } from 'react';

interface EditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  children?: ReactNode;
  className?: string;
}

export function Editor({
  value,
  onChange,
  placeholder = '',
  readOnly = false,
  children,
  className = '',
}: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && !readOnly) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value, readOnly]);

  return (
    <div className={`editor-container ${className}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`textarea-editor scrollbar-thin p-5 ${readOnly ? 'cursor-default select-text' : ''}`}
        spellCheck={!readOnly}
      />
      {children}
    </div>
  );
}