// Read and answered personally by a founder.
export const email = "contact@wayline.studio";
// Home gallery: the right-hand cards are decorative for now (the workflow
// detail pages are outdated). Set to true to make them link again.
export const galleryCardsClickable = false;
export const scenes = [
  {
    id: "overview",
    number: "01",
    title: ["Build fast.", "Stay built."],
    description:
      "You vibe-code the product. A full team of engineers and designers makes sure it holds up.",
    action: "SEE HOW WE WORK",
    href: "/services/",
    color: "#3d6681",
    ink: "#e2e7dc",
    visual: "flow",
    label: "Build fast, stay built",
  },
  {
    id: "landing",
    number: "02",
    title: ["Landing page.", "Day one."],
    description:
      "Brand, copy structure, motion, and SEO — from the same team that builds the product behind it.",
    action: "WHAT WE BUILD",
    href: "/services/#services",
    color: "#6c556d",
    ink: "#efe4e0",
    visual: "insurance",
    label: "Landing & brand site",
  },
  {
    id: "product",
    number: "03",
    title: ["Your product.", "Built to last."],
    description:
      "Frontend, APIs, auth, payments, and the agent and LLM work in between. Built to survive real users.",
    action: "WHAT WE BUILD",
    href: "/services/#services",
    color: "#af3f52",
    ink: "#f3dfd4",
    visual: "warehouse",
    label: "Product application",
  },
  {
    id: "back-office",
    number: "04",
    title: ["The back office.", "Handled."],
    description:
      "The admin, ops, and data tools your team uses every day — with permissions and audit trails built in.",
    action: "WHAT WE BUILD",
    href: "/services/#services",
    color: "#b6893b",
    ink: "#fcf0d8",
    visual: "property",
    label: "Private back office",
  },
  {
    id: "infrastructure",
    number: "05",
    title: ["Shipped.", "Watched.", "Maintained."],
    description:
      "Deploys, monitoring, cost control, and the on-call work nobody wants to own. We stay after launch.",
    action: "WHAT WE BUILD",
    href: "/services/#services",
    color: "#486a61",
    ink: "#e4e8dc",
    visual: "freight",
    label: "Infrastructure & on-call",
  },
  {
    id: "pricing",
    number: "06",
    title: ["Start small.", "Stay long."],
    description:
      "Partnerships start at $1,000 a month, with a founder answering every question personally.",
    action: "SEE PRICING",
    href: "/services/#pricing",
    color: "#bd4b35",
    ink: "#f5e2d0",
    visual: "pilot",
    label: "Pricing",
  },
] as const;
export const workflows = {
  insurance: {
    title: "Renewals & carrier portals",
    industry: "Independent insurance",
    headline: "Less chasing. More renewing.",
    intro:
      "Collect renewal information, coordinate portal work, update agency systems, and return approval steps to licensed staff.",
    color: "#6c556d",
    steps: [
      "Gather renewal information from emails, documents, and existing records.",
      "Check required fields and flag missing or conflicting information.",
      "Coordinate carrier portal work and agency system updates.",
      "Return decisions and approval steps to licensed staff.",
      "Record outcomes, exceptions, and the next action.",
    ],
  },
  distribution: {
    title: "Email & PDF orders to ERP",
    industry: "Wholesale distribution",
    headline: "An order should only be entered once.",
    intro:
      "Extract orders, check required fields, validate pricing or inventory, and route exceptions before entry.",
    color: "#af3f52",
    steps: [
      "Capture incoming orders from email, PDFs, and spreadsheets.",
      "Extract line items, customer details, and required fields.",
      "Validate pricing and inventory against available systems.",
      "Route discrepancies to the right person before entry.",
      "Move approved records into the ERP and retain an audit trail.",
    ],
  },
  property: {
    title: "Invoices & work orders",
    industry: "Property operations",
    headline: "Give every invoice a clear way forward.",
    intro:
      "Connect incoming invoices, contracts, work orders, approvals, and accounting preparation with an auditable trail.",
    color: "#b6893b",
    steps: [
      "Collect invoices, contracts, and supporting documents.",
      "Match documents to the relevant property and work order.",
      "Check required information and identify inconsistencies.",
      "Request the appropriate approval with full context.",
      "Prepare accounting records and retain the decision history.",
    ],
  },
  freight: {
    title: "Proof of delivery to billing",
    industry: "Freight brokerage",
    headline: "The delivery is done. Finish the paperwork.",
    intro:
      "Capture documents, verify shipment details, update transportation systems, and prepare complete billing packets.",
    color: "#486a61",
    steps: [
      "Capture proof-of-delivery documents from existing channels.",
      "Verify shipment identifiers and required information.",
      "Flag missing pages, conflicting details, and exceptions.",
      "Update transportation systems through approved access.",
      "Prepare a complete billing packet with a traceable history.",
    ],
  },
} as const;


/* ───────────── Services & pricing ───────────── */

export const services = [
  [
    "Landing & brand site",
    "The first page your users and investors see. Copy structure, design, motion, SEO, and analytics.",
  ],
  [
    "Product application",
    "The app your customers live in. Frontend, APIs, auth, payments, model and agent integrations.",
  ],
  [
    "Private back office",
    "The admin, ops, and data tools your team uses every day. Permissions, audit trails, and dashboards.",
  ],
  [
    "Infrastructure & reliability",
    "Deployment, environments, monitoring, cost control, and the on-call work nobody wants to own.",
  ],
] as const;

export const team = [
  "Frontend engineering",
  "Backend engineering",
  "Product design",
  "Agent & LLM systems",
  "DevOps & infrastructure",
  "QA & code review",
];

export const responsibilities = {
  you: [
    "Own the product and the customer",
    "Vibe-code features and prototypes freely",
    "Decide what ships and when",
  ],
  us: [
    "Architecture that survives the next 10× of usage",
    "Review, refactor, and harden what you ship",
    "Design system, security, deploys, and on-call",
  ],
};

// Columns: full-time engineer · traditional outsourcing · WAYLINE
export const comparison = [
  ["Monthly cost", "One senior salary + overhead", "Per-project quote + change orders", "Starting at $1,000 / month"],
  ["Roles covered", "One", "Whoever is free", "Frontend, backend, design, infra"],
  ["Time to start", "1–3 months of hiring", "Weeks of scoping", "Days"],
  ["Who writes code", "Them", "Them", "You and us, together"],
  ["Incentive", "A salary", "Billable hours", "Profit share in your outcome"],
  ["Relationship", "Employment", "Ends at hand-off", "Long-term partner"],
  ["Trust risk", "One person — if they leave, the knowledge leaves", "Unknown subcontractors behind the contract", "A trusted international team, not one unstable individual"],
] as const;

export const plans = [
  {
    name: "Partner",
    prefix: "Starting at",
    price: "$1,000",
    cadence: "/ month",
    hours: "30 hours a month by default",
    summary: "The whole team, across your whole product.",
    features: [
      "Frontend, backend, and design on call",
      "Landing page, product app, back office, and infrastructure",
      "Code review on everything you vibe-code",
      "Agent and LLM systems work",
      "Shared channel, same-day response",
      "Monitoring and on-call",
    ],
    featured: true,
    cta: "BECOME A PARTNER",
  },
  {
    name: "Custom",
    prefix: "",
    price: "Let’s talk",
    cadence: "",
    hours: "Hours and team shaped to your roadmap",
    summary: "For multiple products, larger scope, or compliance needs.",
    features: [
      "Everything in Partner",
      "Dedicated squad and roadmap planning",
      "Security and compliance reviews",
      "Hiring support for your in-house team",
    ],
    featured: false,
    cta: "TALK TO US",
  },
] as const;
