import { Codex } from "@openai/codex-sdk";
import process from "process";

const codex = new Codex();

// repoPath is where this script is being run from
const repoPath = process.cwd();

const defaultPrompt = `
You are my "Upwork / portfolio prep" assistant for this repository.

Context:
- This repo will be used as a showcase for clients on Upwork and direct portfolio links.
- Target audience: technical but busy hiring managers who want proof of:
  * solid engineering fundamentals,
  * clear automation/AI value,
  * easy deployment / demo,
  * and understandable documentation.

Repository path:
- ${repoPath}

Your tasks:

1) Repo overview
   - Infer the purpose of this project.
   - Identify the main tech stack, frameworks, and key tools (e.g., Next.js, FastAPI, Codex, OpenAI, Excel automation).
   - Explain in 3–5 sentences how this repo demonstrates my skills in automation, AI, and web app work.

2) Cleanup recommendations
   - List specific, concrete cleanup tasks:
     * files/folders to rename, move, or delete,
     * configuration files to add or improve,
     * tests or linters to add,
     * any obvious security / secrets issues to fix.
   - Prioritize them as HIGH / MEDIUM / LOW.

3) Documentation plan
   - Draft a proposed structure for README.md with sections like:
     * Overview
     * Features
     * Tech Stack
     * Getting Started
     * Running Locally
     * Deployment
     * Examples / Screenshots
     * For Upwork Clients (how this maps to their use-cases)
   - For each section, provide bullet points or short paragraphs I can paste almost directly into the README.

4) Demo / deployment strategy
   - Propose at least one simple way to deploy this app or demo:
     * For web apps: Vercel / Render / Fly.io or similar.
     * For automations: "Run from CLI" instructions and sample commands.
   - Include:
     * required environment variables,
     * minimal build/setup steps,
     * how to produce a link or artifact I can show to clients.

5) Upwork-facing narrative
   - Write a short, client-facing description (150–250 words) I can:
     * use in an Upwork proposal,
     * or add to my portfolio profile referencing this repo.
   - Focus on business outcomes (time saved, errors reduced, faster decisions) rather than just tech buzzwords.

Format your answer as structured Markdown with the following top-level headings:

# Repo Overview
# Cleanup Recommendations
# Documentation Plan
# Demo / Deployment Strategy
# Upwork Narrative
`;

async function run() {
  const userPrompt = process.argv.slice(2).join(" ");
  const finalPrompt =
    userPrompt && userPrompt.trim().length > 0
      ? `${defaultPrompt}\n\nAdditional instructions from me:\n${userPrompt}`
      : defaultPrompt;

  const thread = await codex.startThread();
  const result = await thread.run(finalPrompt);
  console.log(result);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
