console.time("parser");
const filename = "input";
// const filename = "testinput";

const grid = require("fs")
  .readFileSync(filename, "UTF-8")
  .split("\n")
  .map((line) => line.split("").map(Number));
grid.pop();

const height = grid.length;
const width = grid[0].length;
console.timeEnd("parser");

console.time("Part 1");
(() => {
  let ans = 2 * (height + width - 2);
  for (let i = 1; i < height - 1; ++i) {
    for (let j = 1; j < width - 1; ++j) {
      const thisTree = grid[i][j];
      let smaller = true;
      for (let k = 0; k < i; ++k) {
        if (thisTree <= grid[k][j]) {
          smaller = false;
          break;
        }
      }
      if (smaller) {
        ++ans;
        continue;
      }
      smaller = true;
      for (let k = i + 1; k < height; ++k) {
        if (thisTree <= grid[k][j]) {
          smaller = false;
          break;
        }
      }
      if (smaller) {
        ++ans;
        continue;
      }

      smaller = true;
      for (let k = 0; k < j; ++k) {
        if (thisTree <= grid[i][k]) {
          smaller = false;
          break;
        }
      }
      if (smaller) {
        ++ans;
        continue;
      }

      smaller = true;
      for (let k = j + 1; k < width; ++k) {
        if (thisTree <= grid[i][k]) {
          smaller = false;
          break;
        }
      }
      if (smaller) {
        ++ans;
        continue;
      }
    }
  }

  console.debug(ans);
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  let ans = 0;
  for (let i = 1; i < height - 1; ++i) {
    for (let j = 1; j < width - 1; ++j) {
      const thisTree = grid[i][j];
      let score = 1;
      let a = 0;

      for (let k = i - 1; k >= 0; --k) {
        ++a;
        if (grid[k][j] >= thisTree) {
          break;
        }
      }
      score *= a;
      a = 0;

      for (let k = i + 1; k < height; ++k) {
        ++a;
        if (grid[k][j] >= thisTree) {
          break;
        }
      }
      score *= a;
      a = 0;

      for (let k = j - 1; k >= 0; --k) {
        ++a;
        if (grid[i][k] >= thisTree) {
          break;
        }
      }
      score *= a;
      a = 0;

      for (let k = j + 1; k < width; ++k) {
        ++a;
        if (grid[i][k] >= thisTree) {
          break;
        }
      }
      score *= a;

      ans = Math.max(ans, score);
    }
  }

  console.debug(ans);
})();
console.timeEnd("Part 2");
