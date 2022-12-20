console.time("parser");
const filename = "input";
// const filename = "testinput";

const rawData = require("fs").readFileSync(filename, "UTF-8").split("\n");
rawData.pop();

const data = rawData.map(Number);
console.timeEnd("parser");

function process(input, count = 1) {
  const xs = input.map((x) => ({ x }));
  const XS = [...xs];

  for (let i = 0; i < count; ++i) {
    for (const elem of XS) {
      const index = xs.indexOf(elem);
      xs.splice(index, 1);
      let targetIndex = index + elem.x;
      if (targetIndex < 0) {
        targetIndex +=
          xs.length * Math.abs(Math.floor(targetIndex / xs.length));
      }
      if (targetIndex >= xs.length) {
        targetIndex %= xs.length;
      }

      xs.splice(targetIndex, 0, elem);
    }
  }

  return xs.map(({ x }) => x);
}

function findGrove(xs) {
  const index = xs.indexOf(0);
  return [index + 1000, index + 2000, index + 3000]
    .map((i) => i % xs.length)
    .map((i) => xs[i])
    .reduce((acc, v) => acc + v, 0);
}

console.time("Part 1");
(() => {
  const processed = process(data);
  console.info(findGrove(processed));
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  const processed = process(
    data.map((x) => x * 811589153),
    10
  );
  console.info(findGrove(processed));
})();
console.timeEnd("Part 2");
