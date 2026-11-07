import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { FounderContact } from "@/components/founder-contact";
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
        <FounderContact subject="Let’s work together" />
      </section>
      <section className="editorial-section">
        <div className="engagement-grid">
          <article>
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
          <p>
            A scoped paid pilot, followed by implementation and ongoing support
            where the results justify it.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
