import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    date: "2025-11-25",
    repo: "dotlink-ops/nextjs",
    summary_bullets: [
      "Got daily automation pipeline running end-to-end.",
      "Integrated OpenAI, GitHub, and local artifacts."
    ],
    action_items: [
      "Polish Next.js portfolio landing page.",
      "Refine investor-facing automation summary."
    ],
    raw_text: "Summary:\\n- ...\\n\\nActions:\\n- ...",
    created_at: "2025-11-25T11:55:23"
  });
}
