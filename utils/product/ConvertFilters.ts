type Filter = {
  key: string;
  title: string;
  type: 'checkbox' | 'price';
  multiselect: boolean;
  goToLink: boolean;
  items?: any[];
  value?: any;
  baseLink? : string
};

export const convertFilters = (data: any): Filter[] => {
  const filters: Filter[] = [];

  
  // برندها
  if (data.brands?.length) {
    filters.push({
      key: 'brands[]',
      title: 'برند',
      type: 'checkbox',
      multiselect: true,
      goToLink: true,
      baseLink: "/brands/",
      items: data.brands.map((item: any) => ({
        id: item.id,
        title: item.title,
        value: item.id,
        slug: item.slug
      })),
    });
  }

  // دسته‌بندی‌ها
  if (data.categories?.length) {
    filters.push({
      key: 'categories[]',
      title: 'دسته‌بندی',
      type: 'checkbox',
      multiselect: true,
      goToLink: true,
      baseLink: "/product-category/",
      items: data.categories.map((item: any) => ({
        title: item.title,
        value: item.slug,
      })),
    });
  }

  // ویژگی‌ها
  if (data.attributes?.length) {
    data.attributes.forEach((attr: any) => {
      filters.push({
        key: `attribute_values[${attr.id}]`,
        title: attr.title,
        type: 'checkbox',
        multiselect: true,//attr.select_list !== 0,
        goToLink: false,
        items: attr.values.map((value: any) => ({
          id: value.id,
          title: value.title,
          value: value.id,
          color: value.color,
        })),
      });
    });
  }

  // قیمت
  filters.push({
    key: 'price',
    title: 'محدوده قیمت',
    type: 'price',
    multiselect: false,
    goToLink: false,
    value: {
      min: data.min_amount ?? 0,
      max: data.max_amount ?? 0,
      selectedMin: data.min_amount ?? 0,
      selectedMax: data.max_amount ?? 0,
    },
  });

  return filters;
};
