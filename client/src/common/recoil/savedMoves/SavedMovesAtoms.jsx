import { atom } from "recoil";

export const savedMovesAtom = atom({
  key: "savedMoves",
  default: [],
});
