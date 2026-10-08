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
  const scene = scenes.find((scene) => scene.id === slug)!;
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
      email: "contact@singlebase.co",
    },
  };
  return (
    <PageShell back={`/#${slug}`}>
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
        <h1>{item.headline}</h1>
        <p>{item.intro}</p>
        <span className="workflow-scroll">
          SCROLL TO EXPLORE <span aria-hidden="true">↓</span>
        </span>
        <div className="workflow-art">
          <Visual kind={scene.visual} />
        </div>
      </section>
      <section className="editorial-section workflow-description">
        <div>
          <p className="eyebrow">A REPRESENTATIVE WORKFLOW</p>
          <h2>
            From fragmented inputs
            <br />
            <em>to completed work.</em>
          </h2>
          <p>
            Start with one recurring workflow that crosses systems, contains
            real exceptions, and costs money when it is slow or wrong.
          </p>
          <p className="muted">
            This is an illustrative use case, not a published client case study.
            System access, workflow economics, security, and maintainability are
            evaluated during discovery.
          </p>
        </div>
        <ol className="execution-steps">
          {item.steps.map((step, i) => (
            <li key={step}>
              <span className="step-number">0{i + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="editorial-section workflow-principles">
        <article>
          <span className="eyebrow">01 / HUMAN CHECKPOINTS</span>
          <h3>Judgment stays human.</h3>
          <p>
            Low-confidence cases and high-impact actions return to the right
            person with the context needed to decide.
          </p>
        </article>
        <article>
          <span className="eyebrow">02 / OBSERVABILITY</span>
          <h3>Know where work stands.</h3>
          <p>
            Status, decisions, errors, retries, and recovery are part of the
            workflow — so it remains visible and supportable.
          </p>
        </article>
        <article>
          <span className="eyebrow">03 / EXISTING SYSTEMS</span>
          <h3>Work with your stack.</h3>
          <p>
            Approved APIs, integrations, and browser control connect the tools
            you already use.
          </p>
        </article>
      </section>
      <section className="editorial-section closing-section">
        <p className="eyebrow">START NARROW. PROVE VALUE.</p>
        <h2>
          Have a workflow
          <br />
          <em>like this one?</em>
        </h2>
        <a className="text-link" href={`/contact/?workflow=${slug}`}>
          LET’S MAP IT TOGETHER <span className="link-arrow">↗</span>
        </a>
      </section>
      <a href={`/workflows/${next}/`} className="next-workflow">
        <span className="eyebrow">NEXT WORKFLOW</span>
        <strong>{workflows[next as keyof typeof workflows].title}</strong>
        <span aria-hidden="true">↗</span>
      </a>
    </PageShell>
  );
}
