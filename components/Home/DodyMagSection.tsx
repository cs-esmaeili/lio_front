import Link from 'next/link';
import Icon from '@/components/global/Icon';
import { ArrowSquareLeft } from 'iconsax-reactjs';
import MagCartItem from '@/components/global/Cards/MagCardHome';

export default function DodiyMagSection({ section }: { section?: any }) {


  const { title, description, button_link, button_text } = section;
  const { posts } = section.data;

  return (
    <section className='container mb-10 lg:-mt-6'>
      <div className='text-center mb-5'>
        <h2 className='text-primary-1 mb-2'>{title}</h2>
        <h5 className='text-secondary-black-2 text-body'>{description}</h5>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {posts.map((article :any, index: number) => (
          <div key={article.id} className={index >= 4 ? 'hidden sm:block' : ''}>
            <MagCartItem
              href={`/blog/${article.slug}`}
              imageSrc={article.image}
              imageAlt={article.title}
              title={article.title}
              date={article.created_date}
            />
          </div>
        ))}

        <Link
          href={button_link}
          className='flex items-center justify-center gap-4 rounded-lg bg-primary-2 min-h-16 p-3 sm:col-span-2 lg:col-span-1
           hover:bg-linear-to-r hover:from-primary-3 hover:to-primary-1
           hover:shadow-[0_8px_24px_0_var(--color-primary-3)]
           transition-all duration-300'>
          <span className='text-regular text-secondary-black-3 whitespace-nowrap'>{button_text}</span>
          <Icon IconComponent={ArrowSquareLeft} size={28} className='text-secondary-black-3 shrink-0' variant='Bold' />
        </Link>
      </div>
    </section>
  );
}
