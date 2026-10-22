export type LgaName = 'Shomolu' | 'Kosofe' | 'Ikorodu' | 'Epe' | 'Ibeju-Lekki';

export const lgaDirectory: Record<LgaName, string[]> = {
  Shomolu: ['Bariga LCDA'],
  Kosofe: ['Ikosi-Isheri LCDA', 'Agboyi-Ketu LCDA'],
  Ikorodu: [
    'Ikorodu North LCDA',
    'Ikorodu West LCDA',
    'Igbogbo-Baiyeku LCDA',
    'Imota LCDA',
    'Ijede LCDA',
  ],
  Epe: ['Eredo LCDA', 'Ikosi-Ejinrin LCDA'],
  'Ibeju-Lekki': ['Lekki LCDA'],
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
