import { create } from "zustand";
import type { CatalogItem } from "@/lib/snippets";

export interface GridSize { rows: number; cols: number }

export interface PlacedItem {
  id: string; // uuid
  catalogId: string;
  r: number; // top-left row index
  c: number; // top-left col index
  w: number; // span width (cells)
  h: number; // span height (cells)
  html: string;
}

interface BuilderState {
  grid: GridSize;
  items: PlacedItem[];
  setGrid: (rows: number, cols: number) => void;
  canPlace: (r: number, c: number, w: number, h: number, excludeId?: string) => boolean;
  placeItem: (catalog: CatalogItem, r: number, c: number) => void;
  moveItem: (itemId: string, r: number, c: number) => void;
  removeItem: (itemId: string) => void;
  // Dragging/interaction state
  isDragging: boolean;
  dragInfo: { source: "palette" | "item"; id: string; span: { w: number; h: number } } | null;
  setDragging: (dragging: boolean) => void;
  setDragInfo: (info: BuilderState["dragInfo"]) => void;
  clearDragInfo: () => void;
  setGlobalDragging: (isDragging: boolean) => void;
}

function rectanglesOverlap(a: { r: number; c: number; w: number; h: number }, b: { r: number; c: number; w: number; h: number }): boolean {
  const aRight = a.c + a.w - 1;
  const aBottom = a.r + a.h - 1;
  const bRight = b.c + b.w - 1;
  const bBottom = b.r + b.h - 1;
  const noOverlap = aRight < b.c || bRight < a.c || aBottom < b.r || bBottom < a.r;
  return !noOverlap;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  grid: { rows: 4, cols: 4 },
  items: [],
  setGrid: (rows, cols) =>
    set((state) => {
      // Trim items that would be out-of-bounds after resize
      const filtered = state.items.filter((it) => it.r + it.h <= rows && it.c + it.w <= cols);
      return { grid: { rows, cols }, items: filtered };
    }),
  canPlace: (r, c, w, h, excludeId) => {
    const { grid, items } = get();
    if (r < 0 || c < 0) return false;
    if (r + h > grid.rows || c + w > grid.cols) return false;
    const candidate = { r, c, w, h };
    return items.every((it) => (excludeId && it.id === excludeId) ? true : !rectanglesOverlap(candidate, it));
  },
  placeItem: (catalog, r, c) =>
    set((state) => {
      const w = catalog.span.w;
      const h = catalog.span.h;
      const ok = get().canPlace(r, c, w, h);
      if (!ok) return {} as Partial<BuilderState>;
      const newItem: PlacedItem = {
        id: crypto.randomUUID(),
        catalogId: catalog.id,
        r,
        c,
        w,
        h,
        html: catalog.html,
      };
      return { items: [...state.items, newItem] };
    }),
  moveItem: (itemId, r, c) =>
    set((state) => {
      const idx = state.items.findIndex((it) => it.id === itemId);
      if (idx === -1) return {} as Partial<BuilderState>;
      const item = state.items[idx];
      const ok = get().canPlace(r, c, item.w, item.h, itemId);
      if (!ok) return {} as Partial<BuilderState>;
      const updated = [...state.items];
      updated[idx] = { ...item, r, c };
      return { items: updated };
    }),
  removeItem: (itemId) =>
    set((state) => ({ items: state.items.filter((it) => it.id !== itemId) })),
  isDragging: false,
  dragInfo: null,
  setDragging: (dragging) => set({ isDragging: dragging }),
  setDragInfo: (info) => set({ dragInfo: info }),
  clearDragInfo: () => set({ dragInfo: null }),
  setGlobalDragging: (isDragging) => {
    if (typeof document !== 'undefined') {
      if (isDragging) {
        document.body.classList.add('is-dragging');
      } else {
        document.body.classList.remove('is-dragging');
      }
    }
    set({ isDragging });
  },
}));

