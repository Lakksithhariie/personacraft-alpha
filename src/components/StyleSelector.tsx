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
        className="dropdown-trigger min-w-[150px]"
      >
        <span className="font-medium">{selected?.label}</span>
        <svg
          className={`w-4 h-4 text-muted-text transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown-menu min-w-[240px] py-2">
          {STYLES.map((style) => (
            <button
              key={style.value}
              type="button"
              onClick={() => {
                onChange(style.value);
                setIsOpen(false);
              }}
              className={`dropdown-item ${value === style.value ? 'selected' : ''}`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">{style.label}</span>
                <span className="text-xs opacity-60">{style.useCase}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}