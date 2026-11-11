import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      "https://wayline-workflow-systems.mellow-pond-8134.chatgpt.site",
  ),
  title: {
    default: "WAYLINE — A whole engineering team for AI-native companies",
    template: "%s | WAYLINE",
  },
  description:
    "WAYLINE is a long-term engineering and design team for AI-native companies — landing page to private back office, starting at $3,000 a month.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "WAYLINE",
    title: "WAYLINE — Build fast. Stay built.",
    description:
      "A whole engineering team for AI-native companies, built for the long run.",
  },
  twitter: { card: "summary", title: "WAYLINE — Build fast. Stay built." },
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
    email: "contact@wayline.studio",
    url:
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://wayline-workflow-systems.mellow-pond-8134.chatgpt.site",
    description:
      "A long-term engineering and design team for AI-native companies: landing pages, product applications, back offices, and infrastructure.",
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Lets CSS hide the un-enhanced home layout for the one frame
            before hydration, so it never flashes on navigation. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
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
