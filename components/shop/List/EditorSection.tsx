type EditorSectionProps = {
  content: string ;
};

const EditorSection = ({ content }: EditorSectionProps) => {
  const html = content.replace(/\\n/g, '<br />');
  return (
    <div className='space-y-6' suppressHydrationWarning>
      <div
        className='flex flex-col gap-4 font-light text-secondary-1 text-justify text-body box-description'
        dangerouslySetInnerHTML={{ __html: html }}
        suppressHydrationWarning
      />
    </div>
  );
};

export default EditorSection;
