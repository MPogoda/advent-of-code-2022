console.time("parser");
const filename = "input";
// const filename = "testinput";

const rawData = require("fs").readFileSync(filename, "UTF-8").split("\n");
rawData.pop();

const initElves = new Set();

function hash(x, y) {
  return ((y + 256) << 16) | (x + 256);
}
function unhash(raw) {
  return [(raw & 0xffff) - 256, (raw >> 16) - 256];
}

rawData.map((line, y) =>
  line.split("").map((v, x) => v === "#" && initElves.add(hash(x, y)))
);

console.timeEnd("parser");

const DIRECTIONS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
  [-1, -1],
];
const CHECKS = [
  {
    check: [-1, 0, 1].map((dx) => hash(dx, -1)),
    dxy: [0, -1],
  },
  {
    check: [-1, 0, 1].map((dx) => hash(dx, 1)),
    dxy: [0, 1],
  },
  {
    check: [-1, 0, 1].map((dy) => hash(-1, dy)),
    dxy: [-1, 0],
  },
  {
    check: [-1, 0, 1].map((dy) => hash(1, dy)),
    dxy: [1, 0],
  },
];

function process(elves, k) {
  const proposals = new Map();
  const destinations = new Map();

  for (const e of elves) {
    const [x, y] = unhash(e);
    const adj = new Set();
    for (const [dx, dy] of DIRECTIONS) {
      if (elves.has(hash(x + dx, y + dy))) {
        adj.add(hash(dx, dy));
      }
    }

    if (!adj.size) {
      continue;
    }
    for (let i = 0; i < 4; ++i) {
      const { check, dxy } = CHECKS[(k + i) % 4];
      if (check.every((v) => !adj.has(v))) {
        const [dx, dy] = dxy;
        const newXY = hash(x + dx, y + dy);
        proposals.set(newXY, 1 + (proposals.get(newXY) || 0));
        destinations.set(e, newXY);
        break;
      }
    }
  }

  const newElves = new Set();
  let moved = false;
  for (const e of elves) {
    const newE = destinations.get(e);
    if (proposals.get(newE) === 1) {
      moved = true;
      newElves.add(newE);
    } else {
      newElves.add(e);
    }
  }

  return { newElves, moved };
}

console.time("Part 1");
(() => {
  let elves = initElves;
  for (let k = 0; k < 10; ++k) {
    const { newElves } = process(elves, k);
    elves = newElves;
  }

  let [minX, maxX, minY, maxY] = Array(4).fill(4);
  for (const e of elves) {
    const [x, y] = unhash(e);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  console.info(
    (1 + Math.abs(maxY - minY)) * (1 + Math.abs(maxX - minX)) - elves.size
  );
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  let elves = initElves;
  for (let k = 0; ; ++k) {
    const { newElves, moved } = process(elves, k);
    elves = newElves;
    if (!moved) {
      console.info(k + 1);
      return;
    }
  }
})();
console.timeEnd("Part 2");
