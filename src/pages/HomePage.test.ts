import { describe, expect, it } from 'vitest';
import { HOME_SECTIONS } from '../data/homeSections';

describe('HOME_SECTIONS', () => {
  it('includes the required section ids in render order', () => {
    const ids = HOME_SECTIONS.map((section) => section.id);
    expect(ids).toEqual([
      'home',
      'home-story',
      'who-we-serve',
      'home-structure',
      'home-leadership',
      'home-news',
    ]);
  });

  it('keeps home → story → who-we-serve → structure → leadership order', () => {
    const required = ['home', 'home-story', 'who-we-serve', 'home-structure', 'home-leadership'];
    const ids = HOME_SECTIONS.map((section) => section.id);
    let last = -1;
    for (const id of required) {
      const index = ids.indexOf(id as (typeof HOME_SECTIONS)[number]['id']);
      expect(index).toBeGreaterThan(last);
      last = index;
    }
  });
});
