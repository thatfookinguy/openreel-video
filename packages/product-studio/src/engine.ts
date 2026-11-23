/** Product rendering — photoreal shots via image engine prompts. */
export type ProductShotType =
  | "hero"
  | "packaging"
  | "lifestyle"
  | "white-bg"
  | "detail";

export function productPrompt(
  productName: string,
  shot: ProductShotType,
  extra?: string
): string {
  const shots: Record<ProductShotType, string> = {
    hero: `Professional product photography of ${productName}, hero angle, studio lighting, sharp detail, commercial ecommerce`,
    packaging: `Product packaging mockup for ${productName}, clean studio, label readable, commercial render`,
    lifestyle: `${productName} in a realistic lifestyle setting, natural light, aspirational advertising photo`,
    "white-bg": `${productName} on pure white background, soft shadow, catalog product shot, high resolution`,
    detail: `Macro detail shot of ${productName}, texture and craftsmanship, commercial photography`,
  };
  return `${shots[shot]}. ${extra || ""}`.trim();
}
