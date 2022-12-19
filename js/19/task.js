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
  return {
    ore: { ore: a },
    clay: { ore: b },
    obsidian: { ore: c, clay: d },
    geode: { ore: e, obsidian: f },
  };
});
console.timeEnd("parser");

function hasSeen(seenStorage, state) {
  const [t, ore, clay, obsidian, geode, rOre, rClay, rObsidian, rGeode] = state;
  const hashM =
    1_000_000_000 * geode + 1_000_000 * obsidian + 1_000 * clay + ore;
  const hashR = 32 ** 3 * rGeode + 32 ** 2 * rObsidian + 32 * rClay + rOre;
  const key = [t, hashM, hashR].join(":");
  if (seenStorage.has(key)) {
    return true;
  }
  seenStorage.add(key);
  return false;
}

function simplifyState(blueprint, state) {
  const maxOreNeeds = Math.max(
    blueprint.ore.ore,
    blueprint.clay.ore,
    blueprint.obsidian.ore,
    blueprint.geode.ore
  );
  let [t, ore, clay, obsidian, geode, rOre, rClay, rObsidian, rGeode] = state;
  rOre = Math.min(rOre, maxOreNeeds);
  rObsidian = Math.min(rObsidian, blueprint.geode.obsidian);
  rClay = Math.min(rClay, blueprint.obsidian.clay);
  ore = Math.min(ore, t * maxOreNeeds - rOre * (t - 1));
  clay = Math.min(clay, t * blueprint.obsidian.clay - rClay * (t - 1));
  obsidian = Math.min(
    obsidian,
    t * blueprint.geode.obsidian - rObsidian * (t - 1)
  );
  return [t, ore, clay, obsidian, geode, rOre, rClay, rObsidian, rGeode];
}

function* nextStates(blueprint, seen, state) {
  const [t, ore, clay, obsidian, geode, rOre, rClay, rObsidian, rGeode] =
    simplifyState(blueprint, state);
  if (!t || hasSeen(seen, state)) {
    return;
  }
  yield [
    t - 1,
    ore + rOre,
    clay + rClay,
    obsidian + rObsidian,
    geode + rGeode,
    rOre,
    rClay,
    rObsidian,
    rGeode,
  ];

  if (ore >= blueprint.ore.ore) {
    yield [
      t - 1,
      ore + rOre - blueprint.ore.ore,
      clay + rClay,
      obsidian + rObsidian,
      geode + rGeode,
      rOre + 1,
      rClay,
      rObsidian,
      rGeode,
    ];
  }
  if (ore >= blueprint.clay.ore) {
    yield [
      t - 1,
      ore + rOre - blueprint.clay.ore,
      clay + rClay,
      obsidian + rObsidian,
      geode + rGeode,
      rOre,
      rClay + 1,
      rObsidian,
      rGeode,
    ];
  }
  if (ore >= blueprint.obsidian.ore && clay >= blueprint.obsidian.clay) {
    yield [
      t - 1,
      ore + rOre - blueprint.obsidian.ore,
      clay + rClay - blueprint.obsidian.clay,
      obsidian + rObsidian,
      geode + rGeode,
      rOre,
      rClay,
      rObsidian + 1,
      rGeode,
    ];
  }

  if (ore >= blueprint.geode.ore && obsidian >= blueprint.geode.obsidian) {
    yield [
      t - 1,
      ore + rOre - blueprint.geode.ore,
      clay + rClay,
      obsidian + rObsidian - blueprint.geode.obsidian,
      geode + rGeode,
      rOre,
      rClay,
      rObsidian,
      rGeode + 1,
    ];
  }
}
console.time("Part 1");
(() => {
  const qualityLevels = blueprints.map((blueprint, index) => {
    let max = 0;
    const queue = [[24, 0, 0, 0, 0, 1, 0, 0, 0]];
    const seen = new Set();
    while (queue.length) {
      const current = queue.pop();
      max = Math.max(current[4], max);
      queue.push(...nextStates(blueprint, seen, current));
    }
    return (index + 1) * max;
  });

  console.info(qualityLevels.reduce((acc, v) => acc + v, 0));
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  const ans = blueprints
    .slice(0, 3)
    .map((blueprint) => {
      let max = 0;
      const queue = [[32, 0, 0, 0, 0, 1, 0, 0, 0]];
      const seen = new Set();
      while (queue.length) {
        const current = queue.pop();
        max = Math.max(current[4], max);
        queue.push(...nextStates(blueprint, seen, current));
      }
      return max;
    })
    .reduce((acc, v) => acc * v, 1);
  console.info(ans);
})();
console.timeEnd("Part 2");
