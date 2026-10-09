import HeaderClient from './Header.Client';
import type { Communication, HeaderData } from '@/typescript/types/header/header.types';
import type { FooterData } from '@/typescript/types/footer/footer.types';

export default function Header({ wideContainer, headerData, footerData }: { wideContainer: boolean; headerData: HeaderData; footerData?: FooterData }) {
  const socialToAction: Communication[] = footerData?.communications ?? [];

  return <HeaderClient wideContainer={wideContainer} headerData={headerData} socialToAction={socialToAction} />;
}
