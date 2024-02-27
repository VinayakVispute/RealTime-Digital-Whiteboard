const getWidthAndHeight = (x, y, from, shift) => {
  let width = x - from[0];
  let height = y - from[1];
  if (shift) {
    if (Math.abs(width) > Math.abs(height)) {
      if ((width > 0) & (height < 0) || (width < 0) & (height > 0)) {
        width = -height;
      } else {
        width = height;
      }
    } else if ((height > 0 && width < 0) || (height < 0 && width > 0)) {
      height = -width;
    } else {
      height = width;
    }
  } else {
    width = x - from[0];
    height = y - from[1];
  }

  return { width, height };
};

const drawCircle = (ctx, from, x, y, shift) => {
  ctx.beginPath();

  const { width, height } = getWidthAndHeight(x, y, from, shift);

  const cX = from[0] + width / 2;
  const cY = from[1] + height / 2;
  const radiusX = Math.abs(width / 2);
  const radiusY = Math.abs(height / 2);

  ctx.ellipse(cX, cY, radiusX, radiusY, 0, 0, 2 * Math.PI);

  ctx.stroke();
  ctx.fill();
  ctx.closePath();

  return { cX, cY, radiusX, radiusY };
};

const drawRect = (ctx, from, x, y, shift, fill) => {
  ctx.beginPath();

  const { width, height } = getWidthAndHeight(x, y, from, shift);
  if (fill) {
    ctx.fillRect(from[0], from[1], width, height);
  } else {
    ctx.rect(from[0], from[1], width, height);
  }
  ctx.stroke();
  ctx.fill();
  ctx.closePath();

  return { width, height };
};

const drawLine = (ctx, from, x, y, shift) => {
  if (shift) {
    ctx.beginPath();
    ctx.lineTo(from[0], from[1]);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();

    return;
  }

  ctx.lineTo(x, y);
  ctx.stroke();
};

export { drawCircle, drawRect, drawLine };
