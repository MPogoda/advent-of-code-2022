console.time("parser");
const filename = "input";
// const filename = "testinput";

const rawData = require("fs").readFileSync(filename, "UTF-8").split("\n");
rawData.pop();

const data = rawData.map((l) => {
  const [a, b, c, d] = l.split(",").flatMap((x) => x.split("-").map(Number));
  return { a, b, c, d };
});

console.timeEnd("parser");

console.time("Part 1");
(() => {
  let result = 0;
  for (const { a, b, c, d } of data) {
    if (a >= c && b <= d) {
      result += 1;
    } else if (c >= a && d <= b) {
      result += 1;
    }
  }
  console.debug(result);
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  let result = 0;
  for (const { a, b, c, d } of data) {
    if ((a >= c && a <= d) || (c >= a && c <= b)) {
      result += 1;
    }
  }
  console.debug(result);
})();
console.timeEnd("Part 2");
