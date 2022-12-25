console.time("parser");
const filename = "input";
// const filename = "testinput";

const rawData = require("fs").readFileSync(filename, "UTF-8").split("\n");
rawData.pop();
console.timeEnd("parser");

function getDigit(ch) {
  return "=-012".indexOf(ch) - 2;
}

function fromSnafu(raw) {
  let power = 1;
  let ans = 0;
  for (const ch of raw.split("").reverse()) {
    ans += power * getDigit(ch);
    power *= 5;
  }
  return ans;
}

function toSnafu(x) {
  const output = [];
  let rest = 0;
  while (x !== 0 || rest) {
    const rem = (x % 5) + rest;
    rest = rem > 2 ? 1 : 0;
    output.push("012=-0"[rem]);
    x = Math.floor(x / 5);
  }
  return output.reverse().join("");
}

console.time("Part 1");
(() => {
  const sum = rawData.reduce((acc, v) => acc + fromSnafu(v), 0);
  console.info(toSnafu(sum));
})();
console.timeEnd("Part 1");
