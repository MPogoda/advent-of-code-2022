console.time("parser");
const filename = "input";
// const filename = "testinput";

const rawData = require("fs").readFileSync(filename, "UTF-8").split("\n");
rawData.pop();
const blueprints = rawData.map((line) => {
  const [a, b, c, d, e, f] =
    /^.*costs (.*) ore.*costs (.*) ore.*costs (.*) ore and (.*) clay.*costs (.*) ore and (.*) obsidian.$/
      .exec(line)
      .slice(1)
      .map(Number);
  return [
    [a, 0, 0, 0],
    [b, 0, 0, 0],
    [c, d, 0, 0],
    [e, 0, f, 0],

    [Math.max(b, c, e), d, Infinity, Infinity],
  ];
});
console.timeEnd("parser");

const EXTRACT = Array(4)
  .fill(0)
  .map((_, x) => 8 * x)
  .map((x) => (raw) => (raw >> x) & 0xff);
const CONST = Array(4)
  .fill(0)
  .map((_, x) => 1 << (8 * x));

const [ore, clay, obsidian, geode] = EXTRACT;
const [ORE, CLAY, OBSIDIAN, GEODE] = CONST;

function calculateTimeNeeded(req, res, robots, extract) {
  return req && req > extract(res)
    ? Math.floor((req - extract(res) + extract(robots) - 1) / extract(robots))
    : 0;
}
function go(blueprint, t, res = 0, robots = ORE) {
  let max = geode(res + t * robots);

  if (ore(robots) < blueprint[4][0]) {
    const ff = 1 + calculateTimeNeeded(blueprint[0][0], res, robots, ore);
    if (t > ff) {
      max = Math.max(
        max,
        go(
          blueprint,
          t - ff,
          res + ff * robots - ORE * blueprint[0][0],
          robots + ORE
        )
      );
    }
  }

  if (clay(robots) < blueprint[4][1]) {
    const ff = 1 + calculateTimeNeeded(blueprint[1][0], res, robots, ore);
    if (t > ff) {
      max = Math.max(
        max,
        go(
          blueprint,
          t - ff,
          res + ff * robots - ORE * blueprint[1][0],
          robots + CLAY
        )
      );
    }
  }

  if (clay(robots)) {
    const ff =
      1 +
      Math.max(
        calculateTimeNeeded(blueprint[2][0], res, robots, ore),
        calculateTimeNeeded(blueprint[2][1], res, robots, clay)
      );
    if (t > ff) {
      max = Math.max(
        max,
        go(
          blueprint,
          t - ff,
          res + ff * robots - ORE * blueprint[2][0] - CLAY * blueprint[2][1],
          robots + OBSIDIAN
        )
      );
    }
  }

  if (obsidian(robots)) {
    const ff =
      1 +
      Math.max(
        calculateTimeNeeded(blueprint[3][0], res, robots, ore),
        calculateTimeNeeded(blueprint[3][2], res, robots, obsidian)
      );
    if (t > ff) {
      max = Math.max(
        max,
        go(
          blueprint,
          t - ff,
          res +
            ff * robots -
            ORE * blueprint[3][0] -
            OBSIDIAN * blueprint[3][2],
          robots + GEODE
        )
      );
    }
  }

  return max;
}

console.time("Part 1");
(() => {
  const qualityLevels = blueprints.map((blueprint, index) => {
    const max = go(blueprint, 24);
    return (index + 1) * max;
  });

  console.info(qualityLevels.reduce((acc, v) => acc + v, 0));
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  const ans = blueprints
    .slice(0, 3)
    .map((blueprint) => go(blueprint, 32))
    .reduce((acc, v) => acc * v, 1);
  console.info(ans);
})();
console.timeEnd("Part 2");
