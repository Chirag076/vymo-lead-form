import type { BaseControlProps } from './types';
import styles from './Select.module.css';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends BaseControlProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  /** Shown as the empty first entry. */
  placeholder?: string;
}

export function Select({
  id,
  name,
  label,
  value,
  options,
  onChange,
  onBlur,
  placeholder = 'Select an option',
  invalid = false,
  describedBy,
  disabled,
}: SelectProps) {
  const className = [
    styles.select,
    invalid ? styles.invalid : '',
    value === '' ? styles.placeholder : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={styles.wrapper}>
      <select
        id={id}
        name={name}
        className={className}
        value={value}
        disabled={disabled}
        aria-label={label}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className={styles.chevron} aria-hidden="true" />
    </span>
  );
}
