import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { Visual } from "@/components/visual";
import { capabilities } from "@/lib/content";
export const metadata: Metadata = {
  openGraph: {
    title: "About us — The execution layer | WAYLINE",
    description:
      "Reliable workflows across email, documents, portals, and core systems.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About us — The execution layer | WAYLINE",
    description:
      "Reliable workflows across email, documents, portals, and core systems.",
  },
  title: "About us — The execution layer",
  description:
    "WAYLINE builds reliable operational workflows across email, documents, portals, and core systems. Deterministic where possible. Agentic where useful.",
  alternates: { canonical: "/about/" },
};
const steps = [
  [
    "Capture",
    "Bring email, documents, forms, portal activity, and system events into one traceable task flow.",
  ],
  [
    "Validate",
    "Extract fields, apply deterministic rules, compare records, and identify missing or conflicting information early.",
  ],
  [
    "Execute",
    "Use approved APIs, integrations, or browser control to move work across the existing stack.",
  ],
  [
    "Escalate",
    "Route low-confidence cases and high-impact actions to the right person with the context needed to decide.",
  ],
  [
    "Observe",
    "Record status, decisions, errors, retries, and recovery so the workflow remains visible and supportable.",
  ],
];
export default function About() {
  return (
    <PageShell>
      <section className="about-hero">
        <div className="about-art">
          <Visual kind="flow" />
        </div>
        <div className="about-heading">
          <h1>
            We connect
            <br />
            the in-between.
          </h1>
          <p className="about-intro">
            Your core systems keep the records.
            <br />
            We make the work around them work.
          </p>
        </div>
      </section>
      <section className="editorial-section statement">
        <p className="eyebrow">THE OPERATING GAP</p>
        <h2>
          The gap is usually between systems,
          <br />
          <em>not inside them.</em>
        </h2>
        <p>
          Orders arrive in an inbox. Documents live in a folder. Someone has to
          re-key the fields, check the status, and remember the unwritten rules.
          As volume grows, so does the coordination.
        </p>
        <p>
          We build reliable execution layers across email, documents, portals,
          and systems of record — without forcing a core-system replacement.
        </p>
      </section>
      <section className="editorial-section execution-section">
        <div>
          <p className="eyebrow">THE EXECUTION LAYER</p>
          <h2>
            One controlled
            <br />
            workflow.
            <br />
            <em>Start to finish.</em>
          </h2>
          <p>
            We combine software engineering, integrations, browser automation,
            and agents. The most reliable tool wins.
          </p>
          <p className="human-note">
            Human-in-the-loop by design. People stay in control where judgment,
            approval, or accountability matters.
          </p>
        </div>
        <ol className="execution-steps">
          {steps.map(([title, copy], i) => (
            <li key={title}>
              <span className="step-number">0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <div className="principle-band">
        <span>DETERMINISTIC WHERE POSSIBLE.</span>
        <span>AGENTIC WHERE USEFUL.</span>
        <span aria-hidden="true">DETERMINISTIC WHERE POSSIBLE.</span>
      </div>
      <section className="editorial-section">
        <p className="eyebrow">BUILT END TO END</p>
        <h2>
          Custom where you’re unique.
          <br />
          <em>Reusable everywhere else.</em>
        </h2>
        <div className="capability-grid">
          {capabilities.map(([title, copy], i) => (
            <article key={title}>
              <span className="eyebrow">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="editorial-section security-section">
        <p className="eyebrow">PRACTICAL SECURITY FROM THE START</p>
        <h2>
          Control is part
          <br />
          of the product.
        </h2>
        <div>
          <p>
            Role-based access, encryption, secrets management, audit trails,
            environment separation, least privilege, and data masking can be
            built into the solution from the start. US-region cloud deployment
            is available when required.
          </p>
          <p className="muted">
            Regulatory, certification, and enterprise-review requirements are
            confirmed during discovery and scoped before delivery.
          </p>
        </div>
      </section>
      <section className="editorial-section closing-section">
        <p className="eyebrow">ONE WORKFLOW. CLEAR CRITERIA. REAL EVIDENCE.</p>
        <h2>
          Let’s make one workflow
          <br />
          <em>measurably better.</em>
        </h2>
        <a href="/contact/" className="text-link">
          START A CONVERSATION <span className="link-arrow">↗</span>
        </a>
      </section>
    </PageShell>
  );
}
