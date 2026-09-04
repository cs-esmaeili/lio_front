export default function productSchema(props: any = {}) {
  const {
    name,
    description,
    image,
    url,
    sku,
    brand,
    price,
    priceCurrency = "IRR",
    availability,
    ratingValue,
    reviewCount,
    review,
  } = props;

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
  };

  if (name) {
    schema.name = name;
  }

  if (description) {
    schema.description = description;
  }

  if (image) {
    schema.image = Array.isArray(image) ? image : [image];
  }

  if (url) {
    schema.url = url;
  }

  if (sku) {
    schema.sku = sku;
  }

  if (brand) {
    schema.brand = {
      "@type": "Brand",
      name: brand,
    };
  }

  if (price || availability) {
    schema.offers = {
      "@type": "Offer",
    };

    if (url) {
      schema.offers.url = url;
    }

    if (price) {
      schema.offers.price = price;
      schema.offers.priceCurrency = priceCurrency;
    }

    if (availability) {
      schema.offers.availability = availability;
    }

    schema.offers.itemCondition =
      'https://schema.org/NewCondition';

  }

  if (ratingValue && reviewCount && Number(reviewCount) > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (review && review.length > 0) {
    schema.review = review;
  }

  return schema;
}