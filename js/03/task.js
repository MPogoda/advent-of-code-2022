console.time("parser");
const filename = "input";
// const filename = "testinput";

const rawData = require("fs").readFileSync(filename, "UTF-8").split("\n");
rawData.pop();
console.timeEnd("parser");

function compute(ch) {
  return (
    1 +
    ch.charCodeAt() +
    (ch <= "Z" ? 26 - "A".charCodeAt() : -"a".charCodeAt())
  );
}

console.time("Part 1");
(() => {
  let result = 0;
  for (const line of rawData) {
    const a = line.slice(0, line.length / 2);
    const b = line.slice(line.length / 2);

    const [intersection] = Array.from(a).filter((x) => b.includes(x));
    result += compute(intersection);
  }
  console.log(result);
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  let result = 0;
  let accum = [];
  for (const line of rawData) {
    accum.push(line);

    if (accum.length === 3) {
      const [a, b, c] = accum;
      const [intersection] = Array.from(a).filter(
        (x) => b.includes(x) && c.includes(x)
      );
      result += compute(intersection);

      accum = [];
    }
  }
  console.log(result);
})();
console.timeEnd("Part 2");
