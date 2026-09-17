import type { FooterLink } from '@/typescript/schemas/footer/footer-section.schema';

export interface FooterCommunication {
  title?: string;
  image: string;
  key: string;
  value?: string;
  full_url: string;
}

export interface FooterData {
  footer: FooterLink[];
  logo?: string | null;
  description?: string | null;
  slogan?: string | null;
  communications?: FooterCommunication[];
  support_phone?: string;
  telephone?: string;
}
