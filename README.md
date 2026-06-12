# EPOCH ORACLE — Assem Badr's Portfolio

A cinematic five-chapter horizontal journey through an AI engineer's story, guided by a chapter-aware AI Oracle (Groq-powered) that can chat, navigate the site on command, listen to your voice, and speak Arabic.

**Stack:** Vite + React · GSAP ScrollTrigger (horizontal pinning) · Vercel Edge Function → Groq (free tier) · zero monthly cost.

---

## 🚀 Go live in 3 steps

**1. Push to GitHub**

```bash
cd My_Portfolio
git init
git add .
git commit -m "EPOCH ORACLE v1"
git branch -M main
git remote add origin https://github.com/AsemBadr01/My_Portfolio.git
git push -u origin main
```

**2. Import to Vercel**

Go to [vercel.com/new](https://vercel.com/new) → Import `My_Portfolio` → Framework preset: **Vite** (auto-detected) → before deploying, open **Environment Variables** and add:

| Name | Value |
|---|---|
| `GROQ_API_KEY` | your **new, rotated** Groq key (never the one that was ever pasted anywhere) |
| `GROQ_MODEL` | *(optional)* default `llama-3.3-70b-versatile` |
| `GROQ_FALLBACK` | *(optional)* default `llama-3.1-8b-instant` |

**3. Deploy.** Your site is live at `https://my-portfolio-<something>.vercel.app`. The Oracle works immediately — the Edge Function at `/api/oracle` holds the key server-side; it never reaches the browser.

---

## 🧪 Local development

```bash
npm install
npm run dev        # site at localhost:5173 — Oracle shows its friendly offline message (no API in plain Vite)
```

To test the Oracle locally, use Vercel's dev server (free):

```bash
npm i -g vercel
echo "GROQ_API_KEY=your_new_key" > .env.local   # .env* is gitignored
vercel dev
```

---

## 🗺️ What's where

```
api/oracle.js                 Edge proxy → Groq (model fallback chain, 429 friendly message, origin guard)
src/constants/oraclePrompt.js The Oracle's brain — all facts about Assem & Makhraj. Edit here to teach it new things.
src/constants/chapterData.js  Chapter names, accents, suggested pills, guided-tour narrations
src/lib/intent.js             Zero-cost client intents: navigation regex, "hire me", easter eggs
src/lib/streamApi.js          SSE streaming + the [[NAV:N]] sentinel parser
src/components/Experience.jsx GSAP horizontal engine, chapter detection, goToChapter, global UI
src/components/Oracle.jsx     The chat: skins per chapter, voice input, guided tour, streaming
src/components/chapters/      The five worlds
public/resume.html            Plain scannable resume (served at /resume via vercel.json rewrite)
public/*.webp                 Headshot + Oracle avatar
public/*.pdf                  Downloadable CV
```

## ✨ Try these on the live site

- Scroll (or use ← → / arrow keys) through the five chapters — the Oracle orb re-skins per chapter.
- Ask the Oracle: *"take me to Makhraj"* (client regex navigates free) or phrase it unusually — the model emits `[[NAV:4]]` and the site scrolls itself.
- Type **hire me** or **let's work together** → 🎉 confetti + contact card.
- Type **بسم الله** → gold particle burst. Type **matrix** → the rain accelerates.
- Click the 🎙 mic (Chrome/Edge) — on the Makhraj chapter it listens in Arabic (`ar-EG`).
- Toggle **GUIDED TOUR** (bottom-left) — the Oracle narrates each chapter as you arrive. First-time visitors get offered the tour automatically.
- Visit `/resume` for the plain version + PDF download.

## 🔧 Tuning notes

- **Arabic quality:** test the Oracle in Arabic after deploying. If it underwhelms, set `GROQ_MODEL=meta-llama/llama-4-scout-17b-16e-instruct` in Vercel env vars (officially multilingual incl. Arabic) — no code change. Current model list: [console.groq.com/docs/models](https://console.groq.com/docs/models).
- **Rate limits:** the free tier 429s gracefully — the Oracle replies "email Assem directly 😄". Abuse can never create a bill; there is no card on file anywhere.
- **Tour offer reset (for testing):** `localStorage.removeItem('epoch_tour_prompted')` in the console.
- **After July 1:** update `public/resume.html` + the PDF with the GridNox line whenever you're ready; the cinematic site already carries Chapter 06.
- **Mobile** stacks chapters vertically (no pinning) and the Oracle becomes a bottom sheet. **prefers-reduced-motion** disables rain/scrub/flash and shows final states instantly.
- Deviation from the original spec: plain CSS with custom properties instead of Tailwind — fewer dependencies, deterministic builds, and the five chapter aesthetics are fully custom anyway.

Built with Claude (Fable 5). Oracle runtime: Groq.
