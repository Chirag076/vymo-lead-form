import { describe, expect, it } from 'vitest';
import { initialValues } from '../../design-system/form';
import type { FormValues } from '../../design-system/form';
import { leadFormConfig } from './leadFormConfig';
import { validateLeadForm } from './leadValidation';

const base = (overrides: FormValues = {}): FormValues => ({
  ...initialValues(leadFormConfig),
  ...overrides,
});

const valid = (overrides: FormValues = {}): FormValues =>
  base({
    fullName: 'Priya Sharma',
    email: 'priya@acme.com',
    leadType: 'individual',
    phone: '9876543210',
    notes: '',
    consent: true,
    ...overrides,
  });

const validate = (values: FormValues) =>
  validateLeadForm(leadFormConfig, values);

describe('validateLeadForm', () => {
  it('reports every required field on an untouched form', () => {
    const errors = validate(base());
    expect(Object.keys(errors).sort()).toEqual([
      'consent',
      'email',
      'fullName',
      'leadType',
      'phone',
    ]);
  });

  it('returns no errors for a complete individual lead', () => {
    expect(validate(valid())).toEqual({});
  });

  describe('conditional company name', () => {
    it('is not required while the field is hidden', () => {
      const errors = validate(valid({ leadType: 'individual' }));
      expect(errors.companyName).toBeUndefined();
    });

    it('becomes required as soon as the lead type is company', () => {
      const errors = validate(valid({ leadType: 'company' }));
      expect(errors.companyName).toBe('Company name is required.');
    });

    it('passes once the company name is filled in', () => {
      const errors = validate(
        valid({ leadType: 'company', companyName: 'Acme Pvt Ltd' }),
      );
      expect(errors).toEqual({});
    });

    it('ignores a stale value left behind after switching back', () => {
      const errors = validate(
        valid({ leadType: 'individual', companyName: '' }),
      );
      expect(errors).toEqual({});
    });
  });

  describe('email', () => {
    it.each(['not-an-email', 'missing@domain', 'no-at.example.com', 'a@b.c '])(
      'rejects %j',
      (email) => {
        expect(validate(valid({ email })).email).toBe(
          'Enter a valid email address.',
        );
      },
    );

    it('accepts a normal address', () => {
      expect(validate(valid({ email: 'chirag+lead@acme.co.in' })).email)
        .toBeUndefined();
    });
  });

  describe('phone', () => {
    it.each(['12345', '98765432101', '98765abcde'])(
      'rejects %j',
      (phone) => {
        expect(validate(valid({ phone })).phone).toBe(
          'Enter exactly 10 digits.',
        );
      },
    );

    it('accepts 10 digits written with spaces or dashes', () => {
      expect(validate(valid({ phone: '98765 43210' })).phone).toBeUndefined();
      expect(validate(valid({ phone: '98765-43210' })).phone).toBeUndefined();
    });
  });

  describe('notes', () => {
    it('is optional', () => {
      expect(validate(valid({ notes: '' })).notes).toBeUndefined();
    });

    it('accepts exactly 200 characters', () => {
      expect(validate(valid({ notes: 'x'.repeat(200) })).notes).toBeUndefined();
    });

    it('rejects 201 characters', () => {
      expect(validate(valid({ notes: 'x'.repeat(201) })).notes).toBe(
        'Keep this under 200 characters (currently 201).',
      );
    });
  });

  describe('consent', () => {
    it('is an error while unticked', () => {
      expect(validate(valid({ consent: false })).consent).toBe(
        'Please tick this box to continue.',
      );
    });
  });

  it('treats whitespace-only text as empty', () => {
    expect(validate(valid({ fullName: '   ' })).fullName).toBe(
      'Full name is required.',
    );
  });

  it('is pure: repeated calls agree and the input is not mutated', () => {
    const values = valid({ leadType: 'company' });
    const snapshot = structuredClone(values);

    expect(validate(values)).toEqual(validate(values));
    expect(values).toEqual(snapshot);
  });
});
