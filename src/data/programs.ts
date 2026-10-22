import { imageAlts, images, sectorSrcSet } from './images';
import type { MembershipCategory } from './site';

export type ProgramId = 'markets' | 'artisans' | 'professionals' | 'women-youth';

export type ProgramIcon = 'store' | 'wrench' | 'users' | 'heart';

export type ProgramAction = 'join' | 'whatsapp' | 'contact' | 'programs';

export type ProgramActivity = {
  title: string;
  text: string;
};

export type ProgramInvolvement = {
  label: string;
  text: string;
  action: ProgramAction;
  category?: MembershipCategory;
};

export type Program = {
  id: ProgramId;
  title: string;
  stripLabel: string;
  description: string;
  image: string;
  srcSet: string;
  alt: string;
  icon: ProgramIcon;
  objectPosition: string;
  objectPositionMobile: string;
  aim: string;
  work: string[];
  cardText: string;
  eyebrow: string;
  headline: string;
  intro: string;
  whyItMatters: string;
  activities: ProgramActivity[];
  /** Present only where the approved copy has a section between activities and expectations. */
  note?: { heading: string; text: string };
  memberExpectations: string[];
  whereWeWork: string;
  getInvolved: ProgramInvolvement[];
  closingLine: string;
  seoTitle: string;
  seoDescription: string;
};

/** Copy order, which is not the order of the structure directory. */
export const whereWeWorkLgas = ['Epe', 'Ibeju-Lekki', 'Ikorodu', 'Kosofe', 'Shomolu'] as const;

export const whereWeWorkLine = `${whereWeWorkLgas.join(' · ')}, and their LCDAs.`;

export const programMovement = {
  heading: 'Be part of the movement',
  text: 'Whether you trade, build, practise a profession or are just starting out, there is a place for you in ICGTMP. Register your interest, and a coordinator in your LGA will reach out.',
  joinLabel: 'Join ICGTMP',
  whatsappLabel: 'Join the WhatsApp group',
  programmesLabel: 'Explore other programmes',
} as const;

export const programs: Program[] = [
  {
    id: 'markets',
    title: 'Markets & Traders',
    stripLabel: 'Markets & Trade',
    description:
      'Connecting market associations, traders and commercial communities across Lagos East.',
    image: images.markets,
    srcSet: sectorSrcSet.markets,
    alt: imageAlts.markets,
    icon: 'store',
    objectPosition: '38% 40%',
    objectPositionMobile: '36% 35%',
    aim: 'Strengthen market associations and trading communities as organised civic partners.',
    work: [
      'Association meetings and market-floor conversations',
      'PVC registration and collection support in market corridors',
      'Welfare, security and trading-condition priorities gathered from traders',
    ],
    cardText:
      'Markets are the heartbeat of Lagos East. We organise traders and market associations so their voice is heard on the issues that shape their daily trade.',
    eyebrow: 'Programme · Markets & Traders',
    headline: 'Where Lagos East trades, ICGTMP stands with you',
    intro:
      'Every morning, long before offices open, Lagos East is already at work in its markets. Traders feed families, move goods, give credit, train apprentices and keep whole communities running. ICGTMP exists to make sure the people who carry this economy are organised, informed and represented.',
    whyItMatters:
      'From the foodstuff trade around Mile 12 in Kosofe to the fish and produce markets of Epe, and from the busy corridors of Ikorodu to the growing Lekki corridor in Ibeju-Lekki, markets are where Lagos East earns its living. Yet traders are often the last to be consulted on the decisions that affect them most: security, sanitation, access roads, levies and trading conditions. When market associations speak together, they are heard. Our work is to help them speak together.',
    activities: [
      {
        title: 'Association engagement',
        text: 'We meet market leaders, iyalojas, babalojas and association executives to understand priorities market by market.',
      },
      {
        title: 'Market-floor conversations',
        text: 'We go to the stalls, not just the offices, so the views of everyday traders are counted.',
      },
      {
        title: 'Trader priorities register',
        text: 'We gather and document concerns on welfare, security and trading conditions, and carry them to the right stakeholders.',
      },
      {
        title: 'PVC registration and collection support',
        text: "We help traders register, locate and collect their Permanent Voter Cards without losing a day's trade, and share clear voter-education information.",
      },
    ],
    memberExpectations: [
      'A direct line to ICGTMP coordinators for your market or LGA',
      'Regular updates on issues affecting traders in Lagos East',
      'A seat at the table when market concerns are discussed',
      'A network of fellow traders across the five LGAs',
    ],
    whereWeWork: whereWeWorkLine,
    getInvolved: [
      {
        label: 'Join as a trader',
        text: 'Register your interest and tell us your market and association.',
        action: 'join',
        category: 'Markets & Traders',
      },
      {
        label: 'Bring your association',
        text: 'Market leaders can request a meeting with ICGTMP coordinators.',
        action: 'contact',
      },
      {
        label: 'Join the WhatsApp group',
        text: 'for updates.',
        action: 'whatsapp',
      },
    ],
    closingLine: "Strong markets build a strong Lagos. Let's build it together.",
    seoTitle: 'Markets & Traders | ICGTMP',
    seoDescription:
      'ICGTMP organises traders and market associations across Lagos East, so their priorities on welfare, security and trading conditions are heard.',
  },
  {
    id: 'artisans',
    title: 'Artisans & Skilled Workers',
    stripLabel: 'Artisans',
    description:
      'Engaging mechanics, technicians, tailors, builders, craftspeople and other skilled workers.',
    image: images.artisans,
    srcSet: sectorSrcSet.artisans,
    alt: imageAlts.artisans,
    icon: 'wrench',
    objectPosition: '70% 35%',
    objectPositionMobile: '72% 30%',
    aim: 'Organise mechanics, technicians, tailors, builders and other skilled workers.',
    work: [
      'Workshop and cluster visits across Ikorodu and the wider East',
      'Skills, tools and apprenticeship conversations',
      'A clearer channel between artisan groups and Lagos East structure',
    ],
    cardText:
      'Mechanics, tailors, builders, technicians and craftspeople keep Lagos working. We bring skilled workers together so their trades are recognised and their voices count.',
    eyebrow: 'Programme · Artisans & Skilled Workers',
    headline: 'The hands that build Lagos deserve a voice',
    intro:
      "Behind every repaired car, finished outfit, wired home and newly built house is a skilled worker. Artisans are the backbone of Lagos East's economy, and many of them train the next generation through apprenticeship. ICGTMP works to organise artisans so their skills are valued, their concerns are heard and their trades are represented.",
    whyItMatters:
      'Artisans work across every community in Lagos East: mechanic clusters along the roads into Ikorodu, tailoring and fashion workshops across the mainland, and builders and technicians serving fast-growing communities in Ibeju-Lekki. Artisans face real pressures, including the cost of tools and materials, access to workspace, and the question of how young apprentices can gain recognised skills. These concerns are rarely heard because artisans are rarely organised in one voice.',
    activities: [
      {
        title: 'Workshop and cluster visits',
        text: 'We meet artisans where they work, starting in Ikorodu and extending across Lagos East.',
      },
      {
        title: 'Skills, tools and apprenticeship conversations',
        text: 'We listen to what artisans need to grow their trade and to train apprentices well, and document it.',
      },
      {
        title: 'One clear channel',
        text: 'We give artisan associations and guilds a direct link to the ICGTMP structure in each LGA and LCDA.',
      },
      {
        title: 'Civic participation',
        text: 'We share voter-registration and PVC collection information so artisans can take part fully.',
      },
    ],
    note: {
      heading: 'Trades we work with',
      text: 'mechanics and auto-technicians, tailors and fashion designers, builders, masons and carpenters, electricians and plumbers, welders and fabricators, hairdressers and barbers, phone and electronics technicians, and other skilled crafts.',
    },
    memberExpectations: [
      'Recognition of your trade within the ICGTMP network',
      'A coordinator who knows your area and your craft',
      'Updates on matters affecting artisans in Lagos East',
      'Connection with fellow artisans across the five LGAs',
    ],
    whereWeWork: whereWeWorkLine,
    getInvolved: [
      {
        label: 'Join as an artisan',
        text: 'Register and tell us your trade and location.',
        action: 'join',
        category: 'Artisans & Skilled Workers',
      },
      {
        label: 'Bring your guild or cluster',
        text: 'Association leaders can request a visit.',
        action: 'contact',
      },
      {
        label: 'Join the WhatsApp group',
        text: 'for updates.',
        action: 'whatsapp',
      },
    ],
    closingLine: 'Skilled hands, strong communities, a greater Lagos.',
    seoTitle: 'Artisans & Skilled Workers | ICGTMP',
    seoDescription:
      'ICGTMP brings mechanics, tailors, builders, technicians and craftspeople across Lagos East together, so skilled workers are recognised and heard.',
  },
  {
    id: 'professionals',
    title: 'Professionals & SMEs',
    stripLabel: 'Professionals',
    description:
      'Partnering with professionals, entrepreneurs and business owners for stronger communities.',
    image: images.professionals,
    srcSet: sectorSrcSet.professionals,
    alt: imageAlts.professionals,
    icon: 'users',
    objectPosition: '50% 28%',
    objectPositionMobile: '50% 22%',
    aim: 'Connect professionals, entrepreneurs and SME owners to grassroots work.',
    work: [
      'Volunteer time, mentoring and pro-bono skills',
      'Small-business and professional association outreach',
      'Support for data, communications and programme delivery',
    ],
    cardText:
      'Professionals, entrepreneurs and small-business owners bring expertise that communities need. We connect that talent to grassroots work across Lagos East.',
    eyebrow: 'Programme · Professionals & SMEs',
    headline: 'Your expertise can move a community forward',
    intro:
      'Lagos East is home to doctors and nurses, teachers and lawyers, engineers and accountants, and thousands of small and growing businesses. ICGTMP believes these skills belong not only in offices and clinics but in the service of the communities around them. This programme connects professionals and business owners to grassroots work where their knowledge makes a real difference.',
    whyItMatters:
      "Lagos East is changing fast. The Lekki corridor in Ibeju-Lekki is drawing major investment, Ikorodu and Kosofe are growing quickly, and Shomolu is known for its long-established printing and enterprise clusters. Small businesses create much of the area's work. When professionals and entrepreneurs engage at the grassroots, communities gain better information, sharper planning and stronger organisations.",
    activities: [
      {
        title: 'Volunteer time and pro-bono skills',
        text: 'We match professionals who want to give back with community needs, such as health awareness, legal literacy, financial literacy and mentoring.',
      },
      {
        title: 'SME and professional association outreach',
        text: 'We engage business owners and professional bodies to understand the conditions that help small businesses thrive in Lagos East.',
      },
      {
        title: 'Skills for the movement',
        text: 'Professionals help ICGTMP with data, communications, research and programme delivery, so our work is well-organised and evidence-based.',
      },
      {
        title: 'Mentoring',
        text: 'We link experienced professionals with young people and new entrepreneurs.',
      },
    ],
    note: {
      heading: 'Who this is for',
      text: 'healthcare workers, educators, legal practitioners, engineers, accountants and finance professionals, ICT and creative professionals, and owners of small and medium-sized businesses.',
    },
    memberExpectations: [
      'A clear, practical way to contribute your skills to your community',
      'A network of like-minded professionals and business owners across Lagos East',
      'Opportunities to mentor and to share expertise',
      'Updates on issues affecting enterprise in Lagos East',
    ],
    whereWeWork: whereWeWorkLine,
    getInvolved: [
      {
        label: 'Volunteer your skills',
        text: 'Tell us your profession and how much time you can offer.',
        action: 'join',
        category: 'Volunteer',
      },
      {
        label: 'Partner with us',
        text: 'Professional associations and businesses can propose a partnership.',
        action: 'contact',
      },
      {
        label: 'Join the WhatsApp group',
        text: 'for updates.',
        action: 'whatsapp',
      },
    ],
    closingLine: 'Expertise shared is a community strengthened.',
    seoTitle: 'Professionals & SMEs | ICGTMP',
    seoDescription:
      'ICGTMP connects professionals, entrepreneurs and small-business owners in Lagos East with grassroots work through volunteering, mentoring and partnership.',
  },
  {
    id: 'women-youth',
    title: 'Women & Youth',
    stripLabel: 'Women & Youth',
    description:
      'Creating more opportunities for women and young people in trade, business and leadership.',
    image: images.womenYouth,
    srcSet: sectorSrcSet.womenYouth,
    alt: imageAlts.womenYouth,
    icon: 'heart',
    objectPosition: '50% 30%',
    objectPositionMobile: '50% 24%',
    aim: 'Open more room for women and young people in trade, business and leadership.',
    work: [
      'Women-led market and trade networks',
      'Youth mobilisation and civic education',
      'Leadership seats for women and youth coordinators — names to be published when appointed',
    ],
    cardText:
      "Women and young people drive Lagos East's markets, trades and future. We are opening more room for them in trade, business and leadership.",
    eyebrow: 'Programme · Women & Youth',
    headline: 'Making room for the women and young people who power Lagos East',
    intro:
      "Walk through any market in Lagos East and you will see women running stalls, managing credit circles and leading associations. Visit any workshop and you will find young people learning a trade and building a future. Women and youth already carry much of Lagos East's economy. ICGTMP works to make sure they also have a full voice in its direction.",
    whyItMatters:
      "Women lead many of the market networks that keep trade moving, and young people make up a large share of Lagos East's population. Yet both groups are often under-represented where decisions are made. A movement that speaks for traders, artisans and professionals must reflect the people who actually make up those groups, and that means women and young people in visible leadership.",
    activities: [
      {
        title: 'Women-led market and trade networks',
        text: "We work with women traders, market women's associations and women entrepreneurs to strengthen their networks and amplify their priorities.",
      },
      {
        title: 'Youth mobilisation and civic education',
        text: 'We engage young people in trades, campuses and communities with clear information on registration, PVC collection and civic participation.',
      },
      {
        title: 'Leadership pathways',
        text: 'ICGTMP is creating dedicated leadership positions for women and youth coordinators within its structure. Names will be published when appointments are made.',
      },
      {
        title: 'Mentoring and connection',
        text: 'We link young people and women entrepreneurs with experienced traders, artisans and professionals in our network.',
      },
    ],
    memberExpectations: [
      'A network of women and young people across all five Lagos East LGAs',
      'Opportunities to take on coordinating and leadership roles',
      'Clear civic and voter-education information',
      'Mentoring connections within the ICGTMP network',
    ],
    whereWeWork: whereWeWorkLine,
    getInvolved: [
      {
        label: 'Join as a woman trader, entrepreneur or young person',
        text: 'Register your interest.',
        action: 'join',
        category: 'Women & Youth',
      },
      {
        label: 'Volunteer to coordinate',
        text: 'Tell us your LGA and the community you can organise.',
        action: 'join',
        category: 'Volunteer',
      },
      {
        label: 'Join the WhatsApp group',
        text: 'for updates.',
        action: 'whatsapp',
      },
    ],
    closingLine: 'When women and youth lead, Lagos rises.',
    seoTitle: 'Women & Youth | ICGTMP',
    seoDescription:
      "ICGTMP opens more room for women and young people in Lagos East's trade, business and leadership, through networks, civic education and leadership pathways.",
  },
];

export function programById(id: string | undefined): Program | undefined {
  if (!id) return undefined;
  return programs.find((program) => program.id === id);
}

export function programPath(id: ProgramId): string {
  return `/programs/${id}`;
}
