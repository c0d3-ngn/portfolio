# imp-portfolio

Personal portfolio of Ivan Martin Prieto — Computer Science Engineer and Full Stack Developer.
Static site built with Astro, bilingual (EN `/`, ES `/es/`), with two modes: a designed **preview** site and an
interactive **dev** terminal (`/dev`, `/es/dev`).

## Stack

Astro 7 (static output) · React 19 islands · Tailwind CSS v4 · `motion` · TypeScript (strict) · Biome · Vitest · Bun.
The full set of project rules lives in [`CLAUDE.md`](./CLAUDE.md).

## Commands

| Command | What it does |
|---|---|
| `bun install` | Install dependencies and wire the git hooks in `.githooks/` |
| `bun run dev` | Dev server on `http://localhost:4321` |
| `bun run build` | Production build into `dist/` |
| `bun run preview` | Serve `dist/` locally |
| `bun run check` | Type-check `.astro`/`.ts` and content schemas |
| `bun run lint` / `lint:fix` | Biome lint and format |
| `bun run test` | Vitest (pure logic only) |

Run `lint`, `check`, `test` and `build` before pushing — the `pre-push` hook does it for you.

> If you add or remove a dependency while `bun run dev` is running, restart the dev server. Vite keeps a stale
> dependency cache (`504 Outdated Optimize Dep`), no island hydrates, and animated content stays hidden.

## Editing content

| What | Where |
|---|---|
| Name, role, tagline, stack, email, socials (per language) | `src/data/profile.ts` |
| About text | `src/content/about/<en\|es>/index.md` |
| Projects | `src/content/projects/<en\|es>/*.md` |
| Career | `src/content/career/<en\|es>/*.md` |
| UI copy | `src/i18n/ui.ts` |
| Terminal copy | `src/i18n/terminal.ts` |

Every content entry must exist in **both** languages. Frontmatter schemas are in `src/content.config.ts`.
A project's cover illustration is chosen with `preview: pulse | bars | grid | roots`.

## Deploying (GitHub → Cloudflare Pages)

Every push to the production branch builds and publishes the site; other branches get preview deployments.

| Cloudflare Pages setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `bun run build` |
| Build output directory | `dist` |
| Node version | read from `.node-version` (22) |

Configuration that lives in the repo (so it deploys with the code):

- `public/_headers` — security headers (HSTS, CSP, `nosniff`, frame/referrer/permissions policies), immutable caching for
  `/_astro/*`, `X-Robots-Tag: noindex` on `/dev` and `/es/dev`, and `noindex` on every `*.pages.dev` hostname so the
  Pages URL never competes with `ivanpmartin.com` in search results.
- `src/pages/404.astro` — Cloudflare Pages serves the generated `404.html` for unknown URLs.
- `src/pages/sitemap.xml.ts` and `src/pages/robots.txt.ts` — generated at build time from `site` in
  `astro.config.mjs` and the locale list in `src/i18n/ui.ts`. The production domain is therefore defined in **one**
  place (`site`). Adding a locale updates the sitemap and `hreflang` automatically.
- `public/og.png` (1200×630) is the social-share image. Regenerate it if the name, role or tagline change.

Cloudflare dashboard settings worth keeping as they are today:

- **Always Use HTTPS** on and `www` → apex redirect (both already behave correctly in production).
- **Email Address Obfuscation** and **Rocket Loader** off. Either one rewrites the HTML or defers scripts after the
  server rendered it, which breaks React hydration of the islands (the email appears in several of them).
- If **Web Analytics** is ever enabled, allow its beacon in the CSP in `public/_headers`
  (`script-src` and `connect-src` need `https://static.cloudflareinsights.com` and `https://cloudflareinsights.com`),
  otherwise the browser will block it.

After the first deploy of a change to indexable pages: submit `https://ivanpmartin.com/sitemap.xml` in Google Search
Console and Bing Webmaster Tools, and inspect `/` and `/es/` once to request indexing.
