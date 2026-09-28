import type { BaseControlProps } from './types';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends BaseControlProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * The one atom that renders its own label, because a checkbox label belongs
 * beside the box rather than above it. The field molecule knows this and
 * suppresses its own label for this control.
 */
export function Checkbox({
  id,
  name,
  label,
  checked,
  onChange,
  onBlur,
  invalid = false,
  describedBy,
  disabled,
}: CheckboxProps) {
  const className = [
    styles.row,
    invalid ? styles.invalid : '',
    disabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={className} htmlFor={id}>
      <input
        id={id}
        name={name}
        type="checkbox"
        className={styles.native}
        checked={checked}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.checked)}
        onBlur={onBlur}
      />
      <span className={styles.box} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </label>
  );
}
