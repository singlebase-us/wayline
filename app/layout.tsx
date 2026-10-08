import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      "https://wayline-workflow-systems.mellow-pond-8134.chatgpt.site",
  ),
  title: {
    default: "WAYLINE — Operational Workflow Systems",
    template: "%s | WAYLINE",
  },
  description:
    "Reliable execution layers across email, documents, portals, and systems of record. WAYLINE builds operational workflows with human review, visibility, and recovery.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "WAYLINE",
    title: "WAYLINE — Less busywork. More flow.",
    description:
      "Reliable operational workflows across the systems you already use.",
  },
  twitter: { card: "summary", title: "WAYLINE — Less busywork. More flow." },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3d6681",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WAYLINE",
    email: "contact@singlebase.co",
    url:
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://wayline-workflow-systems.mellow-pond-8134.chatgpt.site",
    description:
      "Product engineering for real-world operations. Reliable execution layers across email, documents, portals, and systems of record.",
  };
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organization).replace(/</g, "\\u003c"),
          }}
        />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
