#!/usr/bin/env node
// Builds ../index.html — a single static page that wraps roadmap_2026.svg
// in a roadmap.sh-style interactive shell:
//   - Click any leaf node → side drawer with Resources tab, AI Tutor tab,
//     status pill (Pending / Done / Skipped), description, badged resource links
//   - Search filter dims non-matching nodes
//   - Progress persisted in localStorage
//
// Reads topic content from figma-plugin/content/*.json (one file per agent
// batch, all merged into a single inline registry). If a topic has no entry,
// the drawer falls back to a generic message + canonical search links.
//
// Run after generate-svg.js:  node figma-plugin/generate-html.js

const fs = require("fs");
const path = require("path");

const svgPath = path.join(__dirname, "..", "roadmap_2026.svg");
const outPath = path.join(__dirname, "..", "index.html");
const contentDir = path.join(__dirname, "content");

if (!fs.existsSync(svgPath)) {
  console.error("Missing roadmap_2026.svg — run generate-svg.js first.");
  process.exit(1);
}
const svg = fs.readFileSync(svgPath, "utf8");

// Merge all content/*.json (skipping the assignments/ subfolder).
const registry = {};
let mergedCount = 0;
let missingFiles = [];
if (fs.existsSync(contentDir)) {
  for (const file of fs.readdirSync(contentDir)) {
    if (!file.endsWith(".json")) continue;
    const full = path.join(contentDir, file);
    if (fs.statSync(full).isDirectory()) continue;
    try {
      const arr = JSON.parse(fs.readFileSync(full, "utf8"));
      if (!Array.isArray(arr)) continue;
      for (const item of arr) {
        if (item && item.id) {
          registry[item.id] = item;
          mergedCount++;
        }
      }
    } catch (e) {
      console.warn(`Skipping malformed ${file}: ${e.message}`);
      missingFiles.push(file);
    }
  }
}
console.log(`Merged ${mergedCount} content entries from ${contentDir}`);
if (missingFiles.length) console.warn(`  (${missingFiles.length} files failed to parse)`);

const contentJson = JSON.stringify(registry).replace(/</g, "\\u003c");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Android Developer Roadmap 2026</title>
<meta name="description" content="Interactive Android Developer Roadmap for 2026. Track your progress through Kotlin, Compose, Architecture, KMP, On-Device AI, and more.">
<style>
  :root {
    /* Light page theme to match roadmap.sh */
    --bg: #f6f7fb;
    --panel: #ffffff;
    --border: #e3e5ed;
    --fg: #0f1430;
    --muted: #4b5063;
    --accent: #2563eb;
    --done: #d1d5db;
    --done-stroke: #9ca3af;
    --skipped: #e5e7eb;
    --yellow: #FFF170;
    --yellow-fg: #0f1430;
    /* Drawer (light theme to match roadmap.sh) */
    --d-bg: #ffffff;
    --d-fg: #0f1430;
    --d-muted: #4b5063;
    --d-border: #e3e5ed;
    --d-soft: #f4f5f9;
    --tab-active-bg: #0f1430;
    --tab-active-fg: #ffffff;
    --tab-bg: #f4f5f9;
    --tab-fg: #0f1430;
    --status-bg: #f4f5f9;
    --status-fg: #0f1430;
    --green: #16a34a;
    --green-soft: #dcfce7;
    --official-bg: #2563eb;
    --official-fg: #ffffff;
    --article-bg: #f5d971;
    --article-fg: #4a3a08;
    --video-bg: #ddd6fe;
    --video-fg: #5b21b6;
    --course-bg: #16a34a;
    --course-fg: #ffffff;
    --repo-bg: #6b21a8;
    --repo-fg: #ffffff;
    --book-bg: #6b7280;
    --book-fg: #ffffff;
    --roadmap-bg: #0f1430;
    --roadmap-fg: #ffffff;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: var(--bg); color: var(--fg); font-family: "Open Sans Hebrew", Inter, system-ui, -apple-system, sans-serif; }
  header {
    position: sticky; top: 0; z-index: 50;
    background: var(--panel); border-bottom: 1px solid var(--border);
    padding: 10px 20px; display: flex; flex-direction: column; gap: 10px;
  }
  .topbar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
  .topbar .spacer { flex: 1; }
  .topbar h1 { margin: 0; font-size: 16px; font-weight: 700; }
  .page-tabs { display: inline-flex; gap: 4px; border-bottom: 1px solid transparent; }
  .page-tab {
    background: transparent; border: 0; color: var(--muted);
    padding: 8px 12px; font: inherit; font-weight: 600; font-size: 14px;
    cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
    border-bottom: 2px solid transparent;
  }
  .page-tab.active { color: var(--fg); border-bottom-color: var(--fg); }
  .page-tab .ico { font-size: 14px; }

  input[type="search"] {
    background: #fff; color: var(--fg); border: 1px solid var(--border);
    border-radius: 8px; padding: 7px 12px; font: inherit; width: 220px;
  }
  input[type="search"]:focus { outline: none; border-color: var(--accent); }
  button.btn {
    background: #fff; color: var(--fg); border: 1px solid var(--border);
    border-radius: 8px; padding: 7px 12px; font: inherit; font-weight: 600; cursor: pointer;
  }
  button.btn:hover { background: #f4f5f9; }

  /* Segmented stages bar */
  .stages {
    display: flex; gap: 6px; align-items: center;
    background: #fff; border: 1px solid var(--border);
    border-radius: 10px; padding: 6px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  }
  .stage {
    flex: 1; min-width: 120px;
    background: #f4f5f9; color: var(--muted);
    border: 0; border-radius: 8px; padding: 8px 14px;
    font: inherit; font-weight: 700; font-size: 13px;
    display: inline-flex; align-items: center; gap: 6px; cursor: default;
    white-space: nowrap;
  }
  .stage .ico { font-size: 14px; }
  .stage .pct { margin-left: auto; font-variant-numeric: tabular-nums; }
  .stage.active { background: var(--yellow); color: var(--yellow-fg); }
  .stage-more {
    background: #f4f5f9; color: var(--muted); border: 0; border-radius: 8px;
    padding: 8px 12px; font: inherit; cursor: pointer;
  }

  .canvas { padding: 24px; overflow: auto; min-height: calc(100vh - 120px); background: var(--bg); }
  .canvas svg { display: block; max-width: 100%; height: auto; margin: 0 auto; }

  /* SVG node states — light theme */
  svg [data-kind="node"] { cursor: pointer; transition: opacity .2s; }
  svg [data-kind="node"]:hover rect { stroke-width: 3; }
  svg [data-kind="node"][data-status="done"] rect { fill: var(--done); stroke: var(--done-stroke); }
  svg [data-kind="node"][data-status="done"] text { text-decoration: line-through; opacity: 0.65; }
  svg [data-kind="node"][data-status="in-progress"] rect { fill: #fde68a; stroke: #d97706; }
  svg [data-kind="node"][data-status="skipped"] rect { fill: var(--skipped); stroke: var(--done-stroke); }
  svg [data-kind="node"][data-status="skipped"] text { text-decoration: line-through; opacity: 0.45; }
  svg [data-kind="group"] { cursor: pointer; }
  svg [data-kind="group"]:hover rect { stroke-width: 3; }
  svg [data-kind="section"] { cursor: pointer; }
  svg [data-hidden="true"] { opacity: 0.18; }

  /* Drawer — roadmap.sh-style (light theme) */
  .drawer {
    position: fixed; top: 0; right: 0; bottom: 0; width: 640px; max-width: 96vw;
    background: var(--d-bg); color: var(--d-fg);
    border-left: 1px solid var(--d-border); box-shadow: -8px 0 24px rgba(0,0,0,0.18);
    transform: translateX(100%); transition: transform .25s ease;
    z-index: 60; display: flex; flex-direction: column;
  }
  .drawer.open { transform: translateX(0); }

  .drawer-top {
    display: flex; align-items: center; gap: 8px;
    padding: 14px 20px; border-bottom: 1px solid var(--d-border);
    background: var(--d-bg);
  }
  .tab {
    background: var(--tab-bg); color: var(--tab-fg);
    border: 0; border-radius: 8px; padding: 8px 14px;
    font: inherit; font-weight: 600; font-size: 13px;
    cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
  }
  .tab.active { background: var(--tab-active-bg); color: var(--tab-active-fg); }
  .tab[disabled] { opacity: 0.55; cursor: not-allowed; }
  .tab .ico { font-size: 14px; }

  .status-wrap { position: relative; }
  .status-trigger {
    display: inline-flex; align-items: center; gap: 8px;
    background: #fff; color: var(--d-fg);
    border: 1px solid var(--d-border); border-radius: 10px;
    padding: 7px 12px; font: inherit; font-size: 14px; font-weight: 600;
    cursor: pointer; line-height: 1;
  }
  .status-trigger:hover { background: #fafbfd; }
  .status-trigger .chevron {
    width: 12px; height: 12px; opacity: 0.5;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'><path d='M3 4.5L6 7.5L9 4.5' stroke='%230f1430' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>") no-repeat center/12px 12px;
  }
  .status-dot {
    width: 9px; height: 9px; border-radius: 50%; flex: 0 0 9px;
    background: #cdd2dd; /* pending */
  }
  .status-dot[data-value="done"] { background: #22c55e; }
  .status-dot[data-value="in-progress"] { background: #eab308; }
  .status-dot[data-value="skipped"] { background: #0f1430; }

  .status-menu {
    position: absolute; top: calc(100% + 6px); right: 0;
    background: #fff; border: 1px solid var(--d-border); border-radius: 10px;
    box-shadow: 0 6px 20px rgba(15,20,48,0.12);
    padding: 6px; min-width: 220px; z-index: 70;
    display: none;
  }
  .status-menu.open { display: block; }
  .status-option {
    display: flex; align-items: center; gap: 12px;
    width: 100%; padding: 8px 10px; border: 0; background: transparent;
    color: var(--d-fg); font: inherit; font-size: 14px; font-weight: 600;
    border-radius: 6px; cursor: pointer; text-align: left;
  }
  .status-option:hover { background: var(--d-soft); }
  .status-option .label { flex: 1; }
  .status-option .kbd {
    font-family: "SF Mono", Menlo, monospace; font-size: 12px;
    color: var(--d-muted); font-weight: 500;
    border: 0; background: transparent;
  }

  .drawer-close {
    background: var(--d-soft); border: 0; color: var(--d-fg);
    font-size: 18px; line-height: 1; padding: 0;
    width: 36px; height: 36px; border-radius: 8px; cursor: pointer;
  }
  .drawer-close:hover { background: #e9eaf2; }

  .sync-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #cdd2dd; margin-right: 4px; vertical-align: middle; }
  .sync-dot[data-state="ok"] { background: #22c55e; }
  .sync-dot[data-state="syncing"] { background: #eab308; }
  .sync-dot[data-state="error"] { background: #ef4444; }

  .sync-modal { position: fixed; inset: 0; background: rgba(15,20,48,0.45); display: none; align-items: center; justify-content: center; z-index: 50; }
  .sync-modal[aria-hidden="false"] { display: flex; }
  .sync-card { background: #fff; width: 520px; max-width: 92vw; border-radius: 12px; box-shadow: 0 24px 60px rgba(15,20,48,0.25); overflow: hidden; }
  .sync-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid var(--border); }
  .sync-head h3 { margin: 0; font-size: 17px; font-weight: 700; }
  .sync-body { padding: 18px 22px 22px; }
  .sync-help { margin: 0 0 14px; font-size: 13.5px; color: var(--muted); line-height: 1.5; }
  .sync-help code { background: #f1f3f8; padding: 1px 5px; border-radius: 4px; font-size: 12.5px; }
  .sync-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; font-size: 13px; }
  .sync-field span { color: var(--d-fg); font-weight: 500; }
  .sync-field input { padding: 9px 11px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; font-family: inherit; }
  .sync-field input:focus { outline: 2px solid #93c5fd; outline-offset: -1px; }
  .sync-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
  .btn-primary { background: #0f1430; color: #fff; border-color: #0f1430; }
  .btn-primary:hover { background: #1f2547; }
  .sync-status { margin-top: 12px; font-size: 13px; min-height: 18px; color: var(--muted); }
  .sync-status[data-kind="ok"] { color: #15803d; }
  .sync-status[data-kind="error"] { color: #b91c1c; }

  .drawer-body { padding: 26px 32px 36px; overflow-y: auto; flex: 1; }
  .drawer-body h1.topic-title { margin: 0 0 18px; font-size: 38px; font-weight: 800; line-height: 1.15; letter-spacing: -0.01em; }
  .topic-desc { color: var(--d-fg); font-size: 17px; line-height: 1.6; }
  .topic-desc p { margin: 0 0 14px; }
  .topic-desc ol { padding-left: 22px; margin: 0 0 16px; }
  .topic-desc ol li { margin-bottom: 12px; }
  .topic-desc ul { padding-left: 22px; margin: 0 0 16px; }
  .topic-desc ul li { margin-bottom: 6px; }
  .topic-desc strong { font-weight: 700; }
  .topic-desc code { background: var(--d-soft); padding: 1px 6px; border-radius: 4px; font-family: "SF Mono", Menlo, monospace; font-size: 0.9em; }
  .topic-desc a { color: var(--official-bg); }

  .resources-section { margin-top: 28px; padding-top: 4px; position: relative; }
  .resources-pill {
    display: inline-flex; align-items: center; gap: 6px;
    color: var(--green);
    border: 1px solid var(--green); background: var(--d-bg);
    border-radius: 999px; padding: 5px 14px; font-size: 12px; font-weight: 700;
    position: relative; z-index: 1;
  }
  .resources-pill .heart { font-size: 11px; }
  .resources-rule { border-bottom: 1px solid var(--green); position: relative; top: -14px; margin-bottom: 14px; }

  .resource-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
  .resource-row { display: flex; align-items: center; gap: 14px; }
  .resource-row a { color: var(--d-fg); text-decoration: underline; text-underline-offset: 3px; font-size: 16px; word-break: break-word; }
  .resource-row a:hover { color: var(--official-bg); }
  .badge {
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: 4px; padding: 3px 9px; font-size: 11px; font-weight: 700;
    text-transform: capitalize; min-width: 72px; flex: 0 0 auto;
  }
  .badge.official { background: var(--official-bg); color: var(--official-fg); }
  .badge.article  { background: var(--article-bg);  color: var(--article-fg); }
  .badge.video    { background: var(--video-bg);    color: var(--video-fg); }
  .badge.course   { background: var(--course-bg);   color: var(--course-fg); }
  .badge.repo     { background: var(--repo-bg);     color: var(--repo-fg); }
  .badge.book     { background: var(--book-bg);     color: var(--book-fg); }
  .badge.roadmap  { background: var(--roadmap-bg);  color: var(--roadmap-fg); }

  .ai-tab-msg {
    background: var(--d-soft); border-radius: 12px; padding: 18px 20px;
    color: var(--d-muted); font-size: 14px; line-height: 1.5;
  }

  @media (max-width: 600px) {
    header h1 { font-size: 14px; }
    input[type="search"] { width: 140px; }
    .progress-bar { width: 100px; }
    .drawer { width: 100vw; }
    .drawer-body { padding: 18px 18px 28px; }
    .drawer-body h1.topic-title { font-size: 24px; }
  }
</style>
</head>
<body>

<header>
  <div class="topbar">
    <div class="page-tabs">
      <button class="page-tab active" data-page-tab="roadmap"><span class="ico">📍</span> Roadmap</button>
      <button class="page-tab" data-page-tab="ai"><span class="ico">✨</span> AI Tutor</button>
    </div>
    <span class="spacer"></span>
    <input type="search" id="search" placeholder="Search topics…" autocomplete="off">
    <span class="progress-text" style="font-size:13px;color:var(--muted)"><span id="progress-done">0</span>/<span id="progress-total">0</span> done</span>
    <button class="btn" id="sync-btn" title="Sync progress across devices"><span id="sync-status-dot" class="sync-dot"></span> <span id="sync-label">Sync</span></button>
    <button class="btn" id="reset" title="Reset all progress">Reset</button>
  </div>
  <div class="stages" id="stages">
    <div class="stage" data-stage="0"><span class="ico">⊕</span> Getting Started <span class="pct" id="pct-0">0%</span></div>
    <div class="stage" data-stage="1"><span class="ico">↗</span> Halfway</div>
    <div class="stage" data-stage="2"><span class="ico">🚀</span> Almost There</div>
    <div class="stage" data-stage="3"><span class="ico">🏆</span> Complete</div>
    <button class="stage-more" title="Coming soon">⋯</button>
  </div>
</header>

<div class="canvas" id="canvas">
${svg}
</div>

<aside class="drawer" id="drawer" aria-hidden="true">
  <div class="drawer-top">
    <button class="tab active" id="tab-resources" data-tab="resources"><span class="ico">⊕</span> Resources</button>
    <button class="tab" id="tab-ai" data-tab="ai"><span class="ico">✦</span> AI Tutor</button>
    <span class="spacer" style="flex:1"></span>
    <div class="status-wrap" id="status-wrap">
      <button class="status-trigger" id="status-trigger" aria-haspopup="menu" aria-expanded="false">
        <span class="status-dot" id="status-dot"></span>
        <span id="status-label">Pending</span>
        <span class="chevron"></span>
      </button>
      <div class="status-menu" id="status-menu" role="menu">
        <button class="status-option" data-status="done" role="menuitem">
          <span class="status-dot" data-value="done"></span>
          <span class="label">Done</span>
          <span class="kbd">D</span>
        </button>
        <button class="status-option" data-status="in-progress" role="menuitem">
          <span class="status-dot" data-value="in-progress"></span>
          <span class="label">In Progress</span>
          <span class="kbd">L</span>
        </button>
        <button class="status-option" data-status="skipped" role="menuitem">
          <span class="status-dot" data-value="skipped"></span>
          <span class="label">Skip</span>
          <span class="kbd">S</span>
        </button>
      </div>
    </div>
    <button class="drawer-close" id="drawer-close" aria-label="Close">×</button>
  </div>
  <div class="drawer-body">
    <h1 class="topic-title" id="drawer-title">—</h1>
    <div id="tab-pane-resources">
      <div class="topic-desc" id="drawer-desc"></div>
      <div class="resources-section">
        <div class="resources-pill"><span class="heart">♥</span> Free Resources</div>
        <div class="resources-rule"></div>
        <ul class="resource-list" id="drawer-resources"></ul>
      </div>
    </div>
    <div id="tab-pane-ai" hidden>
      <div class="ai-tab-msg">
        AI Tutor is a placeholder in this static build. Wiring this tab to a real
        chat would require a backend with an API key — out of scope for the
        single-file deploy.
      </div>
    </div>
  </div>
</aside>

<div class="sync-modal" id="sync-modal" aria-hidden="true">
  <div class="sync-card" role="dialog" aria-labelledby="sync-title">
    <div class="sync-head">
      <h3 id="sync-title">Sync progress across devices</h3>
      <button class="drawer-close" id="sync-close" aria-label="Close">×</button>
    </div>
    <div class="sync-body">
      <p class="sync-help">Progress is stored in a <b>private GitHub Gist</b>. Paste a Personal Access Token with the <code>gist</code> scope. Token stays in this browser only.</p>
      <label class="sync-field">
        <span>GitHub token (<a href="https://github.com/settings/tokens/new?scopes=gist&description=Android%20Roadmap%20Sync" target="_blank" rel="noopener">create one</a>)</span>
        <input type="password" id="sync-token" placeholder="ghp_… or github_pat_…" autocomplete="off">
      </label>
      <label class="sync-field">
        <span>Gist ID <em style="color:var(--muted);font-style:normal">(leave blank to create a new private gist)</em></span>
        <input type="text" id="sync-gist" placeholder="e.g. a1b2c3d4e5…" autocomplete="off">
      </label>
      <div class="sync-row">
        <button class="btn btn-primary" id="sync-save">Save & Sync now</button>
        <button class="btn" id="sync-pull">Pull from gist</button>
        <button class="btn" id="sync-disconnect">Disconnect</button>
      </div>
      <div class="sync-status" id="sync-msg"></div>
    </div>
  </div>
</div>

<script>
(function() {
  const STORAGE_KEY = "androidRoadmap2026Status.v1";
  const SYNC_KEY = "androidRoadmap2026Sync.v1";
  const CONTENT = ${contentJson};

  let status = {};
  try { status = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch (e) { status = {}; }

  let syncCfg = { token: "", gistId: "" };
  try { syncCfg = Object.assign(syncCfg, JSON.parse(localStorage.getItem(SYNC_KEY) || "{}")); } catch (e) {}

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const nodeEls = () => $$('svg [data-kind="node"]');

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(status)); } catch (e) {}
    schedulePush();
  }

  function setSyncDot(state, label) {
    const dot = document.getElementById("sync-status-dot");
    const lab = document.getElementById("sync-label");
    if (dot) dot.setAttribute("data-state", state || "");
    if (lab && label) lab.textContent = label;
  }

  function setSyncMsg(text, kind) {
    const m = document.getElementById("sync-msg");
    if (!m) return;
    m.textContent = text || "";
    if (kind) m.setAttribute("data-kind", kind); else m.removeAttribute("data-kind");
  }

  async function ghFetch(path, opts) {
    if (!syncCfg.token) throw new Error("No token configured");
    const res = await fetch("https://api.github.com" + path, Object.assign({
      headers: {
        "Authorization": "Bearer " + syncCfg.token,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
      },
    }, opts || {}));
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error("GitHub " + res.status + ": " + body.slice(0, 140));
    }
    return res.json();
  }

  async function ensureGist() {
    if (syncCfg.gistId) return syncCfg.gistId;
    const data = await ghFetch("/gists", {
      method: "POST",
      body: JSON.stringify({
        description: "Android Developer Roadmap 2026 — progress",
        public: false,
        files: { "progress.json": { content: JSON.stringify({ status, updatedAt: Date.now() }, null, 2) } },
      }),
    });
    syncCfg.gistId = data.id;
    localStorage.setItem(SYNC_KEY, JSON.stringify(syncCfg));
    return data.id;
  }

  let pushTimer = null;
  function schedulePush() {
    if (!syncCfg.token || !syncCfg.gistId) return;
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(() => { syncPush().catch(() => {}); }, 1200);
  }

  async function syncPush() {
    if (!syncCfg.token) return;
    setSyncDot("syncing", "Syncing…");
    try {
      await ensureGist();
      await ghFetch("/gists/" + syncCfg.gistId, {
        method: "PATCH",
        body: JSON.stringify({ files: { "progress.json": { content: JSON.stringify({ status, updatedAt: Date.now() }, null, 2) } } }),
      });
      setSyncDot("ok", "Synced");
      setSyncMsg("Pushed to gist · " + new Date().toLocaleTimeString(), "ok");
    } catch (e) {
      setSyncDot("error", "Sync error");
      setSyncMsg(String(e.message || e), "error");
    }
  }

  async function syncPull() {
    if (!syncCfg.token || !syncCfg.gistId) return;
    setSyncDot("syncing", "Pulling…");
    try {
      const data = await ghFetch("/gists/" + syncCfg.gistId);
      const file = data.files && data.files["progress.json"];
      if (file && file.content) {
        const parsed = JSON.parse(file.content);
        if (parsed && parsed.status && typeof parsed.status === "object") {
          status = parsed.status;
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(status)); } catch (e) {}
          applyStatus();
        }
      }
      setSyncDot("ok", "Synced");
      setSyncMsg("Pulled from gist · " + new Date().toLocaleTimeString(), "ok");
    } catch (e) {
      setSyncDot("error", "Sync error");
      setSyncMsg(String(e.message || e), "error");
    }
  }

  function openSyncModal() {
    const m = document.getElementById("sync-modal");
    document.getElementById("sync-token").value = syncCfg.token || "";
    document.getElementById("sync-gist").value = syncCfg.gistId || "";
    setSyncMsg("");
    m.setAttribute("aria-hidden", "false");
  }
  function closeSyncModal() {
    document.getElementById("sync-modal").setAttribute("aria-hidden", "true");
  }

  function applyStatus() {
    const all = nodeEls();
    let done = 0;
    all.forEach((n) => {
      const id = n.getAttribute("data-id");
      const s = status[id];
      if (s && s !== "pending") n.setAttribute("data-status", s);
      else n.removeAttribute("data-status");
      if (s === "done") done++;
    });
    $("#progress-done").textContent = done;
    $("#progress-total").textContent = all.length;
    const pct = all.length ? (done / all.length) * 100 : 0;
    const stage = pct >= 100 ? 3 : pct >= 75 ? 2 : pct >= 25 ? 1 : 0;
    $$(".stage").forEach((s) => s.classList.toggle("active", Number(s.dataset.stage) === stage));
    const pctEl = document.getElementById("pct-0");
    if (pctEl) pctEl.textContent = Math.round(pct) + "%";
  }

  // Tiny markdown-ish renderer for descriptions:
  // - **bold**
  // - \`code\`
  // - numbered lists (lines beginning "1. ", "2. " etc.)
  // - blank-line-separated paragraphs
  function renderMarkdown(md) {
    if (!md) return '';
    md = String(md);
    const blocks = md.split(/\\n{2,}/);
    let out = "";
    for (const blk of blocks) {
      const lines = blk.split("\\n");
      const isOrdered = lines.every((l) => /^\\s*\\d+\\.\\s/.test(l));
      const isUnordered = lines.every((l) => /^\\s*[-*]\\s/.test(l));
      if (isOrdered) {
        out += "<ol>" + lines.map((l) => "<li>" + inlineMd(l.replace(/^\\s*\\d+\\.\\s+/, "")) + "</li>").join("") + "</ol>";
      } else if (isUnordered) {
        out += "<ul>" + lines.map((l) => "<li>" + inlineMd(l.replace(/^\\s*[-*]\\s+/, "")) + "</li>").join("") + "</ul>";
      } else {
        out += "<p>" + inlineMd(blk.replace(/\\n/g, " ")) + "</p>";
      }
    }
    return out;
  }
  function inlineMd(s) {
    return escapeHtml(s)
      .replace(/\\*\\*(.+?)\\*\\*/g, "<strong>$1</strong>")
      .replace(/\`([^\`]+)\`/g, "<code>$1</code>");
  }
  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function fallbackResources(text) {
    const q = encodeURIComponent(text);
    return [
      { type: "Official", title: 'Search Android Developers for "' + text + '"', url: "https://developer.android.com/s/results?q=" + q },
      { type: "Article",  title: 'Google: "android ' + text + '"',                url: "https://www.google.com/search?q=" + encodeURIComponent("android " + text) },
    ];
  }

  const STATUS_LABELS = { pending: "Pending", done: "Done", "in-progress": "In Progress", skipped: "Skip" };

  function setStatusPill(value) {
    const v = value || "pending";
    $("#status-dot").setAttribute("data-value", v === "pending" ? "" : v);
    $("#status-label").textContent = STATUS_LABELS[v] || "Pending";
    $("#status-trigger").setAttribute("data-value", v);
  }

  function openStatusMenu() {
    $("#status-menu").classList.add("open");
    $("#status-trigger").setAttribute("aria-expanded", "true");
  }
  function closeStatusMenu() {
    $("#status-menu").classList.remove("open");
    $("#status-trigger").setAttribute("aria-expanded", "false");
  }
  function toggleStatusMenu() {
    if ($("#status-menu").classList.contains("open")) closeStatusMenu();
    else openStatusMenu();
  }

  function setTopicStatus(value) {
    const id = activeTopicId();
    if (!id) return;
    if (value === "pending") delete status[id]; else status[id] = value;
    save(); applyStatus(); setStatusPill(value);
  }

  function activeTopicId() { return $("#drawer").getAttribute("data-topic-id"); }

  function openDrawer(el) {
    const id = el.getAttribute("data-id");
    const text = el.getAttribute("data-text") || "Topic";
    const kind = el.getAttribute("data-kind") || "topic";
    const drawer = $("#drawer");
    drawer.setAttribute("data-topic-id", id);
    drawer.setAttribute("data-topic-kind", kind);
    $("#drawer-title").textContent = text;

    const entry = CONTENT[id];
    const desc = entry && entry.description ? entry.description : (
      kind === "section" ? "**" + text + "** — high-level section. Open the topics underneath to dive into specifics." :
      kind === "group"   ? "**" + text + "** — group of related topics. See child nodes below for the actual items to learn." :
      "Mark this topic complete once you understand it well enough to use in production code."
    );
    $("#drawer-desc").innerHTML = renderMarkdown(desc);

    const resources = (entry && entry.resources && entry.resources.length) ? entry.resources : fallbackResources(text);
    const ul = $("#drawer-resources");
    ul.innerHTML = resources.map((r) => {
      const t = (r.type || "Official").toLowerCase();
      const safeTitle = escapeHtml(r.title || r.url);
      const safeUrl = escapeHtml(r.url || "#");
      return '<li class="resource-row"><span class="badge ' + t + '">' + escapeHtml(r.type || "Official") + '</span><a href="' + safeUrl + '" target="_blank" rel="noopener">' + safeTitle + '</a></li>';
    }).join("");

    setStatusPill(kind === "node" ? (status[id] || "pending") : "pending");
    $("#status-wrap").style.display = kind === "node" ? "" : "none";
    closeStatusMenu();
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");

    // Reset to Resources tab on open
    activateTab("resources");
  }

  function closeDrawer() {
    const d = $("#drawer");
    d.classList.remove("open");
    d.setAttribute("aria-hidden", "true");
  }

  function activateTab(name) {
    $$("[data-tab]").forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
    $("#tab-pane-resources").hidden = name !== "resources";
    $("#tab-pane-ai").hidden = name !== "ai";
  }

  // Click delegation
  document.addEventListener("click", (e) => {
    const target = e.target.closest('svg [data-kind]');
    if (target) { openDrawer(target); return; }
    if (e.target.closest('.drawer') || e.target.closest('header')) return;
    closeDrawer();
  });
  $("#drawer-close").addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

  $$("[data-tab]").forEach((t) => t.addEventListener("click", () => activateTab(t.dataset.tab)));

  $("#status-trigger").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleStatusMenu();
  });
  $$(".status-option").forEach((opt) => {
    opt.addEventListener("click", (e) => {
      e.stopPropagation();
      setTopicStatus(opt.dataset.status);
      closeStatusMenu();
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest('#status-wrap')) closeStatusMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (!$("#drawer").classList.contains("open")) return;
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    const k = e.key.toLowerCase();
    if (k === "d") { setTopicStatus("done"); }
    else if (k === "l") { setTopicStatus("in-progress"); }
    else if (k === "s") { setTopicStatus("skipped"); }
  });

  $("#reset").addEventListener("click", () => {
    if (Object.keys(status).length === 0) return;
    if (confirm("Reset all progress? This cannot be undone.")) {
      status = {}; save(); applyStatus();
    }
  });

  $("#search").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    nodeEls().forEach((n) => {
      const t = (n.getAttribute("data-text") || "").toLowerCase();
      if (!q || t.includes(q)) n.removeAttribute("data-hidden");
      else n.setAttribute("data-hidden", "true");
    });
  });

  // Sync UI wiring
  document.getElementById("sync-btn").addEventListener("click", openSyncModal);
  document.getElementById("sync-close").addEventListener("click", closeSyncModal);
  document.getElementById("sync-modal").addEventListener("click", (e) => {
    if (e.target.id === "sync-modal") closeSyncModal();
  });
  document.getElementById("sync-save").addEventListener("click", async () => {
    syncCfg.token = document.getElementById("sync-token").value.trim();
    syncCfg.gistId = document.getElementById("sync-gist").value.trim();
    if (!syncCfg.token) { setSyncMsg("Token required.", "error"); return; }
    localStorage.setItem(SYNC_KEY, JSON.stringify(syncCfg));
    setSyncMsg("Saved. Syncing…");
    try {
      if (syncCfg.gistId) {
        await syncPull();
      } else {
        await syncPush();
        document.getElementById("sync-gist").value = syncCfg.gistId;
        setSyncMsg("Created gist " + syncCfg.gistId.slice(0, 8) + "… · synced", "ok");
      }
    } catch (e) { setSyncMsg(String(e.message || e), "error"); }
  });
  document.getElementById("sync-pull").addEventListener("click", () => {
    syncCfg.token = document.getElementById("sync-token").value.trim() || syncCfg.token;
    syncCfg.gistId = document.getElementById("sync-gist").value.trim() || syncCfg.gistId;
    localStorage.setItem(SYNC_KEY, JSON.stringify(syncCfg));
    syncPull();
  });
  document.getElementById("sync-disconnect").addEventListener("click", () => {
    syncCfg = { token: "", gistId: "" };
    localStorage.removeItem(SYNC_KEY);
    document.getElementById("sync-token").value = "";
    document.getElementById("sync-gist").value = "";
    setSyncDot("", "Sync");
    setSyncMsg("Disconnected.", "ok");
  });

  applyStatus();
  if (syncCfg.token && syncCfg.gistId) {
    setSyncDot("ok", "Synced");
    syncPull();
  }
})();
</script>

</body>
</html>
`;

fs.writeFileSync(outPath, html);
console.log("Wrote " + outPath + " (" + Buffer.byteLength(html) + " bytes)");
