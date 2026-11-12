import type { MetadataRoute } from "next";
import { locales, localizedHref } from "@/lib/locales";
import { workflows } from "@/lib/content";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://wayline-workflow-systems.mellow-pond-8134.chatgpt.site";
  return [
    "",
    "/about/",
    "/services/",
    "/contact/",
    ...Object.keys(workflows).map((slug) => `/workflows/${slug}/`),
  ].flatMap((path) => [path || "/", ...locales.map(locale => localizedHref(path || "/", locale))]).map((path) => ({
    url: `${origin}${path || "/"}`,
    changeFrequency: "monthly",
    priority: path === "/" || locales.some(locale => path === `/${locale}/`) ? 1 : 0.8,
  }));
}
