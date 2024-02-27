import { useRecoilValue, useSetRecoilState } from "recoil";
import { savedMovesAtom } from "./savedMovesAtoms";

export const useSetSavedMoves = () => {
  const setSavedMoves = useSetRecoilState(savedMovesAtom);

  const addSavedMove = (move) => {
    setSavedMoves((prev) => [move, ...prev]);
  };

  const removeSavedMove = () => {
    let move;
    setSavedMoves((prev) => {
      move = prev.at(0);

      return prev.slice(1);
    });

    return move;
  };

  const clearSavedMoves = () => {
    setSavedMoves([]);
  };

  return {
    addSavedMove,
    removeSavedMove,
    clearSavedMoves,
  };
};

export const useSavedMoves = () => {
  const savedMoves = useRecoilValue(savedMovesAtom);

  return savedMoves;
};
