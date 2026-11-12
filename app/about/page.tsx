import { T } from "@/components/i18n";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { FounderContact } from "@/components/founder-contact";
import { PixelPower } from "@/components/pixel-power";

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
      <section className="about-hero about-hero--text">
        <div className="about-pixel">
          <PixelPower className="pixel-canvas" />
        </div>
        <div className="about-heading">
          <h1><T>{"Your team."}</T><br /><T>{"For years."}</T></h1>
          <p className="about-intro"><T>{"An international team of engineers and designers, working with a few AI-native companies — for years, not sprints."}</T></p>
        </div>
      </section>

      <section className="editorial-section statement">
        <h2><T>{"Most outsourcing is built to end."}</T><br />
          <em><T>{"We’re built to stay."}</T></em>
        </h2>
        <p><T>{"Agencies are paid for hours and hand-offs. Freelancers move on when something better comes along. Either way, the knowledge of your product walks out the door."}</T></p>
        <p><T>{"We work the other way round: a stable team that joins your channel, learns your product, and is still accountable for it next year."}</T></p>
      </section>

      <section className="editorial-section execution-section">
        <div>
          <h2><T>{"Built around"}</T><br /><T>{"the people who"}</T><br />
            <em><T>{"know the business."}</T></em>
          </h2>
          <p><T>{"The people closest to your customers should build freely. We make sure what they build is fast, safe, and still standing as you grow."}</T></p>
          <p className="human-note"><T>{"Partnerships start at $3,000 a month, with 30 hours a month by default."}</T></p>
        </div>
        <ol className="execution-steps">
          {steps.map(([title, copy], i) => (
            <li key={title}>
              <span className="step-number">0{i + 1}</span>
              <div>
                <h3><T>{title}</T></h3>
                <p><T>{copy}</T></p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="principle-band">
        <span><T>{"FEWER COMPANIES. BETTER WORK."}</T></span>
        <span><T>{"EVERYONE IS A STAKEHOLDER."}</T></span>
        <span aria-hidden="true"><T>{"FEWER COMPANIES. BETTER WORK."}</T></span>
      </div>

      <section className="editorial-section">
        <h2><T>{"Why it works."}</T><br />
          <em><T>{"And keeps working."}</T></em>
        </h2>
        <div className="capability-grid">
          {principles.map(([title, copy]) => (
            <article key={title}>
              <h3><T>{title}</T></h3>
              <p><T>{copy}</T></p>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-section security-section">
        <h2><T>{"Trust is part"}</T><br /><T>{"of the product."}</T></h2>
        <div>
          <p><T>{"No single point of failure: knowledge of your product is shared across the team and written down, so nobody leaving takes it with them."}</T></p>
          <p><T>{"Your code, your accounts, your infrastructure. Access control, secrets management, and least privilege are the default, not an upgrade."}</T></p>
        </div>
      </section>

      <section className="editorial-section closing-section">
        <h2><T>{"Let’s build"}</T><br />
          <em><T>{"for the long run."}</T></em>
        </h2>
        <FounderContact subject="Working with WAYLINE" />
      </section>
    </PageShell>
  );
}
