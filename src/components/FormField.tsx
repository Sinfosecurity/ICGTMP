import { cloneElement, type ReactElement } from 'react';

type Control = ReactElement<{
  id?: string;
  required?: boolean;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}>;

type Props = {
  /** Also the id of the control, so the error summary can link straight to it. */
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  /** Spans both columns in the two-column modal grid. */
  wide?: boolean;
  children: Control;
};

export const fieldErrorId = (id: string) => `${id}-error`;
export const fieldHintId = (id: string) => `${id}-hint`;

/**
 * The single place label, hint, error text and ARIA wiring are joined up.
 * Every form on the site uses it, so a field cannot end up half-labelled.
 */
export function FormField({ id, label, hint, error, required, wide, children }: Props) {
  const errorId = error ? fieldErrorId(id) : undefined;
  const hintId = hint && !error ? fieldHintId(id) : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ');

  return (
    <label className={wide ? 'wideField' : undefined} htmlFor={id}>
      <span className="fieldLabel">
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="req">
              *
            </span>
            <span className="srOnly"> (required)</span>
          </>
        ) : null}
      </span>
      <span className="fieldControl">
        {cloneElement(children, {
          id,
          required,
          'aria-invalid': error ? true : undefined,
          'aria-describedby': describedBy || undefined,
        })}
        {error ? (
          <em className="fieldError" id={errorId}>
            {error}
          </em>
        ) : null}
        {hintId ? (
          <span className="fieldHint" id={hintId}>
            {hint}
          </span>
        ) : null}
      </span>
    </label>
  );
}
