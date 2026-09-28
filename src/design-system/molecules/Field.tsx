import type { ReactNode } from 'react';
import styles from './Field.module.css';

export interface FieldProps {
  /** Must match the id of the control rendered as children. */
  id: string;
  label: string;
  children: ReactNode;
  hint?: string;
  /** Rendered under the control. Presentational only — the molecule does
   *  not decide whether a value is valid. */
  error?: string;
  required?: boolean;
  /** Set when the control renders its own label, e.g. a checkbox. */
  hideLabel?: boolean;
  /** Adds an "optional" marker next to the label. */
  showOptionalMarker?: boolean;
}

/** id of the hint node for a field, so controls can point at it. */
export const hintId = (id: string) => `${id}-hint`;
/** id of the error node for a field, so controls can point at it. */
export const errorId = (id: string) => `${id}-error`;

/**
 * Label + control + hint + error.
 *
 * Owns the vertical rhythm of a single field and the wiring between the
 * control and its descriptive text. It knows nothing about what the field
 * means or which rules apply to it.
 */
export function Field({
  id,
  label,
  children,
  hint,
  error,
  required = false,
  hideLabel = false,
  showOptionalMarker = false,
}: FieldProps) {
  return (
    <div className={styles.field}>
      {!hideLabel && (
        <label className={styles.label} htmlFor={id}>
          {label}
          {required && (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          )}
          {showOptionalMarker && !required && (
            <span className={styles.optional}>optional</span>
          )}
        </label>
      )}

      {children}

      {hint && (
        <span className={styles.hint} id={hintId(id)}>
          {hint}
        </span>
      )}

      {error && (
        <span className={styles.error} id={errorId(id)} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
