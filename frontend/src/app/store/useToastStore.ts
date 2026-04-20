import { create } from "zustand";

type ToastType = "success" | "error" | "info";

export type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastState = {
  toasts: ToastItem[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: number) => void;
};

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (message, type = "info") => {
    const id = Date.now();
    set({ toasts: [...get().toasts, { id, message, type }] });

    setTimeout(() => {
      get().removeToast(id);
    }, 2500);
  },

  removeToast: (id) => {
    set({ toasts: get().toasts.filter((toast) => toast.id !== id) });
  },
}));