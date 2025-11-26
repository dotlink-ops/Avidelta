import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const base = path.join(process.cwd(), "SAMPLE_OUTPUTS");
    const summaryPath = path.join(base, "daily_runner_summary.txt");
    const logPath = path.join(base, "issue_pipeline_log.txt");

    const [summary, log] = await Promise.all([
      fs.readFile(summaryPath, "utf8").catch(() => ""),
      fs.readFile(logPath, "utf8").catch(() => ""),
    ]);

    return NextResponse.json({ summary, log }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "unable to read sample outputs", details: String(err) }, { status: 500 });
  }
}
