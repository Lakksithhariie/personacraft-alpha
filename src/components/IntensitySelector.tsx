import { INTENSITIES } from '../types';
import type { IntensityType } from '../types';

interface IntensitySelectorProps {
  value: IntensityType;
  onChange: (intensity: IntensityType) => void;
}

export function IntensitySelector({ value, onChange }: IntensitySelectorProps) {
  return (
    <div className="flex items-center gap-0.5">
      {INTENSITIES.map((intensity) => (
        <button
          key={intensity.value}
          type="button"
          onClick={() => onChange(intensity.value)}
          className={`intensity-option ${value === intensity.value ? 'active' : ''}`}
        >
          {intensity.label}
        </button>
      ))}
    </div>
  );
}