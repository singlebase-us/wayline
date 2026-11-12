import { metadata } from "../../(default)/contact/page";
import { localizedMetadata } from "@/lib/localized-metadata";
export { default } from "../../(default)/contact/page";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return localizedMetadata(metadata, "/contact/", (await params).locale);
}
