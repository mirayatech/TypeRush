import { create } from "zustand";
import { persist } from "zustand/middleware";

type TypeRushState = {
  points: number;
  earnedPoints: number;
  setPoints: (points: number) => void;
  setEarnedPoints: (earnedPoints: number) => void;
};

export const useTypeRushStore = create<TypeRushState>()(
  persist(
    (set) => ({
      points: 100,
      earnedPoints: 0,
      setPoints: (points) => set(() => ({ points })),
      setEarnedPoints: (earnedPoints) => set(() => ({ earnedPoints })),
    }),
    {
      name: "game-store",
    }
  )
);
