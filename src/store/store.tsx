import { create } from "zustand";

export const useStore = create((set) => ({
  selectedLanguage: "en",
  setSelectedLanguage: (language: string) =>
    set({ selectedLanguage: language }),
}));
