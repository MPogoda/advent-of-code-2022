console.time("parser");
const filename = "input";
// const filename = "testinput";

function createOp(raw) {
  return (old) => {
    let newV = old;
    eval(raw);
    return newV;
  };
}
const monkeys = require("fs")
  .readFileSync(filename, "UTF-8")
  .split("\n\n")
  .map((lines) => {
    const [, starting, rawOperation, rawTest, rawIfTrue, rawIfFalse] =
      lines.split("\n");

    const startingItems = starting.split(": ")[1].split(", ").map(Number);

    const op = createOp(rawOperation.split(": ")[1].replace("new", "newV"));

    const divisibleBy = Number(rawTest.split("by ")[1]);
    const ifTrue = Number(rawIfTrue.split("monkey ")[1]);
    const ifFalse = Number(rawIfFalse.split("monkey ")[1]);

    return { startingItems, op, divisibleBy, ifTrue, ifFalse };
  });
console.timeEnd("parser");

console.time("Part 1");
(() => {
  const state = monkeys.map((monkey) => ({
    ...monkey,
    items: Array.from(monkey.startingItems),
    inspected: 0,
  }));
  for (let i = 0; i < 20; ++i) {
    for (let i = 0; i < monkeys.length; ++i) {
      const monkey = state[i];
      while (monkey.items.length) {
        monkey.inspected += 1;
        const item = monkey.items.shift();
        const newItem = Math.floor(monkey.op(item) / 3);
        const throwTo =
          newItem % monkey.divisibleBy === 0 ? monkey.ifTrue : monkey.ifFalse;
        state[throwTo].items.push(newItem);
      }
    }
  }

  console.log(
    state
      .map(({ inspected }) => inspected)
      .sort((a, b) => b - a)
      .slice(0, 2)
      .reduce((acc, v) => acc * v, 1)
  );
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  const state = monkeys.map((monkey) => ({
    ...monkey,
    inspected: 0,
    items: Array.from(monkey.startingItems),
  }));
  const mod = monkeys.reduce((acc, { divisibleBy }) => acc * divisibleBy, 1);
  for (let i = 0; i < 10_000; ++i) {
    for (let i = 0; i < monkeys.length; ++i) {
      const monkey = state[i];
      while (monkey.items.length) {
        monkey.inspected += 1;
        const item = monkey.items.shift();
        const newItem = monkey.op(item) % mod;
        const throwTo =
          newItem % monkey.divisibleBy === 0 ? monkey.ifTrue : monkey.ifFalse;
        state[throwTo].items.push(newItem);
      }
    }
  }

  console.log(
    state
      .map(({ inspected }) => inspected)
      .sort((a, b) => b - a)
      .slice(0, 2)
      .reduce((acc, v) => acc * v, 1)
  );
})();
console.timeEnd("Part 2");
