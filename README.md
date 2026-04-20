# Learn Indian Languages — Kavya's Palace

Interactive language learning app for a 4-year-old. Kannada, Hindi, Gujarati.

- **Live:** https://zesty-bublanina-d4336d.netlify.app/
- **Architecture:** see `CLAUDE.md`
- **Adding content:** see `ADDING_CONTENT.md`
- **Spec:** `docs/superpowers/specs/2026-04-20-kavyas-palace-design.md`

## Running locally

No build step. Open `index.html` directly, or for the Sarvam TTS proxy to work:
```bash
netlify dev
```
and set `SARVAM_API_KEY` in a `.env` file.

## Running engine tests

Open `index.html?test=1` in a browser. Results print to the console.

## Deployment

Auto-deploys from `main` to Netlify. `netlify/functions/tts.js` proxies Sarvam TTS with the API key stored in Netlify env vars.
