type AboutSchemaProps = {
  name: string;
  description?: string;
  url: string;
  image?: string;
};

export default function aboutSchema({
  name,
  description,
  url,
  image,
}: AboutSchemaProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',

    name,
    description,
    url,
    image,
  };
}