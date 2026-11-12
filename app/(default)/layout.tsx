import SiteDocument from "@/components/site-document";
export { metadata, viewport } from "@/components/site-document";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteDocument restorePreference>{children}</SiteDocument>;
}
