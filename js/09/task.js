console.time("parser");
const filename = "input";
// const filename = "testinput";

const rawData = require("fs").readFileSync(filename, "UTF-8").split("\n");
rawData.pop();

console.timeEnd("parser");

function snap(h, t) {
  if (h[1] === t[1] && Math.abs(h[0] - t[0]) > 1) {
    t[0] += h[0] > t[0] ? 1 : -1;
    return true;
  }
  if (h[0] === t[0] && Math.abs(h[1] - t[1]) > 1) {
    t[1] += h[1] > t[1] ? 1 : -1;
    return true;
  }
  if (Math.abs(h[1] - t[1]) > 1 || Math.abs(h[0] - t[0]) > 1) {
    t[0] += h[0] > t[0] ? 1 : -1;
    t[1] += h[1] > t[1] ? 1 : -1;
    return true;
  }
  return false;
}

console.time("Part 1");
(() => {
  const tailPositions = new Set(["0:0"]);
  const h = [0, 0];
  const t = [0, 0];

  for (const m of rawData) {
    const [dir, count] = m.split(" ");
    const dirMove = {
      R: [1, 0],
      U: [0, 1],
      L: [-1, 0],
      D: [0, -1],
    }[dir];

    for (let i = 0; i < Number(count); ++i) {
      h[0] += dirMove[0];
      h[1] += dirMove[1];

      if (snap(h, t)) {
        tailPositions.add(t.join(":"));
      }
    }
  }
  console.debug(tailPositions.size);
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  const rope = Array(10)
    .fill(0)
    .map(() => [0, 0]);
  const tailPositions = new Set(["0:0"]);

  for (const m of rawData) {
    const [dir, count] = m.split(" ");
    const dirMove = {
      R: [1, 0],
      U: [0, 1],
      L: [-1, 0],
      D: [0, -1],
    }[dir];

    for (let i = 0; i < Number(count); ++i) {
      rope[0][0] += dirMove[0];
      rope[0][1] += dirMove[1];

      for (let j = 0; j < rope.length - 1; ++j) {
        if (!snap(rope[j], rope[j + 1])) {
          break;
        }
      }

      tailPositions.add(rope[9].join(":"));
    }
  }
  console.debug(tailPositions.size);
})();
console.timeEnd("Part 2");
