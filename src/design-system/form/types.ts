/**
 * The config contract.
 *
 * Every entry is plain, serialisable data — no functions, no JSX, no imports
 * from a feature. That is deliberate: a config could be fetched from an API
 * or stored as JSON without changing a line of the form renderer.
 */

/** The control types this design system can render. */
export type FieldType = 'text' | 'email' | 'select' | 'textarea' | 'checkbox';

/** Checkboxes hold booleans; every other control holds a string. */
export type FieldValue = string | boolean;

export type FormValues = Record<string, FieldValue>;

/** Field name -> the single message shown under that field. */
export type FormErrors = Record<string, string>;

export interface SelectOption {
  label: string;
  value: string;
}

/**
 * Declarative validation rules. The rules are *described* here and
 * *interpreted* by the feature's validation module, which keeps the
 * interpretation in one place instead of scattered across components.
 */
export interface ValidationRules {
  required?: boolean;
  /** Must look like an email address. */
  email?: boolean;
  /** Must be exactly this many digits, ignoring spaces and dashes. */
  exactDigits?: number;
  maxLength?: number;
  minLength?: number;
}

/**
 * Conditional visibility, expressed as data rather than a callback so the
 * config stays serialisable.
 */
export interface VisibilityRule {
  /** Name of the field this one depends on. */
  field: string;
  /** This field is shown when that field holds this value. */
  equals: FieldValue;
}

export interface FieldConfig {
  /** Unique key within a form. Also the key in FormValues and FormErrors. */
  name: string;
  type: FieldType;
  label: string;
  hint?: string;
  placeholder?: string;
  /** Required for `select`, ignored otherwise. */
  options?: SelectOption[];
  /** Desktop column width. Ignored below 1024px, where everything is full. */
  span?: 'half' | 'full';
  validations?: ValidationRules;
  /** When present, the field renders only if the rule matches. */
  visibleWhen?: VisibilityRule;
}

export type FormConfig = readonly FieldConfig[];

/** The signature every validation module must satisfy. */
export type ValidateFn = (config: FormConfig, values: FormValues) => FormErrors;
