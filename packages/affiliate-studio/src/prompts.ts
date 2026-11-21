export function productResearchPrompt(productName: string, extra?: string) {
  return `You are an expert affiliate marketer and product researcher.

Research and expand this product for high-converting affiliate content:

Product: ${productName}
${extra ? `Extra context: ${extra}` : ""}

Return a clean JSON object with:
{
  "name": "",
  "niche": "",
  "benefits": ["..."],
  "painPoints": ["..."],
  "targetAudience": "",
  "uniqueSellingPoints": ["..."]
}

Only return valid JSON, no markdown.`;
}

export function scriptPrompt(
  product: any,
  style: string,
  platform: string,
  length: "short" | "medium" | "long" = "short"
) {
  const lengthGuide =
    length === "short"
      ? "15-30 seconds, punchy"
      : length === "medium"
      ? "45-75 seconds"
      : "2-3 minutes";

  return `You are an elite affiliate copywriter specializing in ${platform} ${style} content.

Product:
${JSON.stringify(product, null, 2)}

Write a high-converting ${style} script for ${platform}.
Target length: ${lengthGuide}.

Structure:
1. HOOK (first 3 seconds – stop the scroll)
2. BODY (problem → solution → proof / benefits)
3. CTA (clear call to action with urgency)

Return JSON:
{
  "hook": "",
  "body": "",
  "cta": "",
  "fullScript": "",
  "estimatedDurationSec": number
}

Only return valid JSON.`;
}

export function adCreativePrompt(product: any, platform: string) {
  return `Create 5 high-converting ad creative angles for this product on ${platform}.

Product: ${JSON.stringify(product)}

For each angle return:
- Angle name
- Headline
- Primary text
- Visual suggestion
- CTA

Return as a JSON array. Only valid JSON.`;
}
