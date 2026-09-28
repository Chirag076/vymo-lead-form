/**
 * Props shared by every control atom.
 *
 * Atoms are deliberately generic: they receive a value, a label and event
 * handlers. They know nothing about leads, nothing about validation rules
 * and nothing about the form they sit in. `invalid` is a presentational
 * flag — the atom renders an error state, it never decides one.
 */
export interface BaseControlProps {
  /** DOM id, used by the field molecule to wire up <label for>. */
  id: string;
  /** Form field name, submitted with the value. */
  name: string;
  /** Accessible label. The molecule usually renders this visually. */
  label: string;
  /** Renders the error state. The atom does not decide what is invalid. */
  invalid?: boolean;
  /** ids of the hint/error nodes that describe this control. */
  describedBy?: string;
  disabled?: boolean;
  onBlur?: () => void;
}
