import { Link } from 'react-router-dom';
import { SITE } from '../config/site';

export const CONSENT_ERROR = 'Please tick the consent box to continue.';

type Props = {
  id: string;
  checked: boolean;
  error?: string;
  onChange: (checked: boolean) => void;
  onNavigate?: () => void;
};

export function ConsentField({ id, checked, error, onChange, onNavigate }: Props) {
  return (
    <div className="consentField wideField">
      <input
        id={id}
        name="consent"
        type="checkbox"
        checked={checked}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label htmlFor={id}>
        I agree that {SITE.registeredName} ({SITE.name}) may store my details, including my political
        affiliation, to contact me about campaign activities. I can ask for my data to be deleted at
        any time. Read the{' '}
        <Link
          to="/privacy"
          onMouseDown={(event) => event.preventDefault()}
          onClick={onNavigate}
        >
          Privacy Policy
        </Link>
        .
      </label>
      {error ? (
        <em className="fieldError" id={`${id}-error`}>
          {error}
        </em>
      ) : null}
    </div>
  );
}
