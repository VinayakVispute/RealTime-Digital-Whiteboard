import { CANVAS_SIZE } from "../../../common/constants/canvasSize";

const handleMove = (move, ctx) => {
  const { options, path } = move;
  ctx.lineWidth = options.lineWidth;
  ctx.strokeStyle = options.lineColor;

  ctx.beginPath();
  path.forEach(([x, y]) => {
    ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.closePath();
};

export const drawBackground = (ctx) => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#ccc";
  for (let i = 0; i < CANVAS_SIZE.height; i += 25) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(CANVAS_SIZE.width, i);
    ctx.stroke();
  }

  for (let i = 0; i < CANVAS_SIZE.width; i += 25) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, CANVAS_SIZE.height);
    ctx.stroke();
  }
};

const drawAllMoves = (ctx, room) => {
  const { movesWithoutUser, usersMoves, myMoves } = room;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawBackground(ctx);
  movesWithoutUser.forEach((move) => handleMove(move, ctx));

  usersMoves.forEach((userMoves) => {
    userMoves.forEach((move) => handleMove(move, ctx));
  });

  myMoves.forEach((move) => handleMove(move, ctx));
};

export { handleMove, drawAllMoves };
