import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

export function useBackdropPortal(open: boolean, zIndex = 'z-20'): ReactNode | null {
  return open ? createPortal(<div className={`fixed inset-0 ${zIndex} bg-gray-1/20 backdrop-blur-md`} />, document.body) : null;
}
