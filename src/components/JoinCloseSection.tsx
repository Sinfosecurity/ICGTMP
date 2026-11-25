import { forwardRef } from 'react';
import { useJoin } from '../routes/JoinProvider';
import { WhatsAppJoinLink } from './WhatsAppJoinLink';

type Props = {
  /** Optional id for the heading (defaults for shared close). */
  titleId?: string;
};

/** Closing membership CTA — static markup shared by homepage and inner pages. */
export const JoinCloseSection = forwardRef<HTMLElement, Props>(function JoinCloseSection(
  { titleId = 'join-close-title' },
  ref,
) {
  const onJoin = useJoin();

  return (
    <section ref={ref} className="cineClose" aria-labelledby={titleId}>
      <div className="cineCloseInner cineReveal">
        <p className="sectionKicker">Membership</p>
        <h2 id={titleId}>Join ICGMTP today</h2>
        <p>
          Register your interest by LGA, trade and membership category — or join the public
          WhatsApp group.
        </p>
        <div className="cineCloseActions">
          <button type="button" className="goldPill" data-join-trigger onClick={() => onJoin()}>
            Join ICGMTP <span aria-hidden="true">→</span>
          </button>
          <WhatsAppJoinLink className="cineWhatsApp" />
        </div>
      </div>
    </section>
  );
});
