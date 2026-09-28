import type { ReactElement } from 'react';
import { Checkbox, Select, TextArea, TextInput } from '../atoms';
import type { FieldConfig, FieldType, FieldValue } from './types';

/**
 * What the form hands a control renderer. Note there is nothing lead-shaped
 * here: a renderer sees a config entry, a value and two callbacks.
 */
export interface ControlRenderProps {
  field: FieldConfig;
  id: string;
  value: FieldValue;
  invalid: boolean;
  describedBy?: string;
  onChange: (value: FieldValue) => void;
  onBlur: () => void;
}

export type ControlRenderer = (props: ControlRenderProps) => ReactElement;

const asText = (value: FieldValue) => (typeof value === 'string' ? value : '');
const asBool = (value: FieldValue) =>
  typeof value === 'boolean' ? value : false;

/**
 * type -> atom.
 *
 * This map is the whole extension point for new control types: add a key
 * here and the type becomes usable from any config. Nothing else changes.
 */
export const fieldRegistry: Record<FieldType, ControlRenderer> = {
  text: ({ field, id, value, invalid, describedBy, onChange, onBlur }) => (
    <TextInput
      id={id}
      name={field.name}
      label={field.label}
      type="text"
      inputMode={field.validations?.exactDigits ? 'numeric' : undefined}
      placeholder={field.placeholder}
      value={asText(value)}
      invalid={invalid}
      describedBy={describedBy}
      onChange={onChange}
      onBlur={onBlur}
    />
  ),

  email: ({ field, id, value, invalid, describedBy, onChange, onBlur }) => (
    <TextInput
      id={id}
      name={field.name}
      label={field.label}
      type="email"
      inputMode="email"
      placeholder={field.placeholder}
      value={asText(value)}
      invalid={invalid}
      describedBy={describedBy}
      onChange={onChange}
      onBlur={onBlur}
    />
  ),

  select: ({ field, id, value, invalid, describedBy, onChange, onBlur }) => (
    <Select
      id={id}
      name={field.name}
      label={field.label}
      options={field.options ?? []}
      placeholder={field.placeholder}
      value={asText(value)}
      invalid={invalid}
      describedBy={describedBy}
      onChange={onChange}
      onBlur={onBlur}
    />
  ),

  textarea: ({ field, id, value, invalid, describedBy, onChange, onBlur }) => (
    <TextArea
      id={id}
      name={field.name}
      label={field.label}
      placeholder={field.placeholder}
      value={asText(value)}
      invalid={invalid}
      describedBy={describedBy}
      onChange={onChange}
      onBlur={onBlur}
    />
  ),

  checkbox: ({ field, id, value, invalid, describedBy, onChange, onBlur }) => (
    <Checkbox
      id={id}
      name={field.name}
      label={field.label}
      checked={asBool(value)}
      invalid={invalid}
      describedBy={describedBy}
      onChange={onChange}
      onBlur={onBlur}
    />
  ),
};
