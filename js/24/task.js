console.time("parser");
const filename = "input";
// const filename = "testinput";

const rawData = require("fs").readFileSync(filename, "UTF-8").split("\n");
rawData.pop();

function hash3(x, y, c) {
  return (c << 16) | (y << 8) | x;
}

const DIR_TO_INT = "><^v";

const blizzards = new Set();
const H = rawData.length;
const W = rawData[0].length;
for (let y = 1; y < H - 1; ++y) {
  for (let x = 1; x < W - 1; ++x) {
    const ch = rawData[y][x];
    if (ch !== ".") {
      blizzards.add(hash3(x - 1, y - 1, DIR_TO_INT.indexOf(ch)));
    }
  }
}
console.timeEnd("parser");

function hasBlizzard(t, x, y) {
  --x;
  --y;
  const offsetW = 10000 * (W - 2);
  const offsetH = 10000 * (H - 2);
  return (
    blizzards.has(hash3((x - t + offsetW) % (W - 2), y, 0)) || // >
    blizzards.has(hash3((x + t) % (W - 2), y, 1)) || // <
    blizzards.has(hash3(x, (y + t) % (H - 2), 2)) || // ^
    blizzards.has(hash3(x, (y - t + offsetH) % (H - 2), 3)) // v
  );
}
const DIRS = [
  [1, 0],
  [-1, 0],
  [0, -1],
  [0, 1],
  [0, 0],
];

function bfs([startX, startY], [targetX, targetY], initT = 0) {
  const queue = [[initT, startX, startY]];
  const visited = new Set();

  while (queue.length) {
    const [t, x, y] = queue.shift();

    const k = hash3(x, y, t);
    if (visited.has(k)) {
      continue;
    }
    visited.add(k);

    const nextT = t + 1;
    for (const [dx, dy] of DIRS) {
      const nextX = x + dx;
      const nextY = y + dy;
      if (nextX === targetX && nextY === targetY) {
        return nextT;
      }
      if (
        nextX > 0 &&
        nextX < W - 1 &&
        nextY > 0 &&
        nextY < H - 1 &&
        !hasBlizzard(nextT, nextX, nextY)
      ) {
        queue.push([nextT, nextX, nextY]);
      }
    }
  }
}

const origin = [rawData[0].indexOf("."), 0];
const destination = [
  rawData[rawData.length - 1].indexOf("."),
  rawData.length - 1,
];
console.time("Part 1");
(() => {
  console.info(bfs(origin, destination));
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  const t1 = bfs(origin, destination);
  const t2 = bfs(destination, origin, t1 + 1);
  const t3 = bfs(origin, destination, t2 + 1);

  console.info(t3);
})();
console.timeEnd("Part 2");
