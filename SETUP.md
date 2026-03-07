# Netlify + Notion Setup

1. Create a local `.env` file from `.env.example`.
2. Put your real `NOTION_TOKEN` in `.env`.
3. Set `NOTION_CONTACT_DB_ID` and `NOTION_NEWSLETTER_DB_ID` in `.env` (defaults are already provided in `.env.example`).
4. Install Netlify CLI manually, then run local development with `npm run dev` (this starts Netlify Dev and proxies Vite).
5. If you only want the frontend without functions, run `npm run dev:vite`.
6. Test endpoints locally:
   - `/.netlify/functions/contact`
   - `/.netlify/functions/newsletter`

Residency form:
- Add `NOTION_RESIDENCY_DB_ID` to your local `.env`.
- New endpoint: `/.netlify/functions/residency`.
- This form submits through a server-side function, so `NOTION_TOKEN` is not exposed to the browser.
- Netlify Dev serves the site on `http://localhost:8888` and proxies Vite on port `5177`. Use `8888` when testing forms.

Security notes:
- `NOTION_TOKEN` must never be exposed in frontend/client code.
- The currently exposed Notion secret should be rotated immediately.
