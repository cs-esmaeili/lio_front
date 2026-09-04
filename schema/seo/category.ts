type Props = {
  name: string;
  description?: string;
  url: string;
};

export default function categorySchema({
  name,
  description,
  url,
}: Props) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',

    name,

    description,

    url,
  };
}