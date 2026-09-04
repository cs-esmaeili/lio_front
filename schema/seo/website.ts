type WebsiteSchemaProps = {
  name?: string;
  url: string;
  searchUrl?: string;
  inLanguage?: string;
};

export default function websiteSchema({
  name,
  url,
  searchUrl,
  inLanguage,
}: WebsiteSchemaProps) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url,
  };

  if (name) {
    schema.name = name;
  }

  if (inLanguage) {
    schema.inLanguage = inLanguage;
  }

  if (searchUrl) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: `${searchUrl}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    };
  }

  return schema;
}