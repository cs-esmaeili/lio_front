import type { SiteSetting } from '@/typescript/schemas/site-setting.schema';

/* -------------------------------------------------------------------------- */
/*  Editor field model                                                        */
/* -------------------------------------------------------------------------- */

export type SettingFieldType = 'string' | 'number' | 'boolean' | 'json';

export interface SettingField {
  id: string;
  key: string;
  type: SettingFieldType;
  /** Raw input value. Booleans use `'true'` / `'false'`. */
  value: string;
}

let fieldSequence = 0;
function nextFieldId(): string {
  fieldSequence += 1;
  return `field-${fieldSequence}`;
}

export const FIELD_TYPE_LABELS: Record<SettingFieldType, string> = {
  string: 'متن',
  number: 'عدد',
  boolean: 'بولین',
  json: 'JSON',
};

function detectFieldType(value: unknown): SettingFieldType {
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (value !== null && typeof value === 'object') return 'json';
  return 'string';
}

function serializeValue(value: unknown, type: SettingFieldType): string {
  if (value == null) return '';
  if (type === 'json') return JSON.stringify(value, null, 2);
  return String(value);
}

/** Turn a setting's `data` object into editable field rows. */
export function settingDataToFields(data: Record<string, unknown>): SettingField[] {
  return Object.entries(data).map(([key, value]) => {
    const type = detectFieldType(value);
    return { id: nextFieldId(), key, type, value: serializeValue(value, type) };
  });
}

export function createEmptyField(): SettingField {
  return { id: nextFieldId(), key: '', type: 'string', value: '' };
}

/** Build the `data` object from the field rows, or return a validation error. */
export function fieldsToData(fields: SettingField[]): { data: Record<string, unknown> } | { error: string } {
  const data: Record<string, unknown> = {};

  for (const field of fields) {
    const key = field.key.trim();

    if (!key) return { error: 'کلید همه فیلدها باید پر شود.' };
    if (key in data) return { error: `کلید «${key}» تکراری است.` };

    switch (field.type) {
      case 'string':
        data[key] = field.value;
        break;
      case 'number': {
        const parsed = Number(field.value);
        if (field.value.trim() === '' || !Number.isFinite(parsed)) {
          return { error: `مقدار «${key}» باید یک عدد معتبر باشد.` };
        }
        data[key] = parsed;
        break;
      }
      case 'boolean':
        data[key] = field.value === 'true';
        break;
      case 'json': {
        try {
          data[key] = JSON.parse(field.value);
        } catch {
          return { error: `مقدار «${key}» یک JSON معتبر نیست.` };
        }
        break;
      }
    }
  }

  return { data };
}

/* -------------------------------------------------------------------------- */
/*  Presentation helpers                                                      */
/* -------------------------------------------------------------------------- */

function formatPreviewValue(value: unknown): string {
  if (value == null) return '—';
  if (typeof value === 'boolean') return value ? 'بله' : 'خیر';
  if (typeof value === 'number') return value.toLocaleString('fa-IR');
  if (typeof value === 'object') return Array.isArray(value) ? `[${value.length.toLocaleString('fa-IR')} مورد]` : '…';
  return String(value);
}

/** Short `key: value` previews for a setting card. */
export function summarizeSetting(setting: SiteSetting, limit = 3): { entries: string[]; rest: number } {
  const all = Object.entries(setting.data);
  const entries = all.slice(0, limit).map(([key, value]) => `${key}: ${formatPreviewValue(value)}`);
  return { entries, rest: Math.max(all.length - limit, 0) };
}
