import { notFound } from "next/navigation";
import SiteDocument from "@/components/site-document";
import { locales, isLocale } from "@/lib/locales";
export { metadata, viewport } from "@/components/site-document";
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}
export default async function Layout({ children, params }: {
  children: React.ReactNode; params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SiteDocument locale={locale}>{children}</SiteDocument>;
}
