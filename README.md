# Lumi — AI Skin Care Specialist

[![CI](https://github.com/sbicpcl/elara-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/sbicpcl/elara-portfolio/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)](https://nextjs.org/)
[![Claude](https://img.shields.io/badge/Claude-vision-d97757)](https://www.anthropic.com/)

Share a photo of your skin and Lumi — an AI skincare specialist — reads your skin type and visible
concerns, then builds a personalized AM/PM routine, suggests key ingredients, and answers follow-up
questions. Powered by **Claude vision** (`claude-opus-4-8`).

> Inspired by the reference repo `AIwithhassan/ai-skin-specialist` (a Python/Gradio app), rebuilt as a
> modern **Next.js App Router + TypeScript** web app.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sbicpcl/elara-portfolio&project-name=lumi-skin&repository-name=lumi-skin)

## Stack
- **Next.js 14** (App Router, serverless API routes)
- **TypeScript** (strict) · **React 18**
- **`@anthropic-ai/sdk`** — Claude vision + structured JSON output
- Plain CSS design system with light/dark themes (`app/globals.css`)

## How it works
1. **Upload / snap a photo** — `components/SkinAnalyzer.tsx` downscales it client-side (~1024px JPEG).
2. **Analyze** — `POST /api/analyze` sends the image to Claude vision with a strict JSON schema
   (`output_config.format`), returning skin type, concerns (with severity), an AM/PM routine, and
   key ingredients.
3. **Chat** — `POST /api/chat` answers follow-ups, grounded in your analysis.

Photos are analyzed in-request and **never stored** (stateless).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## API key & demo mode
Lumi works out of the box in **demo mode** — with no key set, `/api/analyze` and `/api/chat` return
clearly-labelled sample data so the whole flow is usable.

To enable **live AI analysis**:
1. `cp .env.example .env.local` and set `ANTHROPIC_API_KEY` (from https://console.anthropic.com).
2. Restart `npm run dev`. Real analysis activates automatically.

On **Vercel**: add `ANTHROPIC_API_KEY` under Settings → Environment Variables, then redeploy.

## Deploy (Vercel)
Zero-config — import the repo at vercel.com (auto-detects Next.js). The analyze/chat routes set
`maxDuration = 60` for vision latency headroom. Add the API key env var to go live.

## Project layout
- `lib/anthropic.ts` — client, model, types, JSON schema, prompts, demo fallback data
- `app/api/analyze/route.ts` · `app/api/chat/route.ts` — serverless endpoints
- `components/SkinAnalyzer.tsx` — the upload → analyze → results → chat flow
- `app/page.tsx` — hero, tool, how-it-works, ingredients, about

## Disclaimer
Lumi provides **general cosmetic guidance, not medical advice**, and does not diagnose conditions.
Patch-test new products, introduce one active at a time, and consult a board-certified dermatologist
for persistent, painful, or changing skin concerns.
