import { atom } from "recoil";

export const savedMovesAtom = atom({
  key: "saved_moves",
  default: [],
});
