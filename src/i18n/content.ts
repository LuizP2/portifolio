import type { Locale } from './ui';

/** The specialty list under the hero — one per line, right aligned. */
export const specialties: Record<Locale, string[]> = {
  en: [
    'REST APIs',
    'Authentication & Security',
    'Payments / Stripe',
    'Automation & AI Agents',
    'Databases',
    'Docker / AWS / CI-CD',
  ],
  pt: [
    'APIs REST',
    'Autenticação e segurança',
    'Pagamentos / Stripe',
    'Automação e agentes de IA',
    'Bancos de dados',
    'Docker / AWS / CI-CD',
  ],
  es: [
    'APIs REST',
    'Autenticación y seguridad',
    'Pagos / Stripe',
    'Automatización y agentes de IA',
    'Bases de datos',
    'Docker / AWS / CI-CD',
  ],
};

/**
 * The metric band. Every number traces back to a case study in
 * src/content/work/ — `source` names it. Only the thousands separator and the
 * caption change between locales; the measurements do not.
 */
export type Metric = { value: string; label: string; source: string };

export const numbers: Record<Locale, Metric[]> = {
  en: [
    { value: '500+', label: 'users served', source: 'speake' },
    { value: '~5,000', label: 'requests/day handled', source: 'speake' },
    { value: '65%', label: 'faster API responses', source: 'speake' },
    { value: '20', label: 'developers taught', source: 'usina-social' },
  ],
  pt: [
    { value: '500+', label: 'usuários atendidos', source: 'speake' },
    { value: '~5.000', label: 'requisições por dia', source: 'speake' },
    { value: '65%', label: 'respostas mais rápidas', source: 'speake' },
    { value: '20', label: 'desenvolvedores formados', source: 'usina-social' },
  ],
  es: [
    { value: '500+', label: 'usuarios atendidos', source: 'speake' },
    { value: '~5.000', label: 'solicitudes por día', source: 'speake' },
    { value: '65%', label: 'respuestas más rápidas', source: 'speake' },
    { value: '20', label: 'desarrolladores formados', source: 'usina-social' },
  ],
};
