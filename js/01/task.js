console.time("parser");
const filename = "input";
// const filename = "testinput";

const rawData = require("fs").readFileSync(filename, "UTF-8").split("\n");
rawData.pop();

const data = rawData.map(Number);
console.timeEnd("parser");

console.time("Part 1");
(() => {
  const grouped = [];
  let current = 0;
  for (const c of data) {
    if (c === 0) {
      grouped.push(current);
      current = 0;
    }
    current += c;
  }
  grouped.push(current);
  grouped.sort((a, b) => a - b).reverse();
  console.debug(grouped.shift());
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  const grouped = [];
  let current = 0;
  for (const c of data) {
    if (c === 0) {
      grouped.push(current);
      current = 0;
    }
    current += c;
  }
  grouped.push(current);
  grouped.sort((a, b) => a - b).reverse();
  console.debug(grouped.slice(0, 3).reduce((acc, v) => acc + v, 0));
})();
console.timeEnd("Part 2");
