const handleMove = (move, ctx) => {
  const { options, path } = move;
  const tempCtx = ctx;
  if (tempCtx) {
    tempCtx.lineWidth = options.lineWidth;
    tempCtx.strokeStyle = options.lineColor;

    tempCtx.beginPath();
    path.forEach(([x, y]) => {
      tempCtx.lineTo(x, y);
    });
    tempCtx.stroke();
    tempCtx.closePath();
  }
};

const drawonUndo = (ctx, savedMoves, users) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  Object.values(users).forEach((user) => {
    user.forEach((move) => handleMove(move, ctx));
  });

  savedMoves.forEach((move) => {
    handleMove(move, ctx);
  });
};
export { handleMove, drawonUndo };
