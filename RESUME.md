# RESUME — build state

**Goal:** "The Estonian Anomaly" field guide. Full hybrid (forces + companies +
founders + data core), Nordic/e-Estonia minimal visual register, deep-dive
research, standalone repo, deploy to a nvbinh.com subdomain after review.

## Status

- [x] Repo scaffolded; resumable batched research harness.
- [x] Companies (11/11), founders (7/7), forces (7/7), context (4/4) — `node progress.mjs` → ALL DONE.
- [x] Template (Nordic minimal) + render layer; builds to index.html (~516 KB, self-contained).
- [x] Review/verify (mechanical, no reviewer agents): numeric integrity ✓ (every number sourced),
      links ✓ (483 total, 0 placeholders, 0 insecure), verification-artifact leaks stripped
      (sanitizer lives in merge.mjs), AI-tells de-duped ("is the rare" ×3 + "clean case study" rewritten),
      mobile horizontal-scroll fixed, 0 console errors, all 7 sections + interactions verified in-browser.
- [ ] Deploy (git-connected Vercel + project domain) — AWAITING user go-ahead. Proposed: estonia.nvbinh.com.

## Forces batch — resilience note
The original 7-force workflow wedged on 2 hung tail agents (queue-tail starvation) and never
returned. Recovered 6/7 from the run journal (no re-research), stopped the zombie, then ran a
baked-subset 2-agent re-run (`estonia.education.run.js`) for the missing `education` force.

## To rebuild
```bash
bash run.sh    # node merge.mjs (assemble + sanitize + source-gate) && node build.mjs
```
Edit content in `research.json` (or re-derive from `research-raw/` via merge); edit design in
`template.html`; then rebuild. Never re-run research to iterate.

## Cleanup TODO
- Per-batch run copies (`estonia.{founders,forces,context}.workflow.js`, `estonia.education.run.js`)
  are derived from `estonia.workflow.js` (canonical). Keep canonical; remove or gitignore the copies.
