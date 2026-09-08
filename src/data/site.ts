/**
 * Single source of truth for identity and links.
 *
 * A profile with an empty `url` renders as plain muted text, never a dead link.
 */
export const site = {
  name: 'Luiz Medeiros',
  fullName: 'Luiz Paulo Souza de Medeiros',
  role: 'Backend Developer',
  email: 'luizpaulo.ius@gmail.com',
  location: 'Rio de Janeiro, Brazil',
  locationLine: 'Based in Rio de Janeiro, Brazil · Remote worldwide',
  available: true,
  url: 'https://luizmedeiros.dev',
  description:
    'I build the systems your product runs on — and I explain them in plain language. Backend developer working in Java, Spring Boot, payments, authentication and automation.',
} as const;

export type Profile = { label: string; url: string };

export const profiles: Profile[] = [
  { label: 'Upwork', url: 'https://www.upwork.com/freelancers/~015ebf33a4c1172bb6' },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/luiz-paulo-medeiros' },
  { label: 'GitHub', url: 'https://github.com/LuizP2' },
];

/**
 * Repository of this site itself — linked from the footer.
 * Still blank: this is the repo URL, not the GitHub profile above.
 */
export const sourceRepo = '';

export const specialties = [
  'REST APIs',
  'Authentication & Security',
  'Payments / Stripe',
  'Automation & AI Agents',
  'Databases',
  'Docker / AWS / CI-CD',
];

/** Every number here is traceable to a case study in src/content/work/. */
export const numbers = [
  { value: '500+', label: 'users served', source: 'speake' },
  { value: '~5,000', label: 'requests/day handled', source: 'speake' },
  { value: '65%', label: 'faster API responses', source: 'speake' },
  { value: '20', label: 'developers taught', source: 'usina-social' },
];

export const howIWork = [
  {
    n: '01',
    title: 'I ask first, code second',
    body: 'Before you pay for anything, we agree on exactly what "done" looks like. Most failed projects fail at this step, not at the code.',
  },
  {
    n: '02',
    title: 'I use AI, and I tell you so',
    body: 'Claude Code is part of my workflow. It means you get things faster. It does not mean nobody checked the work — I review, test, and can explain every line I hand over.',
  },
  {
    n: '03',
    title: 'I teach, so I explain',
    body: 'I train junior developers three classes a year. You will never get a status update you cannot understand.',
  },
];
