import os
import json
import logging
from pathlib import Path
from google import genai
from google.genai import types
from dotenv import load_dotenv

logger = logging.getLogger(__name__)
load_dotenv()

PROMPTS_DIR = Path(__file__).parent.parent / "prompts"

async def generate_report_json(company_name: str, website_url: str = None, website_content: str = "") -> dict:
    """
    Uses Google Gemini to generate a structured JSON report based on the provided company details and website content.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set")
    client = genai.Client(api_key=api_key)
    
    # Load prompts
    with open(PROMPTS_DIR / "system_prompt.md", "r", encoding="utf-8") as f:
        system_prompt = f.read()
        
    with open(PROMPTS_DIR / "user_prompt.md", "r", encoding="utf-8") as f:
        user_prompt_template = f.read()
        
    with open(PROMPTS_DIR / "report_schema.json", "r", encoding="utf-8") as f:
        schema_json = f.read()

    # Format user prompt
    user_prompt = user_prompt_template.format(
        company_name=company_name,
        website_url=website_url or "Not Provided",
        website_content=website_content
    )
    
    # Append the schema to the system prompt to enforce structure strongly
    system_prompt_with_schema = f"{system_prompt}\n\nStrictly adhere to the following JSON schema:\n```json\n{schema_json}\n```"

    try:
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=[system_prompt_with_schema, user_prompt],
            config=types.GenerateContentConfig(
                tools=[types.Tool(google_search=types.GoogleSearch())],
                temperature=0.2
            )
        )
        
        result_content = response.text.strip()
        # Remove markdown code block wrapping if present
        if result_content.startswith("```json"):
            result_content = result_content[7:]
        elif result_content.startswith("```"):
            result_content = result_content[3:]
        if result_content.endswith("```"):
            result_content = result_content[:-3]
            
        result_content = result_content.strip()
        
        return json.loads(result_content)
        
    except Exception as e:
        logger.error(f"AI Generation Error: {str(e)}")
        raise ValueError(f"AI Failure: {str(e)}")

def json_to_markdown(report_data: dict) -> str:
    """
    Converts the structured JSON report into a formatted Markdown string.
    """
    md = f"# Company Intelligence Report: {report_data['report_metadata'].get('company_name', 'Unknown')}\n\n"
    
    url = report_data['report_metadata'].get('website_url')
    if url and url != "Not Provided":
        md += f"**Website:** [{url}]({url})\n\n"
        
    md += f"## Company Identity\n"
    md += f"- **Industry:** {report_data['company_identity'].get('industry', 'N/A')}\n"
    md += f"- **Sub-Industry:** {report_data['company_identity'].get('sub_industry', 'N/A')}\n\n"
    
    md += f"## Business Profile\n"
    md += f"{report_data['business_profile'].get('business_summary', 'N/A')}\n\n"
    md += f"**Target Market:** {report_data['business_profile'].get('target_market', 'N/A')}\n\n"
    
    md += f"### Products\n"
    for item in report_data['business_profile'].get('products', []):
        md += f"- {item}\n"
    md += "\n"
    
    md += f"### Services\n"
    for item in report_data['business_profile'].get('services', []):
        md += f"- {item}\n"
    md += "\n"
    
    md += f"### Key Strengths\n"
    for item in report_data['business_profile'].get('key_strengths', []):
        md += f"- {item}\n"
    md += "\n"
    
    md += f"### Growth Signals\n"
    for item in report_data['business_profile'].get('growth_signals', []):
        md += f"- {item}\n"
    md += "\n"
    
    md += f"## Partnership Opportunities\n"
    for item in report_data['partnership_opportunities'].get('potential_opportunities', []):
        md += f"- {item}\n"
    md += "\n"
    
    md += f"**Suggested Decision Maker Types:**\n"
    for item in report_data['partnership_opportunities'].get('suggested_decision_maker_types', []):
        md += f"- {item}\n"
    md += "\n"
    
    md += f"**Recommended Outreach Strategy:**\n{report_data['partnership_opportunities'].get('recommended_outreach_strategy', 'N/A')}\n\n"
    
    md += f"## Partnership Readiness Assessment\n"
    pr = report_data.get('partnership_readiness_assessment', {})
    md += f"- **Overall Score:** {pr.get('overall_score', 'N/A')}/100\n"
    md += f"- **Priority:** {pr.get('priority', 'N/A')}\n"
    md += f"- **Reasoning:** {pr.get('reasoning', 'N/A')}\n"
    md += f"- **Recommendation:** {pr.get('recommendation', 'N/A')}\n\n"
    
    md += f"### Strengths\n"
    for item in pr.get('strengths', []):
        md += f"- {item}\n"
    md += "\n"
    
    md += f"### Risks\n"
    for item in pr.get('risks', []):
        md += f"- {item}\n"
    md += "\n"
    
    md += f"### Opportunities\n"
    for item in pr.get('opportunities', []):
        md += f"- {item}\n"
    md += "\n"
    
    md += f"## Confidence Assessment\n"
    ca = report_data.get('confidence_assessment', {})
    md += f"- **Confidence Level:** {ca.get('confidence_level', 'N/A')}\n"
    md += f"- **Reason:** {ca.get('reason', 'N/A')}\n"
    md += f"- **Inference Notes:** {ca.get('inference_notes', 'N/A')}\n"
    md += f"- **Source Summary:** {ca.get('source_summary', 'N/A')}\n\n"
    
    md += f"### Missing Information\n"
    for item in ca.get('missing_information', []):
        md += f"- {item}\n"
    md += "\n"
    
    md += f"### Verified Sources\n"
    for item in ca.get('verified_sources', []):
        md += f"- {item}\n"
        
    return md
