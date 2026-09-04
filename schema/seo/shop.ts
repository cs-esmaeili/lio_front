const shopSchema = ({
  name,
  description,
  url,
}: {
  name: string;
  description?: string;
  url: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name,
  description,
  url,
});

export default shopSchema;