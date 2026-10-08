import { CopyEmail } from "./copy-email";
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
        <span>PRODUCT ENGINEERING FOR REAL-WORLD OPERATIONS</span>
        <a href="mailto:contact@singlebase.co">CONTACT@SINGLEBASE.CO ↗</a>
      </footer>
    </div>
  );
}
