import properties from "@/moc-data/properties.json";

export async function getAllProperties() {
  return properties;
}

export async function getPropertyBySlug(slug: string) {
  return properties.find(
    (item: any) =>
      item.slug?.trim().toLowerCase() === slug?.trim().toLowerCase(),
  );
}
