# Melody

Personal AI assistant for phone, Windows, and macOS.

## Current status

Repository initialized. Application implementation and deployment have not started. No executable app, live service, or account integrations are included yet.

## Intended capabilities

- Voice and text conversations in English and Spanish.
- A responsive interface for phones and computers.
- Authorized Gmail, Outlook, and GitHub integrations.
- Web search and browser assistance.
- Desktop screen assistance and app control through a separately installed companion, with operating system permissions.

These are planned capabilities, not implemented features. Safari support requires macOS. Available desktop and mobile controls will depend on platform permissions.

## Credentials

API keys must stay on the backend or in an operating system credential store. Never include credentials in browser code, commits, issues, screenshots, or documentation. Environment files, key files, and local user data are excluded by `.gitignore`. Ignore rules do not remove previously committed files.

ChatGPT account connections do not automatically grant access to this application. Each integration requires its own supported authorization flow.

## Development milestones

1. Build and verify AI text conversations with a server-side credential.
2. Add mobile and desktop layouts, voice input, and spoken replies.
3. Add account authorization and verify each integration independently.
4. Build and test Windows/macOS companions for screen assistance and app control.
5. Deploy the backend and prepare platform-specific releases.

GitHub hosts the source code. A secure backend deployment and desktop installation are separate delivery steps.
