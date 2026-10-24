export type LgaName = 'Shomolu' | 'Kosofe' | 'Ikorodu' | 'Epe' | 'Ibeju-Lekki';

export const lgaDirectory: Record<LgaName, string[]> = {
  Shomolu: ['Bariga LCDA'],
  Kosofe: ['Agboyi-Ketu LCDA', 'Ikosi-Isheri LCDA'],
  Ikorodu: [
    'Igbogbo-Baiyeku LCDA',
    'Ijede LCDA',
    'Ikorodu North LCDA',
    'Ikorodu West LCDA',
    'Imota LCDA',
  ],
  Epe: ['Eredo LCDA', 'Ikosi-Ejinrin LCDA'],
  'Ibeju-Lekki': ['Lekki LCDA'],
};

/** The local government itself, then its LCDAs, for the join form. */
export const councilOptions: Record<LgaName, string[]> = {
  Shomolu: ['Shomolu LG', ...lgaDirectory.Shomolu],
  Kosofe: ['Kosofe LG', ...lgaDirectory.Kosofe],
  Ikorodu: ['Ikorodu LG', ...lgaDirectory.Ikorodu],
  Epe: ['Epe LG', ...lgaDirectory.Epe],
  'Ibeju-Lekki': ['Ibeju-Lekki LG', ...lgaDirectory['Ibeju-Lekki']],
};

export const lgaNames = Object.keys(lgaDirectory) as LgaName[];

export function lgaSectionId(name: LgaName): string {
  return name.toLowerCase();
}

export const lgaNotes: Record<LgaName, string> = {
  Shomolu: 'Mainland communities and market corridors.',
  Kosofe: 'Trading hubs connecting the mainland and the lagoon edge.',
  Ikorodu: 'A major artisan, market and residential belt in Lagos East.',
  Epe: 'Waterfront, market and agrarian communities including Epe Waterfront.',
  'Ibeju-Lekki': 'Coastal communities along the Lekki corridor.',
};
