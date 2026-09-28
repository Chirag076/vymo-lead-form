/**
 * Breakpoint tokens.
 *
 * CSS media queries cannot read CSS custom properties, so the breakpoint
 * values are declared here as the single source of truth and repeated
 * literally in the two stylesheets that own layout:
 *   - design-system/form/DynamicForm.module.css
 *   - features/lead/LeadFormPage.module.css
 *
 * Exported so JS/TS (and tests) can reference the same numbers.
 */
export const breakpoints = {
  /** Phone layout applies below this width. */
  mobileMax: 768,
  /** Two-column desktop layout applies above this width. */
  desktopMin: 1024,
} as const;

export type Breakpoint = keyof typeof breakpoints;
