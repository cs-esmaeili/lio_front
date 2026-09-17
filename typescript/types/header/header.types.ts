import type { MenuItem } from '@/typescript/schemas/header/menu.schema';

export interface HeaderData {
  header: MenuItem[];
  logo?: string;
  slogan?: string | null;
  supportPhone?: string | null;
}

export interface Communication {
  key: string;
  full_url: string;
}
