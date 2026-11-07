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
        <a className="nav-link" href={back}>
          <span aria-hidden="true">←</span> BACK
        </a>
        <CopyEmail />
      </header>
      <main id="main">{children}</main>
      <footer className="detail-footer">
        <a className="wordmark" href="/">
          WAYLINE
          <span className="brand-line" />
        </a>
        <CopyEmailLink className="footer-email" label={email.toUpperCase()} />
      </footer>
    </div>
  );
}
