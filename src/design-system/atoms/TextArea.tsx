import type { BaseControlProps } from './types';
import styles from './TextArea.module.css';

export interface TextAreaProps extends BaseControlProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function TextArea({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  rows = 4,
  invalid = false,
  describedBy,
  disabled,
}: TextAreaProps) {
  return (
    <textarea
      id={id}
      name={name}
      rows={rows}
      className={
        invalid ? `${styles.textarea} ${styles.invalid}` : styles.textarea
      }
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      aria-label={label}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
    />
  );
}
