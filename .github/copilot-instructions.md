# GitHub Copilot Instructions

You are an AI coding copilot working in this repository.

## Repository Overview

This is a production-ready automation portfolio containing:
- **Next.js portfolio app**: A React/TypeScript web application deployed to Vercel at `avidelta.vercel.app`
- **Python automation stack**: Daily runner scripts for automated workflows
- **Glue scripts**: Bash/zsh scripts that sync automation outputs into the frontend

## Your Responsibilities

Your job is to **fix, debug, and improve**:
1. The Python automation stack in the repo root (`scripts/daily-runner.py`, `run-daily.sh`, `/data`, `/output`)
2. The Next.js portfolio app (`app/`, `components/`, `public/`)
3. Any glue scripts (bash/zsh) that sync automation outputs into the frontend

---

## Project Structure

```
/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints (health, status, daily-summary, demo)
│   ├── components/        # Page-level components
│   ├── page.tsx           # Main portfolio landing page
│   └── layout.tsx         # Root layout with metadata
├── components/            # Shared React components
├── data/                  # Automation output data (JSON summaries)
├── scripts/               # Python automation scripts
│   └── daily-runner.py    # Main daily automation script
├── public/                # Static assets
├── run-daily.sh          # Bash wrapper for daily runner
├── package.json          # Node.js dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── next.config.ts        # Next.js configuration
└── eslint.config.mjs     # ESLint configuration
```

---

## Tech Stack

### Frontend (Next.js)
- **Framework**: Next.js 16.0.0 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS ^4 with PostCSS
- **React**: React 19.2.0
- **Deployment**: Vercel (auto-deploys from `main` branch)

### Backend/Automation (Python)
- **Language**: Python 3.11+
- **Environment**: Virtual environment (`venv/`)
- **Key integrations**: OpenAI API, GitHub REST API

### Scripts (Bash/Zsh)
- **Entry point**: `run-daily.sh`
- **Purpose**: Orchestrate Python automation and sync outputs

---

## Development Commands

### Next.js App
```bash
npm install          # Install dependencies
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
npm start            # Start production server
```

### Python Automation
```bash
./run-daily.sh                           # Run full daily workflow
python3 scripts/daily-runner.py          # Run Python script directly
```

### Testing API Endpoints
```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/healthz | jq
curl http://localhost:3000/api/status | jq
curl http://localhost:3000/api/daily-summary | jq
```

---

## Coding Conventions

### TypeScript/React
- Use functional components with hooks
- Prefer named exports for components
- Use `"use client"` directive only when necessary (client-side interactivity)
- Follow Next.js App Router patterns
- Keep components small and focused
- Use TypeScript strict mode

### Python
- Follow PEP 8 style guidelines
- Use type hints for function signatures
- Include docstrings for functions and modules
- Handle exceptions gracefully with proper logging
- Use virtual environments for isolation

### Bash/Zsh Scripts
- Start with appropriate shebang (`#!/bin/bash` or `#!/bin/zsh`)
- Use `set -e` for fail-fast behavior
- Quote variables to handle spaces
- Provide clear error messages

---

## API Endpoints

The Next.js app provides these API routes:

| Endpoint | Description |
|----------|-------------|
| `/api/health` | Basic liveness check |
| `/api/healthz` | Ops-friendly health check with commit info |
| `/api/ready` | Readiness check |
| `/api/status` | Aggregated status |
| `/api/version` | Version info |
| `/api/uptime` | Process uptime |
| `/api/ping` | Timestamp echo |
| `/api/daily-summary` | Daily automation summary data |
| `/api/demo` | Demo endpoint for portfolio |

---

## Data Flow

1. **Daily Runner** (`run-daily.sh` → `scripts/daily-runner.py`)
   - Ingests notes from configured sources
   - Uses OpenAI API for summarization
   - Creates/updates GitHub issues
   - Writes JSON output to `data/daily_summary.json`

2. **Next.js API** (`app/api/daily-summary/`)
   - Reads from `data/daily_summary.json`
   - Serves data to frontend components

3. **Frontend** (`app/page.tsx`, `components/`)
   - Displays automation outputs
   - Interactive demo components

---

## Environment Variables

Required environment variables (set in `.env.local`):
- `OPENAI_API_KEY` - For AI summarization
- `GITHUB_TOKEN` - For GitHub API access
- `REPO_NAME` - Target repository for issues

See `.env.example` for template.

---

## Common Tasks

### Adding a new API endpoint
1. Create folder in `app/api/[endpoint-name]/`
2. Add `route.ts` with exported HTTP method handlers
3. Return `NextResponse.json()` for JSON responses

### Modifying the daily runner
1. Edit `scripts/daily-runner.py`
2. Test with `python3 scripts/daily-runner.py`
3. Update `data/daily_summary.json` schema if needed
4. Ensure API endpoints handle schema changes

### Updating frontend components
1. Edit files in `app/` or `components/`
2. Run `npm run dev` for hot reload
3. Test on mobile viewport for responsive design
4. Run `npm run lint` before committing

---

## Deployment

- **Production**: Automatic deployment to Vercel on push to `main`
- **Preview**: Automatic preview URLs for pull requests
- **Health checks**: Use `/api/healthz` and `/api/status` to verify deployments

---

## Best Practices

1. **Never commit secrets** - Use environment variables
2. **Test locally first** - Run `npm run build` before pushing
3. **Keep PRs focused** - One feature/fix per PR
4. **Update docs** - Keep README.md current with changes
5. **Log automation runs** - Maintain audit trail in `data/`
