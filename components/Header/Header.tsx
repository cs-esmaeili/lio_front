import HeaderClient from './Header.Client';
import type { HeaderData } from '@/typescript/types/header/header.types';

export default function Header({ wideContainer, headerData }: { wideContainer: boolean; headerData: HeaderData }) {
  return <HeaderClient wideContainer={wideContainer} headerData={headerData} />;
}
