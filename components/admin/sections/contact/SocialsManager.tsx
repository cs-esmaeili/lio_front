'use client';

import { useState } from 'react';
import { Pencil, Plus, Share2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { useSiteSetting } from '@/hooks/site-settings/useSiteSetting';
import { useUpsertSiteSetting } from '@/hooks/site-settings/useUpsertSiteSetting';
import { resolveFileUrl } from '@/utils/fileUrl';
import { ContactSocialSchema, type ContactSocial } from '@/typescript/schemas/page-section.schema';
import SocialFormModal from './SocialFormModal';

const SOCIALS_KEY = 'socials';
const SocialsItemsSchema = z.array(ContactSocialSchema);

type EditorState = { mode: 'create' | 'edit'; index: number; social: ContactSocial | null };

/** Manages the `socials` site setting (keyed by `site:manage`). */
export default function SocialsManager() {
  const { setting, loading, refetch } = useSiteSetting(SOCIALS_KEY);
  const { upsertSetting, loading: saving } = useUpsertSiteSetting();

  const [editor, setEditor] = useState<EditorState | null>(null);

  const parsed = SocialsItemsSchema.safeParse(setting?.data?.items);
  const items: ContactSocial[] = parsed.success ? parsed.data : [];

  // --------------------------------------------------------

  const saveItems = async (next: ContactSocial[]): Promise<boolean> => {
    const saved = await upsertSetting(SOCIALS_KEY, { data: { items: next }, isPrivate: false });
    if (!saved) return false;

    toast.success('شبکه‌های اجتماعی ذخیره شد.');
    void refetch();
    return true;
  };

  const handleSubmit = async (social: ContactSocial) => {
    if (!editor) return;
    const next = [...items];
    if (editor.mode === 'edit' && editor.index >= 0) {
      next[editor.index] = social;
    } else {
      next.push(social);
    }
    await saveItems(next);
  };

  const handleDelete = async (index: number) => {
    await saveItems(items.filter((_, itemIndex) => itemIndex !== index));
  };

  // --------------------------------------------------------

  return (
    <div className='flex flex-col gap-4 rounded-2xl border border-gray-1 bg-custom-white p-5'>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <Share2 className='text-secondary-3' size={18} aria-hidden='true' />
          <h2 className='text-lg font-bold text-secondary-black-3'>شبکه‌های اجتماعی</h2>
        </div>

        <Button
          type='button'
          variant='outline'
          size='sm'
          className='h-9 rounded-lg border-gray-2'
          disabled={loading || saving}
          onClick={() => setEditor({ mode: 'create', index: -1, social: null })}>
          <Plus />
          افزودن
        </Button>
      </div>

      {loading && !setting ? (
        <div className='h-24 animate-pulse rounded-xl border border-gray-1 bg-gray-1/60' />
      ) : items.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-2 py-10 text-center'>
          <Share2 className='text-secondary-3' size={28} aria-hidden='true' />
          <p className='text-regular text-secondary-2'>هنوز شبکه‌ای ثبت نشده است.</p>
        </div>
      ) : (
        <ul className='flex flex-col gap-2'>
          {items.map((social, index) => (
            <li key={`${social.key}-${index}`} className='flex items-center gap-3 rounded-xl border border-gray-1 p-3'>
              <div className='grid size-10 shrink-0 place-content-center overflow-hidden rounded-lg border border-gray-2 bg-gray-1'>
                {resolveFileUrl(social.image) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={resolveFileUrl(social.image) ?? ''} alt={social.key} className='h-full w-full object-contain' />
                ) : null}
              </div>

              <div className='flex min-w-0 flex-1 flex-col'>
                <span className='text-regular font-medium text-secondary-black-3'>{social.title || social.key}</span>
                <a href={social.fullUrl} target='_blank' rel='noopener noreferrer' className='truncate text-caption text-secondary-2' dir='ltr'>
                  {social.fullUrl}
                </a>
              </div>

              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className='text-secondary-2 hover:text-primary-1'
                title='ویرایش'
                onClick={() => setEditor({ mode: 'edit', index, social })}>
                <Pencil />
              </Button>

              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className='text-secondary-2 hover:bg-custom-red/10 hover:text-custom-red'
                title='حذف'
                disabled={saving}
                onClick={() => void handleDelete(index)}>
                {saving ? <Spinner /> : <Trash2 />}
              </Button>
            </li>
          ))}
        </ul>
      )}

      {editor && (
        <SocialFormModal
          key={`${editor.mode}:${editor.index}`}
          open
          onOpenChange={(open) => {
            if (!open) setEditor(null);
          }}
          mode={editor.mode}
          initial={editor.social}
          submitting={saving}
          onSubmit={(social) => void handleSubmit(social)}
        />
      )}
    </div>
  );
}
