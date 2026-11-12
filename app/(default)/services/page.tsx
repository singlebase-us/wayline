import { LocaleLink } from "@/components/i18n";
import { T, Labelled } from "@/components/i18n";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { FounderContact } from "@/components/founder-contact";
import {
  comparison,
  plans,
  responsibilities,
  services,
  team,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Services & pricing",
  description:
    "A complete engineering and design team for AI-native companies — landing page to private back office, starting at $3,000 a month.",
  alternates: { canonical: "/services/" },
  openGraph: {
    title: "Services & pricing | WAYLINE",
    description:
      "A whole team, every layer. Long-term engineering partners for AI-native companies.",
    type: "website",
  },
};

export default function Services() {
  return (
    <PageShell>
      {/* 1 — Positioning */}
      <section className="svc-hero">
        <h1><T>{"A whole team."}</T><br />
          <em><T>{"Every layer covered."}</T></em>
        </h1>
        <p className="svc-lede"><T>{"Durable, efficient engineering for companies building with AI. We join for the long run, not for a single hand-off."}</T></p>
        <Labelled as="nav" className="svc-jump" aria-label="On this page">
          <LocaleLink href="#services"><T>{"Services"}</T></LocaleLink>
          <LocaleLink href="#why"><T>{"Why us"}</T></LocaleLink>
          <LocaleLink href="#pricing"><T>{"Pricing"}</T></LocaleLink>
        </Labelled>
      </section>

      {/* 2 — Services */}
      <section id="services" className="editorial-section svc-services">
        <div className="svc-services-head">
          <h2><T>{"Landing page to"}</T><br />
            <em><T>{"private back office."}</T></em>
          </h2>
          <p><T>{"Every layer of your product is covered by one team, so nothing falls between vendors."}</T></p>
          <Labelled as="ul" className="svc-team" aria-label="Who is on the team">
            {team.map((role) => (
              <li key={role}><T>{role}</T></li>
            ))}
          </Labelled>
        </div>
        <ol className="svc-index">
          {services.map(([title, copy], i) => (
            <li key={title}>
              <span className="step-number">0{i + 1}</span>
              <h3><T>{title}</T></h3>
              <p><T>{copy}</T></p>
            </li>
          ))}
        </ol>
      </section>

      {/* 3 — Shared responsibility */}
      <section className="editorial-section svc-split-section">
        <h2><T>{"You vibe-code."}</T><br />
          <em><T>{"We’ve got your back."}</T></em>
        </h2>
        <p className="svc-split-intro"><T>{"The people who understand the business best should build freely. We make sure what they build is fast, safe, and still standing next year."}</T></p>
        <div className="svc-split">
          <div>
            <span className="svc-split-label"><T>{"YOUR TEAM"}</T></span>
            <ul>
              {responsibilities.you.map((item) => (
                <li key={item}><T>{item}</T></li>
              ))}
            </ul>
          </div>
          <div className="svc-split-us">
            <span className="svc-split-label">WAYLINE</span>
            <ul>
              {responsibilities.us.map((item) => (
                <li key={item}><T>{item}</T></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4 — Comparison */}
      <section id="why" className="editorial-section svc-compare-section">
        <h2><T>{"Not a vendor."}</T><br />
          <em><T>{"A team that stays."}</T></em>
        </h2>
        <div className="svc-table-wrap">
          <table className="svc-table">
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only"><T>{"Criteria"}</T></span>
                </th>
                <th scope="col"><T>{"Full-time engineer"}</T></th>
                <th scope="col"><T>{"Traditional agency"}</T></th>
                <th scope="col" className="is-us">
                  WAYLINE
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map(([label, hire, agency, us]) => (
                <tr key={label}>
                  <th scope="row"><T>{label}</T></th>
                  <Labelled as="td" data-label="Full-time engineer"><T>{hire}</T></Labelled>
                  <Labelled as="td" data-label="Traditional agency"><T>{agency}</T></Labelled>
                  <td className="is-us" data-label="WAYLINE">
                    <T>{us}</T>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5 — Why it works */}
      <section className="editorial-section svc-reasons">
        <div className="svc-reason">
          <span className="svc-reason-num"><T>{"A"}</T></span>
          <h2><T>{"We take on"}</T><br />
            <em><T>{"fewer companies."}</T></em>
          </h2>
          <p><T>{"We cap the number of partners we work with at any one time. Your product gets attention, not a slot in a queue."}</T></p>
        </div>
        <div className="svc-reason">
          <span className="svc-reason-num"><T>{"B"}</T></span>
          <h2><T>{"Every teammate"}</T><br />
            <em><T>{"is a stakeholder."}</T></em>
          </h2>
          <p><T>{"Our engineers and designers don’t work for us — they share in the profit. The quality of your product is, quite literally, their income."}</T></p>
        </div>
      </section>

      {/* 6 — Pricing */}
      <section id="pricing" className="editorial-section svc-pricing">
        <h2><T>{"One partnership."}</T><br />
          <em><T>{"Or one built for you."}</T></em>
        </h2>
        <div className="svc-plans">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`svc-plan${plan.featured ? " is-featured" : ""}`}
            >
              <header>
                <h3><T>{plan.name}</T></h3>
              </header>
              <p className="svc-price">
                <small className="svc-from" aria-hidden={!plan.prefix}>
                  <T>{plan.prefix || "\u00a0"}</T>
                </small>
                <T>{plan.price}</T>
                {plan.cadence && <small> <T>{plan.cadence}</T></small>}
              </p>
              <p className="svc-plan-summary"><T>{plan.summary}</T></p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}><T>{feature}</T></li>
                ))}
              </ul>
              <p className="svc-hours"><T>{plan.hours}</T></p>
              <LocaleLink href="/contact/" className="svc-plan-cta">
                <T>{plan.cta}</T>
                <span aria-hidden="true">↗</span>
              </LocaleLink>
            </article>
          ))}
        </div>
        <p className="svc-pricing-note"><T>{"No hiring cost. No change orders. Start in days, and adjust the plan as your company grows."}</T></p>
      </section>

      <section className="editorial-section closing-section">
        <h2><T>{"Build the business."}</T><br />
          <em><T>{"We’ll build with you."}</T></em>
        </h2>
        <FounderContact subject="Partnering with WAYLINE" />
      </section>
    </PageShell>
  );
}
