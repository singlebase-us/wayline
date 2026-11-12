import { T } from "@/components/i18n";
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
        <h1><T>{"Show us the work"}</T><br /><T>{"that shouldn’t"}</T><br />
          <em><T>{"be your work."}</T></em>
        </h1>
        <p><T>{"The workflow that makes your best people babysit software."}</T><br /><T>{"That’s a good place to start."}</T></p>
        <FounderContact subject="Let’s work together" />
      </section>
      <section className="editorial-section">
        <div className="engagement-grid">
          <article>
            <h2><T>{"Bring one"}</T><br /><T>{"painful workflow."}</T></h2>
            <p><T>{"In a 30–45 minute working session, we map the handoffs, systems, exceptions, ownership, and cost of delay or error."}</T></p>
          </article>
          <article>
            <h2><T>{"Set a"}</T><br /><T>{"narrow pilot."}</T></h2>
            <p><T>{"We agree on scope, access, human checkpoints, success criteria, and the operational support boundary before implementation begins."}</T></p>
          </article>
          <article>
            <h2><T>{"Build, observe,"}</T><br /><T>{"decide."}</T></h2>
            <p><T>{"We deliver the workflow, monitor real use, document exceptions, and use the evidence to expand, refine, or stop."}</T></p>
          </article>
        </div>
        <div className="engagement-note">
          <p><T>{"A scoped paid pilot, followed by implementation and ongoing support where the results justify it."}</T></p>
        </div>
      </section>
    </PageShell>
  );
}
