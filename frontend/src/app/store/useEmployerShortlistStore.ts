import { create } from "zustand";

type EmployerShortlistState = {
  shortlistedIds: number[];
  toggleShortlist: (id: number) => void;
  isShortlisted: (id: number) => boolean;
};

const getInitialShortlistedIds = (): number[] => {
  try {
    const raw = localStorage.getItem("employer_shortlisted_ids");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const useEmployerShortlistStore = create<EmployerShortlistState>(
  (set, get) => ({
    shortlistedIds: getInitialShortlistedIds(),

    toggleShortlist: (id) => {
      const current = get().shortlistedIds;
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];

      localStorage.setItem("employer_shortlisted_ids", JSON.stringify(next));
      set({ shortlistedIds: next });
    },

    isShortlisted: (id) => {
      return get().shortlistedIds.includes(id);
    },
  })
);