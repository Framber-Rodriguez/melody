# Salomon

A personal AI assistant project built with React, TypeScript, Vite, and a Node.js backend. Designed for phones, Windows, and macOS.

**Open Salomon:** https://framber-rodriguez.github.io/salomon/

The primary project is this GitHub repository. The interface builds into `docs/` for GitHub Pages and opens without ChatGPT sign-in. The earlier ChatGPT Sites deployment is retained separately; it is not required to build or run this version.

## Quick start

Requires Node.js 22.13 or newer and pnpm (version declared in `package.json`).

```sh
pnpm install
pnpm build
pnpm start
```

Open `http://127.0.0.1:8787`. The Node server serves the interface and API from the same origin. No ChatGPT account is needed.

For interface development:

```sh
pnpm dev
```

The Vite development interface and GitHub Pages do not include a server. Connect a separately running backend under Settings when needed.

## GitHub Pages

The committed `docs/` directory contains the generated static interface, with relative asset URLs so it works beneath the repository path. Publish through Settings → Pages → Deploy from a branch → `main` → `/docs`.

The owner approved making this repository public. GitHub Pages is enabled from `main/docs`, and the initial deployment succeeded. The public interface opens without ChatGPT sign-in at https://framber-rodriguez.github.io/salomon/.

After changing UI code, run `pnpm build` and commit the updated `docs/` files with the source changes. GitHub's branch-based Pages deployment publishes that built interface. No API keys belong in the Pages build, repository, or GitHub Pages configuration.

## AI backend

GitHub Pages serves static HTML/CSS/JavaScript. It does not execute the Node backend or store private API credentials. The page remains usable for design, voice dictation where supported, conversation management, and settings. AI responses, image analysis, search, and recorded-audio transcription need a backend.

Configure the backend's environment locally or through a server's secret manager:

```sh
cp .env.example .env.local
# Edit .env.local locally. Never commit it.
pnpm start
```

`OPENAI_API_KEY` belongs only on the backend. Salomon currently uses `gpt-4.1-mini` by default. Both the Personal and Making Money organizations returned `credit_balance_exhausted` during checks on October 26, 2026; available API credits are still needed for OpenAI replies. Moving the interface to GitHub does not remove provider charges.

### Connecting a remotely hosted backend

- Keep backend traffic on HTTPS.
- Set `HOST=0.0.0.0`, `PORT`, and a unique `MELODY_ACCESS_TOKEN` of at least 24 characters. A remotely bound server refuses to start without this access code.
- Set `ALLOWED_ORIGINS` to the exact browser origins allowed to call it, such as your GitHub Pages origin. Wildcard origins are not accepted.
- In Salomon → Settings, enter the backend origin and its access code. Do not enter an AI provider API key in the browser.

The backend URL is stored on that browser; the access code is stored in session storage for the tab session. The server enforces the code, origin checks, request-size bounds, and a basic per-address request limit. This is a personal-project access code, not a multi-user identity system. Use a proper authentication service before expanding access to multiple users.

No new external backend host has been provisioned. The earlier Sites backend is private and requires ChatGPT sign-in; it is not automatically a cross-origin backend for GitHub Pages.

## Implemented features

- Responsive navy/violet/blue interface with original scalable Salomon logo assets.
- English/Spanish chat, optional web search with sources, image attachments, and supported-browser screen snapshots (with a connected backend).
- Browser voice dictation and device spoken replies. Recorded transcription fallback needs the backend and provider access.
- Local conversation history, export, and deletion. Images are not persisted in history.
- Optional read-only GitHub metadata API with a server token and repository allowlist.
- Windows/macOS screenshot helper source in `desktop/`.

## Not yet implemented

Gmail/Outlook authorization, email sending/reading, autonomous Safari or desktop app control, continuous screen watching, wake-word/background listening, cross-device conversation sync, signed Windows/Mac installers, and an unlimited free hosted AI service are not included. GitHub metadata reads require separate credentials and have not been connected. Existing ChatGPT app connections do not transfer to the independent app.

## Validation

```sh
node --test tests/*.test.mjs
pnpm exec tsc --noEmit
pnpm build
```

Tests cover request validation, role injection, image forwarding, quota errors, backend URL restrictions, static serving without ChatGPT, access-code checks, CORS restrictions, and remote-server configuration. The desktop helper has not been verified on physical Windows/Mac hardware.

## Source map

| Path | Purpose |
| --- | --- |
| `app/page.tsx`, `app/globals.css` | Shared interface and visual design |
| `pages/`, `vite.pages.config.ts` | Independent static application entry/build |
| `docs/` | Generated GitHub Pages website |
| `lib/browser-api.mjs` | Configurable backend connection |
| `lib/melody.mjs` | Server-side AI request validation and provider calls |
| `scripts/standalone-server.mjs` | Standalone Node server |
| `public/brand/` | Original SVG logo assets |
| `desktop/` | Optional screenshot helper source |
| `app/api/`, `worker/`, `.openai/` | Earlier Sites deployment adapter |

The earlier deployment can be developed separately with `pnpm dev:sites`, built with `pnpm build:sites`, and run with `pnpm start:sites` in its supported hosting environment.

## Privacy

Messages/images are sent to the backend selected in Settings and its configured provider. OpenAI requests use `store: false`. Browser speech recognition and speech synthesis may use device/browser speech services. Conversations are stored in browser local storage until cleared; users sharing a browser profile can access them. No API keys or conversation data are embedded in the static build.
