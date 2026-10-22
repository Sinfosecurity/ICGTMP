import { heroSlides } from '../data/heroSlides';
import { Hero } from '../components/Hero';
import { ImpactGoals } from '../components/ImpactGoals';
import { JoinPanel } from '../components/JoinPanel';
import { LagosEastPresence } from '../components/LagosEastPresence';
import { LeadershipSection } from '../components/LeadershipSection';
import { NewsSection } from '../components/NewsSection';
import { ProgramsStrip } from '../components/ProgramsStrip';
import { SectorCards } from '../components/SectorCards';

export function HomePage() {
  return (
    <main>
      <h1 className="visuallyHidden">{heroSlides[0].title}</h1>
      <Hero />
      <SectorCards />
      <ImpactGoals />
      <LagosEastPresence />
      <section id="home-lower" className="lowerGrid" aria-label="Leadership, news and membership">
        <LeadershipSection />
        <NewsSection />
        <JoinPanel />
      </section>
      <ProgramsStrip />
    </main>
  );
}
