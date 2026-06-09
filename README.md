# The Estonian Anomaly — a field guide

A self-contained, single-page field guide to how a country of ~1.3 million built
a tech nation: the forces behind it, the companies and founders that prove it,
and the numbers — every figure carries its source. Skeptical by design.

Built with the [`field-guide`](https://github.com/nvbinh15/agent-skills) method:
multi-agent research → adversarial + numeric verification → a source-gated
`research.json` → a `template.html` design system → `index.html`.

## Files

| File | What it is |
|---|---|
| `index.html` | The built, self-contained page (inline CSS/JS, data embedded). Works from `file://`. |
| `template.html` | Nordic / e-Estonia minimal design system + render JS, with a `__DATA__` placeholder. |
| `research.json` | The verified dataset = source of truth. **Edit this to change content.** |
| `build.mjs` | Injects `research.json` → `index.html` (escapes `<`). |
| `merge.mjs` | Folds `research-raw/*.json` → `research.json` by id (idempotent) + numeric source-gate. |
| `progress.mjs` | Pure-read resume state: what's done, what's left, the next batch. |
| `roster.mjs` | Canonical entity lists (companies, founders, forces, context) — the "what should exist". |
| `content.mjs` | Authored prose (masthead, framing, author block) folded in by `merge.mjs`. |
| `estonia.workflow.js` | The resumable, batched research Workflow (run via the Workflow tool). |
| `run.sh` | `node merge.mjs && node build.mjs`. |

## Build / rebuild

```bash
bash run.sh          # merge research-raw → research.json, then build index.html
# or
node merge.mjs && node build.mjs
```

To change **content**, edit `research.json`; to change **design**, edit
`template.html`; then rebuild. Never re-run research just to iterate on the build.

## Research (resumable, disk-checkpointed)

Research runs **one batch per Workflow invocation** so an interruption never costs
more than one batch:

1. `node progress.mjs` — see what's done / what's left / the next batch.
2. In `estonia.workflow.js`, set the `BATCH` marker (`companies` | `founders` |
   `forces` | `context`). For a **targeted re-run of only the gaps**, bake their
   ids into the `ONLY` marker (do **not** trust a runtime arg — it can fall
   through and re-run everything).
3. Run the Workflow on `estonia.workflow.js`.
4. Save its returned JSON to `research-raw/<batch>.json`.
5. `node merge.mjs` to fold it in. Repeat for the next batch.

`research-raw/` is gitignored (large, intermediate); `research.json` is committed.

## The accuracy contract

Every reader-facing number is a `{label, value, source_url, confidence}` leaf.
`merge.mjs` drops any number lacking a `source_url`. Research agents prefer
primary sources, never invent URLs or quotes, and each section carries an honest
`counterpoint` / skeptic's view so the guide reads as analysis, not a brochure.
