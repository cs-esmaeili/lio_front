export default function collectionSchema({
  name,
  description,
  url,
  image,
}: {
  name: string;
  description?: string;
  url: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    image,
  };
}