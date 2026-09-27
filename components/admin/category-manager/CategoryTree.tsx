'use client';

import CategoryTreeItem from './CategoryTreeItem';
import type { CategoryTreeNode } from './category-manager.model';

interface CategoryTreeProps {
  nodes: CategoryTreeNode[];
  expandedIds: Set<number>;
  forceExpand: boolean;
  canManage: boolean;
  busyId: number | null;
  onToggle: (id: number) => void;
  onAddChild: (category: CategoryTreeNode) => void;
  onEdit: (category: CategoryTreeNode) => void;
  onDelete: (category: CategoryTreeNode) => void;
}

/** Presentational hierarchical list of categories; expansion is owned by the caller. */
export default function CategoryTree({
  nodes,
  expandedIds,
  forceExpand,
  canManage,
  busyId,
  onToggle,
  onAddChild,
  onEdit,
  onDelete,
}: CategoryTreeProps) {
  return (
    <ul className='flex flex-col gap-0.5'>
      {nodes.map((node) => (
        <CategoryTreeItem
          key={node.id}
          node={node}
          expandedIds={expandedIds}
          onToggle={onToggle}
          forceExpand={forceExpand}
          canManage={canManage}
          busyId={busyId}
          onAddChild={onAddChild}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
