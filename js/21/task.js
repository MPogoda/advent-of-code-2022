console.time("parser");
const filename = "input";
// const filename = "testinput";

const rawData = require("fs").readFileSync(filename, "UTF-8").split("\n");
rawData.pop();

const data = new Map();
rawData.forEach((line) => {
  const [monkey, job] = line.split(": ");
  const [lhs, op, rhs] = job.split(" ");
  data.set(monkey, op ? { lhs, op, rhs } : { value: Number(lhs) });
});
console.timeEnd("parser");

function deepClone(x) {
  return new Map(Array.from(x.entries()).map(([k, v]) => [k, { ...v }]));
}

function prepareDeps(data, thisMonkey) {
  if (thisMonkey.value !== undefined) return;
  thisMonkey.lhsValue = data.get(thisMonkey.lhs).value;
  thisMonkey.rhsValue = data.get(thisMonkey.rhs).value;
}

function compute(monkeyJob) {
  if (monkeyJob.value !== undefined) return monkeyJob.value;
  if (monkeyJob.lhsValue === undefined || monkeyJob.rhsValue == undefined)
    return undefined;
  switch (monkeyJob.op) {
    case "+":
      return monkeyJob.lhsValue + monkeyJob.rhsValue;
    case "-":
      return monkeyJob.lhsValue - monkeyJob.rhsValue;
    case "*":
      return monkeyJob.lhsValue * monkeyJob.rhsValue;
    case "/":
      return monkeyJob.lhsValue / monkeyJob.rhsValue;
    case "=":
      return monkeyJob.lhsValue === monkeyJob.rhsValue ? 1 : 0;
  }
}

function yell(data) {
  const thisData = deepClone(data);
  const root = thisData.get("root");

  while (root.value === undefined) {
    for (const m of thisData.values()) {
      prepareDeps(thisData, m);
    }
    for (const m of thisData.values()) {
      m.value = compute(m);
    }
  }
  return root;
}

console.time("Part 1");
(() => {
  console.info(yell(data).value);
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  data.get("root").op = "=";
  const humn = data.get("humn");

  let low = 0;
  let high = 10_000_000_000_000;
  while (low <= high) {
    const mid = Math.floor((high + low) / 2);
    humn.value = mid;

    const result = yell(data);
    if (result.value) {
      console.info(humn.value);
      return;
    }

    if (result.lhsValue > result.rhsValue) {
      low = mid;
    } else {
      high = mid;
    }
  }
})();
console.timeEnd("Part 2");
