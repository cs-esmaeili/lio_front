interface PageTitleProps {
  title: string;
}
export default function PageTitle({ title }: PageTitleProps) {
  return (
    <div className="page-title flex items-center justify-center text-center w-full text-secondary-1">
      <h1>{title}</h1>
    </div>
  );
}
