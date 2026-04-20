import { create } from "zustand";

type SavedVacanciesState = {
  savedIds: number[];
  toggleSaved: (id: number) => void;
  isSaved: (id: number) => boolean;
  clearSaved: () => void;
};

const getInitialSavedIds = (): number[] => {
  try {
    const raw = localStorage.getItem("saved_vacancies");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const useSavedVacanciesStore = create<SavedVacanciesState>((set, get) => ({
  savedIds: getInitialSavedIds(),

  toggleSaved: (id) => {
    const current = get().savedIds;
    const next = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];

    localStorage.setItem("saved_vacancies", JSON.stringify(next));
    set({ savedIds: next });
  },

  isSaved: (id) => {
    return get().savedIds.includes(id);
  },

  clearSaved: () => {
    localStorage.removeItem("saved_vacancies");
    set({ savedIds: [] });
  },
}));