import ContactUsInfo from '@/components/contact-us/ContactUsInfo';
import ContactUsForm from '@/components/contact-us/ContactUsForm';
import ContactUsSocialMedia from '@/components/contact-us/ContactUsSocialMedia';
import ContactUsCta from '@/components/contact-us/ContactUsCta';
import Gradient from '@/components/global/Gradient';
import { BreadCrumpGenerator } from '@/components/global/BreadCrumpGenerator';
import ContactUsMap from '@/components/contact-us/ContactUsMap';
import { contactData } from '@/services/contactUs.service';
import useSeo from '@/hooks/seo/useSeo';
import contactSchema from '@/schema/seo/contact';
import JsonLd from '@/components/seo/JsonLd';
import breadcrumbSchema from '@/schema/seo/breadcrumb';
import type { BreadcrumbItem } from '@/typescript/types/general/breadcrumb';

export async function generateMetadata() {
  const result = await contactData();

  const seo = result.data?.seo;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_ENDPOINT;
  return useSeo({
    title: `${seo?.title || 'ارتباط با ما'} | ${siteName}`,
    description: seo?.description,
    keywords: seo?.keywords,
    canonical: seo?.canonical ?? `${siteUrl}/contact-us/`,
    robots: seo?.robot,
    image: `${siteUrl}/logo.webp`,
    imageAlt: 'ارتباط با دودیگرام',
  });
}

export default async function page() {
  const result = await contactData();
  const contactDataResult = result.data || result || {};
  const breadcrumbItems: BreadcrumbItem[] = contactDataResult?.breadcrumb || [];

  const {
    address = '',
    address_tehran = '',
    support_phone = '',
    telephone = '',
    'support-department': support_department = '',
    'pre-sales-consultation': pre_sales_consultation = '',
    'support-hour': support_hour = '',
    communications = [],
    balad = '',
    google = '',
    neshan = '',
    map = {},
  } = contactDataResult || {};

  const seo = contactDataResult.seo;

  const description = seo?.description || `ارتباط با دودیگرام، آدرس، شماره تماس، ساعات پاسخگویی و راه‌های ارتباطی.`;

  const contactJsonLd = contactSchema({
    name: seo?.title || 'ارتباط با دودیگرام',
    description,
    url: `${process.env.NEXT_PUBLIC_SITE_ENDPOINT}/contact-us/`,
    telephone,
  });

  const breadcrumbJsonLd = breadcrumbSchema(breadcrumbItems);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={contactJsonLd} />
      <Gradient />
      <div className='container '>
        <BreadCrumpGenerator items={breadcrumbItems} />
        <div className='page-title flex items-center justify-center w-full text-secondary-1'>
          <h1>ارتباط با دودیگرام</h1>
        </div>
        <div className='main-content mt-8 lg:mt-17'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 w-full طم:h-106 '>
            <ContactUsInfo
              address={address}
              addressTehran={address_tehran}
              supportPhone={support_phone}
              telephone={telephone}
              internalSupport={support_department}
              internalConsulting={pre_sales_consultation}
            />
            <div className='bg-gray-1 rounded-2xl map-part'>
              {/* <ContactUsMap center={[Number(map.lat) || 51.389, Number(map.lng) || 35.6892]} zoom={14} traffic={true} poi={true} /> */}
            </div>
            <ContactUsForm />
          </div>
        </div>

        <div className='social-media-part my-16 lg:my-20 lg:h-41.25'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <ContactUsSocialMedia communications={communications} />
            <ContactUsCta timeWork={support_hour} />
          </div>
        </div>
      </div>
    </>
  );
}
