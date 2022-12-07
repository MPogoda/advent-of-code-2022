console.time("parser");
const filename = "input";
// const filename = "testinput";

const rawData = require("fs").readFileSync(filename, "UTF-8").split("\n");
rawData.pop();

const fs = { "/": { dirs: [], files: [] } };

let current;
for (const line of rawData) {
  if (line.startsWith("$ ")) {
    const [, cmd, dir] = line.split(" ");
    if (cmd === "cd") {
      if (dir === "/") {
        current = fs["/"];
      } else if (dir === "..") {
        current = current.parrent ?? fs["/"];
      } else {
        current = current.dirs[dir];
      }
    }
  } else {
    const [lhs, rhs] = line.split(" ");
    if (lhs === "dir") {
      current.dirs[rhs] = {
        dirs: [],
        files: [],
        parrent: current,
      };
    } else {
      current.files[rhs] = Number(lhs);
    }
  }
}

const sizes = [];

function calculateSizes(dir) {
  dir.size = 0;
  for (const subDir in dir.dirs) {
    dir.size += calculateSizes(dir.dirs[subDir]);
  }
  for (const file in dir.files) {
    dir.size += dir.files[file];
  }
  sizes.push(dir.size);
  return dir.size;
}

calculateSizes(fs["/"]);
sizes.sort((a, b) => a - b);

console.timeEnd("parser");

console.time("Part 1");
(() => {
  console.debug(sizes.reduce((acc, v) => (v <= 100_000 ? acc + v : acc), 0));
})();
console.timeEnd("Part 1");

console.time("Part 2");
(() => {
  console.debug(sizes.find((s) => fs["/"].size - s <= 40_000_000));
})();
console.timeEnd("Part 2");
