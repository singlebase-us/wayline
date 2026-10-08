import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
export const metadata: Metadata = {
  openGraph: {
    title: "Start with one workflow | WAYLINE",
    description:
      "Bring one painful workflow. Define a scoped paid pilot and measure operational value.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Start with one workflow | WAYLINE",
    description:
      "Bring one painful workflow. Define a scoped paid pilot and measure operational value.",
  },
  title: "Start with one workflow",
  description:
    "Bring one painful workflow to a 30–45 minute discovery session. Define a scoped paid pilot and measure operational value with WAYLINE.",
  alternates: { canonical: "/contact/" },
};
export default function Contact() {
  return (
    <PageShell>
      <section className="contact-hero">
        <h1>
          Show us the work
          <br />
          that shouldn’t
          <br />
          <em>be your work.</em>
        </h1>
        <p>
          The workflow that makes your best people babysit software.
          <br />
          That’s a good place to start.
        </p>
        <a
          className="contact-email"
          href="mailto:contact@singlebase.co?subject=Let%E2%80%99s%20improve%20one%20workflow"
        >
          contact@singlebase.co <span aria-hidden="true">↗</span>
        </a>
        <span className="contact-note">
          CLIENT CONVERSATIONS & SUPPORT DURING NORMAL US BUSINESS HOURS
        </span>
      </section>
      <section className="editorial-section">
        <p className="eyebrow">
          START NARROW. PROVE VALUE. EXPAND WITH EVIDENCE.
        </p>
        <div className="engagement-grid">
          <article>
            <span>01 / DISCOVER</span>
            <h2>
              Bring one
              <br />
              painful workflow.
            </h2>
            <p>
              In a 30–45 minute working session, we map the handoffs, systems,
              exceptions, ownership, and cost of delay or error.
            </p>
          </article>
          <article>
            <span>02 / DEFINE</span>
            <h2>
              Set a<br />
              narrow pilot.
            </h2>
            <p>
              We agree on scope, access, human checkpoints, success criteria,
              and the operational support boundary before implementation begins.
            </p>
          </article>
          <article>
            <span>03 / DELIVER</span>
            <h2>
              Build, observe,
              <br />
              decide.
            </h2>
            <p>
              We deliver the workflow, monitor real use, document exceptions,
              and use the evidence to expand, refine, or stop.
            </p>
          </article>
        </div>
        <div className="engagement-note">
          <span className="eyebrow">HOW WE ENGAGE</span>
          <p>
            A scoped paid pilot, followed by implementation and ongoing support
            where the results justify it.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
