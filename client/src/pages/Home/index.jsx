import { useEffect, useRef, useState } from "react";
import { useDraw } from "../../common/hooks/drawing";
import { socket } from "../../common/lib/socket";
const Home = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef();

  const [size, setSize] = useState({ width: 0, heigth: 0 });
  const [options, setOptions] = useState({
    lineColor: "#000",
    lineWidth: 5,
  });

  const { handleStartDrawing, handleEndDrawing, handleDraw, drawing } = useDraw(
    options,
    ctxRef.current
  );

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const drawFromSocket = (socketMoves, socketOptions) => {
    const tempCtx = ctxRef.current;
    if (tempCtx) {
      tempCtx.lineWidth = socketOptions.lineWidth;
      tempCtx.strokeStyle = socketOptions.lineColor;

      tempCtx.beginPath();
      socketMoves.forEach(([x, y]) => {
        tempCtx.lineTo(x, y);
        tempCtx.stoke();
      });
      tempCtx.closePath();
    }
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctxRef.current = ctx;
      }
    }
  }, [options.lineColor, options.lineWidth]);

  useEffect(() => {
    let movesToDrawLeter = [];
    let optionsToUseLater = {
      lineColor: "",
      lineWidth: 0,
    };
    socket.on("socket_draw", (movesToDraw, socketOptions) => {
      if (ctxRef.current && !drawing) {
        drawFromSocket(movesToDraw, socketOptions);
      } else {
        movesToDrawLeter = movesToDraw;
        optionsToUseLater = socketOptions;
      }
    });
    return () => {
      socket.off("socket_draw");
      if (movesToDrawLeter.length) {
        drawFromSocket(movesToDrawLeter, optionsToUseLater);
      }
    };
  }, [drawing]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <button
        className="absolute bg-black text-white"
        onClick={() =>
          setOptions({
            lineColor: "blue",
            lineWidth: 5,
          })
        }
      >
        Blue
      </button>
      <canvas
        className="h-full w-full"
        ref={canvasRef}
        onMouseDown={(e) => handleStartDrawing(e.clientX, e.clientY)}
        onMouseUp={handleEndDrawing}
        onMouseMoveCapture={(e) => handleDraw(e.clientX, e.clientY)}
        onTouchStart={(e) =>
          handleStartDrawing(
            e.changedTouches[0].clientX,
            e.changedTouches[0].clientY
          )
        }
        onTouchEnd={(e) => handleEndDrawing()}
        onTouchMove={(e) =>
          handleDraw(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
        }
        width={size.width}
        height={size.height}
      />
    </div>
  );
};

export default Home;
