import { createStore } from 'zustand/vanilla';
import type { AdminCategory } from '@/typescript/schemas/category.schema';

export type CategoryLoadStatus = 'idle' | 'loading' | 'ready' | 'error';

interface CategoryState {
  /** Flat list as returned by the API, ordered by id. */
  categories: AdminCategory[];
  status: CategoryLoadStatus;
  error: string | null;

  setLoading: () => void;
  setCategories: (categories: AdminCategory[]) => void;
  setError: (message: string) => void;
  /** Insert or replace a single category (after create/update). */
  upsertCategory: (category: AdminCategory) => void;
  /** Remove categories by id (after delete). */
  removeCategories: (ids: number[]) => void;
  reset: () => void;
}

function sortById(categories: AdminCategory[]): AdminCategory[] {
  return [...categories].sort((a, b) => a.id - b.id);
}

/**
 * Shared cache of the category tree. The admin page and the reusable
 * `CategoryPickerDialog` both read from here, so the list is fetched once and
 * every consumer stays in sync after a mutation. `useCategoryList` owns the
 * fetching; mutations update the store directly through the helpers below.
 */
export const categoryStore = createStore<CategoryState>()((set) => ({
  categories: [],
  status: 'idle',
  error: null,

  setLoading: () => set({ status: 'loading', error: null }),
  setCategories: (categories) => set({ categories: sortById(categories), status: 'ready', error: null }),
  setError: (message) => set({ status: 'error', error: message }),

  upsertCategory: (category) =>
    set((state) => {
      const exists = state.categories.some((item) => item.id === category.id);
      const next = exists
        ? state.categories.map((item) => (item.id === category.id ? category : item))
        : [...state.categories, category];

      return { categories: sortById(next) };
    }),

  removeCategories: (ids) =>
    set((state) => {
      const idSet = new Set(ids);
      return { categories: state.categories.filter((item) => !idSet.has(item.id)) };
    }),

  reset: () => set({ categories: [], status: 'idle', error: null }),
}));
