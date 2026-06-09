#!/usr/bin/env node
// Pure-read resume state: what's done, what's left, and the next batch's ids.
// Run this BEFORE any (re-)run so you never re-research an already-merged batch.
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { COMPANIES, FOUNDERS, FORCES, CONTEXT } from "./roster.mjs";

const dir = dirname(fileURLToPath(import.meta.url));
const read = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);
const rj = read(join(dir, "research.json")) || {};

const norm = (s) => (s || "").toString().toLowerCase().replace(/[^a-z0-9]+/g, "");
const haveIds = (arr) => new Set((arr || []).map((r) => norm(r.id || r.slug)));

function report(name, roster, have) {
  const got = haveIds(have);
  const missing = roster.filter((e) => !got.has(norm(e.id)));
  const done = roster.length - missing.length;
  const bar = "█".repeat(done) + "░".repeat(missing.length);
  console.log(`\n${name}: ${done}/${roster.length}  ${bar}`);
  if (missing.length) console.log("  missing: " + missing.map((m) => m.id).join(", "));
  return missing.map((m) => m.id);
}

console.log("=== Estonia field guide — research progress ===");
const mC = report("companies", COMPANIES, rj.companies);
const mF = report("founders", FOUNDERS, rj.founders);
const mFo = report("forces", FORCES, rj.forces);
const ctxDone = [
  rj.arc && "arc",
  rj.landscape && "landscape",
  (rj.metrics || []).length && "metrics",
  (rj.sources || []).length && "sources",
].filter(Boolean);
const mCtx = CONTEXT.map((c) => c.id).filter((id) => !ctxDone.includes(id));
console.log(`\ncontext: ${ctxDone.length}/${CONTEXT.length}  have: ${ctxDone.join(", ") || "—"}`);
if (mCtx.length) console.log("  missing: " + mCtx.join(", "));

const nextBatch = mC.length
  ? ["companies", mC]
  : mF.length
    ? ["founders", mF]
    : mFo.length
      ? ["forces", mFo]
      : mCtx.length
        ? ["context", mCtx]
        : null;

console.log("\n" + "-".repeat(46));
if (nextBatch) console.log(`NEXT BATCH → ${nextBatch[0]}: [${nextBatch[1].join(", ")}]`);
else console.log("ALL DONE ✓  (run: node merge.mjs && node build.mjs)");
