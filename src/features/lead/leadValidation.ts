import { isFieldVisible } from '../../design-system/form';
import type {
  FieldConfig,
  FieldValue,
  FormConfig,
  FormErrors,
  FormValues,
} from '../../design-system/form';

/**
 * Every rule for this form lives here.
 *
 * `validateLeadForm` is a pure function of (config, values): no React, no
 * DOM, no state, no side effects. The same inputs always give the same
 * errors, which is why the form can call it on every render instead of
 * keeping a second copy of the truth in state — and why it is testable
 * without mounting a component.
 *
 * No atom and no molecule imports this file. They render the error they are
 * handed; they never work one out.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const asText = (value: FieldValue | undefined): string =>
  typeof value === 'string' ? value : '';

const isBlank = (field: FieldConfig, value: FieldValue | undefined): boolean =>
  field.type === 'checkbox' ? value !== true : asText(value).trim() === '';

const requiredMessage = (field: FieldConfig): string => {
  if (field.type === 'checkbox') return 'Please tick this box to continue.';
  if (field.type === 'select') return `Select a ${field.label.toLowerCase()}.`;
  return `${field.label} is required.`;
};

/** Returns the first message for a field, or undefined if it passes. */
function validateField(
  field: FieldConfig,
  value: FieldValue | undefined,
): string | undefined {
  const rules = field.validations;
  if (!rules) return undefined;

  if (rules.required && isBlank(field, value)) {
    return requiredMessage(field);
  }

  // Past this point an empty optional field has nothing left to check.
  const text = asText(value).trim();
  if (text === '') return undefined;

  if (rules.email && !EMAIL_PATTERN.test(text)) {
    return 'Enter a valid email address.';
  }

  if (rules.exactDigits !== undefined) {
    const digitsOnly = text.replace(/[\s-]/g, '');
    if (!/^\d+$/.test(digitsOnly) || digitsOnly.length !== rules.exactDigits) {
      return `Enter exactly ${rules.exactDigits} digits.`;
    }
  }

  if (rules.minLength !== undefined && text.length < rules.minLength) {
    return `Use at least ${rules.minLength} characters.`;
  }

  if (rules.maxLength !== undefined && text.length > rules.maxLength) {
    return `Keep this under ${rules.maxLength} characters (currently ${text.length}).`;
  }

  return undefined;
}

/**
 * Validates the whole form.
 *
 * Hidden fields are skipped entirely, which is what makes "Company name is
 * required only when it is visible" fall out of the same `visibleWhen` rule
 * that decides whether it renders — rather than being a second rule that can
 * drift out of step with the first.
 */
export function validateLeadForm(
  config: FormConfig,
  values: FormValues,
): FormErrors {
  const errors: FormErrors = {};

  for (const field of config) {
    if (!isFieldVisible(field, values)) continue;

    const message = validateField(field, values[field.name]);
    if (message) errors[field.name] = message;
  }

  return errors;
}
