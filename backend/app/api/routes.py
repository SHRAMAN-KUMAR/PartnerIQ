import json
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional, List
from sqlmodel import Session, select
from app.database import get_session
from app.models.report import Report
from app.services.scraper import fetch_website_content
from app.services.ai_analyzer import generate_report_json, json_to_markdown
from app.services.pdf_generator import generate_report_pdf

router = APIRouter()

class AnalyzeRequest(BaseModel):
    company_name: str
    website_url: Optional[str] = None

class ReportResponse(BaseModel):
    id: int
    company_name: str
    website_url: Optional[str]
    report_json: str
    report_markdown: str
    overall_score: int
    priority: str
    created_at: str

@router.post("/reports/analyze", response_model=ReportResponse)
async def analyze_company(request: AnalyzeRequest, session: Session = Depends(get_session)):
    if not request.company_name.strip():
        raise HTTPException(status_code=400, detail="Missing Company Name")
        
    website_content = ""
    if request.website_url:
        try:
            website_content = await fetch_website_content(request.website_url)
        except Exception as e:
            # According to requirements, website unreachable/parsing failure should be a user friendly error.
            # We can still proceed if the AI can use its existing knowledge, but the prompt says to let the user know.
            # The PMS says: Error handling: Missing Company Name, Invalid Website URL, Website Unreachable... Errors must be user friendly.
            # We will raise HTTP 400 for bad URL, or 502 for unreachable.
            raise HTTPException(status_code=400, detail=str(e))
            
    try:
        report_data = await generate_report_json(
            company_name=request.company_name,
            website_url=request.website_url,
            website_content=website_content
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Failure: {str(e)}")
        
    try:
        markdown_content = json_to_markdown(report_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Markdown Generation Failure: {str(e)}")
        
    # Extract metadata for DB
    overall_score = report_data.get("partnership_readiness_assessment", {}).get("overall_score", 0)
    priority = report_data.get("partnership_readiness_assessment", {}).get("priority", "Unknown")
    
    report = Report(
        company_name=request.company_name,
        website_url=request.website_url,
        report_json=json.dumps(report_data),
        report_markdown=markdown_content,
        overall_score=overall_score,
        priority=priority
    )
    
    try:
        session.add(report)
        session.commit()
        session.refresh(report)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Failure: {str(e)}")
        
    return {
        "id": report.id,
        "company_name": report.company_name,
        "website_url": report.website_url,
        "report_json": report.report_json,
        "report_markdown": report.report_markdown,
        "overall_score": report.overall_score,
        "priority": report.priority,
        "created_at": report.created_at.isoformat()
    }

@router.get("/reports", response_model=List[ReportResponse])
def get_reports(session: Session = Depends(get_session)):
    reports = session.exec(select(Report).order_by(Report.created_at.desc())).all()
    return [
        {
            "id": r.id,
            "company_name": r.company_name,
            "website_url": r.website_url,
            "report_json": r.report_json,
            "report_markdown": r.report_markdown,
            "overall_score": r.overall_score,
            "priority": r.priority,
            "created_at": r.created_at.isoformat()
        }
        for r in reports
    ]

@router.get("/reports/{report_id}", response_model=ReportResponse)
def get_report(report_id: int, session: Session = Depends(get_session)):
    report = session.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    return {
        "id": report.id,
        "company_name": report.company_name,
        "website_url": report.website_url,
        "report_json": report.report_json,
        "report_markdown": report.report_markdown,
        "overall_score": report.overall_score,
        "priority": report.priority,
        "created_at": report.created_at.isoformat()
    }

@router.get("/reports/{report_id}/pdf")
def get_report_pdf(report_id: int, session: Session = Depends(get_session)):
    report = session.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    try:
        report_data = json.loads(report.report_json)
        pdf_bytes = generate_report_pdf(report_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF Generation Failure: {str(e)}")
        
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="partneriq_{report.id}.pdf"'
        }
    )
