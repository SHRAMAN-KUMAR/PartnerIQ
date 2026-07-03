Analyze the following company and generate a structured Company Intelligence Report based on the provided JSON schema.

Company Name: {company_name}
Company Website URL: {website_url}

Website Content Extracted:
```
{website_content}
```

If the Website Content Extracted is empty or mostly blank, rely strictly on your existing knowledge about "{company_name}", but explicitly state in the Confidence Model that the website was unavailable and information is based on pre-existing knowledge, which may be outdated or incomplete. DO NOT hallucinate.

Return ONLY a JSON object matching the provided schema. No other text.
