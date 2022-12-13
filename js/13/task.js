console.time("parser");
const filename = "input";
// const filename = "testinput";

const data = require("fs")
  .readFileSync(filename, "UTF-8")
  .split("\n\n")
  .map((group) => {
    const [a, b] = group.split("\n");
    return [JSON.parse(a), JSON.parse(b)];
  });
console.timeEnd("parser");

function compare(lhs, rhs) {
  if (typeof lhs === "number" && typeof rhs === "number") {
    return lhs === rhs ? undefined : lhs < rhs;
  }
  if (Array.isArray(lhs) && Array.isArray(rhs)) {
    for (let i = 0; i < Math.min(lhs.length, rhs.length); ++i) {
      const r = compare(lhs[i], rhs[i]);
      if (r !== undefined) {
        return r;
      }
    }
    return lhs.length === rhs.length ? undefined : lhs.length < rhs.length;
  }
  return compare(
    typeof lhs === "number" ? [lhs] : lhs,
    typeof rhs === "number" ? [rhs] : rhs
  );
}
console.time("Part 1");
(() => {
  let ans = 0;
  let i = 0;
  for (const [lhs, rhs] of data) {
    ++i;
    if (compare(lhs, rhs)) {
      ans += i;
    }
  }
  console.info(ans);
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  const x = [[2]];
  const y = [[6]];
  const packets = [x, y, ...data.flatMap((x) => x)].sort((a, b) =>
    compare(a, b) ? -1 : 1
  );

  console.info((packets.indexOf(x) + 1) * (packets.indexOf(y) + 1));
})();
console.timeEnd("Part 2");
