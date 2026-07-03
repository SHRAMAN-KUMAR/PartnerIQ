import httpx
from bs4 import BeautifulSoup
import re
import logging

logger = logging.getLogger(__name__)

async def fetch_website_content(url: str) -> str:
    """
    Downloads HTML from a URL and extracts cleaned visible text.
    Removes scripts, styles, navigation, footers, etc.
    """
    if not url:
        return ""
        
    if not url.startswith("http"):
        url = "https://" + url

    try:
        # Using a browser-like user agent to avoid basic blocks
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            html_content = response.text
            
            return clean_html(html_content)
    except httpx.RequestError as e:
        logger.error(f"Error fetching URL {url}: {str(e)}")
        raise ValueError(f"Website Unreachable: {str(e)}")
    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP Error fetching URL {url}: {e.response.status_code}")
        raise ValueError(f"Website returned error: {e.response.status_code}")
    except Exception as e:
        logger.error(f"Unexpected error fetching URL {url}: {str(e)}")
        raise ValueError(f"Website Parsing Failure: {str(e)}")

def clean_html(html_content: str) -> str:
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Remove unwanted tags
    for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'noscript', 'iframe']):
        tag.decompose()
        
    # Remove elements often associated with cookie banners or hidden content
    for element in soup.find_all(['div', 'section'], class_=re.compile(r'(cookie|banner|popup|hidden|modal)', re.I)):
        element.decompose()
        
    # Get text
    text = soup.get_text(separator=' ')
    
    # Compress whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Limit content length to avoid massive token usage (e.g. max 50,000 characters)
    max_length = 50000
    if len(text) > max_length:
        text = text[:max_length] + "... [Content Truncated]"
        
    return text
