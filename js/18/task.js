console.time("parser");
const filename = "input";
// const filename = "testinput";

const rawData = require("fs").readFileSync(filename, "UTF-8").split("\n");
rawData.pop();
console.timeEnd("parser");

function getCube(line) {
  return line.split(",").map(Number);
}
function* getNeighbours([x, y, z]) {
  yield [x + 1, y, z];
  yield [x - 1, y, z];
  yield [x, y + 1, z];
  yield [x, y - 1, z];
  yield [x, y, z + 1];
  yield [x, y, z - 1];
}

function calculate(cubes) {
  let ans = 0;
  for (const line of cubes) {
    const cube = getCube(line);
    for (const n of getNeighbours(cube)) {
      if (!cubes.has(n.join(","))) {
        ++ans;
      }
    }
  }
  return ans;
}

console.time("Part 1");
(() => {
  console.info(calculate(new Set(rawData)));
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  const [min, max] = rawData.reduce(
    ([accMin, accMax], l) => {
      const cube = getCube(l);
      for (let i = 0; i < 3; ++i) {
        accMin[i] = Math.min(accMin[i], cube[i] - 1);
        accMax[i] = Math.max(accMax[i], cube[i] + 1);
      }
      return [accMin, accMax];
    },
    [Array(3).fill(Infinity), Array(3).fill(-Infinity)]
  );

  const visited = new Set(rawData);
  const outside = new Set();
  const queue = [min.join(",")];

  while (queue.length) {
    const current = queue.shift();
    outside.add(current);
    const cube = getCube(current);
    for (const n of getNeighbours(cube)) {
      if (n.some((v, i) => v < min[i] || v > max[i])) {
        continue;
      }
      const key = n.join(",");
      if (visited.has(key)) {
        continue;
      }
      visited.add(key);
      queue.push(key);
    }
  }

  const diff = new Set();
  for (let x = min[0]; x <= max[0]; ++x) {
    for (let y = min[1]; y <= max[1]; ++y) {
      for (let z = min[2]; z <= max[2]; ++z) {
        const key = [x, y, z].join(",");
        if (!outside.has(key)) {
          diff.add(key);
        }
      }
    }
  }

  console.info(calculate(diff));
})();
console.timeEnd("Part 2");
