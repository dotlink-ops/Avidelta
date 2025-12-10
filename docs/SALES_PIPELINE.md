# Sales Pipeline Automation

## Overview

Automated sales pipeline data pulling functionality for the Avidelta automation platform. This module provides scheduled data collection from various sales pipeline sources (CRM systems, databases, CSV files) and generates structured summaries for reporting and analysis.

## Features

- **Multi-Source Support**: Can pull data from various sources:
  - CRM systems (Salesforce, HubSpot, etc.) - *Coming Soon*
  - Direct database connections - *Coming Soon*
  - CSV/Excel imports - *Coming Soon*
  - Demo mode with realistic sample data ✅

- **Rich Data Model**: Captures comprehensive deal information:
  - Deal ID, company name, value
  - Stage, probability, expected close date
  - Deal owner, last activity
  - Notes and custom fields

- **Summary Statistics**: Automatic calculation of:
  - Total pipeline value
  - Weighted pipeline value (value × probability)
  - Deals by stage breakdown
  - Top deals by value

- **JSON Output**: Structured data format for easy integration with:
  - Daily automation summaries
  - Dashboards and visualizations
  - Reporting tools
  - API consumers

## Quick Start

### Demo Mode (No Configuration Required)

```bash
# Run with sample data
./scripts/run_sales_pipeline.sh --demo

# Or directly with Python
python3 scripts/sales_pipeline_pull.py --demo
```

### Production Mode

```bash
# Configure data source (see Configuration section)
export SALES_CRM_TYPE=salesforce
export SALES_CRM_API_KEY=your-api-key

# Run pipeline pull
./scripts/run_sales_pipeline.sh
```

## Output Format

The script generates `output/sales_pipeline.json` with the following structure:

```json
{
  "date": "2025-12-10",
  "total_deals": 5,
  "total_value": 750000.0,
  "weighted_value": 407250.0,
  "deals_by_stage": {
    "proposal": 2,
    "negotiation": 1,
    "qualification": 1,
    "prospecting": 1
  },
  "top_deals": [
    {
      "deal_id": "DEAL-003",
      "company_name": "Global Solutions Ltd",
      "deal_value": 250000.0,
      "stage": "qualification",
      "probability": 40,
      "expected_close_date": "2026-01-30",
      "owner": "Sarah Chen",
      "last_activity": "2025-12-10",
      "notes": "Discovery call scheduled for next week"
    }
  ],
  "deals": [ /* full list of all deals */ ],
  "_metadata": {
    "generated_at": "2025-12-10T20:21:03Z",
    "demo_mode": false,
    "version": "1.0.0"
  }
}
```

## Configuration

### Environment Variables

Create or update `.env.local` with the following variables:

```bash
# Data source type (optional, defaults to demo)
SALES_DATA_SOURCE=demo  # Options: demo, salesforce, hubspot, csv, database

# CRM Configuration (if using CRM source)
SALES_CRM_TYPE=salesforce
SALES_CRM_API_KEY=your-api-key-here
SALES_CRM_API_URL=https://api.salesforce.com/v2

# Database Configuration (if using database source)
SALES_DB_HOST=localhost
SALES_DB_PORT=5432
SALES_DB_NAME=crm
SALES_DB_USER=readonly
SALES_DB_PASSWORD=your-password

# CSV Configuration (if using CSV source)
SALES_CSV_PATH=/path/to/pipeline.csv

# Output directory (optional)
OUTPUT_DIR=./output
```

## Integration with Daily Runner

The sales pipeline pull can be integrated into the daily automation workflow:

### Option 1: Run Before Daily Summary

```bash
# In your automation script or cron job
./scripts/run_sales_pipeline.sh
python3 scripts/daily_v2.py
```

### Option 2: Schedule Separately

```bash
# Add to crontab for daily 6 AM run
0 6 * * * cd /path/to/Avidelta && ./scripts/run_sales_pipeline.sh >> /var/log/sales-pipeline.log 2>&1
```

### Option 3: GitHub Actions

Create `.github/workflows/sales-pipeline.yml`:

```yaml
name: Sales Pipeline Pull

on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM UTC
  workflow_dispatch:

jobs:
  pull-pipeline:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - name: Pull pipeline data
        env:
          SALES_CRM_API_KEY: ${{ secrets.SALES_CRM_API_KEY }}
        run: |
          python3 scripts/sales_pipeline_pull.py
      - name: Commit results
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add output/sales_pipeline.json
          git commit -m "Update sales pipeline data" || true
          git push
```

## Data Source Setup

### Salesforce (Coming Soon)

```python
# Example configuration
SALES_DATA_SOURCE=salesforce
SALES_CRM_API_KEY=your-salesforce-token
```

### HubSpot (Coming Soon)

```python
# Example configuration
SALES_DATA_SOURCE=hubspot
SALES_CRM_API_KEY=your-hubspot-token
```

### PostgreSQL Database (Coming Soon)

```python
# Example configuration
SALES_DATA_SOURCE=database
SALES_DB_TYPE=postgresql
SALES_DB_HOST=db.example.com
SALES_DB_NAME=crm
```

### CSV Import (Coming Soon)

```python
# Example configuration
SALES_DATA_SOURCE=csv
SALES_CSV_PATH=/data/pipeline.csv
```

## Pipeline Stages

The following standard pipeline stages are supported:

- **prospecting**: Initial outreach and lead qualification
- **qualification**: Needs analysis and solution fit
- **proposal**: Proposal/quote sent to prospect
- **negotiation**: Contract review and negotiation
- **closed_won**: Deal successfully closed
- **closed_lost**: Deal lost to competitor or no decision

## Testing

```bash
# Run in demo mode
python3 scripts/sales_pipeline_pull.py --demo

# Check output
cat output/sales_pipeline.json | jq

# Verify data structure
python3 -c "import json; data = json.load(open('output/sales_pipeline.json')); print(f'Loaded {data[\"total_deals\"]} deals')"
```

## Troubleshooting

### Issue: Script fails with "No data source configured"

**Solution**: Either run in demo mode or configure a data source in `.env.local`

```bash
# Quick fix: Run in demo mode
./scripts/run_sales_pipeline.sh --demo
```

### Issue: Permission denied

**Solution**: Ensure scripts are executable

```bash
chmod +x scripts/run_sales_pipeline.sh
chmod +x scripts/sales_pipeline_pull.py
```

### Issue: Output directory doesn't exist

**Solution**: The script creates it automatically, but you can create manually:

```bash
mkdir -p output
```

## Roadmap

- [x] Demo mode with sample data
- [x] JSON output format
- [x] Summary statistics calculation
- [ ] Salesforce integration
- [ ] HubSpot integration
- [ ] PostgreSQL database connector
- [ ] CSV/Excel import
- [ ] Custom field mapping
- [ ] Historical tracking and trends
- [ ] Alert thresholds (e.g., pipeline below target)
- [ ] Email/Slack notifications

## API Reference

### SalesPipelinePuller Class

```python
from scripts.sales_pipeline_pull import SalesPipelinePuller

# Initialize
puller = SalesPipelinePuller(demo_mode=True)

# Pull data
deals = puller.pull_pipeline_data()

# Generate summary
summary = puller.generate_summary(deals)

# Save to file
output_file = puller.save_output(summary)
```

### PipelineDeal Dataclass

```python
@dataclass
class PipelineDeal:
    deal_id: str
    company_name: str
    deal_value: float
    stage: str
    probability: int  # 0-100
    expected_close_date: str
    owner: str
    last_activity: str
    notes: Optional[str] = None
```

### PipelineSummary Dataclass

```python
@dataclass
class PipelineSummary:
    date: str
    total_deals: int
    total_value: float
    weighted_value: float
    deals_by_stage: Dict[str, int]
    top_deals: List[Dict[str, Any]]
    deals: List[Dict[str, Any]]
```

## Contributing

To add a new data source:

1. Create a new method in `SalesPipelinePuller` class:
   ```python
   def _pull_from_salesforce(self) -> List[PipelineDeal]:
       # Implementation here
       pass
   ```

2. Update `pull_pipeline_data()` to check for the new source:
   ```python
   if source_type == "salesforce":
       return self._pull_from_salesforce()
   ```

3. Add configuration documentation above

4. Add tests for the new source

## License

Part of the Avidelta automation platform. See main repository LICENSE.

---

**Last Updated**: 2025-12-10  
**Version**: 1.0.0  
**Maintainer**: automation.link
