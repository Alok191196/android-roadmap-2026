# Android Developer Roadmap 2026

Interactive roadmap for Android development in 2026 — Compose-first, with sections covering Architecture, Modularization, Network, Adaptive UI, Camera & Media, Background Work, Privacy & Security, On-Device AI, Kotlin Multiplatform, and more.

**Live site:** https://alok191196.github.io/android-roadmap-2026/

Click any topic to open a detail drawer with description and curated free resources (Official docs, articles, videos, repos, courses). Mark topics as Done / In Progress / Skip — progress is saved in your browser and (optionally) synced across devices via a private GitHub Gist.

## Sync progress across devices

1. Click **Sync** in the top toolbar.
2. Generate a [GitHub Personal Access Token](https://github.com/settings/tokens/new?scopes=gist&description=Android%20Roadmap%20Sync) with the `gist` scope.
3. Paste it; leave Gist ID blank on the first device — a private gist will be created.
4. On other devices, open the same site, paste the same token, and copy the Gist ID from the first device. Progress will pull automatically.

The token is stored only in your browser's localStorage. Don't paste it on shared machines.

## Regenerating

The site is a single static `index.html` produced from `figma-plugin/`:

```bash
cd figma-plugin
node generate-svg.js     # writes ../roadmap_2026.svg
node generate-html.js    # writes ../index.html (inlines SVG + per-topic content from content/*.json)
```

Per-topic content lives in `figma-plugin/content/*.json` (one file per batch).
