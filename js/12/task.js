console.time("parser");
const filename = "input";
// const filename = "testinput";

const rawData = require("fs")
  .readFileSync(filename, "UTF-8")
  .split("\n")
  .slice(0, -1)
  .map((l) => l.split(""));

const H = rawData.length;
const W = rawData[0].length;

let S;
let E;
for (let i = 0; i < H; ++i) {
  for (let j = 0; j < W; ++j) {
    if (rawData[i][j] === "S") {
      S = [i, j];
      rawData[i][j] = "a";
    }
    if (rawData[i][j] === "E") {
      E = [i, j];
      rawData[i][j] = "z";
    }
  }
}

console.timeEnd("parser");

function getNeighbours(v) {
  const [v0, v1] = v;
  return [
    [v0 + 0, v1 + 1],
    [v0 + 0, v1 - 1],
    [v0 + 1, v1 + 0],
    [v0 - 1, v1 + 0],
  ].filter(([a, b]) => a >= 0 && b >= 0 && a < H && b < W);
}
function bfs(start) {
  const queue = [[start, 0]];
  const visited = new Set([start.join(":")]);
  while (queue.length) {
    const [v, len] = queue.shift();
    if (v.join(":") === E.join(":")) {
      return len;
    }
    const dv = rawData[v[0]][v[1]].charCodeAt(0);
    for (const [vy, vx] of getNeighbours(v)) {
      const dvv = rawData[vy][vx].charCodeAt(0);
      if (dvv <= dv + 1) {
        if (!visited.has([vy, vx].join(":"))) {
          queue.push([[vy, vx], len + 1]);
          visited.add([vy, vx].join(":"));
        }
      }
    }
  }
  return Infinity;
}
console.time("Part 1");
(() => {
  console.info(bfs(S));
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  let m = Infinity;
  for (let i = 0; i < H; ++i) {
    for (let j = 0; j < W; ++j) {
      if (rawData[i][j] === "a") {
        m = Math.min(m, bfs([i, j]));
      }
    }
  }
  console.info(m);
})();
console.timeEnd("Part 2");
