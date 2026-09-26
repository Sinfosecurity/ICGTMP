import type { RefObject } from 'react';

export type SummaryItem = {
  /** The id of the control this problem belongs to. */
  id: string;
  message: string;
};

type Props = {
  items: SummaryItem[];
  summaryRef: RefObject<HTMLDivElement | null>;
  className?: string;
};

/**
 * The standard accessible pattern: on a failed submit, focus goes to a list of
 * what is wrong rather than to a single field, so the visitor learns how many
 * problems there are before being dropped into one of them. Each entry moves
 * focus to its control.
 */
export function ErrorSummary({ items, summaryRef, className }: Props) {
  if (!items.length) return null;

  return (
    <div
      className={className ? `errorSummary ${className}` : 'errorSummary'}
      ref={summaryRef}
      role="alert"
      tabIndex={-1}
    >
      <p>
        <strong>
          {items.length === 1
            ? 'There is 1 problem with this form'
            : `There are ${items.length} problems with this form`}
        </strong>
      </p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(event) => {
                event.preventDefault();
                // App.tsx delegates every in-page "#..." link to the router.
                // Without this the summary would navigate to a dead route.
                event.stopPropagation();
                document.getElementById(item.id)?.focus();
              }}
            >
              {item.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
