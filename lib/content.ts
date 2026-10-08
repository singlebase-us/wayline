export const email = "contact@singlebase.co";
export const scenes = [
  {
    id: "overview",
    number: "01",
    eyebrow: "OPERATIONAL WORKFLOW SYSTEMS",
    title: ["Less busywork.", "More flow."],
    description:
      "The operational last mile should not run on copy-and-paste. We connect the systems. You move the work forward.",
    action: "MEET YOUR EXECUTION LAYER",
    href: "/about/",
    color: "#3d6681",
    ink: "#e2e7dc",
    visual: "flow",
    label: "The execution layer",
  },
  {
    id: "insurance",
    number: "02",
    eyebrow: "INDEPENDENT INSURANCE",
    title: ["Renewals.", "Minus the chase."],
    description:
      "From renewal information to carrier portals. Keep the work moving, with licensed people in control of the decisions.",
    action: "EXPLORE THE WORKFLOW",
    href: "/workflows/insurance/",
    color: "#6c556d",
    ink: "#efe4e0",
    visual: "insurance",
    label: "Renewals & carrier portals",
  },
  {
    id: "distribution",
    number: "03",
    eyebrow: "WHOLESALE DISTRIBUTION",
    title: ["Orders in.", "Busywork out."],
    description:
      "Turn email and PDF orders into validated, ready-to-enter records. Catch missing details before they become costly mistakes.",
    action: "EXPLORE THE WORKFLOW",
    href: "/workflows/distribution/",
    color: "#af3f52",
    ink: "#f3dfd4",
    visual: "warehouse",
    label: "Email & PDF orders to ERP",
  },
  {
    id: "property",
    number: "04",
    eyebrow: "PROPERTY OPERATIONS",
    title: ["Every invoice.", "In its place."],
    description:
      "Connect invoices, work orders, approvals, and accounting preparation. One traceable path from incoming to complete.",
    action: "EXPLORE THE WORKFLOW",
    href: "/workflows/property/",
    color: "#b6893b",
    ink: "#fcf0d8",
    visual: "property",
    label: "Invoices & work orders",
  },
  {
    id: "freight",
    number: "05",
    eyebrow: "FREIGHT BROKERAGE",
    title: ["Delivered.", "Documented.", "Done."],
    description:
      "Bring proof of delivery, shipment records, and billing packets together. Close the gap between the delivery and the invoice.",
    action: "EXPLORE THE WORKFLOW",
    href: "/workflows/freight/",
    color: "#486a61",
    ink: "#e4e8dc",
    visual: "freight",
    label: "Proof of delivery to billing",
  },
  {
    id: "pilot",
    number: "06",
    eyebrow: "ONE WORKFLOW. REAL EVIDENCE.",
    title: ["Start narrow.", "Make it matter."],
    description:
      "Bring the workflow that makes your best people babysit software. We’ll find a focused pilot and measure what gets better.",
    action: "LET’S TALK ABOUT YOUR WORKFLOW",
    href: "/contact/",
    color: "#bd4b35",
    ink: "#f5e2d0",
    visual: "pilot",
    label: "Build something that works",
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
export const capabilities = [
  [
    "Product",
    "Discovery, prototype, user experience, landing page, and production web application.",
  ],
  [
    "Platform",
    "Authentication, permissions, APIs, databases, payments, and third-party integrations.",
  ],
  [
    "Agent systems",
    "Tool use, multi-step execution, state management, retries, error handling, and human review.",
  ],
  [
    "Integration",
    "REST and GraphQL APIs, OAuth, webhooks, business systems, and browser control.",
  ],
  [
    "Operations",
    "Cloud deployment, continuous delivery, logs, monitoring, observability, and recovery.",
  ],
  [
    "Productization",
    "Turn recurring work into configurable connectors, approval patterns, and execution components.",
  ],
];
