import { getData } from "../../lib/data";

function isInRange(toTest: number, start: number, end: number): boolean {
  return start <= toTest && toTest <= end;
}

function mergeAndSort(intervals: Interval[]) {
  var currEntry = 0;
  intervals.sort((a, b) => a.start - b.start);

  console.log("before merging:");
  console.log(intervals.length + " amount of intervals");

  console.log("merging...");

  // merge
  while (intervals[currEntry + 1]) {
    if (isInRange(intervals[1].start, intervals[0].start, intervals[0].end)) {
      // next interval is in range of the first -> merge
      intervals.push({
        start: intervals[0].start,
        end:
          // choose the longer one
          intervals[0].end < intervals[1].end
            ? intervals[1].end
            : intervals[0].end,
      });

      console.log(
        "merged: [ " +
          intervals[0].start +
          " , " +
          (intervals[0].end < intervals[1].end
            ? intervals[1].end
            : intervals[0].end) +
          " ]"
      );

      // remove the old ones
      intervals.shift();
      intervals.shift();

      // need to sort again and reset
      intervals.sort((a, b) => a.start - b.start);
      currEntry = 0;
    } else if (intervals[0].end + 1 === intervals[1].start) {
      // next is fließender übergang, so merge that too
      intervals.push({
        start: intervals[0].start,
        end: intervals[1].end,
      });
      intervals.shift();

      // sort again & reset the loop
      intervals.sort((a, b) => a.start - b.start);
      currEntry = 0;
    } else {
      intervals.push({
        start: intervals[0].start,
        end: intervals[0].end,
      });

      intervals.shift();
      // nothing to be merged:
      currEntry++;
    }
  }
  intervals.sort((a, b) => a.start - b.start);
  console.log("result:");
  console.log(intervals.length + " amount of intervals");
  console.log(intervals);
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

  const seeds = data.match(seedRegex)[1].split(" ");
  var seedsAsNums: number[] = [];
  seeds.map((seed) => {
    seedsAsNums.push(Number(seed));
  });

  var intervals: Interval[] = [];

  for (var i = 0; i < seedsAsNums.length; i += 2) {
    intervals.push({
      start: seedsAsNums[i],
      end: seedsAsNums[i] + seedsAsNums[i + 1] - 1,
    });
  }

  intervals.sort((a, b) => a.start - b.start);

  // slice to copy contents, not refereence
  var copy: Interval[] = intervals.slice();

  const lines = data.split("\n");
  // remove first items cuz we already took care of that earlier
  lines.shift();

  lines.map((line) => {
    if (line.match(/[a-z]/)) {
      // line starts with a letter: declares start of new mapping
      // sort bc it gives me a better feeling
      intervals.sort((a, b) => a.start - b.start);
      console.log("mapping for all done!");

      // the merging should not be necessary much but it makes debugging much easier
      mergeAndSort(intervals);

      copy = intervals.slice();
    } else if (line.match(/[0-9]/)) {
      // line is mapping
      const mapping = line.split(" ");

      const dst = Number(mapping[0]);
      const src = Number(mapping[1]);
      const range = Number(mapping[2]);

      // check cases
      for (var currInterval = 0; currInterval < copy.length; currInterval++) {
        // is current mapping relevant for interval?
        // meaning is either start or end in interval?
        const startInRange = isInRange(
          copy[currInterval].start,
          src,
          src + range - 1
        );
        const endInRange = isInRange(
          copy[currInterval].end,
          src,
          src + range - 1
        );
        if (startInRange) {
          // yes it is ! now we gotta handle it

          if (endInRange) {
            // interval fully in current mapping
            intervals[currInterval] = {
              start: dst + (copy[currInterval].start - src),
              end: dst + (copy[currInterval].end - src),
            };
          } else {
            // only start in mapping: need to split!
            // pushing the mapped part
            intervals.push({
              start: copy[currInterval].start + (dst - src),
              end: dst + range - 1,
            });
            // returning the stable part
            intervals[currInterval] = {
              start: src + range,
              end: copy[currInterval].end,
            };
          }
        } else if (endInRange) {
          // it still is! still gotta split it
          // puhsing the split part
          intervals.push({
            start: dst,
            end: copy[currInterval].end + (dst - src),
          });
          // returning the stable part
          intervals[currInterval] = {
            start: copy[currInterval].start,
            end: src - 1,
          };
        } else if (
          isInRange(src, copy[currInterval].start, copy[currInterval].end) &&
          isInRange(
            src + range - 1,
            copy[currInterval].start,
            copy[currInterval].end
          )
        ) {
          // mapping is in interval
          // push first stable
          intervals.push({
            start: copy[currInterval].start,
            end: src - 1,
          });

          // push mapped part
          intervals.push({
            start: dst,
            end: dst + range - 1,
          });

          // leave only second stable behind
          intervals[currInterval] = {
            start: src + range,
            end: copy[currInterval].end,
          };

          // still need to check second stable
          copy.push({
            start: src + range,
            end: copy[currInterval].end,
          });
        }
        // still need to check if theres an interval start in between the range
      }
    }
  });

  // for every seed, go through every line and do all the mappings until location

  mergeAndSort(intervals);
  console.log(intervals);
}

task2();
