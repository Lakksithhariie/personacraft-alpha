import { MODELS } from '../types';
import type { ModelType } from '../types';

interface ModelSelectorProps {
  value: ModelType;
  onChange: (model: ModelType) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <div className="segment-control">
      {MODELS.map((model) => (
        <button
          key={model.value}
          type="button"
          onClick={() => onChange(model.value)}
          className={`segment-option ${value === model.value ? 'active' : ''}`}
          title={model.description}
        >
          {model.label}
        </button>
      ))}
    </div>
  );
}