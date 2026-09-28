# Lead capture — dynamic form and design system

A lead capture screen that renders itself from a config array, built on a
small design system. React + TypeScript + CSS Modules. No component library
and no form library.

## Install and run

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # typecheck (tsc -b) then production build
npm run preview    # serve the production build
npm test           # unit tests for the validation rules
```

Node 20 or newer.

## Folder layout

```
src/
├── design-system/              generic, knows nothing about leads
│   ├── tokens/
│   │   ├── tokens.css          colour, spacing, type, radius (CSS custom properties)
│   │   └── breakpoints.ts      breakpoint values, mirrored in the two layout stylesheets
│   ├── atoms/
│   │   ├── TextInput.tsx       text / email / tel
│   │   ├── TextArea.tsx
│   │   ├── Select.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Button.tsx
│   │   └── types.ts            props every control shares
│   ├── molecules/
│   │   └── Field.tsx           label + control + hint + error
│   └── form/
│       ├── types.ts            FieldConfig, FormValues, FormErrors, ValidateFn
│       ├── fieldRegistry.tsx   field type -> atom
│       ├── visibility.ts       conditional fields + initial values
│       ├── DynamicForm.tsx     renders one field per config entry
│       └── DynamicForm.module.css
└── features/lead/              everything lead-specific
    ├── leadFormConfig.ts       the seven fields, as data
    ├── leadValidation.ts       the rules
    ├── leadValidation.test.ts
    ├── LeadFormPage.tsx        the page
    └── LeadFormPage.module.css
```

The split is the point: nothing under `design-system/` imports from
`features/`, so the same form engine would render a different config without
a change.

## Where things live

| | |
|---|---|
| **Tokens** | `design-system/tokens/tokens.css` — every colour and gap in the app resolves to a variable declared here. `breakpoints.ts` holds the two breakpoint values. |
| **Atoms** | `design-system/atoms/` — each takes a value, a label and event handlers. They render an error state when told to; they never work one out. |
| **Field molecule** | `design-system/molecules/Field.tsx` — label, control, hint, error, and the `aria-describedby` wiring between them. |
| **The form** | `design-system/form/DynamicForm.tsx` — holds values, tracks blur, decides when an error may show, and maps each config entry to an atom through `fieldRegistry.tsx`. |
| **The config** | `features/lead/leadFormConfig.ts` |
| **The validation rules** | `features/lead/leadValidation.ts` |

## Layout ownership

Two files, deliberately split by what they describe:

- **`design-system/form/DynamicForm.module.css`** owns the *form* layout: the
  field grid, the desktop two-column arrangement, and the sticky submit bar
  on a phone.
- **`features/lead/LeadFormPage.module.css`** owns the *page* shell:
  background, page gutters, max width, the card, and the header.

Breakpoints, matching `tokens/breakpoints.ts`:

| Width | Layout |
|---|---|
| `< 768px` | One column, full-width inputs, submit sticks to the bottom of the viewport |
| `768–1023px` | Inherits the mobile layout, as the brief allows |
| `>= 1024px` | Two columns; a field's `span` in the config decides whether it takes one column or both |

The page passes `--form-gutter` to the form so the sticky bar can bleed out
to the card's padding without the form knowing the page's dimensions.

## Adding a field

Add an entry to `leadFormConfig.ts`. Nothing else changes — not the renderer,
not an atom, not the validation module.

```ts
{
  name: 'jobTitle',
  type: 'text',
  label: 'Job title',
  span: 'half',
  validations: { required: true, maxLength: 80 },
  visibleWhen: { field: 'leadType', equals: 'company' },
}
```

Adding a new *control type* means adding one key to `fieldRegistry.tsx`. The
`FieldType` union makes the registry exhaustive, so TypeScript fails the
build until the new type has a renderer.

## Decisions worth flagging

**The config is data, not code.** `visibleWhen` and `validations` are plain
objects rather than callbacks, so a config stays serialisable and could
arrive from an API. The cost is a small interpreter in `leadValidation.ts`;
the benefit is that the config never has to import anything.

**Validation is a pure function of `(config, values)`.** It holds no state,
touches no DOM and is injected into `DynamicForm` as a prop rather than
imported by it. That is what keeps the form reusable and the rules testable
without mounting a component — `leadValidation.test.ts` covers them directly.
Because it is pure, the form recomputes errors on each render instead of
keeping a second copy of the truth in state.

**One source of truth for visibility.** `isFieldVisible` decides both what
renders and what gets validated, so "Company name is required only when it is
visible" falls out of the same rule that shows the field, instead of being a
second rule that can drift out of step.

**Hidden fields keep their value but are not submitted.** Switch to Company,
type a name, switch back to Individual, and the typed value is still there if
you switch again — but `onSubmit` receives only the visible fields, so a
stale company name can never reach the payload.

**The submit button is enabled until the first attempt.** A permanently
disabled button gives a user nothing to act on: the click is what reveals the
errors. After a blocked attempt, all errors are shown, focus moves to the
first invalid field, a summary lists everything outstanding, and *then* the
button is genuinely disabled until the form is valid.

**Overflow is designed against, not patched.** Grid tracks are
`minmax(0, 1fr)` and fields carry `min-width: 0`, because a grid track
defaults to min-content and a long unbroken string will otherwise widen the
column and push the page sideways. Error text uses `overflow-wrap: anywhere`.

## Tests

`npm test` — 21 unit tests over the validation module: required fields, the
conditional company name in both states, email and 10-digit phone formats
(including spaced and dashed input), the 200-character notes boundary at 200
and 201, consent, whitespace-only input, and that the function is pure and
does not mutate its input.

Responsiveness was checked in a headless browser at 1440, 768 and 390 px:
column counts, full-width inputs, no horizontal overflow, the sticky bar
settling into flow rather than covering the consent box at full scroll, and
the blocked-submit behaviour end to end.

## Out of scope

No backend, no auth, no routing, no third-party form library, no Storybook,
and no control types beyond the five in the brief.
