import { CopyEmailLink } from "./copy-email-link";

export function FounderContact({ subject }: { subject?: string }) {
  return (
    <div className="founder-contact">
      <p className="founder-label">
        Talk directly to a founder.
        <span>Every question answered personally.</span>
      </p>
      <CopyEmailLink className="contact-email" subject={subject} />
    </div>
  );
}
