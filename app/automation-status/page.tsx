import fs from "fs";
import path from "path";

export const revalidate = 0; // always fresh on server-side

export default function AutomationStatusPage() {
  const projectRoot = process.cwd();
  const runFile = path.join(projectRoot, "output", "run.json");

  if (!fs.existsSync(runFile)) {
    return (
      <div>
        <h2>Automation status</h2>
        <p>No run.json found. Automation may not have executed yet.</p>
      </div>
    );
  }

  try {
    const raw = fs.readFileSync(runFile, "utf-8");
    const data = JSON.parse(raw);

    return (
      <div>
        <h2>Automation status</h2>
        <pre style={{ whiteSpace: "pre-wrap", maxWidth: "100%" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  } catch (err) {
    return (
      <div>
        <h2>Automation status</h2>
        <p>Failed to read run.json: {(err as Error).message}</p>
      </div>
    );
  }
}
