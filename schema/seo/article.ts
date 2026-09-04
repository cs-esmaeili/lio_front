type ArticleSchemaProps = {
  title: string;
  description?: string;
  image?: string;
  url: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  logo?: string;
};

export default function articleSchema({
  title,
  description,
  image,
  url,
  author,
  publishedTime,
  modifiedTime,
  logo,
}: ArticleSchemaProps) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Article',

    headline: title,

    description,

    mainEntityOfPage: url,

    author: {
      '@type': 'Person',
      name: author,
    },

    publisher: {
      '@type': 'Organization',
      name: 'دودیگرام',
    },

    datePublished: publishedTime,

    dateModified: modifiedTime,
  };

  if (image) {
    schema.image = {
      '@type': 'ImageObject',
      url: image,
    };
  }

  if (logo) {
    schema.publisher.logo = {
      '@type': 'ImageObject',
      url: logo,
    };
  }

  return schema;
}