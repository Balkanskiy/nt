import { create } from "zustand";

export const useStore = create((set) => ({
  selectedLanguage: "",
  setSelectedLanguage: (language: string) =>
    set({ selectedLanguage: language }),
  step: 0,
  setStep: () => set((state: any) => ({ step: state.step + 1 })),
  prompt: "",
  setPrompt: (prompt: string) => set({ prompt }),
}));
