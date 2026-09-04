import Link from 'next/link';
import Icon from '@/components/global/Icon';
import { FeaturesTab } from '@/components/shop/single/tabs/FeaturesTab';
import { ArrowLeft2, Star1 } from 'iconsax-reactjs';

type AttributeItem = { id: number; title: string; values: string };
type AttributeGroup = { id: number; title: string; attributes: AttributeItem[] };
type Category = { id: number; title: string; linkSlug: string; image: string };

type Props = {
  attributeGroups: AttributeGroup[];
  product: any;
  commentsNumber: any;
  tags : any ;
  maxDisplay?: number;
  showAllFeatures?: boolean;
};

const Attribute = ({ attributeGroups, product, commentsNumber, tags , maxDisplay = 4 }: Props) => {

  const { brand, title, buyer_score_count, rating_value, categories } = product;

  
  return (
    <div className='flex flex-col gap-3 justify-between h-full'>
      <div>
        {/* <span className='block text-secondary-1 mb-1'>{brand.title}</span> */}
        <div className='block text-primary-1 text-2xl border-b border-primary-3 mt-3 md:mt-0 w-full'>
          <h1 className='w-[calc(100%-90px)] md:w-full'>{title}</h1>
        </div>

        <span className='flex items-center gap-1 mt-5'>
          <Icon
            IconComponent={Star1}
            className='text-custom-yellow relative -top-0.5'
            size={20}
            variant='Bold'
            toneTwoColor='--color-custom-yellow'
          />
          <span className='text-sm text-secondary-black-3 whitespace-nowrap'>{rating_value}</span>
          <span className='text-sm text-secondary-2 whitespace-nowrap'>(امتیاز {buyer_score_count} خریدار)</span>

          {/* <Link
            href='?tab=reviews'
            className='flex group justify-center items-center bg-gray-3/30 py-1 pl-1 pr-2 rounded-md text-xs text-secondary-2 gap-0
            hover:bg-primary-3/50 transition-all duration-1000 ease-in-out cursor-pointer'>
            <span>{commentsNumber} دیدگاه</span>
            <Icon IconComponent={ArrowLeft2} size={15} className='text-secondary-2' toneTwoColor='--color-secondary-2' variant='TwoTone' />
          </Link> */}
        </span>

        {attributeGroups.slice(0, 2).map((group) => (
          <div key={group.id}>
            <span className='block mt-5 mb-3'>{group.title}</span>
            <FeaturesTab
              features={group.attributes.map((attr) => ({
                title: attr.title,
                description: attr.values,
              }))}
              maxDisplay={maxDisplay}
              showAll={false}
              showLink={true}
            />
          </div>
        ))}
      </div>

      <div className='flex flex-wrap item-center gap-1 text-secondary-2 border-t border-primary-3 pt-3 text-sm'>
        <span>برند: {brand.title}</span>
        <span className='text-secondary-2'>|</span>
        <span>شناسه محصول: {product.barcode}</span>
        <span className='text-secondary-2'>|</span>
        {categories.length > 0 && (
          <>
            <span>
              دسته:{' '}
              {(categories as Category[]).map((cat, i) => (
                <span key={cat.id}>
                  <Link href={`/product-category/${cat.linkSlug}`} className='hover:text-primary-1 transition-colors'>
                    {cat.title}
                  </Link>
                  {i < categories.length - 1 && '،'}
                </span>
              ))}
            </span>
            {tags.length > 0 && <span className='text-secondary-2'>|</span>}
          </>
        )}

        {tags.length > 0 && (
          <span>
            برچسب:{' '}
            {(tags as string[]).map((tag, i) => (
              <span key={tag}>
                {/* <Link href={`/product-tag/${tag}`} className="hover:text-primary-1 transition-colors">
                  {tag}
                </Link> */}
                {tag}
                {i < tags.length - 1 && '،'}
              </span>
            ))}
          </span>
        )}
      </div>
    </div>
  );
};

export default Attribute;
