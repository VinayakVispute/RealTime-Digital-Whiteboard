import { atom } from "recoil";

export const backgroundAtom = atom({
  key: "bg",
  default: {
    mode: "light",
    lines: true,
  },
});
