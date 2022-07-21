// 度 -> ラジアン
export const toRadian = (deg) => {
  return deg * (Math.PI / 180)
}

// start - endの範囲でスクロール量を0から1の数値にする
export const scalePercent = (scrollPercent, start, end) => {
  return (scrollPercent - start) / (end - start)
}

// 線形補間
// a: 0 - 1
// x: start
// y: end
export const linear = (x, y, a) => {
  return (1 - a) * x + a * y
}

// 3次関数補間
export const easeInOut = (x, y, a) => {
  return (y - x) * a * a * (3 - 2 * a) + x
}
