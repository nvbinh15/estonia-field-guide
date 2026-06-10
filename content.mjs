// Authored (non-researched) content: masthead, framing, confidence legend, author
// block, section list. merge.mjs folds this into research.json alongside the
// researched data. Numbers here are intentionally avoided — anything quantitative
// lives in the source-gated `metrics`/`forces` data instead.

export const META = {
  title: "The Estonian Anomaly",
  subtitle: "A field guide to how 1.3 million people built a tech nation",
  dek: "A country smaller than most cities produced more startup unicorns per capita than anywhere in Europe, runs almost entirely on code, and adopts AI faster than nations many times richer. This is a guided tour of how — and an honest look at the cracks.",
  updated: "2026-06",
  // Surfaced in the masthead as the reader's map of the argument.
  reading_note:
    "Read it as three layers: the forces that explain the outlier, the companies and founders that prove it, and the data — every number carries a source. Skeptical by design: where the story is hyped, we say so.",
  confidence_legend: [
    { key: "verified", label: "Verified", note: "Confirmed against an official or primary source." },
    { key: "secondary", label: "Secondary", note: "From credible reporting; not an official figure." },
    { key: "reported", label: "Reported", note: "Widely repeated but unverified or contested — treat with care." },
  ],
  sections: [
    { id: "landscape", num: "01", label: "The landscape" },
    { id: "forces", num: "02", label: "Why it works" },
    { id: "data", num: "03", label: "The numbers" },
    { id: "companies", num: "04", label: "The companies" },
    { id: "founders", num: "05", label: "The founders" },
    { id: "arc", num: "06", label: "The timeline" },
    { id: "sources", num: "07", label: "Sources & method" },
  ],
};

// The comparison chart in "The numbers". All rows come from the same Invest in
// Estonia analysis of Atomico/Dealroom data (Dec 2022) — one shared source.
export const CHART = {
  title: "unicorns per million inhabitants — europe",
  note: "Highest unicorn density per capita of any European country; nearest peers shown. Invest in Estonia's analysis of Atomico/Dealroom data, Dec 2022.",
  source_url: "https://investinestonia.com/estonia-leads-europe-in-startups-unicorns-and-investments-per-capita/",
  confidence: "reported",
  rows: [
    { n: "Estonia", v: 7.7, on: true },
    { n: "Luxembourg", v: 3.1 },
    { n: "United Kingdom", v: 1.6 },
    { n: "Germany", v: 0.6 },
  ],
};

export const AUTHOR = {
  name: "Binh Nguyen",
  blurb:
    "A field guide built with a multi-agent research pipeline: every claim is sourced, every number gated by provenance, and the AI-adoption angle deliberately ranges beyond any single index.",
  blogHeading: "More field guides",
  links: [
    { label: "nvbinh.com", url: "https://nvbinh.com" },
    { label: "An Nam Uni", url: "https://annamuni.nvbinh.com" },
    { label: "The Knowledge Brokers", url: "https://knowledge-brokers.nvbinh.com" },
  ],
};
