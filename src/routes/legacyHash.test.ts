import { describe, expect, it } from 'vitest';
import { pathForLegacyHash } from './legacyHash';

describe('pathForLegacyHash', () => {
  it('maps every old hash link onto its path', () => {
    expect(pathForLegacyHash('#home')).toBe('/');
    expect(pathForLegacyHash('#about')).toBe('/about');
    expect(pathForLegacyHash('#leadership')).toBe('/leadership');
    expect(pathForLegacyHash('#our-structure')).toBe('/structure');
    expect(pathForLegacyHash('#structure')).toBe('/structure');
    expect(pathForLegacyHash('#programs/markets')).toBe('/programs/markets');
    expect(pathForLegacyHash('#programs/artisans')).toBe('/programs/artisans');
    expect(pathForLegacyHash('#programs/professionals')).toBe('/programs/professionals');
    expect(pathForLegacyHash('#programs/women-youth')).toBe('/programs/women-youth');
    expect(pathForLegacyHash('#news-and-events')).toBe('/news');
    expect(pathForLegacyHash('#resources')).toBe('/resources');
    expect(pathForLegacyHash('#contact')).toBe('/contact');
    expect(pathForLegacyHash('#privacy')).toBe('/privacy');
    expect(pathForLegacyHash('#terms')).toBe('/terms');
    expect(pathForLegacyHash('#sitemap')).toBe('/sitemap');
    expect(pathForLegacyHash('#programs')).toBe('/programs');
  });

  it('sends an unknown programme slug through to the programme route', () => {
    expect(pathForLegacyHash('#programs/not-a-sector')).toBe('/programs/not-a-sector');
  });

  it('ignores hashes that were never routes', () => {
    expect(pathForLegacyHash('')).toBeNull();
    expect(pathForLegacyHash('#')).toBeNull();
    expect(pathForLegacyHash('#main')).toBeNull();
    expect(pathForLegacyHash('#programs/markets/extra')).toBeNull();
    expect(pathForLegacyHash('#about/extra')).toBeNull();
  });

  it('accepts a leading slash and an encoded hash', () => {
    expect(pathForLegacyHash('#/about')).toBe('/about');
    expect(pathForLegacyHash('#programs/women%2Dyouth')).toBe('/programs/women-youth');
  });
});
