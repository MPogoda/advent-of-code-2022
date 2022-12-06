console.time("parser");
const filename = "input";
// const filename = "testinput";

const [rawData] = require("fs").readFileSync(filename, "UTF-8").split("\n");

console.timeEnd("parser");

function process(marker) {
  for (let i = 0; i < rawData.length; ++i) {
    const seq = new Set(rawData.slice(i, i + marker));
    if (seq.size === marker) {
      return marker + i;
    }
  }
}

console.time("Part 1");
(() => {
  console.debug(process(4));
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  console.debug(process(14));
})();
console.timeEnd("Part 2");
