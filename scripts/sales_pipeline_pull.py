#!/usr/bin/env python3
"""
Sales Pipeline Data Pull Script
=================================

Automated script to pull sales pipeline data from various sources
and format it for integration with the Avidelta automation system.

This script demonstrates how to:
1. Connect to data sources (CRM, databases, APIs)
2. Pull and normalize sales pipeline data
3. Generate structured output for daily summaries
4. Support demo mode for testing without live data

Usage:
    python3 scripts/sales_pipeline_pull.py --demo    # Demo mode with sample data
    python3 scripts/sales_pipeline_pull.py           # Production mode
"""

import os
import sys
import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S%z",
)
logger = logging.getLogger(__name__)


@dataclass
class PipelineDeal:
    """Represents a deal in the sales pipeline."""
    deal_id: str
    company_name: str
    deal_value: float
    stage: str  # e.g., "prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"
    probability: int  # 0-100
    expected_close_date: str  # ISO format
    owner: str
    last_activity: str  # ISO format
    notes: Optional[str] = None


@dataclass
class PipelineSummary:
    """Summary of sales pipeline data."""
    date: str
    total_deals: int
    total_value: float
    weighted_value: float  # Sum of deal_value * probability
    deals_by_stage: Dict[str, int]
    top_deals: List[Dict[str, Any]]
    deals: List[Dict[str, Any]]


class SalesPipelinePuller:
    """
    Pulls sales pipeline data from configured sources.
    
    Supports:
    - Demo mode: Returns sample data for testing
    - CRM integration: Connect to Salesforce, HubSpot, etc.
    - Database: Direct SQL queries
    - CSV/Excel: Import from files
    """
    
    def __init__(self, demo_mode: bool = False):
        """Initialize the pipeline puller."""
        self.demo_mode = demo_mode
        self.output_dir = Path(os.getenv("OUTPUT_DIR", "./output"))
        logger.info(f"Initialized SalesPipelinePuller (demo_mode={demo_mode})")
    
    def pull_pipeline_data(self) -> List[PipelineDeal]:
        """
        Pull sales pipeline data from configured source.
        
        Returns:
            List of PipelineDeal objects
        """
        logger.info("Pulling sales pipeline data...")
        
        if self.demo_mode:
            return self._get_demo_data()
        
        # In production mode, you would:
        # 1. Check for data source configuration
        # 2. Connect to CRM/database
        # 3. Pull fresh data
        # 4. Transform to PipelineDeal objects
        
        # For now, return demo data with a warning
        logger.warning("No data source configured, using demo data")
        return self._get_demo_data()
    
    def _get_demo_data(self) -> List[PipelineDeal]:
        """Generate realistic demo pipeline data."""
        logger.info("Generating demo pipeline data...")
        
        now = datetime.now(timezone.utc)
        today = now.strftime("%Y-%m-%d")
        
        demo_deals = [
            PipelineDeal(
                deal_id="DEAL-001",
                company_name="Acme Corporation",
                deal_value=150000.00,
                stage="proposal",
                probability=65,
                expected_close_date="2025-12-20",
                owner="Sarah Chen",
                last_activity=today,
                notes="Technical demo completed, awaiting proposal review"
            ),
            PipelineDeal(
                deal_id="DEAL-002",
                company_name="TechStart Inc",
                deal_value=75000.00,
                stage="negotiation",
                probability=80,
                expected_close_date="2025-12-15",
                owner="Mike Johnson",
                last_activity=today,
                notes="In final contract review, legal approval pending"
            ),
            PipelineDeal(
                deal_id="DEAL-003",
                company_name="Global Solutions Ltd",
                deal_value=250000.00,
                stage="qualification",
                probability=40,
                expected_close_date="2026-01-30",
                owner="Sarah Chen",
                last_activity=today,
                notes="Discovery call scheduled for next week"
            ),
            PipelineDeal(
                deal_id="DEAL-004",
                company_name="Innovate Systems",
                deal_value=95000.00,
                stage="prospecting",
                probability=25,
                expected_close_date="2026-02-15",
                owner="Alex Rivera",
                last_activity=today,
                notes="Initial outreach, awaiting response"
            ),
            PipelineDeal(
                deal_id="DEAL-005",
                company_name="DataFlow Analytics",
                deal_value=180000.00,
                stage="proposal",
                probability=70,
                expected_close_date="2025-12-28",
                owner="Mike Johnson",
                last_activity=today,
                notes="Custom proposal sent, follow-up call scheduled"
            ),
        ]
        
        return demo_deals
    
    def generate_summary(self, deals: List[PipelineDeal]) -> PipelineSummary:
        """
        Generate summary statistics from pipeline data.
        
        Args:
            deals: List of PipelineDeal objects
            
        Returns:
            PipelineSummary with aggregated data
        """
        logger.info(f"Generating summary for {len(deals)} deals...")
        
        total_value = sum(deal.deal_value for deal in deals)
        weighted_value = sum(
            deal.deal_value * (deal.probability / 100.0) 
            for deal in deals
        )
        
        # Count deals by stage
        deals_by_stage: Dict[str, int] = {}
        for deal in deals:
            deals_by_stage[deal.stage] = deals_by_stage.get(deal.stage, 0) + 1
        
        # Get top 3 deals by value
        sorted_deals = sorted(deals, key=lambda d: d.deal_value, reverse=True)
        top_deals = [asdict(deal) for deal in sorted_deals[:3]]
        
        summary = PipelineSummary(
            date=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            total_deals=len(deals),
            total_value=total_value,
            weighted_value=weighted_value,
            deals_by_stage=deals_by_stage,
            top_deals=top_deals,
            deals=[asdict(deal) for deal in deals]
        )
        
        logger.info(f"Summary: {len(deals)} deals, ${total_value:,.2f} total value, "
                   f"${weighted_value:,.2f} weighted value")
        
        return summary
    
    def save_output(self, summary: PipelineSummary) -> Path:
        """
        Save pipeline summary to JSON file.
        
        Args:
            summary: PipelineSummary to save
            
        Returns:
            Path to saved file
        """
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        output_file = self.output_dir / "sales_pipeline.json"
        
        # Convert to dict for JSON serialization
        data = asdict(summary)
        data["_metadata"] = {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "demo_mode": self.demo_mode,
            "version": "1.0.0"
        }
        
        output_file.write_text(json.dumps(data, indent=2))
        logger.info(f"Saved pipeline data to {output_file}")
        
        return output_file
    
    def run(self) -> int:
        """
        Main execution method.
        
        Returns:
            Exit code (0 for success, 1 for failure)
        """
        try:
            logger.info("=" * 60)
            logger.info("Sales Pipeline Data Pull - Starting")
            logger.info("=" * 60)
            
            # Pull data
            deals = self.pull_pipeline_data()
            
            # Generate summary
            summary = self.generate_summary(deals)
            
            # Save output
            output_file = self.save_output(summary)
            
            logger.info("=" * 60)
            logger.info("Sales Pipeline Data Pull - Completed Successfully")
            logger.info(f"Output: {output_file}")
            logger.info("=" * 60)
            
            return 0
            
        except Exception as e:
            logger.error(f"Pipeline pull failed: {e}", exc_info=True)
            return 1


def main() -> int:
    """
    Main entry point for the script.
    
    Returns:
        Exit code
    """
    # Check for demo mode flag
    demo_mode = "--demo" in sys.argv or "--dry-run" in sys.argv
    
    if demo_mode:
        logger.info("Running in DEMO MODE")
    
    puller = SalesPipelinePuller(demo_mode=demo_mode)
    return puller.run()


if __name__ == "__main__":
    sys.exit(main())
