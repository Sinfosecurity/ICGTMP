import { leadersInGroup, type Leader } from './leaders';

export type LeadershipTier = {
  conveners: Leader[];
  directorGeneral: Leader[];
  ddgs: Leader[];
  secretary: Leader[];
  diaspora: Leader[];
};

function byOrder(a: Leader, b: Leader) {
  return a.order - b.order;
}

/** Ordered org-chart tiers for the home leadership scene. */
export function leadershipTiers(): LeadershipTier {
  const leadership = leadersInGroup('leadership');
  return {
    conveners: leadership.filter((l) => l.role === 'Convener').sort(byOrder),
    directorGeneral: leadership.filter((l) => l.role === 'Director-General').sort(byOrder),
    ddgs: leadership
      .filter((l) => l.role.startsWith('Deputy Director-General'))
      .sort(byOrder),
    secretary: leadership.filter((l) => l.role === 'Secretary').sort(byOrder),
    diaspora: leadersInGroup('diaspora').sort(byOrder),
  };
}

/** Tier slug order: Conveners → DG → DDGs → Secretary → Diaspora. */
export function leadershipTierSlugs(): string[][] {
  const tiers = leadershipTiers();
  return [
    tiers.conveners.map((l) => l.slug),
    tiers.directorGeneral.map((l) => l.slug),
    tiers.ddgs.map((l) => l.slug),
    tiers.secretary.map((l) => l.slug),
    tiers.diaspora.map((l) => l.slug),
  ];
}
