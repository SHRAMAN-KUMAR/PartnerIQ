from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import datetime, timezone

class Report(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    company_name: str = Field(index=True)
    website_url: Optional[str] = Field(default=None)
    
    # Store the raw structured JSON as a string
    report_json: str
    
    # Store the generated markdown representation
    report_markdown: str
    
    # High-level metadata for quick querying
    overall_score: int
    priority: str
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
