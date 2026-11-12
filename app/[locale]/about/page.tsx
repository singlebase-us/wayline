import { metadata } from "../../(default)/about/page";
import { localizedMetadata } from "@/lib/localized-metadata";
export { default } from "../../(default)/about/page";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return localizedMetadata(metadata, "/about/", (await params).locale);
}
