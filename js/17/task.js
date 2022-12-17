console.time("parser");
const filename = "input";
// const filename = "testinput";

const [rawData] = require("fs").readFileSync(filename, "UTF-8").split("\n");
console.timeEnd("parser");

const pieces = [
  [
    [30, 0], // 0011110
  ],

  [
    [8, 2], //  0001000
    [28, 1], // 0011100
    [8, 0], //  0001000
  ],

  [
    [4, 2], //  0000100
    [4, 1], //  0000100
    [28, 0], // 0011100
  ],

  [
    [16, 3], // 0010000
    [16, 2], // 0010000
    [16, 1], // 0010000
    [16, 0], // 0010000
  ],

  [
    [24, 1], // 0011000
    [24, 0], // 0011000
  ],
];

function getPiece(t, y) {
  return pieces[t % 5].map(([x, yy]) => [x, yy + y]);
}

const W = 7;
const MAX_X = 1 << (W - 1);
function moveH(i, piece) {
  const direction = rawData[i];
  if (direction === "<") {
    if (piece.some(([x]) => x & MAX_X)) {
      return piece;
    }
    return piece.map(([x, y]) => [x << 1, y]);
  }
  if (piece.some(([x]) => x & 1)) {
    return piece;
  }
  return piece.map(([x, y]) => [x >> 1, y]);
}

function moveV(piece, direction) {
  return piece.map(([x, y]) => [x, y + direction]);
}

function hasIntersection(grid, piece) {
  for (const [x, y] of piece) {
    if (grid[y] & x) {
      return true;
    }
  }
  return false;
}

function moveUntilSettled(i, grid, piece) {
  let movedH = moveH(i, piece);
  if (hasIntersection(grid, movedH)) {
    movedH = piece;
  }
  let movedV = moveV(movedH, -1);
  if (hasIntersection(grid, movedV)) {
    return [(i + 1) % rawData.length, movedH];
  }
  return moveUntilSettled((i + 1) % rawData.length, grid, movedV);
}

function show(grid) {
  for (const x of grid) {
    console.debug(("0000000" + x.toString(2)).slice(-W).replace(/0/g, " "));
  }
  console.debug();
}

console.time("Part 1");
(() => {
  const grid = [];
  grid[0] = (1 << W) - 1;
  let top = 0;
  let i = 0;
  for (let t = 0; t < 2022; ++t) {
    const [nextI, piece] = moveUntilSettled(i, grid, getPiece(t, top + 4));
    for (const [x, y] of piece) {
      grid[y] |= x;
    }
    top = Math.max(top, ...piece.map(([, y]) => y));
    i = nextI;
  }

  console.info(top);
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  const grid = [];
  grid[0] = (1 << W) - 1;

  let added = 0;
  let top = 0;
  let i = 0;

  function getKey(t) {
    return [t % 5, i]
      .concat(
        Array(30)
          .fill(0)
          .map((_, y) => grid[top - y] ?? 0)
      )
      .join(":");
  }

  const visited = new Map();

  const L = 1_000_000_000_000;
  for (let t = 0; t < L; ++t) {
    const [nextI, piece] = moveUntilSettled(i, grid, getPiece(t, top + 4));
    for (const [x, y] of piece) {
      grid[y] |= x;
    }
    top = Math.max(top, ...piece.map(([, y]) => y));

    i = nextI;
    const key = getKey(t);
    if (visited.has(key)) {
      const [oldT, oldTop] = visited.get(key);
      const dTop = top - oldTop;
      const dT = t - oldT;
      const ffT = Math.floor((L - t) / dT);
      added += ffT * dTop;
      t += ffT * dT;
    }
    visited.set(key, [t, top]);
  }

  console.info(top + added);
})();
console.timeEnd("Part 2");
