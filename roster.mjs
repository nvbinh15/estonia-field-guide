// Canonical roster for the Estonia field guide — the single source of truth for
// "what entities should exist". progress.mjs diffs research.json against this;
// the workflow researches these; merge.mjs folds results in by `id`.
//
// Each entity has a stable kebab-case `id`. `brief` = known starting facts the
// research agent must VERIFY, correct, and expand (never assume correct).

export const COMPANIES = [
  {
    id: "skype",
    label: "Skype",
    category: "communications",
    brief:
      "Estonia's first tech giant. Core P2P engine built in Tallinn (Ahti Heinla, Priit Kasesalu, Jaan Tallinn) for founders Niklas Zennström (SE) & Janus Friis (DK), 2003. Sold to eBay 2005 (~$2.6B), to Microsoft 2011 (~$8.5B). Microsoft retired the service in May 2025. The wealth + talent created the 'Skype Mafia'. Verify the Estonian engineering origin and the dates/figures.",
  },
  {
    id: "wise",
    label: "Wise (formerly TransferWise)",
    category: "fintech",
    brief:
      "Cross-border payments. Founded 2011 London by Estonians Taavet Hinrikus (Skype's first employee) & Kristo Käärmann. Rebranded TransferWise→Wise 2021. Direct LSE listing July 2021; later added a US listing. Estonia's only decacorn. Verify valuation/listing facts and the dual-listing status.",
  },
  {
    id: "bolt",
    label: "Bolt",
    category: "mobility",
    brief:
      "Ride-hailing, food/grocery delivery, scooters, car-sharing across Europe/Africa. Founded 2013 Tallinn by Markus Villig (as Taxify) at age 19, with brother Martin Villig. Unicorn 2018. One of Europe's largest mobility platforms; repeatedly rumored for IPO. Verify founding, valuation, country count.",
  },
  {
    id: "playtech",
    label: "Playtech",
    category: "gaming",
    brief:
      "World's largest online gambling/gaming software supplier. Founded 1999 in Tartu, Estonia, by Teddy Sagi with a team of Estonian developers. Listed on the London Stock Exchange (2006). Verify the Estonian (Tartu) founding origin and current scale/listing.",
  },
  {
    id: "pipedrive",
    label: "Pipedrive",
    category: "saas",
    brief:
      "Sales CRM for small businesses. Founded 2010 Tallinn by Timo Rein, Urmas Purde, Ragnar Sass, Martin Henk, Martin Tajur. Vista Equity majority stake 2020 minted unicorn status. Serves 100,000+ companies. Verify founders, the Vista deal/valuation, and HQ.",
  },
  {
    id: "veriff",
    label: "Veriff",
    category: "identity",
    brief:
      "AI-powered identity verification / KYC. Founded 2015 Tallinn by Kaarel Kotkas (started it as a teenager). Unicorn 2022 after Tiger Global / Alkeon rounds. Verify founder, founding year, valuation and the funding rounds.",
  },
  {
    id: "glia",
    label: "Glia",
    category: "saas",
    brief:
      "Digital customer service / unified interaction platform for banks & insurers. Founded 2012 as SaleMove by Estonians Dan Michaeli & Justin DiPietro (NYC HQ, strong Tallinn engineering). Unicorn 2022. Verify the Estonian connection, founders, and unicorn round.",
  },
  {
    id: "gelato",
    label: "Gelato",
    category: "commerce",
    brief:
      "Global print-on-demand / distributed manufacturing network. Often listed among Estonia-linked unicorns — VERIFY the actual Estonian connection carefully (HQ is Oslo, Norway; founder Henrik Müller-Hansen). If the Estonian link is weak or only an R&D office, say so explicitly and downgrade confidence. Accuracy over inclusion.",
  },
  {
    id: "zego",
    label: "Zego",
    category: "insurtech",
    brief:
      "Commercial motor insurance for the gig economy / fleets. London-HQ but co-founded by Estonian Sten Saar (ex-Deliveroo) with Harry Franks; reached unicorn 2021. Counted in Estonian per-capita unicorn tallies via its Estonian co-founder. VERIFY the Estonian connection and state it precisely.",
  },
  {
    id: "starship",
    label: "Starship Technologies",
    category: "deeptech",
    brief:
      "Autonomous sidewalk delivery robots. Founded 2014 by Skype co-founders Ahti Heinla & Janus Friis; significant Estonian (Tallinn) engineering, San Francisco / Tallinn presence. Millions of autonomous deliveries on campuses. Not a confirmed unicorn — present as an iconic Skype-Mafia deeptech spinout, not necessarily a $1B company. Verify status.",
  },
  {
    id: "skeleton",
    label: "Skeleton Technologies",
    category: "deeptech",
    brief:
      "Ultracapacitor / energy-storage maker using patented 'curved graphene' (SuperBattery). Estonian-founded (2009, Tartu/Tallinn roots; Taavi Madiberk & Oliver Ahlberg), now major operations in Germany. A flagship Estonian deeptech/hardware story beyond software. Verify founders, technology claims, and current scale/funding.",
  },
];

export const FOUNDERS = [
  {
    id: "jaan-tallinn",
    label: "Jaan Tallinn",
    brief:
      "Founding engineer of Kazaa and Skype; physicist by training. Now a leading voice and funder in AI existential-safety (co-founded CSER at Cambridge and the Future of Life Institute), prolific angel investor. Rich primary sources: talks, interviews, essays on AI risk. Find his own words + handles.",
  },
  {
    id: "taavet-hinrikus",
    label: "Taavet Hinrikus",
    brief:
      "Skype's first employee (director of strategy) → co-founder of Wise (TransferWise) → prominent investor (co-founded Plural, an early-stage European fund) and ecosystem builder. Articulate on Europe's tech sovereignty. Find his essays/interviews/talks + handles.",
  },
  {
    id: "kristo-kaarmann",
    label: "Kristo Käärmann",
    brief:
      "Co-founder & CEO of Wise. Ex-Deloitte/PwC consultant; the personal money-transfer pain point that started Wise. Verify his role and find his interviews/letters-to-shareholders/talks + handles.",
  },
  {
    id: "markus-villig",
    label: "Markus Villig",
    brief:
      "Founder & CEO of Bolt; started it at 19 in 2013, one of Europe's youngest big-tech CEOs. Known for capital efficiency and taking on Uber. Find his interviews/talks + handles; verify the founding story.",
  },
  {
    id: "kaarel-kotkas",
    label: "Kaarel Kotkas",
    brief:
      "Founder & CEO of Veriff; started building identity-verification ideas as a teenager on a farm in Estonia. Find his founder interviews/podcasts + handles; verify the origin story.",
  },
  {
    id: "sten-tamkivi",
    label: "Sten Tamkivi",
    brief:
      "Early Skype employee / GM of Skype Estonia → serial founder (Teleport, Topia) → investor/operator (Plural, ex-Stripe). One of the most articulate writers/essayists in the Estonian ecosystem (Medium/personal blog, Tech.eu, talks). Find his original writing + handles.",
  },
  {
    id: "ilves",
    label: "Toomas Hendrik Ilves",
    brief:
      "President of Estonia 2006–2016; the political architect/evangelist of e-Estonia and digital identity (and earlier, as ambassador, a co-initiator of the 1996 Tiger Leap school-internet programme). Now a digital-governance thinker (Stanford). Find his speeches/essays/interviews + handles; verify roles and dates.",
  },
];

export const FORCES = [
  {
    id: "digital-state",
    label: "The digital state",
    brief:
      "e-government built on X-Road (decentralised data exchange) + a mandatory cryptographic digital ID; ~99% of public services online, the 'once-only' principle, i-Voting since 2005, digital signatures with EU legal force. Government estimates large time/GDP savings. Explain how this compresses startup time-to-market. Caveat honestly (e.g. the 2007 cyberattacks; 2017 ID-card crypto flaw).",
  },
  {
    id: "skype-mafia",
    label: "The Skype Mafia flywheel",
    brief:
      "Skype's 2005/2011 exits created ~30+ wealthy, experienced founders/angels who recycled capital, talent and confidence into the next generation (Wise, Bolt, Starship, Teleport, Pipedrive ties, Plural fund, etc.). Quantify the reinvestment flywheel; name the lineage. The single most-cited explanation for the cluster.",
  },
  {
    id: "education",
    label: "Education & code-from-childhood",
    brief:
      "Tiger Leap (Tiigrihüpe, 1996): internet+computers in all schools by 2000-01. ProgeTiger (2012): programming/robotics from primary school. Estonia tops Europe on PISA (2018/2022). Tie the talent pipeline to the startup output. Verify PISA ranks and programme dates.",
  },
  {
    id: "tax",
    label: "0% tax on reinvested profit",
    brief:
      "Estonia's distributed-profit corporate tax: 0% on retained/reinvested profit, CIT only on distribution (rate now 22%, computed 22/78 of net). Flat personal tax, simple system; consistently #1 on the Tax Foundation International Tax Competitiveness Index. Explain why this rewards reinvestment-heavy startups. Verify the rate and the ranking.",
  },
  {
    id: "e-residency",
    label: "e-Residency",
    brief:
      "Launched 2014: a government-issued digital identity letting non-residents start & run an EU company 100% online. 100,000+ e-residents; tens of thousands of companies created; net contributor to the economy. Explain its role as soft power + funnel. Verify the headline counts and the economic-contribution claim; flag tax-myth misconceptions honestly.",
  },
  {
    id: "small-market",
    label: "Born-global by necessity",
    brief:
      "A ~1.3M-person domestic market forces export-first/global-from-day-one thinking; high English fluency; EU single-market access; cultural traits (Nordic-Baltic pragmatism, low hierarchy, trust). Explain why smallness is an advantage here, not a limit. Use comparative data where possible.",
  },
  {
    id: "ai-nation",
    label: "The AI nation",
    brief:
      "Broaden beyond Anthropic: Estonia's national AI strategy (the #KrattAI / 'Kratt' programme and its successors), the 2025 'AI Leap' (TI-Hüpe) bringing AI tools into schools (partnerships reported with OpenAI/Anthropic), strong general AI adoption among citizens and business, and Estonia's outsized standing on AI-usage indices — the Anthropic Economic Index (AI Usage Index ~3.05x, ranking near the top per-capita despite modest GDP) is ONE data point among several (also Stanford AI Index, Tortoise Global AI Index, OECD). Explain why a digital-native state adopts AI faster. Source every number.",
  },
];

// Context units run as a single light batch (no adversarial verify pass; agents
// self-source-check). Each maps to a top-level key in research.json.
export const CONTEXT = [
  { id: "arc", label: "Timeline / arc (1991 → today)" },
  { id: "landscape", label: "Framing + the skeptic's view" },
  { id: "metrics", label: "Source-gated data core (incl. multi-index AI adoption)" },
  { id: "sources", label: "Master further-reading list" },
];

export const ROSTER = { COMPANIES, FOUNDERS, FORCES, CONTEXT };

// Map a raw research record onto its roster id (records carry their own id/slug,
// but be forgiving: match on id|slug|name|label, normalised).
export function rosterIds(kind) {
  return ROSTER[kind].map((e) => e.id);
}
