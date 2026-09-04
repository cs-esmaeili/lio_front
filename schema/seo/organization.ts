export default function organizationSchema(props: any = {}) {
  const {
    name,
    url,
    logo
  } = props;

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Organization",
  };

  if (name) {
    schema.name = name;
  }

  if (url) {
    schema.url = url;
  }

  if(logo){
    schema.logo = logo
  }

  return schema;
}