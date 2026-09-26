const stats = [
  { label: 'سفارشات امروز', value: '—' },
  { label: 'کاربران فعال', value: '—' },
  { label: 'محصولات', value: '—' },
];

export default function AdminDashboardPage() {
  return (
    <div className='flex flex-col gap-6'>
      <div className='rounded-2xl border border-gray-1 bg-white p-6 md:p-8'>
        <h1 className='mb-2 text-xl font-bold text-secondary-black-3 md:text-2xl'>داشبورد ادمین</h1>
        <p className='text-regular text-secondary-2'>به پنل مدیریت خوش آمدید. این صفحه فعلاً فقط یک نمای ظاهری است.</p>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {stats.map((stat) => (
          <div key={stat.label} className='rounded-2xl border border-gray-1 bg-white p-5'>
            <span className='text-caption text-secondary-2'>{stat.label}</span>
            <p className='mt-2 text-2xl font-bold text-secondary-black-3'>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
