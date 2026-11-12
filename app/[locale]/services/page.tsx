import { metadata } from "../../(default)/services/page";
import { localizedMetadata } from "@/lib/localized-metadata";
export { default } from "../../(default)/services/page";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return localizedMetadata(metadata, "/services/", (await params).locale);
}
