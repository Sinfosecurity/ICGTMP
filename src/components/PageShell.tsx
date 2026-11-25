import type { ReactNode } from 'react';
import { JoinCloseSection } from './JoinCloseSection';

type Props = {
  kicker?: string;
  title: string;
  children: ReactNode;
  /** When false, skip the closing Join CTA (rare). Default true. */
  showJoinClose?: boolean;
};

export function PageShell({ kicker, title, children, showJoinClose = true }: Props) {
  return (
    <main className="innerPage">
      <header className="innerHero">
        <div className="innerHeroInner">
          {kicker ? <p className="innerKicker">{kicker}</p> : null}
          <h1>{title}</h1>
        </div>
      </header>
      <div className="innerBody">{children}</div>
      {showJoinClose ? <JoinCloseSection /> : null}
    </main>
  );
}
