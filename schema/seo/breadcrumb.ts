type BreadcrumbItem = {
  title: string;
  href?: string;
};

export default function breadcrumbSchema(
  items?: BreadcrumbItem[]
) {
  if (!items || items.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      ...(item.href && {
        item: item.href,
      }),
    })),
  };
}