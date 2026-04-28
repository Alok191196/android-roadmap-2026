#!/usr/bin/env node
// Generates ../roadmap_2026.svg in the "river" layout — section headers on
// a vertical spine, group cards alternating left/right, bezier connectors.
// Aims to evoke the 2022 roadmap aesthetic without claiming pixel-fidelity
// (the original is hand-drawn in Figma; we approximate algorithmically).
//
// Run: node figma-plugin/generate-svg.js

const fs = require("fs");
const path = require("path");

const { ROADMAP } = require("./roadmap-data.js");

// Palette aligned with roadmap.sh — light bg, yellow/tan pills with black
// borders + drop shadows, blue spine (solid) and blue branches (dotted).
const STYLES = {
  bg: "#FFFFFF",
  title: "#0F1430",
  connector: "#3B82F6",
  spine: "#3B82F6",
  border: "#000000",
  section: { fill: "#FFF170", text: "#0F1430", size: 16, padX: 18, padY: 8, weight: 700, stroke: 2 },
  group:   { fill: "#FFF170", text: "#0F1430", size: 13, padX: 14, padY: 6, weight: 700, stroke: 2 },
  node:    { fill: "#F8E1A1", text: "#0F1430", size: 11, padX: 10, padY: 5, weight: 700, stroke: 2 },
};
const FONT_FAMILY = '"Open Sans Hebrew", Inter, system-ui, sans-serif';

const CHAR_W_FACTOR = 0.58;
const PAD = 80;
const SPINE_GUTTER = 60;       // distance from spine to inner edge of group column
const COLUMN_PAD = 16;         // padding around group column
const SECTION_GAP = 64;        // vertical gap between sections
const HEADER_TO_GROUPS = 40;   // gap between section header and first group label
const GROUP_VERTICAL_GAP = 28; // gap between consecutive groups stacked on same side
const NODE_GAP = 6;            // vertical gap between a group label and its children
const SINGLE_GROUP_GAP = 18;   // gap between header and centered group when only 1 group

function textWidth(text, fontSize) {
  return Math.ceil(text.length * fontSize * CHAR_W_FACTOR);
}

function pillSize(text, style) {
  return {
    w: textWidth(text, style.size) + style.padX * 2,
    h: Math.round(style.size * 1.4) + style.padY * 2,
  };
}

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function pillSvg(x, y, text, size, style, data) {
  const tx = x + size.w / 2;
  const ty = y + size.h / 2 + style.size * 0.35;
  const dataAttrs = data
    ? Object.entries(data)
        .map(([k, v]) => ` data-${k}="${escapeXml(String(v))}"`)
        .join("")
    : "";
  const stroke = style.stroke
    ? ` stroke="${STYLES.border}" stroke-width="${style.stroke}"`
    : "";
  const filterAttr = ' filter="url(#pillShadow)"';
  return (
    `<g${dataAttrs}${filterAttr}><rect x="${x}" y="${y}" width="${size.w}" height="${size.h}" rx="6" fill="${style.fill}"${stroke}/>` +
    `<text x="${tx}" y="${ty}" font-family='"Open Sans Hebrew", Inter, system-ui, sans-serif' font-size="${style.size}" font-weight="${style.weight}" fill="${style.text}" text-anchor="middle">${escapeXml(text)}</text></g>`
  );
}

// Sine-wave spine. spineXAt(y) returns the spine's x-coordinate at a given y.
// Amplitude/period chosen so the spine swings gently across the canvas — the
// 2022 original meanders, so straight vertical reads as flat by comparison.
// Set amplitude to 0 for a straight vertical spine (matches roadmap.sh).
// Restore to ~90 if you want the meandering river look back.
const SPINE_AMPLITUDE = 0;
const SPINE_PERIOD = 2400;
const SPINE_PHASE = 200;
let SPINE_CENTER_X = 0; // set in render()

function spineXAt(y) {
  return SPINE_CENTER_X + SPINE_AMPLITUDE * Math.sin(((y - SPINE_PHASE) / SPINE_PERIOD) * Math.PI * 2);
}

// Continuous path tracing the spine between y1..y2 via dense linear samples.
function spinePath(y1, y2, color) {
  if (y2 <= y1) return "";
  let d = `M ${spineXAt(y1).toFixed(2)} ${y1}`;
  const step = 8;
  for (let y = y1 + step; y < y2; y += step) {
    d += ` L ${spineXAt(y).toFixed(2)} ${y}`;
  }
  d += ` L ${spineXAt(y2).toFixed(2)} ${y2}`;
  return `<path d="${d}" stroke="${color}" stroke-width="2" fill="none" opacity="0.55"/>`;
}

// Smooth S-curve from a point on the spine to a group label's inner edge.
// Dotted to match roadmap.sh branch style.
function sCurve(x1, y1, x2, y2, color) {
  const midY = (y1 + y2) / 2;
  return `<path d="M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}" stroke="${color}" stroke-width="2" stroke-dasharray="2 6" stroke-linecap="round" fill="none"/>`;
}

// Vertical run between two y's that follows the spine.
function spineSegment(y1, y2, color) {
  return spinePath(y1, y2, color);
}

function layoutGroup(group) {
  const labelSize = pillSize(group.label, STYLES.group);
  const childSizes = group.children.map((c) => pillSize(c, STYLES.node));
  const colWidth = Math.max(labelSize.w, ...childSizes.map((s) => s.w));
  const childrenHeight =
    childSizes.reduce((a, s) => a + s.h, 0) +
    Math.max(0, childSizes.length) * NODE_GAP;
  const totalHeight = labelSize.h + NODE_GAP + childrenHeight;
  return { labelSize, childSizes, colWidth, totalHeight, group };
}

function renderSection(section, startY) {
  const out = [];
  const sectionSlug = slug(section.title);
  const headerSize = pillSize(section.title, STYLES.section);
  const headerY = startY;
  const headerCenterY = headerY + headerSize.h / 2;
  const headerSpineX = spineXAt(headerCenterY);
  const headerX = headerSpineX - headerSize.w / 2;
  out.push(
    pillSvg(headerX, headerY, section.title, headerSize, STYLES.section, {
      kind: "section",
      id: sectionSlug,
      text: section.title,
    })
  );
  const headerBottomY = headerY + headerSize.h;

  const groupLayouts = section.groups.map(layoutGroup);

  // Single group → centered on the spine below the header
  if (groupLayouts.length === 1) {
    const g = groupLayouts[0];
    const groupSlug = `${sectionSlug}/${slug(g.group.label)}`;
    const labelY = headerBottomY + SINGLE_GROUP_GAP;
    const labelCenterY = labelY + g.labelSize.h / 2;
    const labelX = spineXAt(labelCenterY) - g.labelSize.w / 2;
    out.push(spineSegment(headerBottomY, labelY, STYLES.spine));
    out.push(
      pillSvg(labelX, labelY, g.group.label, g.labelSize, STYLES.group, {
        kind: "group",
        id: groupSlug,
        text: g.group.label,
      })
    );

    let cy = labelY + g.labelSize.h + NODE_GAP;
    const labelBottomY = labelY + g.labelSize.h;
    g.group.children.forEach((c, ci) => {
      const cs = g.childSizes[ci];
      const childCenterY = cy + cs.h / 2;
      const cx = spineXAt(childCenterY) - cs.w / 2;
      out.push(spineSegment(ci === 0 ? labelBottomY : cy - NODE_GAP, cy, STYLES.spine));
      out.push(
        pillSvg(cx, cy, c, cs, STYLES.node, {
          kind: "node",
          id: `${groupSlug}/${slug(c)}`,
          text: c,
        })
      );
      cy += cs.h + NODE_GAP;
    });
    return { svg: out.join("\n"), endY: cy };
  }

  // Multiple groups → alternate L/R off the meandering spine
  const left = [];
  const right = [];
  groupLayouts.forEach((g, i) => (i % 2 === 0 ? left : right).push(g));

  let leftY = headerBottomY + HEADER_TO_GROUPS;
  let rightY = headerBottomY + HEADER_TO_GROUPS;

  function renderColumn(g, side, columnY) {
    const groupSlug = `${sectionSlug}/${slug(g.group.label)}`;
    const colWidth = g.colWidth + COLUMN_PAD * 2;
    const labelY = columnY;
    const labelMidY = labelY + g.labelSize.h / 2;
    // Anchor the column to the spine x at the group's vertical center, so columns
    // shift gently with the wave instead of being pinned to canvas-center.
    const anchorX = spineXAt(labelMidY);
    const innerX = side === "L" ? anchorX - SPINE_GUTTER : anchorX + SPINE_GUTTER;
    const outerX = side === "L" ? innerX - colWidth : innerX + colWidth;
    const colCenterX = (innerX + outerX) / 2;

    // S-curve from a point on the spine (at header bottom) to the group's inner edge.
    const labelX = colCenterX - g.labelSize.w / 2;
    const labelInnerX = side === "L" ? labelX + g.labelSize.w : labelX;
    const spineExitX = spineXAt(headerBottomY) + (side === "L" ? -12 : 12);
    out.push(sCurve(spineExitX, headerBottomY, labelInnerX, labelMidY, STYLES.connector));

    out.push(
      pillSvg(labelX, labelY, g.group.label, g.labelSize, STYLES.group, {
        kind: "group",
        id: groupSlug,
        text: g.group.label,
      })
    );

    // Group's vertical trunk + each child connected by a short stub.
    const trunkX = colCenterX;
    let cy = labelY + g.labelSize.h + NODE_GAP;
    const labelBottomY = labelY + g.labelSize.h;
    let lastTrunkY = labelBottomY;
    g.group.children.forEach((c, ci) => {
      const cs = g.childSizes[ci];
      const cx = colCenterX - cs.w / 2;
      const childMidY = cy + cs.h / 2;
      out.push(`<line x1="${trunkX}" y1="${lastTrunkY}" x2="${trunkX}" y2="${childMidY}" stroke="${STYLES.connector}" stroke-width="2" stroke-dasharray="2 5" stroke-linecap="round"/>`);
      out.push(
        pillSvg(cx, cy, c, cs, STYLES.node, {
          kind: "node",
          id: `${groupSlug}/${slug(c)}`,
          text: c,
        })
      );
      lastTrunkY = cy + cs.h;
      cy += cs.h + NODE_GAP;
    });
    return cy;
  }

  for (const g of left) {
    leftY = renderColumn(g, "L", leftY) + GROUP_VERTICAL_GAP;
  }
  for (const g of right) {
    rightY = renderColumn(g, "R", rightY) + GROUP_VERTICAL_GAP;
  }

  const sectionEndY = Math.max(leftY, rightY);
  // Spine path threading through this section.
  out.push(spineSegment(headerBottomY, sectionEndY - GROUP_VERTICAL_GAP, STYLES.spine));

  return { svg: out.join("\n"), endY: sectionEndY };
}

function render() {
  // Compute canvas width: widest section determines it
  const groupColWidths = ROADMAP.flatMap((s) =>
    s.groups.map((g) => Math.max(pillSize(g.label, STYLES.group).w, ...g.children.map((c) => pillSize(c, STYLES.node).w)) + COLUMN_PAD * 2)
  );
  const maxColW = Math.max(...groupColWidths);
  // Add SPINE_AMPLITUDE to half-width so the wave never pushes content off-canvas.
  const halfWidth = SPINE_GUTTER + maxColW + 40 + SPINE_AMPLITUDE;
  const canvasW = PAD * 2 + halfWidth * 2;
  SPINE_CENTER_X = canvasW / 2;

  const titleSize = 44;
  const titleH = Math.round(titleSize * 1.4);
  let y = PAD + titleH + SECTION_GAP;

  const parts = [];
  // Background placeholder, real one prepended after height known
  const bgIdx = parts.length;
  parts.push(""); // bg placeholder
  parts.push(""); // title placeholder

  for (const section of ROADMAP) {
    const { svg, endY } = renderSection(section, y);
    parts.push(svg);
    y = endY + SECTION_GAP;
  }
  const canvasH = y + PAD;

  parts[bgIdx] = `<rect width="${canvasW}" height="${canvasH}" fill="${STYLES.bg}" rx="24"/>`;
  parts[bgIdx + 1] = `<text x="${SPINE_CENTER_X}" y="${PAD + titleSize}" font-family='"Open Sans Hebrew", Inter, system-ui, sans-serif' font-size="${titleSize}" font-weight="700" fill="${STYLES.title}" text-anchor="middle">Android Developer Roadmap 2026</text>`;

  const defs =
    `<defs>` +
    `<filter id="pillShadow" x="-10%" y="-30%" width="120%" height="160%">` +
    `<feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#000" flood-opacity="0.18"/>` +
    `</filter>` +
    `</defs>`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasW}" height="${canvasH}" viewBox="0 0 ${canvasW} ${canvasH}">\n` +
    defs + "\n" +
    parts.join("\n") +
    `\n</svg>`
  );
}

const out = path.join(__dirname, "..", "roadmap_2026.svg");
fs.writeFileSync(out, render());
console.log("Wrote " + out);
