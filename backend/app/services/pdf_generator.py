import io
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER

def generate_report_pdf(report_data: dict) -> bytes:
    """
    Generates a PDF from the structured JSON report data using ReportLab.
    Returns the PDF as a byte string.
    """
    buffer = io.BytesIO()
    
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=20,
        spaceAfter=20,
        textColor=HexColor("#1e3a8a"), # Tailwind blue-900
        alignment=TA_CENTER
    )
    
    heading2 = ParagraphStyle(
        'Heading2',
        parent=styles['Heading2'],
        fontSize=14,
        spaceBefore=12,
        spaceAfter=6,
        textColor=HexColor("#1e40af") # Tailwind blue-800
    )
    
    heading3 = ParagraphStyle(
        'Heading3',
        parent=styles['Heading3'],
        fontSize=12,
        spaceBefore=10,
        spaceAfter=4,
        textColor=HexColor("#1d4ed8") # Tailwind blue-700
    )
    
    normal = styles['Normal']
    normal.spaceAfter = 6
    
    bullet_style = styles['Normal']
    
    story = []
    
    def add_list(items):
        if not items:
            story.append(Paragraph("None", normal))
            return
        list_items = [ListItem(Paragraph(item, bullet_style)) for item in items]
        story.append(ListFlowable(list_items, bulletType='bullet'))
        story.append(Spacer(1, 6))

    # --- Content ---
    metadata = report_data.get('report_metadata', {})
    story.append(Paragraph(f"Company Intelligence Report", title_style))
    story.append(Paragraph(f"<b>Company:</b> {metadata.get('company_name', 'Unknown')}", normal))
    if metadata.get('website_url') and metadata.get('website_url') != "Not Provided":
        story.append(Paragraph(f"<b>Website:</b> <a href='{metadata.get('website_url')}'>{metadata.get('website_url')}</a>", normal))
        
    story.append(Spacer(1, 12))
    
    ident = report_data.get('company_identity', {})
    story.append(Paragraph("Company Identity", heading2))
    story.append(Paragraph(f"<b>Industry:</b> {ident.get('industry', 'N/A')}", normal))
    story.append(Paragraph(f"<b>Sub-Industry:</b> {ident.get('sub_industry', 'N/A')}", normal))
    
    bp = report_data.get('business_profile', {})
    story.append(Paragraph("Business Profile", heading2))
    story.append(Paragraph(bp.get('business_summary', 'N/A'), normal))
    story.append(Paragraph(f"<b>Target Market:</b> {bp.get('target_market', 'N/A')}", normal))
    
    story.append(Paragraph("Products", heading3))
    add_list(bp.get('products', []))
    
    story.append(Paragraph("Services", heading3))
    add_list(bp.get('services', []))
    
    story.append(Paragraph("Key Strengths", heading3))
    add_list(bp.get('key_strengths', []))
    
    story.append(Paragraph("Growth Signals", heading3))
    add_list(bp.get('growth_signals', []))
    
    po = report_data.get('partnership_opportunities', {})
    story.append(Paragraph("Partnership Opportunities", heading2))
    add_list(po.get('potential_opportunities', []))
    
    story.append(Paragraph("Suggested Decision Maker Types", heading3))
    add_list(po.get('suggested_decision_maker_types', []))
    
    story.append(Paragraph("Recommended Outreach Strategy", heading3))
    story.append(Paragraph(po.get('recommended_outreach_strategy', 'N/A'), normal))
    
    pr = report_data.get('partnership_readiness_assessment', {})
    story.append(Paragraph("Partnership Readiness Assessment", heading2))
    story.append(Paragraph(f"<b>Overall Score:</b> {pr.get('overall_score', 'N/A')}/100", normal))
    story.append(Paragraph(f"<b>Priority:</b> {pr.get('priority', 'N/A')}", normal))
    story.append(Paragraph(f"<b>Reasoning:</b> {pr.get('reasoning', 'N/A')}", normal))
    story.append(Paragraph(f"<b>Recommendation:</b> {pr.get('recommendation', 'N/A')}", normal))
    
    story.append(Paragraph("Strengths", heading3))
    add_list(pr.get('strengths', []))
    
    story.append(Paragraph("Risks", heading3))
    add_list(pr.get('risks', []))
    
    story.append(Paragraph("Opportunities", heading3))
    add_list(pr.get('opportunities', []))
    
    ca = report_data.get('confidence_assessment', {})
    story.append(Paragraph("Confidence Assessment", heading2))
    story.append(Paragraph(f"<b>Confidence Level:</b> {ca.get('confidence_level', 'N/A')}", normal))
    story.append(Paragraph(f"<b>Reason:</b> {ca.get('reason', 'N/A')}", normal))
    story.append(Paragraph(f"<b>Inference Notes:</b> {ca.get('inference_notes', 'N/A')}", normal))
    story.append(Paragraph(f"<b>Source Summary:</b> {ca.get('source_summary', 'N/A')}", normal))
    
    story.append(Paragraph("Missing Information", heading3))
    add_list(ca.get('missing_information', []))
    
    story.append(Paragraph("Verified Sources", heading3))
    add_list(ca.get('verified_sources', []))
    
    doc.build(story)
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return pdf_bytes
