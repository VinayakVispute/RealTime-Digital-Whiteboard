import { useEffect, useState } from "react";
import useRefs from "../../modules/rooms/hooks/useRefs";

export const useCtx = () => {
  const { canvasRef } = useRefs();

  const [ctx, setCtx] = useState();

  useEffect(() => {
    const newCtx = canvasRef.current?.getContext("2d");

    if (newCtx) {
      newCtx.lineCap = "round";
      newCtx.lineJoin = "round";
      setCtx(newCtx);
    }
  }, [canvasRef]);

  return ctx;
};
