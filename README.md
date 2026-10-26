# Melody

A personal AI assistant with a responsive web interface for phones, Windows, and macOS.

**App:** https://melody-framber.bframber12.chatgpt.site (private; sign in with the owner's ChatGPT account).

## Implemented

- English/Spanish chat with OpenAI Responses API, using a server-side key.
- Optional OpenAI web search with clickable sources.
- Voice dictation through browser speech recognition, with recorded transcription fallback; replies can be read aloud by the device.
- PNG/JPEG/WebP attachments under 2 MB and on-demand screen snapshots where the browser supports screen sharing.
- Device-local conversation history, export, and clear-history controls. Images are excluded from persisted history.
- Read-only GitHub repository metadata endpoint, requiring a server-side token and explicit repository allowlist.
- Windows/macOS screenshot companion source in `desktop/`.

## Current limitations

Melody now uses a dedicated key in Making Money / Default project, as requested by the owner. Both Personal and Making Money returned `credit_balance_exhausted` during live checks on October 26, 2026. The UI handles this as a billing error; AI replies require API credits in Making Money. A ChatGPT subscription does not pay for API requests. Melody and Making Money share organization credits and project limits. ChatGPT sign-in was verified in the hosted app.

Gmail and Outlook are **not connected or implemented**. Their cards explain the missing provider OAuth setup and open the mail website. GitHub metadata code is implemented but no provider token has been configured or verified. ChatGPT account connections do not transfer to this app; the current Sites integration-discovery tool was unavailable.

This version cannot click/type in other apps, autonomously control Safari, continuously watch the screen, or listen for a wake word in the background. Desktop helper source has been syntax-checked but not run on physical Windows/Mac hardware. Conversation history does not sync across devices. Voice availability varies by browser and device; iOS background microphone use is not provided.

## Development

Requires Node 22.13+ and pnpm. The project uses React with Vinext and the supported Sites Cloudflare Workers integration.

```sh
pnpm install
cp .env.example .dev.vars
# Configure backend credentials locally; never commit .dev.vars.
pnpm dev
```

Use the Sites tooling/environment for hosted preview and deployment. Normal GitHub Pages hosting cannot run this backend. The tracked `.openai/hosting.json` identifies the private deployment; it contains no secrets.

```sh
node --test tests/melody.test.mjs
pnpm exec tsc --noEmit
pnpm build
```

The server accepts same-origin API POST requests, bounds chat input and attachments, rejects user-supplied system roles, and sends OpenAI requests with `store: false`. No backend chat database is configured. Hosted access is owner-private through Sites. If deploying elsewhere, add authenticated access and production rate limits before exposing the paid API routes. Do not trust client-provided identity headers outside Sites.

## Secrets and optional GitHub access

Use the hosting platform's secret manager for `OPENAI_API_KEY`. Do not expose it through `NEXT_PUBLIC_*` values. The example file contains names only.

To enable GitHub metadata reads, configure a fine-grained, read-only `GITHUB_TOKEN` scoped to the chosen repositories, and set `GITHUB_REPOSITORIES` to their comma-separated `owner/name` identifiers. The endpoint does not support repository writes or arbitrary provider URLs. Do not paste tokens into the chat UI.

## Privacy

Messages and supplied images go to OpenAI. Search invokes OpenAI's web search tool. Browser speech recognition may use the browser vendor's speech service; fallback recorded transcription uses OpenAI. Speech synthesis uses the device/browser voice service. Conversations remain in browser local storage until cleared; shared browser profiles can access them. No service worker caches private responses.

See `desktop/README.md` for the optional screenshot helper. App controls, provider OAuth, cross-device sync, signed installers, and wake-word support remain future milestones.
