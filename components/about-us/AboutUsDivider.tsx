export default function AboutUsDivider() {
  return (
    <div className='w-full lg:w-0.5 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0'>
      <div
        className='w-[70%] lg:w-0.5 lg:h-42 h-0.5 
               mx-auto lg:mx-0 rounded-full shrink-0  bg-linear-to-l lg:bg-linear-to-b from-transparent via-(--primary-1)to-transparent'
      />
    </div>
  );
}
