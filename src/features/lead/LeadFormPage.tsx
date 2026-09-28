import { useState } from 'react';
import { DynamicForm } from '../../design-system/form';
import type { FormValues } from '../../design-system/form';
import { leadFormConfig } from './leadFormConfig';
import { validateLeadForm } from './leadValidation';
import styles from './LeadFormPage.module.css';

/**
 * The lead capture screen.
 *
 * Its whole job is to hand the form a config and a rule set and to decide
 * what happens on a successful submit. There is no field-by-field JSX here:
 * the fields come from leadFormConfig.
 */
export function LeadFormPage() {
  const [submitted, setSubmitted] = useState<FormValues | null>(null);

  const handleSubmit = (values: FormValues) => {
    // The brief asks for the values printed or shown. Do both.
    console.log('Lead submitted:', values);
    setSubmitted(values);
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>New lead</h1>
          <p className={styles.subtitle}>
            Fields marked * are required. Company name appears once the lead
            type is set to Company.
          </p>
        </header>

        <div className={styles.card}>
          <DynamicForm
            config={leadFormConfig}
            validate={validateLeadForm}
            onSubmit={handleSubmit}
            submitLabel="Save lead"
            idPrefix="lead"
          />
        </div>

        {submitted && (
          <section className={styles.result} aria-live="polite">
            <h2 className={styles.resultTitle}>Submitted values</h2>
            <pre className={styles.resultBody}>
              {JSON.stringify(submitted, null, 2)}
            </pre>
          </section>
        )}
      </div>
    </main>
  );
}
