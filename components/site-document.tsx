import { GlobalLoadingProvider } from "./global-loading";
import { LocaleProvider, T } from "@/components/i18n";
import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { type Locale, locales, storageKey } from "@/lib/locales";
import { workflows } from "@/lib/content";
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
export default function SiteDocument({
  children, locale = "en", restorePreference = false,
}: Readonly<{ children: React.ReactNode; locale?: Locale; restorePreference?: boolean }>) {
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
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Legacy URLs restore a preference before showing any page content.
            Explicit locale URLs already contain fully translated static HTML. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js');${restorePreference ? `
              try {
                var saved = localStorage.getItem(${JSON.stringify(storageKey)});
                var paths = ${JSON.stringify(["/", "/services/", "/about/", "/contact/", ...Object.keys(workflows).map(slug => `/workflows/${slug}/`)])};
                if (saved !== 'en' && ${JSON.stringify(locales)}.includes(saved) && paths.includes(location.pathname)) {
                  document.documentElement.dataset.localeRedirect = 'true';
                  location.replace('/' + saved + location.pathname + location.search + location.hash);
                }
              } catch (_) {}
            ` : ""}`,

          }}
        />
        <style>{`html[data-locale-redirect="true"] body { visibility: hidden; }`}</style>
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organization).replace(/</g, "\\u003c"),
          }}
        />
        <GlobalLoadingProvider>
          <LocaleProvider initialLocale={locale}>
            <a href="#main" className="skip-link">
              <T>Skip to content</T>
            </a>
            {children}
          </LocaleProvider>
        </GlobalLoadingProvider>
      </body>
    </html>
  );
}
