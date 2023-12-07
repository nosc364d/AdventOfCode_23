import { getData } from "../../lib/data";

function isInRange(toTest: number, start: number, end: number): boolean {
  return start <= toTest && toTest <= end;
}

// export async function task1() {
//   const data = await getData("5");

//   // const testData =
//   //   "seeds: 79 14 55 13\n\nseed-to-soil map:\n50 98 2\n52 50 48\n\nsoil-to-fertilizer map:\n0 15 37\n37 52 2\n39 0 15\n\nfertilizer-to-water map:\n49 53 8\n0 11 42\n42 0 7\n57 7 4\n\nwater-to-light map:\n88 18 7\n18 25 70\n\nlight-to-temperature map:\n45 77 23\n81 45 19\n68 64 13\n\ntemperature-to-humidity map:\n0 69 1\n1 0 69\n\nhumidity-to-location map:\n60 56 37\n56 93 4\n";

//   const seedRegex = /^seeds:\s(?<seed>.+)/; // regex syntax copied from tlareg on github

//   const seeds = data.match(seedRegex)[1].split(" ");
//   var seedsAsNums: number[] = [];
//   seeds.map((seed) => {
//     seedsAsNums.push(Number(seed));
//   });

//   console.log(seeds);

//   const lines = data.split("\n");

//   var check = true;

//   // for every seed, go through every line and do all the mappings until location
//   for (var seedIndex = 0; seedIndex < seedsAsNums.length; seedIndex++) {
//     lines.map((line) => {
//       if (line.match(/[0-9]/)) {
//         // line is a number
//         const mapping = line.split(" ");
//         // console.log(mapping);
//         if (mapping[0] !== "seeds:") {
//           // assign the mapping results for better readability
//           // we're not golfing here
//           const dst = Number(mapping[0]);
//           const src = Number(mapping[1]);
//           const range = Number(mapping[2]);
//           // only if number is in range, do the mapping
//           if (isInRange(seedsAsNums[seedIndex], src, src + range) && check) {
//             // console.log("mapping for " + seedsAsNums[seedIndex]);
//             // console.log("found in range from " + src + " to " + (src + range));
//             // console.log("now " + (dst + (seedsAsNums[seedIndex] - src)));
//             seedsAsNums[seedIndex] = dst + (seedsAsNums[seedIndex] - src);
//             check = false;
//           }
//         }
//       } else {
//         check = true;
//       }
//     });
//   }

//   console.log(seedsAsNums.sort((a, b) => a - b));
// }

type Interval = {
  start: number;
  end: number;
};

export async function task2() {
  const data = await getData("5");

  const testData =
    "seeds: 79 14 55 13\n\nseed-to-soil map:\n50 98 2\n52 50 48\n\nsoil-to-fertilizer map:\n0 15 37\n37 52 2\n39 0 15\n\nfertilizer-to-water map:\n49 53 8\n0 11 42\n42 0 7\n57 7 4\n\nwater-to-light map:\n88 18 7\n18 25 70\n\nlight-to-temperature map:\n45 77 23\n81 45 19\n68 64 13\n\ntemperature-to-humidity map:\n0 69 1\n1 0 69\n\nhumidity-to-location map:\n60 56 37\n56 93 4\n";

  const seedRegex = /^seeds:\s(?<seed>.+)/; // regex syntax copied from tlareg on github

  const seeds = testData.match(seedRegex)[1].split(" ");
  var seedsAsNums: number[] = [];
  seeds.map((seed) => {
    seedsAsNums.push(Number(seed));
  });

  var intervals: Interval[] = [];

  for (var i = 0; i < seedsAsNums.length; i += 2) {
    intervals.push({
      start: seedsAsNums[i],
      end: seedsAsNums[i + 1],
    });
  }

  const lines = testData.split("\n");

  var check = true;
  var currentLowestResult = seedsAsNums[0];

  // for every seed, go through every line and do all the mappings until location
  for (var seedIndex = 0; seedIndex < seedsAsNums.length; seedIndex += 2) {
    for (
      var thisSeeds = 0;
      thisSeeds < seedsAsNums[seedIndex + 1];
      thisSeeds++
    ) {
      var currentNum = seedsAsNums[seedIndex] + thisSeeds;
      // console.log(currentNum);
      lines.map((line) => {
        if (line.match(/[0-9]/)) {
          // line is a number
          const mapping = line.split(" ");
          // console.log(mapping);
          if (mapping[0] !== "seeds:" && check) {
            // assign the mapping results for better readability
            // we're not golfing here
            const dst = Number(mapping[0]);
            const src = Number(mapping[1]);
            const range = Number(mapping[2]);
            // only if number is in range, do the mapping
            if (isInRange(currentNum, src, src + range)) {
              // console.log("mapping for " + seedsAsNums[seedIndex]);
              // console.log("found in range from " + src + " to " + (src + range));
              // console.log("now " + (dst + (seedsAsNums[seedIndex] - src)));
              currentNum = dst + (currentNum - src);
              // console.log("now: " + currentNum);
              check = false;
            }
          }
        } else {
          check = true;
        }
      });
      if (currentLowestResult > currentNum) currentLowestResult = currentNum;
    }
    console.log(seedIndex + " seed done");
  }

  console.log(currentLowestResult);
}

task2();
