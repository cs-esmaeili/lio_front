// import { ReactNode } from 'react';

// interface PageHeaderProps {
//   children: ReactNode;
//   className?: string;
// }

// export default function PageHeader({ children, className = '' }: PageHeaderProps) {
//   return (
//     <div className={`h-8 flex items-center min-w-full ${className}`}>
//       {children}
//     </div>
//   );
// }

import { ReactNode } from 'react';

interface PageHeaderProps {
  titleSlot: ReactNode;        // Required: the title + icon section
  actionsSlot?: ReactNode;     // Optional: buttons or other actions
  className?: string;          // Additional classes for the container
}

export default function PageHeader({
  titleSlot,
  actionsSlot,
  className = ''
}: PageHeaderProps) {
  return (
    <div className={`flex flex-row items-center justify-between gap-4 min-w-full ${className}`}>
      {/* Title section - always first (right in RTL) */}
      <div className="flex items-center gap-2 overflow-x-auto overflow-y-hidden pb-2">
        {titleSlot}
      </div>

      {/* Actions section - second on mobile, pushed right on desktop */}
      {actionsSlot && (
        <div className="flex items-center gap-2">
          {actionsSlot}
        </div>
      )}
    </div>
  );
}