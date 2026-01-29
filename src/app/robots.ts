import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/login",
        "/register",
        "/dashboard", // Protected writer/admin area
        "/write",      // Editor
        "/api/",       // API routes
      ],
    },
    sitemap: "https://wisefool.xyz/sitemap.xml",
  };
}
