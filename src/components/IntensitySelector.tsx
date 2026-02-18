import { INTENSITIES } from '../types';
import type { IntensityType } from '../types';

interface IntensitySelectorProps {
  value: IntensityType;
  onChange: (intensity: IntensityType) => void;
}

export function IntensitySelector({ value, onChange }: IntensitySelectorProps) {
  return (
    <div className="segment-control">
      {INTENSITIES.map((intensity) => (
        <button
          key={intensity.value}
          type="button"
          onClick={() => onChange(intensity.value)}
          className={`segment-option ${value === intensity.value ? 'active' : ''}`}
        >
          {intensity.label}
        </button>
      ))}
    </div>
  );
}