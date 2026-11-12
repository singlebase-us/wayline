import { metadata } from "@/components/site-document";
import { localizedMetadata } from "@/lib/localized-metadata";
export { default } from "../(default)/page";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return localizedMetadata(metadata, "/", (await params).locale);
}
