console.time("parser");
const filename = "input";
// const filename = "testinput";

const rawData = require("fs").readFileSync(filename, "UTF-8").split("\n");
rawData.pop();
console.timeEnd("parser");

console.time("Part 1");
(() => {
  let i = 1;
  let ans = 0;
  let x = 1;
  function onCycle() {
    if (i >= 20 && (i - 20) % 40 === 0) {
      ans += i * x;
    }
  }
  for (const line of rawData) {
    onCycle();
    ++i;
    if (line !== "noop") {
      const newX = x + Number(line.split(" ")[1]);
      onCycle();
      x = newX;
      ++i;
    }
  }
  console.debug(ans);
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  const ans = Array(6)
    .fill(1)
    .map(() => Array(40).fill("."));
  let x = 1;
  let i = 0;
  let j = 0;

  function onCycle() {
    ++j;
    if (j === 40) {
      j = 0;
      ++i;
    }
    if ([x - 1, x, x + 1].includes(j)) {
      ans[i][j] = "#";
    }
  }

  for (const line of rawData) {
    onCycle();
    if (line !== "noop") {
      const newX = x + Number(line.split(" ")[1]);
      x = newX;
      onCycle();
    }
  }
  console.debug(ans.map((x) => x.join("")).join("\n"));
})();
console.timeEnd("Part 2");
