import { Hero } from '../components/Hero';
import { LagosEastPresence } from '../components/LagosEastPresence';
import { SceneHero } from '../components/home/SceneHero';
import { SceneHook } from '../components/home/SceneHook';
import { SceneImpact } from '../components/home/SceneImpact';
import { SceneLeadership } from '../components/home/SceneLeadership';
import { SceneNewsClose } from '../components/home/SceneNewsClose';
import { SceneSectors } from '../components/home/SceneSectors';
import { HOME_SECTIONS } from '../data/homeSections';

/** Home section order/IDs — keep in sync with the render below. */
export { HOME_SECTIONS };

export function HomePage() {
  return (
    <main className="cineHome">
      {/* HOME_SECTIONS: home */}
      <Hero />
      {/* HOME_SECTIONS: home-story */}
      <SceneHero />
      <SceneHook />
      {/* HOME_SECTIONS: who-we-are */}
      <SceneSectors />
      <SceneImpact />
      {/* HOME_SECTIONS: home-structure */}
      <LagosEastPresence />
      {/* HOME_SECTIONS: home-leadership */}
      <SceneLeadership />
      {/* HOME_SECTIONS: home-news */}
      <SceneNewsClose />
    </main>
  );
}
