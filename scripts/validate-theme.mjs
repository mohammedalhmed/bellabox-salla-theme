import { existsSync, readFileSync } from "node:fs";

const failures = [];
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

const pkg = readJson("package.json");
const twilight = readJson("twilight.json");

const requiredFiles = [
  "src/views/pages/product/single.twig",
  "src/views/pages/product/index.twig",
  "src/views/pages/cart.twig",
  "src/assets/js/main.js",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) failures.push(`Missing required theme file: ${file}`);
}

if (twilight.repository !== "https://github.com/mohammedalhmed/bellabox-salla-theme") {
  failures.push("twilight.json repository must point to the current GitHub repository");
}

if (pkg.salla?.support_url !== "https://github.com/mohammedalhmed/bellabox-salla-theme") {
  failures.push("package.json support_url must point to the current repository");
}

const settingIds = (twilight.settings ?? []).map((setting) => setting.id).filter(Boolean);
if (new Set(settingIds).size !== settingIds.length) {
  failures.push("twilight.json contains duplicate setting ids");
}

const features = twilight.features ?? [];
if (new Set(features).size !== features.length) {
  failures.push("twilight.json contains duplicate feature declarations");
}

if (!twilight.name?.ar || !twilight.name?.en) {
  failures.push("twilight.json must define Arabic and English theme names");
}

if (failures.length) {
  console.error("Theme validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Theme validation passed: ${settingIds.length} setting(s), ${features.length} feature(s).`);
