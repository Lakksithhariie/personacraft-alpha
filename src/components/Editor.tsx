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
    <div className={`editor-surface relative flex flex-col h-full ${className}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`textarea-editor scrollbar-thin p-4 ${readOnly ? 'cursor-default' : ''}`}
        spellCheck={!readOnly}
      />
      {children && (
        <div className="absolute bottom-3 right-3 flex items-center gap-2">{children}</div>
      )}
    </div>
  );
}