# Elara Vance — Portfolio

[![CI](https://github.com/sbicpcl/elara-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/sbicpcl/elara-portfolio/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

An award-style portfolio for a fictional product & interaction designer, built with the modern React stack.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sbicpcl/elara-portfolio&project-name=elara-portfolio&repository-name=elara-portfolio)

> The original reference repo (`ai-skin-specialist`) is a Python/Gradio app, so there is no JS
> stack to mirror literally. This is the idiomatic modern equivalent for a marketing site:
> **Next.js App Router + TypeScript + React**, no runtime UI dependencies.

## Stack
- **Next.js 14** (App Router, static generation)
- **TypeScript** (strict)
- **React 18**
- Plain CSS with design tokens (theme-able, no Tailwind needed) — the full visual system lives in `app/globals.css`

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (prerenders every page)
npm start        # serve the production build
```

## What's here
- **Home** (`app/page.tsx`) — preloader, hero reveal, skills marquee, filterable work grid, about + animated stats, capabilities, testimonial, contact.
- **Projects filter** (`components/WorkFilter.tsx`) — client-side filtering by discipline (All / Mobile / Web App / Design System / Branding) with animated cards and per-card 3D tilt.
- **Case-study pages** (`app/work/[slug]/page.tsx`) — one statically generated page per project via `generateStaticParams`, with overview, challenge, approach, outcome metrics, and a "next project" link. Per-page SEO metadata.
- **Theme** — light/dark toggle persisted to `localStorage`, with a no-flash inline script in `app/layout.tsx`.
- **Effects** (`components/Effects.tsx`) — custom cursor, scroll-reveal, count-up, and card glow, all `prefers-reduced-motion` aware and re-running per route.

- **Contact form** (`components/ContactForm.tsx` + `app/api/contact/route.ts`) — accessible form with
  client validation, submitting/success/error states, and a honeypot. The API route validates server-side
  and logs the enquiry; add an email provider to actually deliver it (see below).

## Project data & images
All projects live in `lib/projects.ts`. Add a new object to the `projects` array and a case-study page is
generated for it automatically — no other wiring required.

Each project renders a generated UI-mockup (`components/ProjectThumb.tsx`) by default. To use a **real
image**, drop a file in `public/projects/` and set `image` / `imageAlt` on the project — see
`public/projects/README.md`.

## Contact email delivery
By default `/api/contact` validates and logs enquiries but sends no email. To enable delivery:

1. `cp .env.example .env.local` and fill in your provider key (example uses [Resend](https://resend.com)).
2. Uncomment the delivery block in `app/api/contact/route.ts`.

## Deploy (Vercel)
Zero-config — import the repo into Vercel and it auto-detects Next.js. `vercel.json` sets `cleanUrls`,
and security headers are configured in `next.config.mjs`. Add any env vars in the Vercel dashboard.

```bash
npm i -g vercel && vercel        # or push to GitHub and import at vercel.com
```
