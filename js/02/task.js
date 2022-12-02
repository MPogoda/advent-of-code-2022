console.time("parser");
const filename = "input";
// const filename = "testinput";

const rawData = require("fs").readFileSync(filename, "UTF-8").split("\n");
rawData.pop();

const data = rawData.map((s) => s.split(" "));
console.timeEnd("parser");

console.time("Part 1");
(() => {
  const scoreMap = { X: 1, Y: 2, Z: 3 };
  const winMap = {
    A: { X: 3, Y: 6, Z: 0 },
    B: { X: 0, Y: 3, Z: 6 },
    C: { X: 6, Y: 0, Z: 3 },
  };
  const result = data.reduce(
    (acc, [he, me]) => acc + scoreMap[me] + winMap[he][me],
    0
  );

  console.debug(result);
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  const map = {
    AX: 0 + 3,
    AY: 3 + 1,
    AZ: 6 + 2,

    BX: 1 + 0,
    BY: 2 + 3,
    BZ: 3 + 6,

    CX: 2 + 0,
    CY: 3 + 3,
    CZ: 1 + 6,
  };
  const result = data.reduce((acc, row) => acc + map[row.join("")], 0);

  console.debug(result);
})();
console.timeEnd("Part 2");
