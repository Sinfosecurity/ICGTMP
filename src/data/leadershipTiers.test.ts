import { describe, expect, it } from 'vitest';
import { leadershipTiers, leadershipTierSlugs } from './leadershipTiers';

describe('leadershipTiers', () => {
  it('orders tiers Conveners → DG → DDGs → Secretary → Diaspora', () => {
    const tiers = leadershipTiers();
    const keys = Object.keys(tiers);
    expect(keys).toEqual([
      'conveners',
      'directorGeneral',
      'ddgs',
      'secretary',
      'diaspora',
    ]);

    expect(tiers.conveners.every((l) => l.role === 'Convener')).toBe(true);
    expect(tiers.directorGeneral.every((l) => l.role === 'Director-General')).toBe(true);
    expect(tiers.ddgs.every((l) => l.role.startsWith('Deputy Director-General'))).toBe(true);
    expect(tiers.secretary.every((l) => l.role === 'Secretary')).toBe(true);
    expect(tiers.diaspora.every((l) => l.group === 'diaspora')).toBe(true);

    expect(tiers.conveners.length).toBeGreaterThan(0);
    expect(tiers.directorGeneral.length).toBe(1);
    expect(tiers.ddgs.length).toBeGreaterThan(0);
    expect(tiers.secretary.length).toBe(1);
    expect(tiers.diaspora.length).toBeGreaterThan(0);
  });

  it('returns ordered slug rows matching the org chart', () => {
    const rows = leadershipTierSlugs();
    expect(rows).toHaveLength(5);
    expect(rows[0]).toEqual([
      'farihuddin-arebi',
      'mujaid-adeyemi',
      'paul-sola-oginni',
    ]);
    expect(rows[1]).toEqual(['jamiu-arowosegbe']);
    expect(rows[2]).toEqual([
      'lookman-alex-adeyemi',
      'aleshinloye-adele',
      'adebayo-shobaloju',
    ]);
    expect(rows[3]).toEqual(['abiodun-keshinro']);
    expect(rows[4]).toEqual(['bidemi-balogun', 'saheed-lawal']);
  });
});
