'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs';

import { OverviewTab } from '@/components/shop/single/tabs/OverviewTab';
import { FeaturesTab } from '@/components/shop/single/tabs/FeaturesTab';
import { CommentsSection } from '@/components/shop/single/tabs/comments/CommentsSection';
import type { CommentApiResponse, AnswerApiResponse } from '@/services/singelProduct.service';

type TabType = 'overview' | 'features' | 'reviews';


type AttributeItem = {
  id: number;
  title: string;
  values: string;
};

type AttributeGroup = {
  id: number;
  title: string;
  attributes: AttributeItem[];
};

type Props = {
  product: any;
  attributeGroups: AttributeGroup[];
  initialTab: TabType;
  shortDescription?: string;
  barcode: string;
  communications?: {
    comments?: CommentApiResponse[];
    questions?: AnswerApiResponse[];
  };
};

const isValidTab = (val: string | null): val is TabType => {
  return !!val && ['overview', 'features', 'reviews'].includes(val);
};

export default function TabsClient({ product, attributeGroups, initialTab, shortDescription, barcode, communications }: Props) {
  const [tab, setTab] = useState<TabType>(initialTab);
  const [isPending, startTransition] = useTransition();

  const prevTab = useRef<TabType | null>(null);

  const handleTabChange = (value: string) => {
    if (!isValidTab(value)) return;

    startTransition(() => {
      setTab(value as TabType);
    });
  };

  useEffect(() => {
    const handler = () => {
      const el = document.getElementById('product-tabs');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      startTransition(() => {
        setTab('features');
      });
    };
    window.addEventListener('switchToFeaturesTab', handler);
    return () => window.removeEventListener('switchToFeaturesTab', handler);
  }, []);

  useEffect(() => {
    if (prevTab.current === null) {
      prevTab.current = tab;
      return;
    }

    if (prevTab.current === tab) return;

    prevTab.current = tab;

    const el = document.getElementById('product-tabs');
    if (!el) return;

    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [tab]);

  return (
    <div id='product-tabs' className='scroll-mt-[100px]'>
      <Tabs value={tab} onValueChange={handleTabChange} dir='rtl'>
        <TabsList variant='line' className='gap-4'>
          <TabsTrigger
            value='overview'
            className='text-[18px] text-secondary-3 shadow-none rounded-none border-b-2 border-transparent data-[state=active]:text-primary-1 data-[state=active]:after:bg-primary-1 transition-colors duration-200'>
            معرفی تخصصی
          </TabsTrigger>

          <TabsTrigger
            value='features'
            className='text-[18px] text-secondary-3 shadow-none rounded-none border-b-2 border-transparent data-[state=active]:text-primary-1 data-[state=active]:after:bg-primary-1 transition-colors duration-200'>
            ویژگی‌ها
          </TabsTrigger>

          <TabsTrigger
            value='reviews'
            className='text-[18px] text-secondary-3 shadow-none rounded-none border-b-2 border-transparent data-[state=active]:text-primary-1 data-[state=active]:after:bg-primary-1 transition-colors duration-200'>
            دیدگاه‌ها
          </TabsTrigger>
        </TabsList>

        <div className={`mt-6 transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
          {tab === 'overview' && <OverviewTab data={product.description} />}

          {tab === 'features' && (
            <>
              {attributeGroups.map((group) => (
                <div key={group.id}>
                  <span className='block mt-5 mb-3'>{/* {group.title} */}</span>

                  <FeaturesTab
                    features={group.attributes.map((attr) => ({
                      title: attr.title,
                      description: attr.values,
                    }))}
                    showAll={true}
                    showLink={false}
                  />
                </div>
              ))}

              {shortDescription && (
                <div
                  className='flex flex-col gap-4 font-light text-secondary-1 text-justify box-description text-body mt-6'
                  dangerouslySetInnerHTML={{ __html: shortDescription }}
                  suppressHydrationWarning
                />
              )}
            </>
          )}

          {tab === 'reviews' && (
            <CommentsSection barcode={barcode} initialComments={communications?.comments} initialQuestions={communications?.questions} />
          )}
        </div>
      </Tabs>
    </div>
  );
}
