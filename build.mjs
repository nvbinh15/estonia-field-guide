#!/usr/bin/env node
// Injects research.json into template.html -> self-contained index.html.
// Data is embedded as an escaped JSON blob (no fetch, so it works from file://).
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const template = readFileSync(join(dir, "template.html"), "utf8");
const data = JSON.parse(readFileSync(join(dir, "research.json"), "utf8"));

// Compact JSON, then neutralise "<" so a stray "</script>" can't break out of the
// JSON <script> block. "<" is valid JSON and parses back to "<".
const json = JSON.stringify(data).replace(/</g, "\\u003c");

if (!template.includes("__DATA__")) {
  console.error("template.html is missing the __DATA__ placeholder");
  process.exit(1);
}
const out = template.replace("__DATA__", () => json);
writeFileSync(join(dir, "index.html"), out);

console.log(
  `built index.html — ${(out.length / 1024).toFixed(0)} KB · ` +
    `${data.companies?.length || 0} companies · ${data.founders?.length || 0} founders · ` +
    `${data.forces?.length || 0} forces · ${data.metrics?.length || 0} metrics · ` +
    `${data.arc?.nodes?.length || 0} timeline · ${data.sources?.length || 0} sources`
);
