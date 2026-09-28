import { useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../atoms';
import { Field, errorId, hintId } from '../molecules';
import { fieldRegistry } from './fieldRegistry';
import { initialValues, isFieldVisible, visibleFields } from './visibility';
import type {
  FieldConfig,
  FieldValue,
  FormConfig,
  FormErrors,
  FormValues,
  ValidateFn,
} from './types';
import styles from './DynamicForm.module.css';

export interface DynamicFormProps {
  config: FormConfig;
  /**
   * Injected rather than imported. The form runs the rules; it does not own
   * them. That is what keeps this component reusable for a form that is not
   * about leads.
   */
  validate: ValidateFn;
  /** Receives the values of the VISIBLE fields only. */
  onSubmit: (values: FormValues) => void;
  submitLabel?: string;
  /** Prefix for generated DOM ids, so two forms can share one page. */
  idPrefix?: string;
}

/**
 * Renders one field per config entry and maps `type` to an atom via the
 * registry. It holds values, tracks which fields have been blurred, and
 * decides when an error is allowed to show — but it never decides what is
 * valid, and it contains no knowledge of any particular form's meaning.
 */
export function DynamicForm({
  config,
  validate,
  onSubmit,
  submitLabel = 'Submit',
  idPrefix = 'field',
}: DynamicFormProps) {
  const [values, setValues] = useState<FormValues>(() => initialValues(config));
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Pure: same config + same values always give the same errors, so there is
  // no error state to keep in sync. Recomputed per render, never stored.
  const errors: FormErrors = useMemo(
    () => validate(config, values),
    [config, validate, values],
  );

  const shown = visibleFields(config, values);
  const errorEntries = Object.entries(errors);
  const isValid = errorEntries.length === 0;

  const fieldId = (field: FieldConfig) => `${idPrefix}-${field.name}`;

  // A blurred field shows its own error immediately; a blocked submit
  // reveals all of them at once.
  const showErrorFor = (field: FieldConfig) =>
    Boolean(errors[field.name]) && (submitAttempted || touched[field.name]);

  const handleChange = (field: FieldConfig, value: FieldValue) => {
    setValues((previous) => ({ ...previous, [field.name]: value }));
  };

  const handleBlur = (field: FieldConfig) => {
    setTouched((previous) => ({ ...previous, [field.name]: true }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (!isValid) {
      // Send focus to the first field in config order that is in error, so
      // the user is not left hunting for it on a long form.
      const firstInvalid = shown.find((field) => errors[field.name]);
      if (firstInvalid) {
        const element = formRef.current?.querySelector<HTMLElement>(
          `#${CSS.escape(fieldId(firstInvalid))}`,
        );
        element?.focus();
      }
      return;
    }

    // Hidden fields keep their typed value in state so that toggling back
    // restores it, but they are not part of the submitted lead.
    const payload: FormValues = {};
    for (const field of shown) {
      payload[field.name] = values[field.name];
    }
    onSubmit(payload);
  };

  return (
    <form
      ref={formRef}
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className={styles.grid}>
        {config.map((field) => {
          if (!isFieldVisible(field, values)) return null;

          const id = fieldId(field);
          const hasError = showErrorFor(field);
          const describedBy =
            [field.hint ? hintId(id) : '', hasError ? errorId(id) : '']
              .filter(Boolean)
              .join(' ') || undefined;

          const renderControl = fieldRegistry[field.type];
          const isCheckbox = field.type === 'checkbox';
          const isRequired = Boolean(field.validations?.required);

          return (
            <div
              key={field.name}
              className={field.span === 'half' ? styles.half : styles.full}
            >
              <Field
                id={id}
                label={field.label}
                hint={field.hint}
                error={hasError ? errors[field.name] : undefined}
                required={isRequired}
                hideLabel={isCheckbox}
                showOptionalMarker={!isCheckbox && !isRequired}
              >
                {renderControl({
                  field,
                  id,
                  value: values[field.name],
                  invalid: hasError,
                  describedBy,
                  onChange: (value) => handleChange(field, value),
                  onBlur: () => handleBlur(field),
                })}
              </Field>
            </div>
          );
        })}
      </div>

      {submitAttempted && !isValid && (
        <div className={styles.summary} role="alert">
          <div className={styles.summaryTitle}>
            {errorEntries.length === 1
              ? 'Fix 1 field before submitting:'
              : `Fix ${errorEntries.length} fields before submitting:`}
          </div>
          <ul className={styles.summaryList}>
            {shown
              .filter((field) => errors[field.name])
              .map((field) => (
                <li key={field.name}>
                  {field.label}: {errors[field.name]}
                </li>
              ))}
          </ul>
        </div>
      )}

      <div className={styles.actions}>
        {/* Enabled until the first submit attempt, so a click is what
            reveals the errors. Once the user has seen them, the button is
            genuinely blocked until the form is valid. */}
        <Button type="submit" disabled={submitAttempted && !isValid}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
