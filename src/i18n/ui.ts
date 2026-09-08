/**
 * Every string the interface renders, per locale.
 *
 * Rule from the brief: never mix two languages on one screen. Each locale is a
 * complete set — a missing key is a TypeScript error, not a silent fallback to
 * English.
 *
 * The language rules apply in every locale: plain words in prose, jargon only
 * inside the mono `stack` tags of a case study.
 */

export const locales = ['en', 'pt', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/** Shown in the language switcher. */
export const localeNames: Record<Locale, string> = {
  en: 'EN',
  pt: 'PT',
  es: 'ES',
};

/** For the `lang` attribute and hreflang — more specific than the route key. */
export const htmlLang: Record<Locale, string> = {
  en: 'en',
  pt: 'pt-BR',
  es: 'es',
};

export const ui = {
  en: {
    'meta.description':
      'I build the systems your product runs on — and I explain them in plain language. Backend developer working in Java, Spring Boot, payments, authentication and automation.',
    'meta.role': 'Backend Developer',

    'a11y.skip': 'Skip to content',
    'a11y.language': 'Language',

    'nav.contact': 'Contact',

    'hero.line1': 'Backend',
    'hero.line2': 'Developer',
    'hero.scroll': 'Scroll down · Scroll down · ',
    'hero.available': 'Available for work',
    'hero.location': 'Based in Rio de Janeiro, Brazil · Remote worldwide',
    'hero.specialties': 'Specialties',
    'hero.portraitAlt': 'Luiz Paulo Souza de Medeiros, backend developer',

    'positioning.headline':
      'I build the systems your product runs on — and I explain them in plain language.',
    'positioning.body':
      'Most of what I do is invisible to your users: the login that keeps their data safe, the payment that never charges twice, the API that answers in 120 milliseconds instead of 350. You notice it only when it’s missing.',

    'work.title': 'Selected work',
    'work.view': 'View project →',
    'work.back': '← Selected work',
    'work.next': 'Next',
    'work.problem': 'The problem',
    'work.built': 'What I built',
    'work.result': 'The result',
    'work.stack': 'Under the hood',
    'work.confidential':
      'Architecture and results only. No proprietary code, customer data or product screenshots are shown.',
    'work.soonTitle': '[Demo projects]',
    'work.soonSummary': 'Things you can click and test',
    'work.soonCategory': 'Live demos',
    'work.soonStatus': 'In progress',

    'numbers.title': 'The numbers',

    'how.title': 'How I work',
    'how.1.title': 'I ask first, code second',
    'how.1.body':
      'Before you pay for anything, we agree on exactly what "done" looks like. Most failed projects fail at this step, not at the code.',
    'how.2.title': 'I use AI, and I tell you so',
    'how.2.body':
      'Claude Code is part of my workflow. It means you get things faster. It does not mean nobody checked the work — I review, test, and can explain every line I hand over.',
    'how.3.title': 'I teach, so I explain',
    'how.3.body':
      'I train junior developers three classes a year. You will never get a status update you cannot understand.',

    'contact.title': 'Get in touch',

    'footer.built': 'Built with Astro. No trackers.',
    'footer.source': 'Source on GitHub',

    '404.label': 'Error 404',
    '404.title': 'Nothing here',
    '404.body': 'This page does not exist — it may have moved, or the link may be wrong.',
    '404.back': 'Back to home →',
  },

  pt: {
    'meta.description':
      'Eu construo os sistemas que sustentam o seu produto — e explico tudo em linguagem simples. Desenvolvedor backend em Java, Spring Boot, pagamentos, autenticação e automação.',
    'meta.role': 'Desenvolvedor Backend',

    'a11y.skip': 'Pular para o conteúdo',
    'a11y.language': 'Idioma',

    'nav.contact': 'Contato',

    'hero.line1': 'Desenvolvedor',
    'hero.line2': 'Backend',
    'hero.scroll': 'Role a página · Role a página · ',
    'hero.available': 'Disponível para trabalhar',
    'hero.location': 'Rio de Janeiro, Brasil · Remoto para o mundo todo',
    'hero.specialties': 'Especialidades',
    'hero.portraitAlt': 'Luiz Paulo Souza de Medeiros, desenvolvedor backend',

    'positioning.headline':
      'Eu construo os sistemas que sustentam o seu produto — e explico tudo em linguagem simples.',
    'positioning.body':
      'Quase tudo o que eu faço é invisível para quem usa o seu produto: o login que mantém os dados a salvo, o pagamento que nunca cobra duas vezes, a resposta que chega em 120 milissegundos em vez de 350. Você só percebe quando falta.',

    'work.title': 'Trabalhos selecionados',
    'work.view': 'Ver projeto →',
    'work.back': '← Trabalhos selecionados',
    'work.next': 'Próximo',
    'work.problem': 'O problema',
    'work.built': 'O que eu construí',
    'work.result': 'O resultado',
    'work.stack': 'Por baixo do capô',
    'work.confidential':
      'Apenas arquitetura e resultados. Não há código proprietário, dados de clientes nem imagens do produto.',
    'work.soonTitle': '[Projetos demo]',
    'work.soonSummary': 'Coisas que você pode clicar e testar',
    'work.soonCategory': 'Demos ao vivo',
    'work.soonStatus': 'Em andamento',

    'numbers.title': 'Os números',

    'how.title': 'Como eu trabalho',
    'how.1.title': 'Pergunto primeiro, programo depois',
    'how.1.body':
      'Antes de você pagar qualquer coisa, combinamos exatamente o que significa "pronto". A maioria dos projetos que dão errado falha nessa etapa, não no código.',
    'how.2.title': 'Eu uso IA, e te conto isso',
    'how.2.body':
      'O Claude Code faz parte do meu fluxo de trabalho. Significa que você recebe as coisas mais rápido. Não significa que ninguém conferiu — eu reviso, testo e sei explicar cada linha que entrego.',
    'how.3.title': 'Eu ensino, então eu explico',
    'how.3.body':
      'Formo desenvolvedores juniores em três turmas por ano. Você nunca vai receber um relatório que não consiga entender.',

    'contact.title': 'Fale comigo',

    'footer.built': 'Feito com Astro. Sem rastreadores.',
    'footer.source': 'Código no GitHub',

    '404.label': 'Erro 404',
    '404.title': 'Não tem nada aqui',
    '404.body': 'Esta página não existe — ela pode ter mudado de lugar, ou o link pode estar errado.',
    '404.back': 'Voltar ao início →',
  },

  es: {
    'meta.description':
      'Construyo los sistemas sobre los que funciona tu producto — y los explico en lenguaje claro. Desarrollador backend en Java, Spring Boot, pagos, autenticación y automatización.',
    'meta.role': 'Desarrollador Backend',

    'a11y.skip': 'Saltar al contenido',
    'a11y.language': 'Idioma',

    'nav.contact': 'Contacto',

    'hero.line1': 'Desarrollador',
    'hero.line2': 'Backend',
    'hero.scroll': 'Desplázate · Desplázate · ',
    'hero.available': 'Disponible para trabajar',
    'hero.location': 'Río de Janeiro, Brasil · Remoto en todo el mundo',
    'hero.specialties': 'Especialidades',
    'hero.portraitAlt': 'Luiz Paulo Souza de Medeiros, desarrollador backend',

    'positioning.headline':
      'Construyo los sistemas sobre los que funciona tu producto — y los explico en lenguaje claro.',
    'positioning.body':
      'Casi todo lo que hago es invisible para quienes usan tu producto: el inicio de sesión que mantiene sus datos a salvo, el pago que nunca cobra dos veces, la respuesta que llega en 120 milisegundos en lugar de 350. Solo lo notas cuando falta.',

    'work.title': 'Trabajos seleccionados',
    'work.view': 'Ver proyecto →',
    'work.back': '← Trabajos seleccionados',
    'work.next': 'Siguiente',
    'work.problem': 'El problema',
    'work.built': 'Lo que construí',
    'work.result': 'El resultado',
    'work.stack': 'Bajo el capó',
    'work.confidential':
      'Solo arquitectura y resultados. No se muestra código propietario, datos de clientes ni imágenes del producto.',
    'work.soonTitle': '[Proyectos demo]',
    'work.soonSummary': 'Cosas que puedes clicar y probar',
    'work.soonCategory': 'Demos en vivo',
    'work.soonStatus': 'En curso',

    'numbers.title': 'Los números',

    'how.title': 'Cómo trabajo',
    'how.1.title': 'Pregunto primero, programo después',
    'how.1.body':
      'Antes de que pagues nada, acordamos exactamente qué significa "terminado". La mayoría de los proyectos que fracasan lo hacen en este paso, no en el código.',
    'how.2.title': 'Uso IA, y te lo digo',
    'how.2.body':
      'Claude Code es parte de mi flujo de trabajo. Significa que recibes las cosas más rápido. No significa que nadie revisó el trabajo — yo reviso, pruebo y sé explicar cada línea que entrego.',
    'how.3.title': 'Enseño, así que explico',
    'how.3.body':
      'Formo desarrolladores junior en tres grupos al año. Nunca recibirás un informe que no puedas entender.',

    'contact.title': 'Hablemos',

    'footer.built': 'Hecho con Astro. Sin rastreadores.',
    'footer.source': 'Código en GitHub',

    '404.label': 'Error 404',
    '404.title': 'Aquí no hay nada',
    '404.body': 'Esta página no existe — puede haber cambiado de lugar, o el enlace puede estar mal.',
    '404.back': 'Volver al inicio →',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];
