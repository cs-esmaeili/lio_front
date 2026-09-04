import Link from 'next/link';

export default function BrandSection({ section }: { section?: any }) {
  const items = section?.data.brands.brands;

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className='container'>
      {section?.title && <h2 className='text-center text-primary-1 mb-6'>{section.title}</h2>}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
        {items.map((item: any) => (
          <Link key={item.id} href={`brands/${item.slug}/`}>
            <div className='flex items-center justify-center'>
              {item.image && <img src={item.image} alt={item.alt || ''} className='max-h-20 object-contain' />}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
