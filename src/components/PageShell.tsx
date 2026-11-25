import type { ReactNode } from 'react';

type Props = {
  kicker?: string;
  title: string;
  children: ReactNode;
};

export function PageShell({ kicker, title, children }: Props) {
  return (
    <main className="innerPage">
      <header className="innerHero">
        <div className="innerHeroInner">
          {kicker ? <p className="innerKicker">{kicker}</p> : null}
          <h1>{title}</h1>
        </div>
      </header>
      <div className="innerBody">{children}</div>
    </main>
  );
}
