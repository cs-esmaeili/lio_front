import type { AdminCategory } from '@/typescript/schemas/category.schema';

/** A category plus its resolved children and depth, ready to render as a tree. */
export interface CategoryTreeNode extends AdminCategory {
  depth: number;
  children: CategoryTreeNode[];
}

/** Build a top-down tree from the flat API list, ordered by id. */
export function buildCategoryTree(categories: AdminCategory[]): CategoryTreeNode[] {
  const nodes = new Map<number, CategoryTreeNode>();
  for (const category of categories) {
    nodes.set(category.id, { ...category, depth: 0, children: [] });
  }

  const roots: CategoryTreeNode[] = [];
  for (const node of nodes.values()) {
    const parent = node.parentId !== null ? nodes.get(node.parentId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }

  const assignDepth = (list: CategoryTreeNode[], depth: number) => {
    for (const node of list) {
      node.depth = depth;
      assignDepth(node.children, depth + 1);
    }
  };
  assignDepth(roots, 0);

  const sortLevel = (list: CategoryTreeNode[]) => {
    list.sort((a, b) => a.id - b.id);
    list.forEach((node) => sortLevel(node.children));
  };
  sortLevel(roots);

  return roots;
}

/** Every descendant id of `id` (excluding `id`) — used to block invalid parents. */
export function getDescendantIds(categories: AdminCategory[], id: number): number[] {
  const childrenByParent = new Map<number, number[]>();
  for (const category of categories) {
    if (category.parentId === null) continue;
    const children = childrenByParent.get(category.parentId) ?? [];
    children.push(category.id);
    childrenByParent.set(category.parentId, children);
  }

  const ids: number[] = [];
  const stack = [...(childrenByParent.get(id) ?? [])];
  while (stack.length) {
    const current = stack.pop()!;
    ids.push(current);
    stack.push(...(childrenByParent.get(current) ?? []));
  }
  return ids;
}

/** Root → category chain (inclusive), following `parentId`. */
export function getCategoryPath(categories: AdminCategory[], id: number): AdminCategory[] {
  const byId = new Map(categories.map((category) => [category.id, category]));
  const path: AdminCategory[] = [];
  const seen = new Set<number>();

  let current = byId.get(id);
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    path.unshift(current);
    current = current.parentId !== null ? byId.get(current.parentId) : undefined;
  }

  return path;
}

/** Human-readable path label for a category (e.g. `پوشاک / مردانه / پیراهن`). */
export function getCategoryPathLabel(categories: AdminCategory[], id: number, separator = ' / '): string {
  return getCategoryPath(categories, id)
    .map((category) => category.name)
    .join(separator);
}

/**
 * Keep only nodes that match `term` (name or slug) or that have a matching
 * descendant; ancestors of a match are preserved so the tree stays navigable.
 */
export function filterCategoryTree(tree: CategoryTreeNode[], term: string): CategoryTreeNode[] {
  const needle = term.trim().toLowerCase();
  if (!needle) return tree;

  const prune = (nodes: CategoryTreeNode[]): CategoryTreeNode[] =>
    nodes.flatMap((node) => {
      const children = prune(node.children);
      const matches = node.name.toLowerCase().includes(needle) || node.slug.toLowerCase().includes(needle);
      if (!matches && children.length === 0) return [];
      return [{ ...node, children }];
    });

  return prune(tree);
}

/** Turn a (latin) name into a URL-safe slug; returns `''` for non-latin input. */
export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
