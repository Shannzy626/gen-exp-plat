import { create } from "zustand";

export type ZoneId = "header" | "main" | "footer";

interface BuilderState {
  selectedZone: ZoneId;
  zones: Record<ZoneId, string[]>;
  selectZone: (zone: ZoneId) => void;
  addComponentToZone: (zone: ZoneId, snippet: string) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  selectedZone: "main",
  zones: { header: [], main: [], footer: [] },
  selectZone: (zone) => set({ selectedZone: zone }),
  addComponentToZone: (zone, snippet) =>
    set((state) => ({
      zones: { ...state.zones, [zone]: [...state.zones[zone], snippet] },
    })),
}));

