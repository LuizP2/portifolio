/**
 * Single source of truth for identity and links.
 *
 * A profile with an empty `url` renders as plain muted text, never a dead link.
 */
export const site = {
  name: 'Luiz Medeiros',
  fullName: 'Luiz Paulo Souza de Medeiros',
  email: 'luizpaulo.ius@gmail.com',
  available: true,
} as const;

export type Profile = { label: string; url: string };

export const profiles: Profile[] = [
  { label: 'Upwork', url: 'https://www.upwork.com/freelancers/~015ebf33a4c1172bb6' },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/luiz-paulo-medeiros' },
  { label: 'GitHub', url: 'https://github.com/LuizP2' },
];

/** Repository of this site itself — linked from the footer. */
export const sourceRepo = 'https://github.com/LuizP2/portifolio';
