const drawFromSocket = (socketMoves, socketOptions, ctx, afteDraw) => {
  const tempCtx = ctx;
  if (tempCtx) {
    tempCtx.lineWidth = socketOptions.lineWidth;
    tempCtx.strokeStyle = socketOptions.lineColor;

    tempCtx.beginPath();
    socketMoves.forEach(([x, y]) => {
      tempCtx.lineTo(x, y);
      tempCtx.stroke();
    });
    tempCtx.closePath();
    afteDraw();
  }
};

export { drawFromSocket };
