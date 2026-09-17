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
  communications?: FooterCommunication[];
  support_phone?: string;
  telephone?: string;
  site_name?: string;
  footer_text?: string;
}
