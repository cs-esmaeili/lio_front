import ContactUsInfo from '@/components/contact-us/ContactUsInfo';
import ContactUsForm from '@/components/contact-us/ContactUsForm';
import ContactUsMap from '@/components/contact-us/ContactUsMap';
import ContactUsSocialMedia from '@/components/contact-us/ContactUsSocialMedia';
import ContactUsCta from '@/components/contact-us/ContactUsCta';
import Gradient from '@/components/global/Gradient';
import useSeo from '@/hooks/seo/useSeo';
import { contactData } from '@/services/contactUs.service';

export async function generateMetadata() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;

  return useSeo({
    title: `ارتباط با ما | ${siteName}`,
    description: `ارتباط با ${siteName}، آدرس، شماره تماس، ساعات پاسخگویی و راه‌های ارتباطی.`,
    canonical: `${siteUrl}/contact-us/`,
    image: `${siteUrl}/logo.webp`,
    imageAlt: `ارتباط با ${siteName}`,
  });
}

export default async function page() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const contact = await contactData();

  return (
    <>
      <Gradient />
      <div className='container '>
        <div className='page-title flex items-center justify-center w-full text-secondary-1'>
          <h1>ارتباط با {siteName}</h1>
        </div>
        <div className='main-content mt-8 lg:mt-17'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 w-full lg:h-106'>
            <ContactUsInfo
              address={contact.address ?? undefined}
              email={contact.email ?? undefined}
              supportPhone={contact.supportPhone ?? undefined}
            />
            <div className='h-72 overflow-hidden rounded-2xl bg-gray-1 lg:h-full'>
              <ContactUsMap center={{ lng: contact.mapLng ?? 51.389, lat: contact.mapLat ?? 35.6892 }} zoom={14} />
            </div>
            <ContactUsForm />
          </div>
        </div>

        <div className='social-media-part my-16 lg:my-20'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <ContactUsSocialMedia communications={contact.socials} />
            <ContactUsCta timeWork={contact.supportHour ?? undefined} />
          </div>
        </div>
      </div>
    </>
  );
}
