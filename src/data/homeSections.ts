/** Canonical home section order and IDs (used by HomePage render + tests). */
export const HOME_SECTIONS = [
  { id: 'home', label: 'Campaign banners' },
  { id: 'home-story', label: 'Intro' },
  { id: 'who-we-serve', label: 'Who we serve' },
  { id: 'home-structure', label: 'Lagos East presence' },
  { id: 'home-leadership', label: 'Leadership' },
  { id: 'home-news', label: 'News' },
] as const;

export type HomeSectionId = (typeof HOME_SECTIONS)[number]['id'];
