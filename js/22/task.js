console.time("parser");
const filename = "input";
// const filename = "testinput";

const [rawField, rawPath] = require("fs")
  .readFileSync(filename, "UTF-8")
  .split("\n\n");

const field = rawField.split("\n").map((l) => l.split(""));
const H = field.length;
const W = field.reduce((acc, l) => Math.max(acc, l.length), 0);

const [path] = rawPath.split("\n");

console.timeEnd("parser");

function* getCommand() {
  for (const v of path
    .replaceAll("L", " L ")
    .replaceAll("R", " R ")
    .split(" ")) {
    if (v === "L" || v === "R") {
      yield v;
    } else {
      yield Number(v);
    }
  }
}

const DIRS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

console.time("Part 1");
(() => {
  function executeCommand(state, command) {
    let { x, y, direction } = state;
    if (command === "L" || command === "R") {
      direction = (direction + 4 + (command === "L" ? -1 : 1)) % 4;
      return { x, y, direction };
    }
    const [dx, dy] = DIRS[direction];
    for (let i = 0; i < command; ++i) {
      let [newX, newY] = [x, y];

      do {
        newX = (newX + dx + W) % W;
        newY = (newY + dy + H) % H;
      } while ((field[newY][newX] ?? " ") === " ");

      if (field[newY][newX] === ".") {
        x = newX;
        y = newY;
      } else if (field[newY][newX] === "#") {
        break;
      } else {
        console.assert(false, { a: field[newY][newX], newY, newX });
      }
    }
    return { x, y, direction };
  }

  let state = { x: field[0].indexOf("."), y: 0, direction: 0 };
  for (const command of getCommand()) {
    state = executeCommand(state, command);
  }

  console.info(1000 * (state.y + 1) + 4 * (state.x + 1) + state.direction);
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  const SIZE = Math.sqrt(
    field.reduce(
      (acc, line) => line.reduce((acc2, x) => acc2 + (x !== " " ? 1 : 0), acc),
      0
    ) / 6
  );

  const unmatchedSides = [];
  for (let i = 0; i < H / SIZE; ++i) {
    for (let j = 0; j < W / SIZE; ++j) {
      if ((field[i * SIZE]?.[j * SIZE] ?? " ") !== " ") {
        unmatchedSides.push("" + [i, j]);
      }
    }
  }

  const reverseMapping = new Map();
  const queue = [
    [
      unmatchedSides.shift().split(",").map(Number),
      [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
    ],
  ];

  function mult(m1, m2) {
    return m1.map((row, i) =>
      m2[0].map((_, j) =>
        row.reduce((acc, _, k) => acc + m1[i][k] * m2[k][j], 0)
      )
    );
  }

  // same as DIR
  const ROT = [
    [
      [0, 0, -1],
      [0, 1, 0],
      [1, 0, 0],
    ],
    [
      [1, 0, 0],
      [0, 0, -1],
      [0, 1, 0],
    ],
    [
      [0, 0, 1],
      [0, 1, 0],
      [-1, 0, 0],
    ],
    [
      [1, 0, 0],
      [0, 0, 1],
      [0, -1, 0],
    ],
  ];

  while (queue.length) {
    const [[i, j], m] = queue.shift();
    for (let y = 0; y < SIZE; ++y) {
      const realY = i * SIZE + y;
      for (let x = 0; x < SIZE; ++x) {
        const realX = j * SIZE + x;

        console.assert(field[realY][realX] !== " ");

        const p = mult(m, [
          [(x + 0.5) / SIZE - 0.5],
          [(y + 0.5) / SIZE - 0.5],
          [-0.5 / SIZE - 0.5],
        ]);

        for (let k = 0; k < 3; ++k) {
          p[k] = Math.round((p[k][0] + 0.5) * SIZE - 0.5);
        }

        console.assert(!reverseMapping.has("" + p));
        reverseMapping.set("" + p, [realX, realY]);
      }

      for (const dir in Array(4).fill(0)) {
        const next = [i + DIRS[dir][1], j + DIRS[dir][0]];
        if (unmatchedSides.includes("" + next)) {
          queue.push([next, mult(m, ROT[dir])]);
          unmatchedSides.splice(
            unmatchedSides.findIndex((x) => x === "" + next),
            1
          );
        }
      }
    }
  }

  console.assert(!unmatchedSides.length);

  let pos = [0, 0, -1];
  let dir = [1, 0, 0];
  let idv = [0, 0, -1];

  function cross([a1, a2, a3], [b1, b2, b3]) {
    return [a2 * b3 - a3 * b2, a3 * b1 - a1 * b3, a1 * b2 - a2 * b1];
  }
  function negate(v) {
    return v.map((x) => -x);
  }
  function add(a, b) {
    return a.map((_, i) => a[i] + b[i]);
  }

  for (const command of getCommand()) {
    if (command === "L" || command === "R") {
      dir = cross(dir, command === "L" ? negate(idv) : idv);
      continue;
    }
    for (let k = 0; k < command; ++k) {
      let nextPos = add(pos, dir);
      let nextDir = dir;
      let nextIdv = idv;

      if (!reverseMapping.has("" + nextPos)) {
        nextDir = negate(idv);
        nextIdv = dir;
        nextPos = add(nextPos, nextDir);
      }

      const [x, y] = reverseMapping.get("" + nextPos);
      if (field[y][x] === "#") {
        break;
      }
      pos = nextPos;
      dir = nextDir;
      idv = nextIdv;
    }
  }

  function figureDirection() {
    let dirV;
    if (reverseMapping.has("" + add(pos, dir))) {
      dirV = add(reverseMapping.get("" + add(pos, dir)), negate([x, y]));
    } else {
      dirV = add(
        [x, y],
        negate(reverseMapping.get("" + add(pos, negate(dir))))
      );
    }
    return DIRS.findIndex((v) => "" + v === "" + dirV);
  }
  const [x, y] = reverseMapping.get("" + pos);
  const d = figureDirection();

  console.info(1000 * (y + 1) + 4 * (x + 1) + d);
})();
console.timeEnd("Part 2");
