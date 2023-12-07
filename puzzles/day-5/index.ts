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
      end: seedsAsNums[i] + seedsAsNums[i + 1],
    });
  }

  intervals.sort((a, b) => a.start - b.start);
  // slice to copy contents, not refereence
  var copy: Interval[] = intervals.slice();

  const lines = testData.split("\n");
  // remove first items cuz we already took care of that earlier
  lines.shift();

  lines.map((line) => {
    if (line.match(/[a-z]/)) {
      // line starts with a letter: declares start of new mapping
      // sort bc it gives me a better feeling
      intervals.sort((a, b) => a.start - b.start);
      copy = intervals.slice();
      console.log("thing done:");
      console.log(intervals);
    } else if (line.match(/[0-9]/)) {
      // line is mapping
      const mapping = line.split(" ");

      const dst = Number(mapping[0]);
      const src = Number(mapping[1]);
      const range = Number(mapping[2]);

      console.log(line);
      console.log("found interval: " + src + ", " + (src + range));
      // check cases
      for (var currInterval = 0; currInterval < copy.length; currInterval++) {
        // is current mapping relevant for interval?
        // meaning is either start or end in interval?
        const startInRange = isInRange(
          copy[currInterval].start,
          src,
          src + range
        );
        const endInRange = isInRange(copy[currInterval].end, src, src + range);
        if (startInRange) {
          // yes it is ! now we gotta handle it

          console.log("found start in range: " + copy[currInterval].start);

          if (endInRange) {
            // interval fully in current mapping
            console.log("interval is fully in range, mapping whole entry");
            intervals[currInterval] = {
              start: dst + (copy[currInterval].start - src),
              end: dst + (copy[currInterval].end - src),
            };
            console.log(intervals);
          } else {
            // only start in mapping: need to split!
            // pushing the mapped part
            console.log("creating new entry");
            intervals.push({
              start: copy[currInterval].start + (dst - src),
              end: dst + range,
            });
            // returning the stable part
            intervals[currInterval] = {
              start: src + range + 1,
              end: copy[currInterval].end,
            };
            console.log("after line:");
            console.log(intervals);
            console.log(copy);
          }
        } else if (endInRange) {
          // it still is! still gotta split it
          // puhsing the split part
          console.log("end in range only, creating new entry");
          intervals.push({
            start: dst,
            end: copy[currInterval].end + (dst - src),
          });
          // returning the stable part
          intervals[currInterval] = {
            start: copy[currInterval].start,
            end: src - 1,
          };
          console.log("after line:");
          console.log(intervals);
        }
        // not in range, no need to modify it
      }
    }
  });

  // for every seed, go through every line and do all the mappings until location

  console.log(intervals);
}

task2();
