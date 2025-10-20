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
  canPlace: (r: number, c: number, w: number, h: number) => boolean;
  placeItem: (catalog: CatalogItem, r: number, c: number) => void;
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
  canPlace: (r, c, w, h) => {
    const { grid, items } = get();
    if (r < 0 || c < 0) return false;
    if (r + h > grid.rows || c + w > grid.cols) return false;
    const candidate = { r, c, w, h };
    return items.every((it) => !rectanglesOverlap(candidate, it));
  },
  placeItem: (catalog, r, c) =>
    set((state) => {
      const w = catalog.span.w;
      const h = catalog.span.h;
      const ok = (get().canPlace(r, c, w, h));
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
}));

