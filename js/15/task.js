console.time("parser");
const filename = "input";
// const filename = "testinput";

const rawData = require("fs").readFileSync(filename, "UTF-8").split("\n");
rawData.pop();

const data = rawData.map((line) => {
  const [sx, sy, bx, by] = /^.*x=(.*), y=(.*):.*x=(.*), y=(.*)$/
    .exec(line)
    .slice(1)
    .map(Number);
  return { sx, sy, bx, by };
});
console.timeEnd("parser");

console.time("Part 1");
(() => {
  const Y = 2_000_000;
  // const Y = 10;
  const scan = [];
  for (const { sx, sy, bx, by } of data) {
    const dist = Math.abs(sx - bx) + Math.abs(sy - by);
    const left = dist - Math.abs(Y - sy);
    if (left >= 0) {
      scan.push([sx - left, true]);
      scan.push([sx + left + 1, false]);
    }
  }

  scan.sort(([a], [b]) => a - b);

  let ans = -1;
  let count = 0;
  let last;
  for (const [x, isStart] of scan) {
    if (count > 0) {
      ans += x - last;
    }
    count += isStart ? +1 : -1;
    last = x;
  }

  console.info(ans);
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  function valid(x, y) {
    for (const { sx, sy, bx, by } of data) {
      const dist1 = Math.abs(sx - bx) + Math.abs(sy - by);
      const dist2 = Math.abs(sx - x) + Math.abs(sy - y);
      if (dist2 <= dist1) {
        return false;
      }
    }
    return true;
  }

  const MAX_XY = 4_000_000;
  for (const { sx, sy, bx, by } of data) {
    const dist = Math.abs(sx - bx) + Math.abs(sy - by);
    for (const [xx, yy] of [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ]) {
      for (let dx = 0; dx <= dist + 1; ++dx) {
        const dy = dist + 1 - dx;
        const x = sx + dx * xx;
        const y = sy + dy * yy;
        if (x < 0 || y < 0 || x > MAX_XY || y > MAX_XY) {
          break;
        }
        if (valid(x, y)) {
          console.info(x * 4_000_000 + y);
          return;
        }
      }
    }
  }
})();
console.timeEnd("Part 2");
