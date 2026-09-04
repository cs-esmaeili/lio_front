import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

export function useBackdropPortal(open: boolean, zIndex?: string): ReactNode | null {
  return open ? createPortal(<div className={`fixed inset-0 z-20 bg-gray-1/20 backdrop-blur-md ${zIndex}`} />, document.body) : null;
}
