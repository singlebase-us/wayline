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
    "A complete engineering and design team for AI-native companies — landing page to private back office, starting at $1,000 a month.",
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
        <h1>
          A whole team.
          <br />
          <em>Every layer covered.</em>
        </h1>
        <p className="svc-lede">
          Durable, efficient engineering for companies building with AI. We
          join for the long run, not for a single hand-off.
        </p>
        <nav className="svc-jump" aria-label="On this page">
          <a href="#services">Services</a>
          <a href="#why">Why us</a>
          <a href="#pricing">Pricing</a>
        </nav>
      </section>

      {/* 2 — Services */}
      <section id="services" className="editorial-section svc-services">
        <div className="svc-services-head">
          <h2>
            Landing page to
            <br />
            <em>private back office.</em>
          </h2>
          <p>
            Every layer of your product is covered by one team, so nothing
            falls between vendors.
          </p>
          <ul className="svc-team" aria-label="Who is on the team">
            {team.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        </div>
        <ol className="svc-index">
          {services.map(([title, copy], i) => (
            <li key={title}>
              <span className="step-number">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 3 — Shared responsibility */}
      <section className="editorial-section svc-split-section">
        <h2>
          You vibe-code.
          <br />
          <em>We’ve got your back.</em>
        </h2>
        <p className="svc-split-intro">
          The people who understand the business best should build freely. We
          make sure what they build is fast, safe, and still standing next
          year.
        </p>
        <div className="svc-split">
          <div>
            <span className="svc-split-label">YOUR TEAM</span>
            <ul>
              {responsibilities.you.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="svc-split-us">
            <span className="svc-split-label">WAYLINE</span>
            <ul>
              {responsibilities.us.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4 — Comparison */}
      <section id="why" className="editorial-section svc-compare-section">
        <h2>
          Not a vendor.
          <br />
          <em>A team that stays.</em>
        </h2>
        <div className="svc-table-wrap">
          <table className="svc-table">
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Criteria</span>
                </th>
                <th scope="col">Full-time engineer</th>
                <th scope="col">Traditional agency</th>
                <th scope="col" className="is-us">
                  WAYLINE
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map(([label, hire, agency, us]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td data-label="Full-time engineer">{hire}</td>
                  <td data-label="Traditional agency">{agency}</td>
                  <td className="is-us" data-label="WAYLINE">
                    {us}
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
          <span className="svc-reason-num">A</span>
          <h2>
            We take on
            <br />
            <em>fewer companies.</em>
          </h2>
          <p>
            We cap the number of partners we work with at any one time. Your
            product gets attention, not a slot in a queue.
          </p>
        </div>
        <div className="svc-reason">
          <span className="svc-reason-num">B</span>
          <h2>
            Every teammate
            <br />
            <em>is a stakeholder.</em>
          </h2>
          <p>
            Our engineers and designers don’t work for us — they share in the
            profit. The quality of your product is, quite literally, their
            income.
          </p>
        </div>
      </section>

      {/* 6 — Pricing */}
      <section id="pricing" className="editorial-section svc-pricing">
        <h2>
          One partnership.
          <br />
          <em>Or one built for you.</em>
        </h2>
        <div className="svc-plans">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`svc-plan${plan.featured ? " is-featured" : ""}`}
            >
              <header>
                <h3>{plan.name}</h3>
              </header>
              <p className="svc-price">
                <small className="svc-from" aria-hidden={!plan.prefix}>
                  {plan.prefix || "\u00a0"}
                </small>
                {plan.price}
                {plan.cadence && <small> {plan.cadence}</small>}
              </p>
              <p className="svc-plan-summary">{plan.summary}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <p className="svc-hours">{plan.hours}</p>
              <a href="/contact/" className="svc-plan-cta">
                {plan.cta}
                <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
        <p className="svc-pricing-note">
          No hiring cost. No change orders. Start in days, and adjust the plan
          as your company grows.
        </p>
      </section>

      <section className="editorial-section closing-section">
        <h2>
          Build the business.
          <br />
          <em>We’ll build with you.</em>
        </h2>
        <FounderContact subject="Partnering with WAYLINE" />
      </section>
    </PageShell>
  );
}
