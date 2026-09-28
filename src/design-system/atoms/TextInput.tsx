import type { BaseControlProps } from './types';
import styles from './TextInput.module.css';

export interface TextInputProps extends BaseControlProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Native input type. The form decides this from the field config. */
  type?: 'text' | 'email' | 'tel';
  inputMode?: 'text' | 'email' | 'numeric' | 'tel';
  maxLength?: number;
}

export function TextInput({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
  inputMode,
  maxLength,
  invalid = false,
  describedBy,
  disabled,
}: TextInputProps) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      inputMode={inputMode}
      className={invalid ? `${styles.input} ${styles.invalid}` : styles.input}
      value={value}
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
      aria-label={label}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
    />
  );
}
