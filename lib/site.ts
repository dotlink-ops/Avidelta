export type NavLink = {
  label: string;
  href: string;
};

export const siteConfig = {
  name: "Avidelta",
  description: "Operational intelligence that turns strategy into repeatable outcomes.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  contactEmail: "hello@avidelta.com",
  navLinks: [
    { label: "Solutions", href: "#solutions" },
    { label: "Outcomes", href: "#outcomes" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ] as NavLink[],
  social: {
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "mailto:hello@avidelta.com",
  },
};

export const metadataDefaults = {
  keywords: [
    "operations platform",
    "revenue enablement",
    "process automation",
    "analytics",
    "customer success",
  ],
};

export function getSiteUrl() {
  const base = siteConfig.url?.trim().replace(/\/$/, "");
  return base || "http://localhost:3000";
}

export function metadataBaseUrl(): URL | undefined {
  try {
    return new URL(getSiteUrl());
  } catch {
    return undefined;
  }
}
