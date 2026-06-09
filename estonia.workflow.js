export const meta = {
  name: "estonia-field-guide-research",
  description:
    "Source-first research + adversarial verification for an Estonia tech-nation field guide. Runs ONE batch per invocation (companies | founders | forces | context) for durable, resumable, disk-checkpointed builds.",
  phases: [
    { title: "Research", detail: "one agent per entity — primary sources, verbatim quotes, sourced numbers" },
    { title: "Verify", detail: "adversarial fact-check + WebFetch every cited URL + re-check every number" },
    { title: "Context", detail: "timeline, framing+skeptic, source-gated data core, master reading list" },
  ],
};

// ============================================================================
// BATCH SELECTOR — edit these two markers between runs (do NOT rely on args).
//   BATCH ∈ "companies" | "founders" | "forces" | "context"
//   ONLY  = [] runs the whole batch; or bake the gap ids for a targeted re-run.
// The /*INJECT*/ markers make targeted edits unambiguous (String.replace hits
// the first match, so a unique marker avoids eating a comment).
// ============================================================================
const BATCH = /*INJECT-BATCH*/ "companies" /*INJECT-BATCH*/;
const ONLY = /*INJECT-ONLY*/ [] /*INJECT-ONLY*/;

// ---------- shared schema fragments ----------
const SOURCE = {
  type: "object",
  properties: {
    title: { type: "string" },
    type: { type: "string", description: "essay|interview|podcast|video|article|report|talk|book|filing|official" },
    publisher: { type: "string" },
    author: { type: "string" },
    url: { type: "string" },
    why: { type: "string", description: "one line: why this primary source is worth the reader's time" },
    pull_quote: { type: "string", description: "short VERBATIM excerpt; empty if none" },
  },
  required: ["title", "type", "url", "why"],
};
const QUOTE = {
  type: "object",
  properties: {
    quote: { type: "string", description: "VERBATIM. Never invent or paraphrase." },
    attribution: { type: "string", description: "who said it + where/when" },
    source_url: { type: "string" },
  },
  required: ["quote", "attribution"],
};
// Every number the reader sees MUST be a NUM with its own source_url.
const NUM = {
  type: "object",
  properties: {
    label: { type: "string", description: "what the number measures" },
    value: { type: "string", description: "the figure, with unit if natural (e.g. '€8.5B', '7.7', '99%')" },
    unit: { type: "string" },
    as_of: { type: "string", description: "year/date the figure applies to" },
    detail: { type: "string", description: "one line of context" },
    comparison: { type: "string", description: "optional: how it compares (e.g. 'vs EU avg 1.9')" },
    source_url: { type: "string", description: "REQUIRED — the page that states this number" },
    confidence: { type: "string", description: "verified | secondary | reported" },
  },
  required: ["label", "value", "source_url"],
};
const SOCIAL = {
  type: "object",
  properties: {
    x: { type: "string" }, linkedin: { type: "string" }, site: { type: "string" }, substack: { type: "string" },
  },
};

// ---------- entity schemas ----------
const COMPANY_PROPS = {
  slug: { type: "string" },
  name: { type: "string" },
  aka: { type: "string", description: "former/alternate names" },
  category: { type: "string" },
  founded_year: { type: "string" },
  hq: { type: "string" },
  founders: { type: "array", items: { type: "object", properties: { name: { type: "string" }, role: { type: "string" } }, required: ["name"] } },
  status: { type: "string", description: "decacorn|unicorn|public|acquired|notable" },
  estonia_connection: { type: "string", description: "REQUIRED: precisely HOW this is an Estonian story. If the link is weak (e.g. only a co-founder, or only an R&D office), SAY SO plainly." },
  peak_valuation: { type: "string" },
  one_liner: { type: "string" },
  story: { type: "string", description: "200-400 words: origin, the insight, the arc. Factual, not promotional." },
  why_it_matters: { type: "string", description: "why it belongs in a guide to Estonia's tech rise" },
  key_numbers: { type: "array", items: NUM, description: "3-6 sourced headline figures (valuation, users, funding, employees)" },
  pull_quotes: { type: "array", items: QUOTE },
  sources: { type: "array", items: SOURCE, description: "3-6 PRIMARY sources, best first" },
  social: SOCIAL,
  current_status: { type: "string", description: "where it is in 2026" },
  confidence_notes: { type: "string" },
};
const COMPANY_SCHEMA = { type: "object", properties: COMPANY_PROPS, required: ["name", "founders", "story", "sources", "estonia_connection"] };
const COMPANY_VERIFIED = {
  type: "object",
  properties: { ...COMPANY_PROPS, verification_report: { type: "string" }, verified: { type: "boolean" } },
  required: ["name", "founders", "story", "sources", "estonia_connection", "verification_report"],
};

const FOUNDER_PROPS = {
  slug: { type: "string" },
  name: { type: "string" },
  role: { type: "string", description: "what they're best known for" },
  companies: { type: "array", items: { type: "string" } },
  bio: { type: "string", description: "one-paragraph background" },
  arc: { type: "string", description: "150-300 words: their journey and why it matters to Estonia's story" },
  philosophy: { type: "string", description: "how they think / what they believe — grounded in their own words" },
  why_admired: { type: "string" },
  pull_quotes: { type: "array", items: QUOTE },
  social: SOCIAL,
  sources: { type: "array", items: SOURCE, description: "3-6 PRIMARY sources (their essays/talks/interviews), best first" },
  current_status: { type: "string" },
  confidence_notes: { type: "string" },
};
const FOUNDER_SCHEMA = { type: "object", properties: FOUNDER_PROPS, required: ["name", "arc", "sources", "social"] };
const FOUNDER_VERIFIED = {
  type: "object",
  properties: { ...FOUNDER_PROPS, verification_report: { type: "string" }, verified: { type: "boolean" } },
  required: ["name", "arc", "sources", "verification_report"],
};

const FORCE_PROPS = {
  slug: { type: "string" },
  title: { type: "string" },
  kicker: { type: "string", description: "a 3-6 word label" },
  thesis: { type: "string", description: "1-2 sentences: the claim this force makes" },
  body: { type: "string", description: "300-500 words explaining the mechanism, with concrete examples" },
  evidence: { type: "array", items: NUM, description: "3-6 sourced numbers that back the thesis" },
  counterpoint: { type: "string", description: "REQUIRED: the honest caveat — where this is overstated, contested, or has a downside. Keeps the guide credible, not promotional." },
  pull_quotes: { type: "array", items: QUOTE },
  sources: { type: "array", items: SOURCE, description: "3-6 primary/credible sources" },
  confidence_notes: { type: "string" },
};
const FORCE_SCHEMA = { type: "object", properties: FORCE_PROPS, required: ["title", "thesis", "body", "counterpoint", "sources"] };
const FORCE_VERIFIED = {
  type: "object",
  properties: { ...FORCE_PROPS, verification_report: { type: "string" }, verified: { type: "boolean" } },
  required: ["title", "thesis", "body", "counterpoint", "sources", "verification_report"],
};

const ARC_SCHEMA = {
  type: "object",
  properties: {
    intro: { type: "string", description: "2-3 sentences framing Estonia's arc for a newcomer" },
    nodes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          year: { type: "string" }, title: { type: "string" },
          blurb: { type: "string", description: "1-2 sentences on why this moment mattered" },
          source_title: { type: "string" }, source_url: { type: "string" },
        },
        required: ["year", "title", "blurb"],
      },
    },
  },
  required: ["nodes"],
};
const LANDSCAPE_SCHEMA = {
  type: "object",
  properties: {
    intro: { type: "string", description: "200-400 words framing the anomaly: a 1.3M-person country as a tech nation" },
    map: { type: "array", items: { type: "object", properties: { label: { type: "string" }, blurb: { type: "string" } }, required: ["label", "blurb"] }, description: "the structure of the answer — the forces, in a sentence each" },
    the_skeptic: { type: "string", description: "200-400 words of HONEST critique: where the story is hyped or fragile — e-Residency tax myths, the 2007 cyberattacks & 2017 ID-card flaw, reliance on a few big exits, brain drain, the gap between 'most unicorns per capita' framing and absolute scale. This section is mandatory." },
    sources: { type: "array", items: SOURCE },
  },
  required: ["intro", "the_skeptic"],
};
const METRICS_SCHEMA = {
  type: "object",
  properties: { items: { type: "array", items: NUM } },
  required: ["items"],
};
const SOURCES_MASTER_SCHEMA = {
  type: "object",
  properties: { items: { type: "array", items: SOURCE } },
  required: ["items"],
};

// ---------- rules ----------
const RULES = `
RESEARCH RULES (strict — this is a published, fact-checked guide; readers will click the links):
- Use WebSearch + WebFetch heavily. Fetch the actual pages; never rely on memory for facts/numbers.
- PREFER PRIMARY/ORIGINAL sources (the subject's own essays/talks/interviews, official Estonian government pages, real journalism, company filings) over encyclopedia/AI summaries. Wikipedia/Crunchbase are OK for facts but should NOT be the showcased sources.
- EVERY NUMBER the reader will see must be a NUM with its own working source_url and a confidence of verified|secondary|reported. No source → do NOT include the number. Never guess a figure.
- pull_quote / quote fields are VERBATIM. Never fabricate or paraphrase a quote. If you can't find a real one, leave it empty.
- Never invent a URL. Every url must be one you actually retrieved that loads.
- Flag every uncertain or conflicting fact in confidence_notes. Flag > guess.
- BE HONEST, NOT PROMOTIONAL. Where a claim is hyped or contested, say so. (Estonia markets itself well; do not just echo the brochure.)
- END BY EMITTING: after ~12-18 fetches, STOP and call your structured-output tool EXACTLY ONCE. A partial, well-sourced result is fine; researching forever and never emitting wastes the whole unit.
`;

// ---------- baked roster (scripts can't import roster.mjs) ----------
const COMPANIES = [
  { id: "skype", label: "Skype", category: "communications", brief: "Estonia's first tech giant. Core P2P engine built in Tallinn (Ahti Heinla, Priit Kasesalu, Jaan Tallinn) for founders Niklas Zennström (SE) & Janus Friis (DK), 2003. Sold to eBay 2005 (~$2.6B), to Microsoft 2011 (~$8.5B). Microsoft retired the service May 2025. Verify the Estonian engineering origin and the dates/figures." },
  { id: "wise", label: "Wise (formerly TransferWise)", category: "fintech", brief: "Cross-border payments. Founded 2011 London by Estonians Taavet Hinrikus & Kristo Käärmann. Rebranded 2021; LSE direct listing July 2021; later a US listing. Estonia's only decacorn. Verify valuation/listing facts." },
  { id: "bolt", label: "Bolt", category: "mobility", brief: "Ride-hailing/delivery/scooters across Europe & Africa. Founded 2013 Tallinn by Markus Villig (as Taxify) at 19, with brother Martin. Unicorn 2018. Verify founding, valuation, country count." },
  { id: "playtech", label: "Playtech", category: "gaming", brief: "World's largest online gaming software supplier. Founded 1999 in Tartu, Estonia by Teddy Sagi with Estonian developers; LSE-listed 2006. Verify the Tartu origin and current scale." },
  { id: "pipedrive", label: "Pipedrive", category: "saas", brief: "Sales CRM for SMBs. Founded 2010 Tallinn by Timo Rein, Urmas Purde, Ragnar Sass, Martin Henk, Martin Tajur. Vista Equity majority stake 2020 = unicorn. 100,000+ customers. Verify founders & the Vista deal." },
  { id: "veriff", label: "Veriff", category: "identity", brief: "AI identity verification / KYC. Founded 2015 Tallinn by Kaarel Kotkas (as a teenager). Unicorn 2022 (Tiger Global / Alkeon). Verify founder, year, valuation." },
  { id: "glia", label: "Glia", category: "saas", brief: "Digital customer service for banks/insurers. Founded 2012 as SaleMove by Dan Michaeli & Justin DiPietro; NYC HQ + strong Tallinn engineering. Unicorn 2022. Verify the Estonian connection precisely." },
  { id: "gelato", label: "Gelato", category: "commerce", brief: "Global print-on-demand network. Often listed among Estonia-linked unicorns — VERIFY the Estonian connection carefully (HQ Oslo; founder Henrik Müller-Hansen). If the link is weak, say so and downgrade confidence." },
  { id: "zego", label: "Zego", category: "insurtech", brief: "Gig-economy/fleet motor insurance. London HQ, co-founded by Estonian Sten Saar (ex-Deliveroo) with Harry Franks; unicorn 2021. Counted via its Estonian co-founder. VERIFY and state the connection precisely." },
  { id: "starship", label: "Starship Technologies", category: "deeptech", brief: "Autonomous sidewalk delivery robots. Founded 2014 by Skype co-founders Ahti Heinla & Janus Friis; strong Tallinn engineering. Millions of deliveries. NOT a confirmed unicorn — present as an iconic Skype-Mafia deeptech spinout. Verify status." },
  { id: "skeleton", label: "Skeleton Technologies", category: "deeptech", brief: "Ultracapacitor/energy-storage maker using patented 'curved graphene' (SuperBattery). Estonian-founded 2009 (Taavi Madiberk & Oliver Ahlberg), big German operations. A flagship hardware/deeptech story. Verify founders, tech claims, funding." },
];
const FOUNDERS = [
  { id: "jaan-tallinn", label: "Jaan Tallinn", brief: "Founding engineer of Kazaa & Skype; physicist. Now a leading voice/funder in AI existential-safety (co-founded CSER at Cambridge and the Future of Life Institute); prolific angel. Find his own words (talks/essays/interviews) + handles." },
  { id: "taavet-hinrikus", label: "Taavet Hinrikus", brief: "Skype's first employee → co-founder of Wise → investor (co-founded Plural). Articulate on European tech sovereignty. Find his essays/interviews/talks + handles." },
  { id: "kristo-kaarmann", label: "Kristo Käärmann", brief: "Co-founder & CEO of Wise; ex-Deloitte/PwC; the money-transfer pain that started Wise. Find his interviews/shareholder letters/talks + handles." },
  { id: "markus-villig", label: "Markus Villig", brief: "Founder & CEO of Bolt; started it at 19 in 2013. Known for capital efficiency and taking on Uber. Find interviews/talks + handles; verify the origin story." },
  { id: "kaarel-kotkas", label: "Kaarel Kotkas", brief: "Founder & CEO of Veriff; began building identity-verification ideas as a teenager in rural Estonia. Find founder interviews/podcasts + handles; verify the origin story." },
  { id: "sten-tamkivi", label: "Sten Tamkivi", brief: "Early Skype / GM Skype Estonia → founder (Teleport, Topia) → investor/operator (Plural, ex-Stripe). One of the ecosystem's most articulate essayists. Find his original writing + handles." },
  { id: "ilves", label: "Toomas Hendrik Ilves", brief: "President of Estonia 2006–2016; political architect/evangelist of e-Estonia & digital ID; earlier a co-initiator of Tiger Leap (1996). Now a digital-governance thinker (Stanford). Find speeches/essays/interviews + handles; verify roles/dates." },
];
const FORCES = [
  { id: "digital-state", label: "The digital state", brief: "e-government on X-Road (decentralised data exchange) + mandatory cryptographic digital ID; ~99% of services online; the 'once-only' principle; i-Voting since 2005; EU-legal digital signatures; large claimed time/GDP savings. Explain how it compresses startup time-to-market. Caveat honestly (2007 cyberattacks; 2017 ID-card crypto flaw)." },
  { id: "skype-mafia", label: "The Skype Mafia flywheel", brief: "Skype's 2005/2011 exits created 30+ wealthy, experienced founders/angels who recycled capital, talent and confidence into Wise, Bolt, Starship, Pipedrive, Plural, etc. Quantify the reinvestment flywheel; name the lineage. The most-cited explanation." },
  { id: "education", label: "Education & code-from-childhood", brief: "Tiger Leap (Tiigrihüpe, 1996): internet+computers in all schools by 2000-01. ProgeTiger (2012): programming/robotics from primary school. Estonia tops Europe on PISA (2018/2022). Tie the pipeline to startup output. Verify PISA ranks and dates." },
  { id: "tax", label: "0% tax on reinvested profit", brief: "Distributed-profit corporate tax: 0% on retained/reinvested profit, CIT only on distribution (22%, computed 22/78 of net). Flat, simple system; repeatedly #1 on the Tax Foundation International Tax Competitiveness Index. Explain why it rewards reinvestment-heavy startups. Verify rate and ranking." },
  { id: "e-residency", label: "e-Residency", brief: "Launched 2014: a government digital identity letting non-residents run an EU company 100% online. 100,000+ e-residents; many companies created; net economic contributor. Explain its role as soft power + funnel. Verify counts and the contribution claim; flag tax-myth misconceptions honestly." },
  { id: "small-market", label: "Born-global by necessity", brief: "A ~1.3M domestic market forces export-first thinking; high English fluency; EU single market; low-hierarchy, high-trust culture. Explain why smallness is an advantage here. Use comparative data where possible." },
  { id: "ai-nation", label: "The AI nation", brief: "BROADEN beyond Anthropic: Estonia's national AI strategy (#KrattAI / 'Kratt' and successors), the 2025 'AI Leap' (TI-Hüpe) putting AI tools in schools (reported OpenAI/Anthropic partnerships), strong general AI adoption among citizens & business, and Estonia's outsized standing on AI-usage indices. The Anthropic Economic Index (AI Usage Index ~3.05x, near the top per-capita despite modest GDP) is ONE data point among several (also Stanford AI Index, Tortoise Global AI Index, OECD). Explain why a digital-native state adopts AI faster. Source EVERY number." },
];

// ---------- prompts ----------
const companyPrompt = (t) => `You are a meticulous business journalist profiling a company for a field guide to Estonia's tech rise.

COMPANY: ${t.label}
KNOWN STARTING FACTS (verify, correct, expand — do NOT assume correct): ${t.brief}

Produce a deep, source-first dossier: the origin/insight/arc (200-400w, factual), why it matters to Estonia's story, 3-6 SOURCED key numbers (each with a working source_url + confidence), 1-3 VERBATIM pull-quotes, social handles, 3-6 PRIMARY sources best-first, and current 2026 status. CRUCIAL: fill estonia_connection precisely — if the Estonian link is weak (foreign HQ, only a co-founder, only an R&D office), say so plainly and downgrade confidence. Set a kebab-case slug.
${RULES}`;
const companyVerify = (p, t) => `You are an adversarial fact-checker for a published guide. Below is a draft dossier for "${t.label}". VERIFY and CORRECT it; do not trust it.

DRAFT:
${JSON.stringify(p)}

With live web access: (1) verify founder names, founding year, HQ, and especially the ESTONIA CONNECTION against independent sources; (2) re-check EVERY number in key_numbers by fetching its source_url — fix/drop any that don't match, ensure each has confidence; (3) WebFetch every url in sources[] and social{} — fix or remove dead/mismatched links; (4) confirm every pull_quote is real & verbatim; (5) keep sources PRIMARY. Return the corrected dossier + verification_report (confirmed / old→new corrections / dead links / uncertainties) and verified=true only if facts & numbers check out.
${RULES}`;

const founderPrompt = (t) => `You are a profile writer for a field guide to Estonia's tech founders.

FOUNDER: ${t.label}
KNOWN STARTING FACTS (verify, correct, expand): ${t.brief}

Produce: a one-paragraph bio, a 150-300w arc of their journey (and why it matters to Estonia's story), their philosophy grounded in THEIR OWN WORDS, why they're worth learning from, 1-3 VERBATIM pull-quotes, social handles to follow (full URLs), and 3-6 PRIMARY sources best-first (their essays/talks/interviews/podcasts — not encyclopedia pages). Set a kebab-case slug.
${RULES}`;
const founderVerify = (p, t) => `You are an adversarial fact-checker. Below is a draft profile for "${t.label}". VERIFY and CORRECT it.

DRAFT:
${JSON.stringify(p)}

With live web access: (1) verify roles, companies, dates; (2) WebFetch every url in sources[] and social{} — fix/remove dead or mismatched ones; (3) confirm every quote is real & verbatim (remove any you can't confirm); (4) keep sources PRIMARY (their own writing/talks). Return the corrected profile + verification_report and verified=true only if it checks out.
${RULES}`;

const forcePrompt = (t) => `You are writing one analytical section of a field guide explaining WHY Estonia punches above its weight in tech.

FORCE: ${t.label}
WHAT IT COVERS (verify, correct, expand): ${t.brief}

Produce: a sharp thesis (1-2 sentences), a 300-500w body that explains the MECHANISM with concrete examples (name real companies/people/programmes), 3-6 SOURCED numbers as evidence (each with working source_url + confidence), and a mandatory honest counterpoint (where this is overstated/contested/has a downside). 1-3 verbatim pull-quotes if strong ones exist. 3-6 primary/credible sources. Set a kebab-case slug.
${RULES}`;
const forceVerify = (p, t) => `You are an adversarial fact-checker for a published guide. Below is a draft section "${t.label}". VERIFY and CORRECT it; be skeptical of round numbers and brochure claims.

DRAFT:
${JSON.stringify(p)}

With live web access: (1) re-check EVERY number in evidence by fetching its source — fix/drop mismatches, set confidence; (2) WebFetch every source url — fix/remove dead/mismatched links; (3) confirm quotes are verbatim; (4) make sure counterpoint is substantive and fair, not a token caveat. Return the corrected section + verification_report and verified=true only if it checks out.
${RULES}`;

// ---------- run one batch ----------
const filt = (arr) => (ONLY.length ? arr.filter((e) => ONLY.includes(e.id)) : arr);

async function runEntity(roster, researchP, verifyP, schema, vschema, ph) {
  return pipeline(
    filt(roster),
    (t) => agent(researchP(t), { label: `research:${t.id}`, phase: "Research", schema, agentType: "general-purpose" }),
    (p, t) => (p ? agent(verifyP(p, t), { label: `verify:${t.id}`, phase: ph, schema: vschema, agentType: "general-purpose" }) : null)
  );
}

let result;
if (BATCH === "companies") {
  phase("Research");
  result = (await runEntity(COMPANIES, companyPrompt, companyVerify, COMPANY_SCHEMA, COMPANY_VERIFIED, "Verify")).filter(Boolean);
  log(`companies done: ${result.length}/${filt(COMPANIES).length}`);
} else if (BATCH === "founders") {
  phase("Research");
  result = (await runEntity(FOUNDERS, founderPrompt, founderVerify, FOUNDER_SCHEMA, FOUNDER_VERIFIED, "Verify")).filter(Boolean);
  log(`founders done: ${result.length}/${filt(FOUNDERS).length}`);
} else if (BATCH === "forces") {
  phase("Research");
  result = (await runEntity(FORCES, forcePrompt, forceVerify, FORCE_SCHEMA, FORCE_VERIFIED, "Verify")).filter(Boolean);
  log(`forces done: ${result.length}/${filt(FORCES).length}`);
} else if (BATCH === "context") {
  phase("Context");
  const [arc, landscape, metrics, sources] = await parallel([
    () =>
      agent(
        `Write the connective timeline for a field guide to Estonia's tech nation. intro + ~12-16 dated nodes from 1991 (restored independence) through: Tiger Leap (1996), Skype (2003), the e-state build-out & X-Road (2001-2002), i-Voting (2005), the 2007 cyberattacks, digital ID maturity, e-Residency (2014), the unicorn wave (Wise/Bolt/Pipedrive/Veriff), Skype's 2025 shutdown, the 2025 AI Leap. Each node: a real PRIMARY source url where possible; never invent URLs. ${RULES}`,
        { label: "arc", phase: "Context", schema: ARC_SCHEMA, agentType: "general-purpose" }
      ),
    () =>
      agent(
        `Write the framing for a field guide titled "The Estonian Anomaly". Produce: (1) intro (200-400w) on how a ~1.3M-person country became a tech nation; (2) a 'map' — one sentence each on the forces (digital state, Skype Mafia, education, 0% reinvested-profit tax, e-Residency, born-global smallness, AI adoption); (3) the_skeptic (200-400w, MANDATORY) — the honest critique: e-Residency tax myths, the 2007 cyberattacks & 2017 ID-card flaw, reliance on a handful of big exits, brain drain, the difference between 'most unicorns per capita' framing and absolute scale, and any over-marketing. Cite sources. ${RULES}`,
        { label: "landscape", phase: "Context", schema: LANDSCAPE_SCHEMA, agentType: "general-purpose" }
      ),
    () =>
      agent(
        `Assemble the SOURCE-GATED data core for an Estonia tech-nation guide: 12-20 headline numbers, EACH a NUM with label, value, as_of, an optional comparison, a working source_url, and confidence. Cover: population (~1.3M), number of unicorns, unicorns per capita (and the per-capita rank in Europe), startup investment/employees per capita, % of public services online, e-residents count, companies founded via e-Residency, PISA standing, corporate-tax-competitiveness rank, AND broad AI adoption — pull from MULTIPLE indices, not just Anthropic: the Anthropic Economic Index AI Usage Index (~3.05x; per-capita rank), plus Stanford AI Index, Tortoise Global AI Index, OECD/Eurostat AI-use stats where available. NEVER include a number without a working source_url. Prefer official/primary sources. ${RULES}`,
        { label: "metrics", phase: "Context", schema: METRICS_SCHEMA, agentType: "general-purpose" }
      ),
    () =>
      agent(
        `Curate the master 'further reading' list for an Estonia tech-nation guide: 12-18 of the BEST primary/long-form works (e-estonia.com & official Estonian gov pages, Invest in Estonia, serious journalism — FT/Economist/Wired/Euronews/Sifted, founder essays/talks, the relevant Anthropic Economic Index report, academic/OECD pieces). Each: title, type, publisher, author, a verified-live url (WebFetch it), and one line on why it matters. PRIMARY/original works only — no AI summaries. ${RULES}`,
        { label: "sources", phase: "Context", schema: SOURCES_MASTER_SCHEMA, agentType: "general-purpose" }
      ),
  ]);
  result = { arc, landscape, metrics, sources };
  log(`context done: arc:${arc ? "y" : "n"} landscape:${landscape ? "y" : "n"} metrics:${metrics?.items?.length || 0} sources:${sources?.items?.length || 0}`);
} else {
  throw new Error(`unknown BATCH: ${BATCH}`);
}

return result;
