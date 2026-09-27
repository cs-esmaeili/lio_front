'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

import AttributeValuesModal from '@/components/admin/attribute-manager/AttributeValuesModal';
import { Button } from '@/components/shadcn/button';
import { Spinner } from '@/components/shadcn/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs';
import { usePermissions } from '@/hooks/auth/usePermissions';
import { useAvailableAttributes } from '@/hooks/product/useAvailableAttributes';
import { useProductMutations } from '@/hooks/product/useProductMutations';
import { PERMISSIONS } from '@/typescript/constants/permissions';
import type { AdminAttribute } from '@/typescript/schemas/attribute.schema';
import { PRODUCT_SLUG_PATTERN, type AdminProduct, type AdminAvailableAttribute } from '@/typescript/schemas/products/admin-product.schema';
import ProductBasicTab from './ProductBasicTab';
import ProductImagesTab from './ProductImagesTab';
import ProductSpecsTab from './ProductSpecsTab';
import ProductVariantsTab from './ProductVariantsTab';
import { buildCombinations, emptyFormState, pruneFormState, toFormState, toSavePayload, type ProductFormState } from './product-manager.model';

interface ProductFormProps {
  mode: 'create' | 'edit';
  /** Existing product in edit mode; `null` when creating. */
  product: AdminProduct | null;
  onSaved: (product: AdminProduct) => void;
  onCancel: () => void;
}

/** Full-page product editor: basic info, images, spec attributes and variant matrix. */
export default function ProductForm({ mode, product, onSaved, onCancel }: ProductFormProps) {
  const { createProduct, updateProduct, saving } = useProductMutations();
  const { hasPermission } = usePermissions();
  const canManageAttributes = hasPermission(PERMISSIONS.ATTRIBUTE_MANAGE);

  const [state, setState] = useState<ProductFormState>(() => (product ? toFormState(product) : emptyFormState()));
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [error, setError] = useState<string | null>(null);
  const [valuesTarget, setValuesTarget] = useState<AdminAttribute | null>(null);

  const { attributes: availableAttributes, loadedKey, loading: attributesLoading, refetch: refetchAttributes } = useAvailableAttributes(state.categoryIds);

  // Drop attributes/values the selected categories no longer expose. Runs during
  // render (not in an effect) once the attributes for the current categories
  // have actually loaded, so a still-loading list never wipes the form. The
  // signature includes value ids so a value added/removed inline also prunes.
  const categoryKey = state.categoryIds.join(',');
  const attributesSignature = availableAttributes
    .map((attribute) => `${attribute.id}:${attribute.values.map((value) => value.id).sort((a, b) => a - b).join('.')}`)
    .sort()
    .join(',');
  const [prunedSignature, setPrunedSignature] = useState<string | null>(null);
  if (!attributesLoading && loadedKey === categoryKey && prunedSignature !== attributesSignature) {
    setPrunedSignature(attributesSignature);
    setState((prev) => pruneFormState(prev, availableAttributes));
  }

  const manageValues = (attribute: AdminAvailableAttribute) => setValuesTarget(attribute);

  const update = (patch: Partial<ProductFormState>) => {
    setState((prev) => ({ ...prev, ...patch }));
    if (error) setError(null);
  };

  const validate = (): string | null => {
    if (!state.name.trim()) return 'نام محصول را وارد کنید.';
    if (!PRODUCT_SLUG_PATTERN.test(state.slug.trim())) return 'اسلاگ محصول باید فقط شامل حروف انگلیسی کوچک، عدد و «-» باشد.';
    if (state.categoryIds.length === 0) return 'حداقل یک دسته‌بندی برای محصول انتخاب کنید.';

    if (buildCombinations(state.variantAxes).filter((combination) => state.variants[combination.key]?.included ?? true).length === 0) {
      return 'حداقل یک ترکیب تنوع باید فعال باشد.';
    }

    for (const attribute of availableAttributes) {
      if (attribute.usage === 'SPEC' && attribute.isRequired && (state.specValues[attribute.id]?.length ?? 0) === 0) {
        return `مقدار ویژگی «${attribute.title}» را انتخاب کنید (اجباری).`;
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    const payload = toSavePayload(state);
    const saved = mode === 'create' ? await createProduct(payload) : product ? await updateProduct(product.id, payload) : null;
    if (!saved) return;

    toast.success(mode === 'create' ? 'محصول ایجاد شد.' : 'محصول ذخیره شد.');
    onSaved(saved);
  };

  const disabled = saving;

  return (
    <div className='flex flex-col gap-6 pb-24'>
      <Tabs defaultValue='basic' dir='rtl' className='flex flex-col gap-5'>
        <div className='flex flex-col gap-4 rounded-2xl border border-gray-1 bg-custom-white p-4 md:flex-row md:items-center md:justify-between md:p-5'>
          <TabsList variant='line' className='w-full justify-start overflow-x-auto md:w-auto'>
            <TabsTrigger value='basic'>اطلاعات پایه</TabsTrigger>
            <TabsTrigger value='images'>تصاویر</TabsTrigger>
            <TabsTrigger value='specs'>مشخصات</TabsTrigger>
            <TabsTrigger value='variants'>تنوع‌ها</TabsTrigger>
          </TabsList>

          <div className='flex shrink-0 items-center gap-2'>
            <Button type='button' variant='outline' className='h-11 rounded-xl border-gray-2' disabled={disabled} onClick={onCancel}>
              انصراف
            </Button>
            <Button type='button' className='h-11 rounded-xl px-6' disabled={disabled} onClick={() => void handleSubmit()}>
              {saving ? <Spinner /> : <Save />}
              ذخیره محصول
            </Button>
          </div>
        </div>

        <div className='rounded-2xl border border-gray-1 bg-custom-white p-4 md:p-6'>
          {error && (
            <div className='mb-4 rounded-xl border border-custom-red/30 bg-custom-red/10 px-4 py-3 text-regular text-custom-red'>{error}</div>
          )}

          <TabsContent value='basic'>
            <ProductBasicTab state={state} disabled={disabled} slugTouched={slugTouched} onSlugTouched={setSlugTouched} onChange={update} />
          </TabsContent>

          <TabsContent value='images'>
            <ProductImagesTab state={state} disabled={disabled} onChange={update} />
          </TabsContent>

          <TabsContent value='specs'>
            <ProductSpecsTab
              state={state}
              disabled={disabled}
              attributes={availableAttributes}
              onChange={update}
              canManageValues={canManageAttributes}
              onManageValues={manageValues}
            />
          </TabsContent>

          <TabsContent value='variants'>
            <ProductVariantsTab
              state={state}
              disabled={disabled}
              attributes={availableAttributes}
              onChange={update}
              canManageValues={canManageAttributes}
              onManageValues={manageValues}
              onRefreshAttributes={() => void refetchAttributes()}
              refreshing={attributesLoading}
            />
          </TabsContent>
        </div>
      </Tabs>

      <AttributeValuesModal
        open={valuesTarget !== null}
        onOpenChange={(open) => {
          if (!open) setValuesTarget(null);
        }}
        attribute={valuesTarget}
        onChanged={(updated) => {
          setValuesTarget(updated);
          void refetchAttributes();
        }}
      />
    </div>
  );
}
