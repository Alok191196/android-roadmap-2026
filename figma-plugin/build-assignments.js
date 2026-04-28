#!/usr/bin/env node
// Splits the 2026 roadmap leaf nodes into 8 batches and writes one assignment
// JSON per batch into figma-plugin/content/assignments/. Each batch file lists
// the {id, title, sectionTitle, groupLabel} a single sub-agent will research.

const fs = require("fs");
const path = require("path");

// Re-export of the same ROADMAP definition used by generate-svg.js.
// (Duplicated here so this script is self-contained.)
const { ROADMAP } = require("./roadmap-data.js");

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const items = [];
for (const section of ROADMAP) {
  const sSlug = slug(section.title);
  for (const group of section.groups) {
    const gSlug = `${sSlug}/${slug(group.label)}`;
    for (const child of group.children) {
      items.push({
        id: `${gSlug}/${slug(child)}`,
        title: child,
        sectionTitle: section.title,
        groupLabel: group.label,
      });
    }
  }
}

// 8 batches grouped roughly by topic area so each agent works on related items
// (helps the agent write coherently and reuse research across nearby topics).
const BATCH_DEFS = [
  { name: "1-fundamentals", sections: ["Application Fundamentals", "Android Operating System", "Android Platform Architecture", "App Manifest", "App Components", "App Entry Points"] },
  { name: "2-navigation-architecture", sections: ["App Navigation", "App Startup & Performance", "Architecture Components", "Design Patterns", "Architecture"] },
  { name: "3-build-network-storage", sections: ["Modularization & Build Logic", "Network", "Image Loading", "Local Storage", "Asynchronous & Concurrency"] },
  { name: "4-views-and-compose-state", sections: ["User Interface (Views — Legacy)"], composeGroups: ["Recomposition", "State", "State Hoisting", "Side-effects", "Theming (Material 3)", "Modifier"] },
  { name: "5-compose-rendering", sections: [], composeGroups: ["Layout", "Lists", "Image", "Text", "Graphics", "Animation", "Gestures", "CompositionLocal", "Navigation", "Components", "Performance", "Testing & Preview"] },
  { name: "6-adaptive-widgets-camera-bg", sections: ["Adaptive UI & Form Factors", "Widgets (Glance)", "Camera & Media", "Background Work"] },
  { name: "7-privacy-ai-kmp", sections: ["Privacy & Security", "On-Device AI / GenAI", "Kotlin Multiplatform"] },
  { name: "8-services-test-cicd-publish", sections: ["Service", "Code Analysis & Test", "CI/CD", "QA & App Publishing"] },
];

const outDir = path.join(__dirname, "content", "assignments");
fs.mkdirSync(outDir, { recursive: true });

const assigned = new Set();
let totalAssigned = 0;
for (const batch of BATCH_DEFS) {
  const batchItems = items.filter((it) => {
    if (batch.sections.includes(it.sectionTitle)) return true;
    if (batch.composeGroups && it.sectionTitle === "Compose UI" && batch.composeGroups.includes(it.groupLabel)) return true;
    return false;
  });
  for (const it of batchItems) assigned.add(it.id);
  totalAssigned += batchItems.length;
  fs.writeFileSync(
    path.join(outDir, `${batch.name}.json`),
    JSON.stringify(batchItems, null, 2)
  );
  console.log(`${batch.name}: ${batchItems.length} items`);
}

const unassigned = items.filter((it) => !assigned.has(it.id));
if (unassigned.length) {
  console.warn(`WARNING: ${unassigned.length} items not assigned to any batch:`);
  unassigned.slice(0, 10).forEach((it) => console.warn(`  ${it.sectionTitle} > ${it.groupLabel} > ${it.title}`));
}
console.log(`Total assigned: ${totalAssigned} / ${items.length}`);
