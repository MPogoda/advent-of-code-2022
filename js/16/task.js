console.time("parser");
const filename = "input";
// const filename = "testinput";

const rawData = require("fs").readFileSync(filename, "UTF-8").split("\n");
rawData.pop();

const connections = {};
const rates = {};
for (const line of rawData) {
  const [, from, rate, to] =
    /^Valve (.*) has flow rate=(.*);.*to valves? (.*)$/.exec(line);
  connections[from] = to.split(", ");
  rates[from] = Number(rate);
}
console.timeEnd("parser");

const distMem = new Map();

function findDist(from, to, maxDist) {
  const key = [from, to].sort().join(":");
  if (distMem.has(key)) {
    return distMem.get(key);
  }
  const queue = [[from, 0]];
  const visited = new Set([from]);
  while (queue.length) {
    const [current, dist] = queue.shift();
    const nextDist = dist + 1;
    if (nextDist >= maxDist) {
      break;
    }
    for (const connection of connections[current]) {
      if (connection === to) {
        distMem.set(key, nextDist);
        return nextDist;
      }
      if (!visited.has(connection)) {
        visited.add(connection);
        queue.push([connection, nextDist]);
      }
    }
  }
  return Infinity;
}

console.time("Part 1");
(() => {
  let maxFlow = 0;
  const mem = new Set();
  function seen({ flow, minutesLeft, current }) {
    const key = [flow, minutesLeft, current].join(":");
    if (mem.has(key)) {
      return true;
    }
    mem.add(key);
    return false;
  }

  function solve(s) {
    if (seen(s)) {
      return;
    }
    if (s.minutesLeft <= 0) {
      maxFlow = Math.max(maxFlow, s.flow);
      return;
    }
    for (const v of s.interestingValves) {
      const dist = findDist(s.current, v, s.minutesLeft - 2);
      if (dist >= s.minutesLeft - 2) {
        continue;
      }
      solve({
        rate: s.rate + rates[v],
        current: v,
        flow: s.flow + (dist + 1) * s.rate,
        minutesLeft: s.minutesLeft - dist - 1,
        interestingValves: s.interestingValves.filter((x) => x !== v),
      });
    }
    solve({
      ...s,
      flow: s.flow + s.minutesLeft * s.rate,
      minutesLeft: 0,
    });
  }

  solve({
    rate: 0,
    current: "AA",
    flow: 0,
    minutesLeft: 30,
    interestingValves: Object.keys(rates).filter((key) => rates[key]),
  });

  console.info(maxFlow);
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  const state = {
    rate: 0,
    pCurrent: "AA",
    pBusyLeft: 0,
    eCurrent: "AA",
    eBusyLeft: 0,
    flow: 0,
    minutesLeft: 26,
    interestingValves: Object.keys(rates).filter((key) => rates[key]),
  };

  let maxFlow = 0;

  const mem = new Set();
  function seen(s) {
    const [k1, k2] = [
      [s.pCurrent, s.pBusyLeft],
      [s.eCurrent, s.eBusyLeft],
    ]
      .map((p) => p.join(":"))
      .sort();
    const key = [s.flow, s.minutesLeft, k1, k2].join(":");
    if (mem.has(key)) {
      return true;
    }
    mem.add(key);
    return false;
  }
  function isBad({
    interestingValves,
    flow,
    rate,
    minutesLeft,
    pBusyLeft,
    eBusyLeft,
    pCurrent,
    eCurrent,
  }) {
    const maxRate = interestingValves.reduce((acc, v) => acc + rates[v], 0);
    const maxPossibleFlow =
      flow +
      // guaranteed
      rate * minutesLeft +
      rates[pCurrent] * Math.max(0, minutesLeft - pBusyLeft) +
      rates[eCurrent] * Math.max(0, minutesLeft - eBusyLeft) +
      // ignore travel time after for both P & E
      maxRate * Math.max(0, minutesLeft - Math.max(pBusyLeft, eBusyLeft));

    return maxPossibleFlow <= maxFlow;
  }
  function solve(s) {
    if (isBad(s) || seen(s)) {
      return;
    }
    if (s.minutesLeft <= 0) {
      maxFlow = Math.max(s.flow, maxFlow);
      return;
    }
    if (s.pBusyLeft && s.eBusyLeft) {
      // fast forward time until either P or E opens the valve
      const ff = Math.min(s.pBusyLeft, s.eBusyLeft, s.minutesLeft);
      return solve({
        ...s,
        pBusyLeft: s.pBusyLeft - ff,
        eBusyLeft: s.eBusyLeft - ff,
        minutesLeft: s.minutesLeft - ff,
        flow: s.flow + ff * s.rate,
        rate:
          s.rate +
          (ff === s.pBusyLeft ? rates[s.pCurrent] : 0) +
          (ff === s.eBusyLeft ? rates[s.eCurrent] : 0),
      });
    } else if (!s.pBusyLeft) {
      // if P is free
      for (const v of s.interestingValves) {
        const dist = findDist(s.pCurrent, v, s.minutesLeft - 2);
        if (dist >= s.minutesLeft - 2) {
          continue;
        }
        solve({
          ...s,
          pCurrent: v,
          pBusyLeft: dist + 1,
          interestingValves: s.interestingValves.filter((x) => x !== v),
        });
      }
      // maybe we don't have to do anything for P?
      solve({
        ...s,
        pBusyLeft: 99,
      });
    } else if (!s.eBusyLeft) {
      // if E is free
      for (const v of s.interestingValves) {
        const dist = findDist(s.eCurrent, v, s.minutesLeft - 2);
        if (dist >= s.minutesLeft - 2) {
          continue;
        }
        solve({
          ...s,
          eCurrent: v,
          eBusyLeft: dist + 1,
          interestingValves: s.interestingValves.filter((x) => x !== v),
        });
      }
      // maybe we don't have to do anything for E?
      solve({
        ...s,
        eBusyLeft: 99,
      });
    }
    // maybe we just stop here?
    solve({
      ...s,
      flow: s.flow + s.minutesLeft * s.rate,
      minutesLeft: 0,
    });
  }
  solve(state);
  console.info(maxFlow);
})();
console.timeEnd("Part 2");
