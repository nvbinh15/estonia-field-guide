#!/usr/bin/env node
// Assembles research.json from the authored content + the per-batch raw research
// dropped under research-raw/. Idempotent: ordering is by roster id, re-merging a
// completed batch just overwrites identically. Runs a numeric source-gate so no
// unsourced number reaches the data core, and prints an anomaly report.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { COMPANIES, FOUNDERS, FORCES } from "./roster.mjs";
import { META, AUTHOR } from "./content.mjs";

const dir = dirname(fileURLToPath(import.meta.url));
const raw = (name) => {
  const p = join(dir, "research-raw", name);
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null;
};

// --- pull raw batches (any may be absent mid-build) ---
const companiesRaw = raw("companies.json") || [];
const foundersRaw = raw("founders.json") || [];
const forcesRaw = raw("forces.json") || [];
const context = raw("context.json") || {};

const anomalies = [];

// Strip verification-artifact leaks from reader-facing prose (the #1 field-guide
// defect). PROTECTED keys keep their candid/verbatim text untouched.
const PROTECT = new Set([
  "verification_report", "confidence_notes", "quote", "attribution", "url",
  "source_url", "x", "linkedin", "site", "substack", "slug", "id", "source_title", "confidence",
]);
let cleaned = 0;
function clean(s) {
  let t = s;
  // fix double-escaped sequences some agents emit literally (render as visible \n, \")
  t = t.replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\t/g, " ");
  // a meta "Confidence: ..." sentence (keep any following real sentence)
  t = t.replace(/\s*(?:Confidence|CONFIDENCE):\s+[^.]*\.(?=\s|$)/g, "");
  t = t.replace(/\s*(?:Confidence|CONFIDENCE):\s+[^.]*$/g, "");
  // process parentheticals ("(note: returned HTTP 403 on fetch; corroborated via …)")
  t = t.replace(/\s*\((?:note|nb)?:?\s*[^)]*?(?:HTTP\s*\d{3}|WebFetch|on fetch|corroborated via|dead link)[^)]*\)/gi, "");
  // source-note verification artifacts ("Verified loads", "Fetched and verified", "(verified verbatim)", 403s, etc.)
  t = t.replace(/\s*(?:Verified loads|Fetched and verified)[^.;]*[.;]?/gi, "");
  t = t.replace(/\s*\(verified verbatim\)/gi, "");
  t = t.replace(/\s*(?:Both quot(?:ed lines|es)[^.]*verified|Title and byline verified|Quote and[^.]*verified on page)[^.]*\.?/gi, "");
  t = t.replace(/\s*\([^)]*\b403s?\b[^)]*\)/gi, "");
  t = t.replace(/\s*Link valid[;,][^.]*\.?/gi, "");
  t = t.replace(/\s*[^.]*\bno transcript text was extractable\b[^.]*\.?/gi, "");
  // stray process phrases
  t = t.replace(/\s*\(?\bvia WebFetch\b\)?/gi, "").replace(/\bI (?:verified|confirmed|was able to)[^.]*\.\s*/gi, "");
  t = t.replace(/\s*\bused in this profile\b/gi, "");
  // collapse spaces/tabs but PRESERVE paragraph newlines (proseHtml splits on \n\n)
  t = t.replace(/[ \t]{2,}/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (t !== s) cleaned++;
  return t;
}
function sanitize(node, key) {
  if (node == null) return node;
  if (typeof node === "string") return PROTECT.has(key) ? node : clean(node);
  if (Array.isArray(node)) return node.map((x) => sanitize(x, key));
  if (typeof node === "object") {
    const o = {};
    for (const k of Object.keys(node)) o[k] = sanitize(node[k], k);
    return o;
  }
  return node;
}

// match a raw record to a roster id by id|slug|name|label (normalised)
const norm = (s) => (s || "").toString().toLowerCase().replace(/[^a-z0-9]+/g, "");
function pick(rawArr, rosterEntry) {
  const want = norm(rosterEntry.id);
  const wantLabel = norm(rosterEntry.label);
  return rawArr.find((r) => {
    const cands = [r.id, r.slug, r.name, r.firm, r.title, r.label].map(norm);
    return cands.includes(want) || cands.some((c) => c && (c === wantLabel || (c.length > 4 && wantLabel.includes(c))));
  });
}

// order researched records by roster, keep only matched ones (so partial builds work)
function ordered(rosterArr, rawArr, kind) {
  const out = [];
  for (const e of rosterArr) {
    const rec = pick(rawArr, e);
    if (rec) {
      // clean roster bucket drives tags/filters; keep the agent's verbose string as detail
      const rich = rec.category && rec.category.length > 18 ? rec.category : null;
      out.push({ ...rec, id: e.id, category: e.category || rec.category, category_detail: rich });
    } else anomalies.push(`${kind}: no record yet for "${e.id}"`);
  }
  return out;
}

// numeric source-gate: every {value/source_url/confidence} leaf must carry a source.
function gateNumbers(items, where) {
  return (items || []).filter((it) => {
    const hasNum = it.value !== undefined && it.value !== null && it.value !== "";
    if (hasNum && !it.source_url) {
      anomalies.push(`${where}: dropped unsourced number "${it.label || it.id}" = ${it.value}`);
      return false;
    }
    if (hasNum && !it.confidence) it.confidence = "reported";
    return true;
  });
}

const companies = ordered(COMPANIES, companiesRaw, "companies");
const founders = ordered(FOUNDERS, foundersRaw, "founders");
const forces = ordered(FORCES, forcesRaw, "forces");

// gate the data-bearing arrays
for (const c of companies) c.key_numbers = gateNumbers(c.key_numbers, `company:${c.id}`);
for (const f of forces) f.evidence = gateNumbers(f.evidence, `force:${f.id}`);
const metrics = gateNumbers(context.metrics?.items || context.metrics || [], "metrics");

const out = {
  meta: META,
  author: AUTHOR,
  landscape: context.landscape || null,
  forces,
  metrics,
  companies,
  founders,
  arc: context.arc || null,
  sources: context.sources?.items || context.sources || [],
  _built: META.updated,
};

const outClean = sanitize(out, "root");
writeFileSync(join(dir, "research.json"), JSON.stringify(outClean, null, 2));
if (cleaned) console.log(`sanitized ${cleaned} reader-facing string(s) of verification-artifact leaks`);

const n = (a) => (a ? a.length : 0);
console.log(
  `merged research.json — ${n(companies)}/${COMPANIES.length} companies · ` +
    `${n(founders)}/${FOUNDERS.length} founders · ${n(forces)}/${FORCES.length} forces · ` +
    `${n(metrics)} metrics · arc:${out.arc ? "y" : "n"} landscape:${out.landscape ? "y" : "n"} · ` +
    `${n(out.sources)} sources`
);
if (anomalies.length) {
  console.log(`\n${anomalies.length} note(s):`);
  for (const a of anomalies) console.log("  • " + a);
}
