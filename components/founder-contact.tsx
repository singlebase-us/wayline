import { T } from "@/components/i18n";
import { CopyEmailLink } from "./copy-email-link";

export function FounderContact({ subject }: { subject?: string }) {
  return (
    <div className="founder-contact">
      <p className="founder-label"><T>{"Talk directly to a founder."}</T><span><T>{"Every question answered personally."}</T></span>
      </p>
      <CopyEmailLink className="contact-email" subject={subject} />
    </div>
  );
}
