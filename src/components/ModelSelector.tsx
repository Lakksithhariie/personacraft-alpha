import { MODELS } from '../types';
import type { ModelType } from '../types';

interface ModelSelectorProps {
  value: ModelType;
  onChange: (model: ModelType) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-surface border border-border rounded p-0.5">
      {MODELS.map((model) => (
        <button
          key={model.value}
          type="button"
          onClick={() => onChange(model.value)}
          className={`px-3 py-1.5 text-sm rounded transition-all duration-100 ${
            value === model.value
              ? 'bg-accent text-white'
              : 'text-muted-text hover:text-primary-text'
          }`}
          title={model.description}
        >
          {model.label}
        </button>
      ))}
    </div>
  );
}