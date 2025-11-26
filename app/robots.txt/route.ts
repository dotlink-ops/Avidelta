import { getSiteUrl } from "@/lib/site";

export function GET() {
  const siteUrl = getSiteUrl();
  const body = `User-agent: *
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
Host: ${siteUrl}`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
