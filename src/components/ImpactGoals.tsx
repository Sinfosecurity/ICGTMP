import { BarChart3, IdCard, Network, ShieldCheck, Users } from 'lucide-react';
import { goals } from '../data/goals';

const icons = {
  users: Users,
  id: IdCard,
  chart: BarChart3,
  shield: ShieldCheck,
  network: Network,
};

export function ImpactGoals() {
  return (
    <section className="impactStrip" aria-label="Our impact goals">
      <div className="impactTitle">
        OUR IMPACT
        <br />
        GOALS
      </div>
      {goals.map((item) => {
        const Icon = icons[item.icon];
        return (
          <div className="impactItem" key={item.id}>
            <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
            {item.figure ? <b>{item.figure}</b> : null}
            <strong>{item.title}</strong>
            <small>{item.detail}</small>
          </div>
        );
      })}
      <blockquote>
        <span className="quoteMark" aria-hidden="true">
          “
        </span>
        <p>The real strength of Lagos is its people.</p>
        <footer>ICGMTP organising principle</footer>
      </blockquote>
    </section>
  );
}
