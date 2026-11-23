/** Logo & Branding Studio — SVG-first when possible. */
export interface BrandKit {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fonts: string[];
  logoSvg?: string;
  logoPngUrl?: string;
  createdAt: number;
}

export class BrandStudioEngine {
  private kits = new Map<string, BrandKit>();

  createKit(partial: Omit<BrandKit, "id" | "createdAt">): BrandKit {
    const kit: BrandKit = {
      ...partial,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    this.kits.set(kit.id, kit);
    return kit;
  }

  listKits() {
    return Array.from(this.kits.values());
  }

  /**
   * Generate a simple geometric SVG logo mark from a name + colors.
   * Real AI logo exploration can refine this; critical text is programmatic.
   */
  generateMarkSvg(name: string, primary: string, secondary: string): string {
    const initial = (name.trim()[0] || "M").toUpperCase();
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="${primary}"/>
  <circle cx="256" cy="220" r="100" fill="${secondary}" opacity="0.9"/>
  <text x="256" y="250" text-anchor="middle" font-family="system-ui,sans-serif" font-size="120" font-weight="700" fill="#fff">${initial}</text>
  <text x="256" y="420" text-anchor="middle" font-family="system-ui,sans-serif" font-size="36" font-weight="600" fill="#fff">${escapeXml(name)}</text>
</svg>`;
  }
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
