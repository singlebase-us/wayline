import { generateMetadata as workflowMetadata } from "../../../(default)/workflows/[slug]/page";
import { localizedMetadata } from "@/lib/localized-metadata";
export { default, generateStaticParams } from "../../../(default)/workflows/[slug]/page";
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  return localizedMetadata(await workflowMetadata({ params }), `/workflows/${slug}/`, locale);
}
