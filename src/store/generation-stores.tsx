import { create } from "zustand";

type GenerationStore = {
  isComplete: boolean;
  setIsComplete: (value: boolean) => void;
};

export const useGenerationStore = create<GenerationStore>((set) => ({
  isComplete: false,

  setIsComplete: (value) =>
    set({ isComplete: value }),
}));