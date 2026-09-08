# Prompt de Construção — Site Portfólio de Luiz Paulo Souza de Medeiros

> **Como usar:** abra o Claude Code em uma pasta nova e diga:
> *"Leia este arquivo e construa o site. Comece pela Fase 1."*
> Todo o conteúdo textual já está pronto aqui — não invente dados, não invente projetos.

---

## 1. Objetivo

Um site portfólio de página única (com páginas internas por projeto) que sirva a **dois públicos ao mesmo tempo**:

| Público | Como chega | O que precisa ver em 10 segundos |
|---|---|---|
| **Cliente de Upwork** (fundador, gerente de produto — geralmente **não é técnico**) | link no perfil do Upwork e nas propostas | "esse cara resolve meu problema e sabe explicar" |
| **Recrutador/tech lead BR** (vagas CLT de backend pleno) | LinkedIn, currículo | "esse cara entrega em produção, não só em tutorial" |

**Métrica de sucesso:** o visitante consegue explicar, em uma frase e com as próprias palavras, o que o Luiz faz — mesmo sem saber o que é uma API.

**Idioma:** inglês como padrão (é o público que paga mais no Upwork), com toggle PT-BR na Fase 3. Nunca misturar os dois na mesma tela.

---

## 2. Decisão estratégica — leia antes de codar

A referência visual é **https://ewan-kerboas.fr/**. Mas ele é dev **front-end/WebGL**: no site dele, o próprio site é a peça de portfólio. Uma cena Three.js prova exatamente a habilidade que ele vende.

**O Luiz é backend.** Copiar o WebGL seria um erro em duas frentes: consome semanas de trabalho e anuncia uma habilidade que não é a que ele está vendendo — o cliente chega esperando animação 3D e recebe proposta de API REST.

**A regra deste projeto:**

> Herdar a **linguagem visual** do Ewan (monocromático, tipografia gigante, índice numerado, revelações no scroll, rigor absoluto).
> Trocar o **mecanismo de "uau"** de gráficos 3D por **prova de engenharia backend**: APIs que rodam ao vivo, métricas reais, tempo de resposta medido na frente do visitante.

Um endpoint que responde de verdade na tela impressiona mais um comprador de backend do que qualquer partícula animada — e é honesto sobre o que ele vende.

---

## 3. Stack técnica

| Camada | Escolha | Motivo |
|---|---|---|
| Framework | **Astro 5** | Zero JS por padrão, ótimo SEO, build simples. O Luiz não é front-end — Astro não pune isso. |
| Estilo | **Tailwind CSS v4** | Mesma base da referência; tokens no `@theme`. |
| Animação | **GSAP + ScrollTrigger** | O que a referência usa. Só isso — sem Three.js, sem Framer Motion. |
| Conteúdo | Content Collections (Markdown) | Cada case study é um `.md`. Editar depois sem mexer em código. |
| Deploy | **Cloudflare Pages** ou Vercel | Domínio próprio: `luizmedeiros.dev` (ou similar). |
| Demos ao vivo | Fly.io / Render (free tier) | As APIs de demonstração da Seção 7 precisam estar de pé de verdade. |

**Restrições:**
- Lighthouse ≥ 95 em Performance, Accessibility, Best Practices e SEO. É argumento de venda, não vaidade.
- Fontes self-hosted (`woff2`), sem chamada ao Google Fonts.
- Funciona sem JavaScript: o conteúdo todo é legível, só as animações somem.
- `prefers-reduced-motion` respeitado — todas as animações viram fade simples.

---

## 4. Design tokens

Extraídos da referência (medidos no site real) e ajustados para legibilidade de leigo.

```css
@theme {
  /* Cor — monocromático, exatamente como a referência */
  --color-ink:        #111111;  /* fundo (valor exato do site do Ewan) */
  --color-surface:    #1A1A1A;  /* cards, seções elevadas */
  --color-line:       #2A2A2A;  /* divisórias — 1px, sempre discretas */
  --color-text:       #FFFFFF;
  --color-muted:      #8A8A8A;  /* labels, metadados */

  /* ÚNICO acento do site. Usado só em números de métrica e no status "open to work". */
  --color-signal:     #C8FF3D;

  /* Tipografia */
  --font-display: "Space Grotesk", system-ui, sans-serif;
  --font-body:    "Inter", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace;
}
```

### Regras tipográficas (é aqui que mora o "amigável para leigos")

| Papel | Fonte | Tratamento |
|---|---|---|
| **Display** (`h1`, nomes de projeto) | Space Grotesk | `700`, `UPPERCASE`, `clamp(2.5rem, 9vw, 8rem)`, `line-height: 0.95`, `letter-spacing: -0.02em` |
| **Corpo** | Inter | **`400`**, `18px`, `line-height: 1.7`, `max-width: 62ch` |
| **Labels / metadados / tags** | JetBrains Mono | `500`, `12px`, `UPPERCASE`, `letter-spacing: 0.12em`, cor `muted` |
| **Números de métrica** | Space Grotesk | `700`, grande, cor `signal` |

**Três regras inegociáveis:**

1. **Mono nunca em parágrafo.** Só em label, tag, numeração e metadado. Mono em texto corrido é o que faz site técnico parecer hostil pra quem não é técnico.
2. **Corpo em weight 400, não 300.** A referência usa `300` — é elegante, mas fica fino demais e cansa. Peso 400 mantém o ar da referência sem punir quem lê.
3. **Nenhum parágrafo passa de 3 linhas.** Se passou, quebra em dois ou vira lista.

### Espaçamento e movimento

- Escala base de 8px. Respiro vertical entre seções: `clamp(6rem, 15vh, 12rem)` — a referência é generosa e isso é metade do efeito.
- Grid de 12 colunas, margem lateral `clamp(1.5rem, 5vw, 6rem)`.
- **Movimento:** só duas primitivas. (a) texto sobe 24px + fade ao entrar na viewport, escalonado por linha, 600ms, `power3.out`. (b) linhas divisórias crescem de 0 a 100% de largura. Nada mais.
- Cursor customizado e preloader com contador `%`: **Fase 3, opcional.** São charme, não conteúdo.

---

## 5. Estrutura do site

Ordem das seções. O copy abaixo é para usar **literalmente**.

### 5.1 Nav (fixa, minimalista)

Esquerda: `Luiz Medeiros` · Direita: botão `CONTACT →`
Sem menu hambúrguer, sem links de seção. A página é curta o bastante.

### 5.2 Hero

```
BACKEND
DEVELOPER
```
Display gigante, uppercase, duas linhas, a segunda com recuo (igual à referência).

Canto inferior esquerdo: badge circular girando com `SCROLL DOWN · SCROLL DOWN ·` e um asterisco no centro.

Canto inferior direito:
```
AVAILABLE FOR WORK ✳
Based in Rio de Janeiro, Brazil · Remote worldwide
```

Abaixo do hero, lista de especialidades alinhada à direita, uma por linha, em cinza (padrão da referência):
```
REST APIs
AUTHENTICATION & SECURITY
PAYMENTS / STRIPE
AUTOMATION & AI AGENTS
DATABASES
DOCKER / AWS / CI-CD
```

### 5.3 Frase de posicionamento

Uma tela só com isto, em display médio, centralizado:

> **I build the systems your product runs on — and I explain them in plain language.**
>
> Most of what I do is invisible to your users: the login that keeps their data safe, the payment that never charges twice, the API that answers in 120 milliseconds instead of 350. You notice it only when it's missing.

*(Esse parágrafo é a peça central do "amigável para leigos". Não reescreva sem manter a estrutura: jargão zero, três exemplos concretos, uma virada final.)*

### 5.4 Selected Work — índice numerado

Padrão da referência: `01 / 04` no topo, lista de projetos. Cada linha:

```
2025    SPEAKE            Audio platform, built from zero        BACKEND / API
2025    USINA SOCIAL      Teaching backend to 20 developers      EDUCATION
2024    ONUP ERP          Keeping an ERP alive                   PYTHON / SUPPORT
2026    [DEMO PROJECTS]   Things you can click and test          LIVE DEMOS
```

Hover revela descrição curta + `View Project →`. Cada uma abre página própria (Seção 6).

### 5.5 The Numbers

Faixa de métricas — **os números vêm da Seção 6, todos reais**.

```
500+          ~5,000        65%           20
users         requests/day  faster        developers taught
served        handled       API responses
```

Número em `--color-signal`, Space Grotesk 700, enorme. Legenda em mono cinza.

### 5.6 How I Work

Três blocos curtos. Copy pronto:

```
01 — I ask first, code second
   Before you pay for anything, we agree on exactly what "done" looks like.
   Most failed projects fail at this step, not at the code.

02 — I use AI, and I tell you so
   Claude Code is part of my workflow. It means you get things faster.
   It does not mean nobody checked the work — I review, test, and can
   explain every line I hand over.

03 — I teach, so I explain
   I train junior developers three classes a year. You will never get
   a status update you cannot understand.
```

### 5.7 Contato

Grande, simples, igual à referência.

```
GET IN TOUCH
```
`luizpaulo.ius@gmail.com` · Upwork · LinkedIn · GitHub

Rodapé: `Built with Astro. No trackers. Source on GitHub.`
*(Linkar o repositório do próprio site — para o público técnico, isso é uma peça de portfólio em si.)*

---

## 6. Case studies

Um `.md` por projeto em `src/content/work/`. **Estrutura fixa de cada página:**

1. **The problem** — em português claro, sem jargão, o que estava quebrado ou faltando
2. **What I built** — a solução em linguagem de leigo
3. **The result** — número medido
4. **Under the hood** — aqui sim, tags mono com o stack. É a válvula de escape do jargão: fica visível para o técnico, ignorável para o leigo.

### 6.1 SPEAKE — Audio station platform (2025 → present)

> ⚠️ Empregador atual. Descrever arquitetura e resultados, **nunca** código proprietário, dados de cliente ou segredos de negócio. Sem screenshots do produto sem autorização.

- **Problem:** A platform for audio stations needed a backend that did not exist yet. Everything — accounts, logins, payments, content delivery — had to be built from zero.
- **What I built:** The full server side. The part users never see: how they sign in safely, how their subscription gets charged correctly every month, how the app stays fast when hundreds of people use it at once.
- **Results:** 500+ users · ~5,000 requests/day · API responses 65% faster (350ms → 120ms) · near-zero downtime on deploys
- **Under the hood:** `Java 21` `Spring Boot 3.5` `Spring Security` `OAuth2` `JWT/Auth0` `Keycloak OIDC` `2FA/TOTP` `Stripe` `PostgreSQL` `Redis` `Caffeine` `Docker` `Jenkins` `AWS EC2/VPC` `Blue-Green` `OpenTelemetry` `Prometheus` `Grafana`

### 6.2 INSTITUTO USINA SOCIAL — Teaching backend (2025 → present)

- **Problem:** 20 people wanted to become developers and had no idea where to start.
- **What I built:** A course from scratch — programming logic through building and shipping a real REST API. Plus the lesson plans, the exercises, and one-on-one mentoring.
- **Results:** 3 classes · 20 students · 80%+ completion rate · dozens of first portfolios shipped with Git and GitHub
- **Under the hood:** `Java` `Spring Boot` `REST APIs` `Git` `GitHub`

*(Este case não é enfeite: para cliente de Upwork ele responde a maior objeção que existe — "esse dev vai saber conversar comigo?")*

### 6.3 ONUP CONSULTORIA — ERP support (2023 → 2024)

- **Problem:** A company was rolling out an ERP system that kept breaking in production.
- **What I built:** Fixes and maintenance in Python, proper version control, documented processes, and a real testing routine.
- **Results:** average ticket resolution time down 20% · fewer repeat failures after launch
- **Under the hood:** `Python` `Git` `ERP` `Software testing` `Technical documentation`

---

## 7. Demo projects — construir isto

**Esta é a parte de maior retorno do projeto inteiro.** O perfil do Upwork está sem portfólio, e é isso que substitui a falta de avaliações. Cada demo vira, ao mesmo tempo, uma página do site e um item de portfólio no Upwork.

Três demos, escolhidos por casarem com as skills cadastradas no Upwork:

**Demo 1 — Live REST API** *(o carro-chefe)*
API pública pequena com Java + Spring Boot: CRUD, autenticação JWT, docs Swagger, deploy em container. Na página do site, um botão **"Run this request"** que dispara a chamada de verdade e mostra o JSON com o tempo de resposta medido ao vivo.
→ *Isto é o substituto do Three.js: prova de backend, na tela, em tempo real.*

**Demo 2 — Automation workflow**
Um fluxo n8n ou script Python resolvendo uma tarefa chata de verdade (ex.: extrair dados de um site → limpar → planilha → notificação). Página com um GIF do fluxo rodando e o antes/depois em tempo gasto.

**Demo 3 — AI agent**
Um agente com OpenAI API que faz uma coisa útil e específica (ex.: lê um documento e responde perguntas sobre ele). Interface mínima, funcionando no navegador.

Requisitos de cada demo: repositório público no GitHub com README decente, deploy funcionando, e a página do site com as mesmas 4 seções da Seção 6.

---

## 8. Regras de linguagem — obrigatórias

Toda frase voltada ao público não-técnico passa por este filtro:

| ❌ Nunca escreva | ✅ Escreva |
|---|---|
| "Implemented OAuth2 Resource Server with persisted refresh tokens" | "Built the login system — users stay signed in safely, and nobody gets into an account that isn't theirs" |
| "Idempotent webhook handling for Stripe" | "Set up payments so a customer never gets charged twice, even if the connection drops mid-payment" |
| "Reduced p95 latency by 65% via distributed caching" | "Made the app respond almost 3x faster — from 350 milliseconds to 120" |
| "Modular monolith with ArchUnit-validated boundaries" | *(cortar — não interessa a ninguém fora de uma entrevista técnica)* |
| "Blue-Green deployment pipeline" | "Updates go live without the app ever going down" |

**O mecanismo:** frase em linguagem simples no corpo do texto + termos técnicos como **tags mono** logo abaixo. O leigo lê e entende; o técnico bate o olho nas tags e valida. Ninguém sai perdendo.

**Teste antes de publicar:** leia qualquer parágrafo em voz alta para alguém que não é da área. Se precisar explicar uma palavra, a palavra está errada.

---

## 9. Fases

**Fase 1 — Site de pé (meta: 1 fim de semana)**
Astro + Tailwind + tokens · Hero · posicionamento · índice de trabalhos · números · how I work · contato · os 3 case studies da Seção 6 · responsivo · deploy.
→ *Ao fim da Fase 1 o site já pode ir para o perfil do Upwork.*

**Fase 2 — Prova ao vivo**
Demo 1 (API rodando com o botão "Run this request"), depois demos 2 e 3. Subir cada um como item de portfólio no Upwork conforme fica pronto.

**Fase 3 — Refinamento**
Animações GSAP no scroll · badge circular girando · preloader com contador · toggle PT-BR · cursor customizado (opcional).

**Ordem importa:** um site simples no ar hoje vale mais que um site animado daqui a um mês. As animações não fecham contrato — o portfólio fecha.

---

## 10. Critérios de aceite

**Conteúdo**
- [ ] Nenhuma afirmação que não esteja neste arquivo ou no `CLAUDE.md` do projeto. Zero projeto inventado, zero cliente inventado, zero número inventado.
- [ ] Todo case study tem as 4 seções: problem / what I built / result / under the hood
- [ ] Nada confidencial da Speake

**Legibilidade**
- [ ] Corpo em weight 400, ≥18px, `line-height` ≥1.6, largura ≤62ch
- [ ] Mono não aparece em nenhum parágrafo
- [ ] Nenhum parágrafo com mais de 3 linhas
- [ ] Passou no teste de leitura em voz alta para não-técnico

**Técnico**
- [ ] Lighthouse ≥95 nas quatro categorias
- [ ] Legível com JavaScript desativado
- [ ] `prefers-reduced-motion` respeitado
- [ ] Contraste WCAG AA em todo texto (atenção ao `--color-muted` sobre `--color-ink`)
- [ ] Testado em 360px, 768px e 1440px
- [ ] Meta tags e OG image configurados (o link vai ser colado em proposta de Upwork — a prévia precisa ficar boa)

**Não fazer**
- [ ] Sem Three.js / WebGL / cena 3D
- [ ] Sem segunda cor de acento além de `--color-signal`
- [ ] Sem formulário de contato (e-mail direto converte mais e não quebra)
- [ ] Sem seção de "skills" com barrinhas de porcentagem
