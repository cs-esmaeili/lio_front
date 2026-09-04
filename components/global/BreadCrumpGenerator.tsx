'use client';

import { Fragment } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/shadcn/breadcrumb';

export function BreadCrumpGenerator({ items = [], baseUrl = null }: { items: any[]; baseUrl?: string | null }) {

  
  return (
    <Breadcrumb>
      <BreadcrumbList className='mb-5'>
        {items.length > 0 && items.map((item, index) => (
          <Fragment key={`${item.id}-${index}`}>
            <BreadcrumbItem>
              {item.disabled ? (
                <span className='text-primary-1'>{item.title}</span>
              ) : (
                <BreadcrumbLink className='hover:text-primary-1' href={item.href ?? `${baseUrl ? `${baseUrl}/` : ''}${item.slug}/`}>{item.title}</BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {index < items.length - 1 && <BreadcrumbSeparator>{'>'}</BreadcrumbSeparator>}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
