console.time("parser");
const filename = "input";
// const filename = "testinput";

const data = require("fs")
  .readFileSync(filename, "UTF-8")
  .split("\n")
  .slice(0, -1)
  .map((line) => line.split(" -> ").map((pair) => pair.split(",").map(Number)));
console.timeEnd("parser");

const grid = new Set();
let height = 0;
let width = 0;

function key(x, y) {
  return y * 1_000_000 + x;
}

for (const line of data) {
  let prev = line[0];
  for (const cur of line) {
    const [x, y] = cur;
    height = Math.max(height, y);
    width = Math.max(width, x);
    if (x === prev[0]) {
      for (let i = Math.min(y, prev[1]); i <= Math.max(y, prev[1]); ++i) {
        grid.add(key(x, i));
      }
    } else if (y === prev[1]) {
      for (let i = Math.min(x, prev[0]); i <= Math.max(x, prev[0]); ++i) {
        grid.add(key(i, y));
      }
    }
    prev = cur;
  }
}

for (let i = -1000; i <= width + 1000; ++i) {
  grid.add(key(i, height + 2));
}

function pour(g) {
  let [sx, sy] = [500, 0];
  while (true) {
    if (!g.has(key(sx, sy + 1))) {
      sy += 1;
    } else if (!g.has(key(sx - 1, sy + 1))) {
      sy += 1;
      sx -= 1;
    } else if (!g.has(key(sx + 1, sy + 1))) {
      sy += 1;
      sx += 1;
    } else {
      g.add(key(sx, sy));
      return [sx, sy];
    }
  }
}

console.time("Part 1");
(() => {
  const thisGrid = new Set(grid);
  let ans = 0;
  while (true) {
    const [, y] = pour(thisGrid);
    if (y > height) {
      break;
    }
    ++ans;
  }
  console.info(ans);
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  const thisGrid = new Set(grid);
  for (let i = -1000; i <= width + 1000; ++i) {
    thisGrid.add(key(i, height + 2));
  }
  let ans = 0;
  while (true) {
    let [sx, sy] = [500, 0];
    if (thisGrid.has(key(sx, sy))) {
      break;
    }
    pour(thisGrid);
    ++ans;
  }
  console.info(ans);
})();
console.timeEnd("Part 2");
