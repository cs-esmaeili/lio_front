export default function contactSchema({
  name,
  description,
  url,
  telephone,
  image,
}: {
  name: string;
  description?: string;
  url: string;
  telephone?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',

    name,
    description,
    url,
    image,
    mainEntity: {
      '@type': 'Organization',
      name: 'دودیگرام',
      url: process.env.NEXT_PUBLIC_SITE_ENDPOINT,
      telephone,
    },
  };
}