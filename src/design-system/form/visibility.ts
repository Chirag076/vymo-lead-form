import type { FieldConfig, FormConfig, FormValues } from './types';

/**
 * Whether a field should render, given the current values.
 *
 * This is the single source of truth for visibility. The renderer uses it to
 * decide what to draw and the validation module uses it to decide what to
 * check, so a hidden field can never produce an error the user cannot see.
 */
export function isFieldVisible(
  field: FieldConfig,
  values: FormValues,
): boolean {
  if (!field.visibleWhen) return true;
  return values[field.visibleWhen.field] === field.visibleWhen.equals;
}

/** The subset of the config that should render for these values. */
export function visibleFields(
  config: FormConfig,
  values: FormValues,
): FieldConfig[] {
  return config.filter((field) => isFieldVisible(field, values));
}

/**
 * Empty values derived from the config: `false` for checkboxes, `''` for
 * everything else. Adding a field to the config adds it here automatically.
 */
export function initialValues(config: FormConfig): FormValues {
  const values: FormValues = {};
  for (const field of config) {
    values[field.name] = field.type === 'checkbox' ? false : '';
  }
  return values;
}
