import { useRef, useState, useEffect } from 'react';
import { STYLES } from '../types';
import type { StyleType } from '../types';

interface StyleSelectorProps {
  value: StyleType;
  onChange: (style: StyleType) => void;
}

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = STYLES.find((s) => s.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="dropdown flex items-center justify-between min-w-[160px]"
      >
        <span>{selected?.label}</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-100 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-surface border border-border rounded shadow-lg z-50 min-w-[220px] py-1">
          {STYLES.map((style) => (
            <button
              key={style.value}
              type="button"
              onClick={() => {
                onChange(style.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 transition-colors duration-100 ${
                value === style.value
                  ? 'bg-accent/10 text-primary-text'
                  : 'text-muted-text hover:text-primary-text hover:bg-surface'
              }`}
            >
              <div className="font-medium text-sm">{style.label}</div>
              <div className="text-xs opacity-70">{style.useCase}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}