/**
 * Website Studio — generates real HTML/CSS (not screenshots).
 * LLM produces structure; we assemble valid documents.
 */
export interface SiteSpec {
  name: string;
  tagline?: string;
  pages: { slug: string; title: string; sections: string[] }[];
  primaryColor?: string;
}

export class WebsiteStudioEngine {
  /** Minimal static site scaffold — expandable with LLM section content. */
  buildStaticSite(spec: SiteSpec): { filename: string; html: string }[] {
    const color = spec.primaryColor || "#10b981";
    return spec.pages.map((page) => {
      const sections = page.sections
        .map(
          (s) =>
            `<section class="section"><h2>${escape(s)}</h2><p>Content for ${escape(s)} — edit in Pro mode.</p></section>`
        )
        .join("\n");
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${escape(page.title)} · ${escape(spec.name)}</title>
  <style>
    :root { --brand: ${color}; }
    body { font-family: system-ui, sans-serif; margin: 0; color: #0f172a; }
    header { background: var(--brand); color: #fff; padding: 2rem 1.5rem; }
    nav a { color: #fff; margin-right: 1rem; text-decoration: none; }
    .section { padding: 2rem 1.5rem; max-width: 900px; margin: 0 auto; }
    footer { padding: 2rem; text-align: center; color: #64748b; font-size: 0.875rem; }
  </style>
</head>
<body>
  <header>
    <strong>${escape(spec.name)}</strong>
    ${spec.tagline ? `<div>${escape(spec.tagline)}</div>` : ""}
    <nav>${spec.pages.map((p) => `<a href="${p.slug}.html">${escape(p.title)}</a>`).join("")}</nav>
  </header>
  <main>${sections}</main>
  <footer>Built with MarketXyn Studio</footer>
</body>
</html>`;
      return { filename: `${page.slug}.html`, html };
    });
  }
}

function escape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
