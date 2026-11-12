import { T } from "@/components/i18n";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { Visual } from "@/components/visual";
import { workflows, scenes } from "@/lib/content";
export function generateStaticParams() {
  return Object.keys(workflows).map((slug) => ({ slug }));
}
export const dynamicParams = false;
type Props = { params: Promise<{ slug: string }> };
function getWorkflow(slug: string) {
  return workflows[slug as keyof typeof workflows];
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getWorkflow(slug);
  if (!item) return {};
  return {
    twitter: {
      card: "summary",
      title: `${item.title} | WAYLINE`,
      description: item.intro,
    },
    title: item.title,
    description: item.intro,
    alternates: { canonical: `/workflows/${slug}/` },
    openGraph: {
      title: `${item.title} | WAYLINE`,
      description: item.intro,
      type: "website",
    },
  };
}
export default async function Workflow({ params }: Props) {
  const { slug } = await params;
  const item = getWorkflow(slug);
  if (!item) notFound();
  const visualFor: Record<string, string> = {
    insurance: "insurance",
    distribution: "warehouse",
    property: "property",
    freight: "freight",
  };
  const scene = scenes.find((scene) => scene.visual === visualFor[slug])!;
  const entries = Object.keys(workflows);
  const next = entries[(entries.indexOf(slug) + 1) % entries.length];
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: item.title,
    description: item.intro,
    serviceType: "Operational workflow engineering",
    provider: {
      "@type": "Organization",
      name: "WAYLINE",
      email: "contact@wayline.studio",
    },
  };
  return (
    <PageShell back="/">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data).replace(/</g, "\\u003c"),
        }}
      />
      <section
        className="workflow-hero"
        style={{ "--workflow-color": item.color } as React.CSSProperties}
      >
        <h1><T>{item.headline}</T></h1>
        <p><T>{item.intro}</T></p>
        <span className="workflow-scroll"><T>{"SCROLL TO EXPLORE"}</T><span aria-hidden="true">↓</span>
        </span>
        <div className="workflow-art">
          <Visual kind={scene.visual} />
        </div>
      </section>
      <section className="editorial-section workflow-description">
        <div>
          <h2><T>{"From fragmented inputs"}</T><br />
            <em><T>{"to completed work."}</T></em>
          </h2>
          <p><T>{"Start with one recurring workflow that crosses systems, contains real exceptions, and costs money when it is slow or wrong."}</T></p>
          <p className="muted"><T>{"This is an illustrative use case, not a published client case study. System access, workflow economics, security, and maintainability are evaluated during discovery."}</T></p>
        </div>
        <ol className="execution-steps">
          {item.steps.map((step, i) => (
            <li key={step}>
              <span className="step-number">0{i + 1}</span>
              <p><T>{step}</T></p>
            </li>
          ))}
        </ol>
      </section>
      <section className="editorial-section workflow-principles">
        <article>
          <h3><T>{"Judgment stays human."}</T></h3>
          <p><T>{"Low-confidence cases and high-impact actions return to the right person with the context needed to decide."}</T></p>
        </article>
        <article>
          <h3><T>{"Know where work stands."}</T></h3>
          <p><T>{"Status, decisions, errors, retries, and recovery are part of the workflow — so it remains visible and supportable."}</T></p>
        </article>
        <article>
          <h3><T>{"Work with your stack."}</T></h3>
          <p><T>{"Approved APIs, integrations, and browser control connect the tools you already use."}</T></p>
        </article>
      </section>
      <section className="editorial-section closing-section">
        <h2><T>{"Have a workflow"}</T><br />
          <em><T>{"like this one?"}</T></em>
        </h2>
        <a className="text-link" href={`/contact/?workflow=${slug}`}><T>{"LET’S MAP IT TOGETHER"}</T><span className="link-arrow">↗</span>
        </a>
      </section>
      <a href={`/workflows/${next}/`} className="next-workflow">
        <span className="eyebrow"><T>{"NEXT WORKFLOW"}</T></span>
        <strong><T>{workflows[next as keyof typeof workflows].title}</T></strong>
        <span aria-hidden="true">↗</span>
      </a>
    </PageShell>
  );
}
