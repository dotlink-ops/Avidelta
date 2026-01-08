#!/usr/bin/env python3
# pyright: strict
"""
Sales Pipeline Data Pull Module
=================================

Automated data collection for sales pipeline analytics.
Integrates with CRM systems and sales tracking tools.
"""

import json
import logging
import os
import urllib.parse
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from pathlib import Path

logger = logging.getLogger(__name__)

# Constants
DEFAULT_CACHE_DIR = "output/sales_cache"
TIMESTAMP_FORMAT = "%Y%m%d_%H%M%S"


@dataclass
class SalesPipelineConfig:
    """Configuration for sales pipeline data source."""
    
    data_source: str  # 'demo', 'hubspot', 'salesforce', 'pipedrive', etc.
    api_key: Optional[str] = None
    api_endpoint: Optional[str] = None
    cache_dir: Optional[Path] = None
    demo_mode: bool = False

    # Salesforce-specific config (optional; only used when data_source == 'salesforce')
    salesforce_login_url: Optional[str] = None
    salesforce_instance_url: Optional[str] = None
    salesforce_api_version: str = "60.0"
    salesforce_soql: Optional[str] = None
    salesforce_client_id: Optional[str] = None
    salesforce_client_secret: Optional[str] = None
    salesforce_username: Optional[str] = None
    salesforce_password: Optional[str] = None
    salesforce_security_token: Optional[str] = None

    # Supabase sink (optional)
    supabase_url: Optional[str] = None
    supabase_service_role_key: Optional[str] = None
    supabase_sales_pipeline_table: str = "sales_pipeline_snapshots"
    
    @classmethod
    def from_env(cls, project_root: Path, demo_mode: bool = False) -> "SalesPipelineConfig":
        """
        Create config from environment variables.
        
        Args:
            project_root: Root directory of the project
            demo_mode: Whether to run in demo mode
        
        Returns:
            SalesPipelineConfig instance
        """
        data_source = os.getenv("SALES_PIPELINE_SOURCE", "demo")
        cache_dir = Path(os.getenv("SALES_PIPELINE_CACHE", str(project_root / DEFAULT_CACHE_DIR)))

        # Salesforce defaults
        default_soql = (
            "SELECT Id, Name, Account.Name, StageName, Amount, Probability, Owner.Name, "
            "CreatedDate, LastModifiedDate "
            "FROM Opportunity "
            "WHERE IsClosed = false "
            "ORDER BY LastModifiedDate DESC "
            "LIMIT 200"
        )

        # Supabase defaults (prefer Next.js naming for URL)
        supabase_url = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        return cls(
            data_source=data_source if not demo_mode else "demo",
            api_key=os.getenv("SALES_PIPELINE_API_KEY"),
            api_endpoint=os.getenv("SALES_PIPELINE_ENDPOINT"),
            cache_dir=cache_dir,
            demo_mode=demo_mode,

            salesforce_login_url=os.getenv("SALESFORCE_LOGIN_URL") or "https://login.salesforce.com",
            salesforce_instance_url=os.getenv("SALESFORCE_INSTANCE_URL") or os.getenv("SALES_PIPELINE_ENDPOINT"),
            salesforce_api_version=os.getenv("SALESFORCE_API_VERSION") or "60.0",
            salesforce_soql=os.getenv("SALESFORCE_SOQL") or default_soql,
            salesforce_client_id=os.getenv("SALESFORCE_CLIENT_ID"),
            salesforce_client_secret=os.getenv("SALESFORCE_CLIENT_SECRET"),
            salesforce_username=os.getenv("SALESFORCE_USERNAME"),
            salesforce_password=os.getenv("SALESFORCE_PASSWORD"),
            salesforce_security_token=os.getenv("SALESFORCE_SECURITY_TOKEN"),

            supabase_url=supabase_url,
            supabase_service_role_key=supabase_key,
            supabase_sales_pipeline_table=os.getenv("SUPABASE_SALES_PIPELINE_TABLE")
            or "sales_pipeline_snapshots",
        )


def _safe_float(value: Any, default: float = 0.0) -> float:
    try:
        if value is None:
            return default
        if isinstance(value, str) and not value.strip():
            return default
        return float(value)
    except (TypeError, ValueError):
        return default


def _clamp(value: float, min_value: float, max_value: float) -> float:
    return max(min_value, min(max_value, value))


@dataclass
class SalesPipelineLead:
    """Individual sales lead/opportunity."""
    
    id: str
    name: str
    company: str
    stage: str
    value: float
    probability: float
    owner: str
    created_at: str
    updated_at: str
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "id": self.id,
            "name": self.name,
            "company": self.company,
            "stage": self.stage,
            "value": self.value,
            "probability": self.probability,
            "owner": self.owner,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }


@dataclass
class SalesPipelineData:
    """Aggregated sales pipeline data."""
    
    timestamp: str
    total_leads: int
    total_value: float
    weighted_value: float
    stage_breakdown: Dict[str, int]
    leads: List[SalesPipelineLead]
    source: str
    demo: bool = False
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "timestamp": self.timestamp,
            "total_leads": self.total_leads,
            "total_value": self.total_value,
            "weighted_value": self.weighted_value,
            "stage_breakdown": self.stage_breakdown,
            "leads": [lead.to_dict() for lead in self.leads],
            "source": self.source,
            "demo": self.demo,
        }


class SalesPipelineDataSource:
    """
    Sales pipeline data source connector.
    
    Pulls data from various CRM systems or uses demo data.
    """
    
    def __init__(self, config: SalesPipelineConfig):
        """
        Initialize sales pipeline data source.
        
        Args:
            config: Configuration for the data source
        """
        self.config = config
        
        # Ensure cache directory exists
        if self.config.cache_dir:
            self.config.cache_dir.mkdir(parents=True, exist_ok=True)
        
        logger.info(
            f"Initialized SalesPipelineDataSource",
            extra={
                "source": self.config.data_source,
                "demo_mode": self.config.demo_mode,
            }
        )
    
    def pull_data(self) -> SalesPipelineData:
        """
        Pull sales pipeline data from configured source.
        
        Returns:
            SalesPipelineData with current pipeline state
        
        Raises:
            RuntimeError: If data source is unavailable or authentication fails
        """
        logger.info(f"📊 Pulling sales pipeline data from {self.config.data_source}...")
        
        if self.config.demo_mode or self.config.data_source == "demo":
            return self._demo_data()
        
        # Route to appropriate data source handler
        handlers = {
            "hubspot": self._pull_hubspot,
            "salesforce": self._pull_salesforce,
            "pipedrive": self._pull_pipedrive,
        }
        
        handler = handlers.get(self.config.data_source)
        if not handler:
            logger.warning(
                f"Unknown data source '{self.config.data_source}', using demo data"
            )
            return self._demo_data()
        
        try:
            return handler()
        except Exception as e:
            logger.error(f"Failed to pull data from {self.config.data_source}: {e}")
            logger.warning("Falling back to demo data")
            return self._demo_data()
    
    def _demo_data(self) -> SalesPipelineData:
        """Generate realistic demo sales pipeline data."""
        timestamp = datetime.now(timezone.utc).isoformat()
        
        demo_leads = [
            SalesPipelineLead(
                id="lead-001",
                name="Enterprise Integration Project",
                company="TechCorp Solutions",
                stage="Qualification",
                value=150000.0,
                probability=0.3,
                owner="Sales Rep A",
                created_at="2025-11-15T10:00:00Z",
                updated_at="2025-12-09T14:30:00Z",
            ),
            SalesPipelineLead(
                id="lead-002",
                name="Automation Platform Migration",
                company="FinTech Innovators",
                stage="Proposal",
                value=85000.0,
                probability=0.5,
                owner="Sales Rep B",
                created_at="2025-11-20T09:15:00Z",
                updated_at="2025-12-10T11:20:00Z",
            ),
            SalesPipelineLead(
                id="lead-003",
                name="API Integration Services",
                company="RetailHub Inc",
                stage="Negotiation",
                value=45000.0,
                probability=0.7,
                owner="Sales Rep A",
                created_at="2025-11-25T13:45:00Z",
                updated_at="2025-12-10T16:00:00Z",
            ),
            SalesPipelineLead(
                id="lead-004",
                name="Data Pipeline Optimization",
                company="Analytics Pro",
                stage="Qualification",
                value=62000.0,
                probability=0.25,
                owner="Sales Rep C",
                created_at="2025-12-01T08:30:00Z",
                updated_at="2025-12-08T10:45:00Z",
            ),
            SalesPipelineLead(
                id="lead-005",
                name="Cloud Infrastructure Setup",
                company="StartupXYZ",
                stage="Closed Won",
                value=120000.0,
                probability=1.0,
                owner="Sales Rep B",
                created_at="2025-10-15T11:00:00Z",
                updated_at="2025-12-05T14:00:00Z",
            ),
        ]
        
        # Calculate aggregates
        total_value = sum(lead.value for lead in demo_leads)
        weighted_value = sum(lead.value * lead.probability for lead in demo_leads)
        
        stage_breakdown: Dict[str, int] = {}
        for lead in demo_leads:
            stage_breakdown[lead.stage] = stage_breakdown.get(lead.stage, 0) + 1
        
        logger.info(
            f"✓ Generated demo sales pipeline data",
            extra={
                "total_leads": len(demo_leads),
                "total_value": total_value,
                "weighted_value": weighted_value,
            }
        )
        
        return SalesPipelineData(
            timestamp=timestamp,
            total_leads=len(demo_leads),
            total_value=total_value,
            weighted_value=weighted_value,
            stage_breakdown=stage_breakdown,
            leads=demo_leads,
            source="demo",
            demo=True,
        )
    
    def _pull_hubspot(self) -> SalesPipelineData:
        """Pull data from HubSpot CRM (placeholder for future implementation)."""
        if not self.config.api_key:
            raise RuntimeError("HubSpot API key not configured")
        
        logger.info("HubSpot integration not yet implemented, using demo data")
        return self._demo_data()
    
    def _pull_salesforce(self) -> SalesPipelineData:
        """Pull data from Salesforce via REST API + SOQL query.

        Supported auth modes (in priority order):
        1) Pre-issued token + instance URL:
           - SALESFORCE_ACCESS_TOKEN or SALES_PIPELINE_API_KEY
           - SALESFORCE_INSTANCE_URL or SALES_PIPELINE_ENDPOINT

        2) OAuth password grant:
           - SALESFORCE_LOGIN_URL (default https://login.salesforce.com)
           - SALESFORCE_CLIENT_ID / SALESFORCE_CLIENT_SECRET
           - SALESFORCE_USERNAME
           - SALESFORCE_PASSWORD
           - SALESFORCE_SECURITY_TOKEN (optional depending on org policy)
        """
        try:
            import requests  # type: ignore
        except Exception as e:
            raise RuntimeError(
                "Missing 'requests' dependency for Salesforce integration. "
                "Install with: pip install -r scripts/requirements.txt"
            ) from e

        access_token = os.getenv("SALESFORCE_ACCESS_TOKEN") or self.config.api_key
        instance_url = self.config.salesforce_instance_url
        api_version = self.config.salesforce_api_version
        soql = self.config.salesforce_soql
        if not soql:
            raise RuntimeError("Salesforce SOQL query not configured")

        if not access_token or not instance_url:
            # Attempt OAuth password grant
            if not (
                self.config.salesforce_client_id
                and self.config.salesforce_client_secret
                and self.config.salesforce_username
                and self.config.salesforce_password
            ):
                raise RuntimeError(
                    "Salesforce credentials not configured. Provide either "
                    "SALESFORCE_ACCESS_TOKEN + SALESFORCE_INSTANCE_URL, or "
                    "Salesforce OAuth password-grant variables."
                )

            login_url = self.config.salesforce_login_url or "https://login.salesforce.com"
            token_url = f"{login_url.rstrip('/')}/services/oauth2/token"
            password = self.config.salesforce_password
            if self.config.salesforce_security_token:
                password = f"{password}{self.config.salesforce_security_token}"

            logger.info("Authenticating to Salesforce (password grant)...")
            resp = requests.post(
                token_url,
                data={
                    "grant_type": "password",
                    "client_id": self.config.salesforce_client_id,
                    "client_secret": self.config.salesforce_client_secret,
                    "username": self.config.salesforce_username,
                    "password": password,
                },
                timeout=30,
            )
            if not resp.ok:
                raise RuntimeError(
                    f"Salesforce auth failed (HTTP {resp.status_code}). "
                    f"Check credentials and org security settings."
                )
            token_data = resp.json()
            access_token = str(token_data.get("access_token") or "").strip()
            instance_url = str(token_data.get("instance_url") or "").strip()
            if not access_token or not instance_url:
                raise RuntimeError("Salesforce auth response missing access_token/instance_url")

        assert access_token is not None
        assert instance_url is not None

        # Run SOQL query with pagination
        base = instance_url.rstrip("/")
        query_url = (
            f"{base}/services/data/v{api_version}/query"
            f"?q={urllib.parse.quote_plus(soql)}"
        )
        headers = {"Authorization": f"Bearer {access_token}", "Accept": "application/json"}

        logger.info("Querying Salesforce Opportunities...")
        records: List[Dict[str, Any]] = []
        next_url: Optional[str] = query_url
        while next_url:
            resp = requests.get(next_url, headers=headers, timeout=30)
            if not resp.ok:
                raise RuntimeError(
                    f"Salesforce query failed (HTTP {resp.status_code}). "
                    "Verify SOQL and permissions."
                )
            payload = resp.json()
            batch = payload.get("records") or []
            if isinstance(batch, list):
                records.extend([r for r in batch if isinstance(r, dict)])

            done = bool(payload.get("done"))
            next_records_url = payload.get("nextRecordsUrl")
            if not done and isinstance(next_records_url, str) and next_records_url.strip():
                next_url = f"{base}{next_records_url}"
            else:
                next_url = None

        # Normalize into repository schema
        timestamp = datetime.now(timezone.utc).isoformat()
        leads: List[SalesPipelineLead] = []
        for rec in records:
            opp_id = str(rec.get("Id") or "").strip()
            if not opp_id:
                continue

            account = rec.get("Account") if isinstance(rec.get("Account"), dict) else {}
            owner = rec.get("Owner") if isinstance(rec.get("Owner"), dict) else {}

            probability_pct = _safe_float(rec.get("Probability"), 0.0)
            probability = _clamp(probability_pct / 100.0, 0.0, 1.0)

            leads.append(
                SalesPipelineLead(
                    id=opp_id,
                    name=str(rec.get("Name") or "").strip(),
                    company=str(account.get("Name") or "").strip(),
                    stage=str(rec.get("StageName") or "").strip() or "Unknown",
                    value=_safe_float(rec.get("Amount"), 0.0),
                    probability=probability,
                    owner=str(owner.get("Name") or "").strip(),
                    created_at=str(rec.get("CreatedDate") or "").strip(),
                    updated_at=str(rec.get("LastModifiedDate") or "").strip(),
                )
            )

        total_value = sum(lead.value for lead in leads)
        weighted_value = sum(lead.value * lead.probability for lead in leads)
        stage_breakdown: Dict[str, int] = {}
        for lead in leads:
            stage_breakdown[lead.stage] = stage_breakdown.get(lead.stage, 0) + 1

        logger.info(
            "✓ Pulled Salesforce sales pipeline data",
            extra={
                "total_leads": len(leads),
                "total_value": total_value,
                "weighted_value": weighted_value,
            },
        )

        return SalesPipelineData(
            timestamp=timestamp,
            total_leads=len(leads),
            total_value=total_value,
            weighted_value=weighted_value,
            stage_breakdown=stage_breakdown,
            leads=leads,
            source="salesforce",
            demo=False,
        )

    def try_upsert_to_supabase(self, data: SalesPipelineData) -> bool:
        """Best-effort upsert of the pipeline snapshot to Supabase via PostgREST.

        This is intentionally non-fatal: if Supabase isn't configured (or table is missing),
        this returns False and logs a warning.

        Expected table schema (recommended):
        - timestamp text UNIQUE
        - source text
        - demo boolean
        - payload jsonb
        """
        if not (self.config.supabase_url and self.config.supabase_service_role_key):
            logger.debug("Supabase not configured; skipping sales pipeline upsert")
            return False

        try:
            import requests  # type: ignore
        except Exception:
            logger.warning("Missing 'requests'; cannot upsert sales pipeline to Supabase")
            return False

        supabase_url = self.config.supabase_url.rstrip("/")
        table = self.config.supabase_sales_pipeline_table
        endpoint = f"{supabase_url}/rest/v1/{table}?on_conflict=timestamp"
        headers = {
            "apikey": self.config.supabase_service_role_key,
            "Authorization": f"Bearer {self.config.supabase_service_role_key}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=minimal",
        }
        row = {
            "timestamp": data.timestamp,
            "source": data.source,
            "demo": data.demo,
            "payload": data.to_dict(),
        }

        try:
            resp = requests.post(endpoint, headers=headers, json=[row], timeout=30)
            if not resp.ok:
                logger.warning(
                    "Supabase upsert failed for sales pipeline snapshot",
                    extra={"status": resp.status_code},
                )
                return False
            logger.info("✓ Upserted sales pipeline snapshot to Supabase")
            return True
        except Exception as e:
            logger.warning(f"Supabase upsert error: {e}")
            return False
    
    def _pull_pipedrive(self) -> SalesPipelineData:
        """Pull data from Pipedrive CRM (placeholder for future implementation)."""
        if not self.config.api_key:
            raise RuntimeError("Pipedrive API key not configured")
        
        logger.info("Pipedrive integration not yet implemented, using demo data")
        return self._demo_data()
    
    def save_to_cache(self, data: SalesPipelineData) -> Path:
        """
        Save pipeline data to cache file.
        
        Args:
            data: Sales pipeline data to cache
        
        Returns:
            Path to cached file
        """
        if not self.config.cache_dir:
            raise RuntimeError("Cache directory not configured")
        
        timestamp_str = datetime.now(timezone.utc).strftime(TIMESTAMP_FORMAT)
        cache_file = self.config.cache_dir / f"sales_pipeline_{timestamp_str}.json"
        
        with open(cache_file, "w", encoding="utf-8") as f:
            json.dump(data.to_dict(), f, indent=2, ensure_ascii=False)
        
        logger.info(f"✓ Cached sales pipeline data to {cache_file}")
        return cache_file


def create_sales_pipeline_source(
    project_root: Path,
    demo_mode: bool = False
) -> SalesPipelineDataSource:
    """
    Create a sales pipeline data source with environment validation.
    
    Args:
        project_root: Root directory of the project
        demo_mode: Whether to run in demo mode
    
    Returns:
        Initialized SalesPipelineDataSource
    """
    config = SalesPipelineConfig.from_env(project_root, demo_mode)
    return SalesPipelineDataSource(config)
