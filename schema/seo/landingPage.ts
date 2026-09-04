type LandingPageSchemaProps = {
  title: string;
  description?: string;
  url: string;
};

export default function landingPageSchema({
  title,
  description,
  url,
}: LandingPageSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description || "",
    "url": url,
    "isPartOf": {
      "@type": "WebSite",
      "name": process.env.NEXT_PUBLIC_SITE_NAME,
      "url": process.env.NEXT_PUBLIC_SITE_ENDPOINT
    }
  };
}