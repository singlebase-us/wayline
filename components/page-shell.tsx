import { LocaleLink } from "@/components/i18n";
import { T } from "@/components/i18n";
import { LanguageNav } from "./language-nav";
import { CopyEmail } from "./copy-email";
import { email } from "@/lib/content";
import { CopyEmailLink } from "./copy-email-link";
export function PageShell({
  children,
  back = "/",
}: {
  children: React.ReactNode;
  back?: string;
}) {
  return (
    <div className="editorial-page">
      <header className="site-header detail-header">
        <LocaleLink className="nav-link" href={back}>
          <span aria-hidden="true">←</span><T>{"BACK"}</T></LocaleLink>
        <LanguageNav><CopyEmail /></LanguageNav>
      </header>
      <main id="main">{children}</main>
      <footer className="detail-footer">
        <LocaleLink className="wordmark" href="/">
          WAYLINE
          <span className="brand-line" />
        </LocaleLink>
        <CopyEmailLink className="footer-email" label={email.toUpperCase()} />
      </footer>
    </div>
  );
}
