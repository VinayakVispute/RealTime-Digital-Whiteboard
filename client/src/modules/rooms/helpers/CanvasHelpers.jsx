const handleMove = (move, ctx) => {
  const { options, path } = move;
  ctx.lineWidth = options.lineWidth;
  ctx.strokeStyle = options.lineColor;
  if (move.erase) ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  path.forEach(([x, y]) => {
    ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.closePath();
  ctx.globalCompositeOperation = "source-over";
};

const drawAllMoves = (ctx, room) => {
  const { movesWithoutUser, usersMoves, myMoves } = room;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const moves = [...movesWithoutUser, ...myMoves];

  usersMoves.forEach((userMoves) => {
    moves.push(...userMoves);
  });
  moves.sort((a, b) => a.timestamp - b.timestamp);

  moves.forEach((move) => {
    handleMove(move, ctx);
  });
};

export { handleMove, drawAllMoves };
