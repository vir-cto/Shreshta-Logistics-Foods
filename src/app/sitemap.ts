import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  "https://www.sreshtalogistics.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const paths = [
    // Logistics public
    "/logistics",
    "/logistics/about",
    "/logistics/services",
    "/logistics/domestic",
    "/logistics/international",
    "/logistics/cargo-freight",
    "/logistics/contact",
    "/logistics/partnership",
    "/logistics/track",
    "/logistics/book-freight",
    "/logistics/pickup-request",

    // Food public
    "/food",
    "/food/products",
    "/food/categories",
    "/food/track",

    // Root (if you use it)
    "/",
  ];

  return paths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/logistics" || path === "/food" ? "daily" : "weekly",
    priority:
      path === "/logistics" || path === "/food"
        ? 1
        : path === "/"
          ? 0.9
          : 0.7,
  }));
}