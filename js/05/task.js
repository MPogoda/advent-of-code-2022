console.time("parser");
const filename = "input";
// const filename = "testinput";

const [rawCrates, rawMoves] = require("fs")
  .readFileSync(filename, "UTF-8")
  .split("\n\n");

const rawCratesLines = rawCrates.split("\n");
const crates = [];
for (let i = 1; i < rawCratesLines[0].length; i += 4) {
  const thisLine = [];
  for (let j = 0; j < rawCratesLines.length - 1; ++j) {
    if (rawCratesLines[j][i] !== " ") {
      thisLine.push(rawCratesLines[j][i]);
    }
  }
  crates.push(thisLine);
}

const moves = rawMoves
  .split("\n")
  .slice(0, -1)
  .map((line) => {
    const [, count, from, to] = /^move (.*) from (.*) to (.*)$/.exec(line);
    return { count: Number(count), from: Number(from) - 1, to: Number(to) - 1 };
  });

console.timeEnd("parser");

console.time("Part 1");
(() => {
  const state = Array.from(crates, (c) => Array.from(c));

  for (const { count, from, to } of moves) {
    state[to].unshift(...state[from].splice(0, count).reverse());
  }
  console.info(state.map((c) => c[0]).join(""));
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  const state = Array.from(crates, (c) => Array.from(c));

  for (const { count, from, to } of moves) {
    state[to].unshift(...state[from].splice(0, count));
  }
  console.info(state.map((c) => c[0]).join(""));
})();
console.timeEnd("Part 2");
