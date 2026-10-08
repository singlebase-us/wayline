import type { MetadataRoute } from "next";
import { workflows } from "@/lib/content";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://wayline-workflow-systems.mellow-pond-8134.chatgpt.site";
  return [
    "",
    "/about/",
    "/contact/",
    ...Object.keys(workflows).map((slug) => `/workflows/${slug}/`),
  ].map((path) => ({
    url: `${origin}${path || "/"}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
