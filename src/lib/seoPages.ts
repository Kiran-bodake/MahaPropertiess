export const SEO_CATEGORY_MAP: Record<string, string> = {
  "agriculture-land": "agriculture",
  "na-plots": "na-plot",
  "commercial-properties": "commercial",
  "warehouse-space": "warehouse",
  "residential-properties": "residential",
};

export function parseSeoSlug(slug: string) {
  const match = slug.match(/(.+)-in-(.+)/);

  if (!match) return null;

  return {
    categorySlug: match[1],
    citySlug: match[2],
  };
}
