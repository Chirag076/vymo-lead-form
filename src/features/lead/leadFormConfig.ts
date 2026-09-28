import type { FormConfig } from '../../design-system/form';

/**
 * The lead capture form, described as data.
 *
 * Adding a field to the screen means adding an entry here — no JSX, no
 * change to the renderer, no change to an atom. Because every entry is
 * serialisable, this array could just as well arrive from an API.
 */
export const leadFormConfig: FormConfig = [
  {
    name: 'fullName',
    type: 'text',
    label: 'Full name',
    placeholder: 'Priya Sharma',
    span: 'half',
    validations: { required: true },
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'priya@acme.com',
    span: 'half',
    validations: { required: true, email: true },
  },
  {
    name: 'leadType',
    type: 'select',
    label: 'Lead type',
    placeholder: 'Select lead type',
    span: 'half',
    options: [
      { label: 'Individual', value: 'individual' },
      { label: 'Company', value: 'company' },
    ],
    validations: { required: true },
  },
  {
    // Rendered only when Lead type is Company, and required only then.
    // Both behaviours come from this one `visibleWhen` rule.
    name: 'companyName',
    type: 'text',
    label: 'Company name',
    placeholder: 'Acme Technologies Pvt Ltd',
    span: 'half',
    visibleWhen: { field: 'leadType', equals: 'company' },
    validations: { required: true },
  },
  {
    name: 'phone',
    type: 'text',
    label: 'Phone',
    placeholder: '9876543210',
    hint: '10 digits, without the country code.',
    span: 'half',
    validations: { required: true, exactDigits: 10 },
  },
  {
    name: 'notes',
    type: 'textarea',
    label: 'Notes',
    placeholder: 'Anything useful about this lead.',
    hint: 'Up to 200 characters.',
    span: 'full',
    validations: { maxLength: 200 },
  },
  {
    name: 'consent',
    type: 'checkbox',
    label: 'I agree to be contacted about this enquiry.',
    span: 'full',
    validations: { required: true },
  },
];
