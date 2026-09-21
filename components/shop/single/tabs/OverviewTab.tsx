export function OverviewTab({ data }: { data?: string | null }) {

  // const html = data.replace(/\\n/g, '').replace(/&nbsp;/g, ' ');
  const html = (data ?? '').replace(/\\n/g, '<br />');

  return (
    <div className='space-y-6' suppressHydrationWarning>
      <div
        className='flex flex-col gap-4 font-light text-secondary-1 text-justify box-description text-body'
        dangerouslySetInnerHTML={{ __html: html }}
        suppressHydrationWarning
      />
    </div>
  );
}
