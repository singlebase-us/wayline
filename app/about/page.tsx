import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { FounderContact } from "@/components/founder-contact";

export const metadata: Metadata = {
  title: "About us — Your team, for years",
  description:
    "WAYLINE is an international team of engineers and designers working long-term with a small number of AI-native companies. Every member shares in the profit.",
  alternates: { canonical: "/about/" },
  openGraph: {
    title: "About us — Your team, for years | WAYLINE",
    description:
      "An international team of engineers and designers, working long-term with a few AI-native companies.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About us — Your team, for years | WAYLINE",
    description:
      "An international team of engineers and designers, working long-term with a few AI-native companies.",
  },
};

const roles = [
  "Frontend",
  "Backend",
  "Design",
  "Agents & LLM",
  "Infrastructure",
  "Review & QA",
];

const steps = [
  [
    "Talk to a founder",
    "No sales layer. The people who run WAYLINE hear what you’re building and tell you honestly whether we fit.",
  ],
  [
    "Start in days",
    "We join your repository, your channel, and your roadmap — no long scoping phase before anything ships.",
  ],
  [
    "You build, we back you",
    "Your team keeps vibe-coding. We review, refactor, harden, and ship what needs to last.",
  ],
  [
    "Grow together",
    "Hours and scope change as your company does. The team that knows your product stays with it.",
  ],
];

const principles = [
  [
    "Fewer companies",
    "We cap how many partners we take on, so your product gets attention instead of a slot in a queue.",
  ],
  [
    "Everyone is a stakeholder",
    "Our engineers and designers share in the profit. The quality of your product is their income.",
  ],
  [
    "An international team",
    "Built on years of working together, across time zones — not a roster of freelancers assembled per project.",
  ],
  [
    "Founders on every account",
    "A founder stays close to every partnership and answers your questions personally.",
  ],
  [
    "Every layer, one team",
    "Landing page, product, back office, and infrastructure — nothing falls between vendors.",
  ],
  [
    "Built to be handed over",
    "Readable code, documentation, and your own accounts. Staying should be a choice, never a lock-in.",
  ],
];

export default function About() {
  return (
    <PageShell>
      <section className="about-hero">
        <div className="about-art">
          <div className="flow-visual team-visual" aria-hidden="true">
            <div className="diagram-top">
              <span>WAYLINE</span>
              <span>ONE TEAM</span>
            </div>
            <p className="flow-intro">
              Every layer.
              <br />
              <em>One team.</em>
            </p>
            <div className="team-roles">
              {roles.map((role) => (
                <span key={role}>{role}</span>
              ))}
            </div>
            <div className="team-you">
              <span>Your team</span>
              <strong>Builds the product. Owns the decisions.</strong>
            </div>
            <div className="diagram-bottom">
              <span>LONG-TERM · FEW PARTNERS</span>
              <span>FOUNDER-LED</span>
            </div>
          </div>
        </div>
        <div className="about-heading">
          <h1>
            Your team.
            <br />
            For years.
          </h1>
          <p className="about-intro">
            An international team of engineers and designers, working with a
            few AI-native companies — for years, not sprints.
          </p>
        </div>
      </section>

      <section className="editorial-section statement">
        <h2>
          Most outsourcing is built to end.
          <br />
          <em>We’re built to stay.</em>
        </h2>
        <p>
          Agencies are paid for hours and hand-offs. Freelancers move on when
          something better comes along. Either way, the knowledge of your
          product walks out the door.
        </p>
        <p>
          We work the other way round: a stable team that joins your channel,
          learns your product, and is still accountable for it next year.
        </p>
      </section>

      <section className="editorial-section execution-section">
        <div>
          <h2>
            Built around
            <br />
            the people who
            <br />
            <em>know the business.</em>
          </h2>
          <p>
            The people closest to your customers should build freely. We make
            sure what they build is fast, safe, and still standing as you grow.
          </p>
          <p className="human-note">
            Partnerships start at $1,000 a month, with 30 hours a month by
            default.
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
        <span>FEWER COMPANIES. BETTER WORK.</span>
        <span>EVERYONE IS A STAKEHOLDER.</span>
        <span aria-hidden="true">FEWER COMPANIES. BETTER WORK.</span>
      </div>

      <section className="editorial-section">
        <h2>
          Why it works.
          <br />
          <em>And keeps working.</em>
        </h2>
        <div className="capability-grid">
          {principles.map(([title, copy]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-section security-section">
        <h2>
          Trust is part
          <br />
          of the product.
        </h2>
        <div>
          <p>
            No single point of failure: knowledge of your product is shared
            across the team and written down, so nobody leaving takes it with
            them.
          </p>
          <p>
            Your code, your accounts, your infrastructure. Access control,
            secrets management, and least privilege are the default, not an
            upgrade.
          </p>
        </div>
      </section>

      <section className="editorial-section closing-section">
        <h2>
          Let’s build
          <br />
          <em>for the long run.</em>
        </h2>
        <FounderContact subject="Working with WAYLINE" />
      </section>
    </PageShell>
  );
}
