import Link from 'next/link';
import { FeaturesTab } from '@/components/shop/single/tabs/FeaturesTab';
import type {
  AttributeGroup,
  ProductDetailsProduct,
} from '@/typescript/schemas/products/product-details.schema';

const Attribute = ({
  product,
  attributeGroups,
  maxDisplay = 4,
}: {
  product: ProductDetailsProduct;
  attributeGroups: AttributeGroup[];
  maxDisplay?: number;
}) => {
  const { id, name, categories, tags } = product;

  return (
    <div className='flex flex-col gap-3 justify-between h-full'>
      <div>
        <div className='block text-primary-1 text-2xl border-b border-primary-3 mt-3 md:mt-0 w-full'>
          <h1 className='w-[calc(100%-90px)] md:w-full'>{name}</h1>
        </div>

        {attributeGroups.slice(0, 2).map((group) => (
          <div key={group.attributeId}>
            <span className='block mt-5 mb-3'>{group.title}</span>

            <FeaturesTab
              features={group.attributes.map((attribute) => ({
                title: attribute.title,
                description: attribute.value,
              }))}
              maxDisplay={maxDisplay}
              showAll={false}
              showLink={true}
            />
          </div>
        ))}
      </div>

      <div className='flex flex-wrap item-center gap-1 text-secondary-2 border-t border-primary-3 pt-3 text-sm'>
        <span>شناسه محصول: {id}</span>

        {categories.length > 0 && (
          <>
            <span className='text-secondary-2'>|</span>
            <span>
              دسته:{' '}
              {categories.map((category, index) => (
                <span key={category.id}>
                  <Link href={`/product-category/${category.slug}`} className='hover:text-primary-1 transition-colors'>
                    {category.name}
                  </Link>
                  {index < categories.length - 1 && '، '}
                </span>
              ))}
            </span>
          </>
        )}

        {tags.length > 0 && (
          <>
            <span className='text-secondary-2'>|</span>
            <span>
              برچسب:{' '}
              {tags.map((tag, index) => (
                <span key={tag.id}>
                  {tag.name}
                  {index < tags.length - 1 && '، '}
                </span>
              ))}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default Attribute;
