interface AboutUsHistoryProps {
  title?: string;
  description?: string;
  image?: string;
}

export default function AboutUsHistory({ title = 'با دودیگرام بیشتر آشنا شوید...', description = '', image = '' }: AboutUsHistoryProps) {
  const cleanDescription = description?.replace(/<[^>]*>/g, '') || '';

  return (
    <div className='historyPart mt-12 lg:mt-16'>
      <h2 className='text-c-primary-1 text-center'>{title}</h2>
      <div className='text-secondary-1 text-body mt-4 lg:mt-6 columns-1 lg:columns-2 gap-8 w-full mx-auto text-justify'>
        <span dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </div>
  );
}
