import { getData } from "../../lib/data";

export type numberData = {
  value: number;
  startPos: number;
  endPos: number;
};

export const wholeNums = new RegExp(/(\d+|\D+)/);
export const specialChars = new RegExp(/([*#$(\+|\-)&%@/=])/);

function popRegEx(regex: RegExpMatchArray): string {
  return (
    regex.input.slice(0, regex.index) +
    regex.input.slice(regex.index + regex[0].length)
  );
}

function generateKey(line: number, index: number): string {
  return line.toString().padStart(3, "0") + index.toString().padStart(3, "0");
}

function pushAllOccurencesInLine(
  line: string,
  regex: RegExp,
  found: any[],
  specialTrack?: Object,
  currLine?: number
) {
  var match = line.match(regex);

  var lineIndex = 0;

  //   if (match) {
  //     lineIndex = match.index;
  //   }
  while (match) {
    if (!Number.isNaN(Number(match[0]))) {
      // valid number
      found.push({
        value: Number(match[0]),
        startPos: lineIndex,
        endPos: lineIndex + match[0].length - 1,
      });
    } else if (match[0][0] !== ".") {
      // sonderzeichen
      found.push(match.index + lineIndex);
      if (specialTrack && match[0] === "*") {
        const key = generateKey(currLine, match.index + lineIndex);

        // create new gear if necessary
        if (!(key in specialTrack)) {
          specialTrack[key] = [];
        }
      }
    }

    const splitLine = popRegEx(match);
    // update how many characters got removed so that the popped items wont mess up the position
    lineIndex += match[0].length;
    match = splitLine.match(regex);
    // that is done so umständlich bc i didnt know how else to get the position of the match
  }
}

function isInRange(
  toTested: number | undefined,
  lowerBound: number,
  higherBound: number
): boolean {
  if (toTested) {
    return lowerBound <= toTested && toTested <= higherBound;
  } else {
    return false;
  }
}

export async function task1() {
  const data = await getData("3");
  const lines = data.split("\n");

  // every line consists of 140 chars
  // possible special chars: * # $ + & % @
  var sum = 0;

  lines.map((line, index) => {
    if (line !== "") {
      // init data structs

      var lowerSpecials: number[] = [];
      const lowerLine = lines[index - 1];
      var specials: number[] = [];
      var higherSpecials: number[] = [];
      const higherLine = lines[index + 1];

      var foundNums: numberData[] = [];

      pushAllOccurencesInLine(line, wholeNums, foundNums);

      // find all occurences of specials chars and save their positions in the specials Array
      pushAllOccurencesInLine(line, specialChars, specials);

      if (lowerLine) {
        pushAllOccurencesInLine(lowerLine, specialChars, lowerSpecials);
      }

      if (higherLine) {
        pushAllOccurencesInLine(higherLine, specialChars, higherSpecials);
      }

      foundNums.map((number) => {
        // check for every sonderzeichen whether is adjacent to number
        for (
          var i = 0;
          i <
          Math.max(
            lowerSpecials.length,
            specials.length,
            higherSpecials.length
          );
          i++
        ) {
          if (
            isInRange(specials[i], number.startPos - 1, number.endPos + 1) ||
            isInRange(
              lowerSpecials[i],
              number.startPos - 1,
              number.endPos + 1
            ) ||
            isInRange(higherSpecials[i], number.startPos - 1, number.endPos + 1)
          ) {
            // theres a special char within the range
            console.log(number.value);
            sum += number.value;
            break;
          }

          if (
            specials[i] > number.endPos + 1 &&
            lowerSpecials[i] > number.endPos + 1 &&
            higherSpecials[i] > number.endPos + 1
          )
            break; // no need to check for anything outta after the interesting part
          // but gotta get to it first
        }
      });
    }
  });

  console.log(sum);
}

export async function task2() {
  const data = await getData("3");
  const lines = data.split("\n");

  // every line consists of 140 chars
  // possible special chars: * # $ + & % @
  var sum = 0;

  var gears = {}; // save all gears in object to match keys

  lines.map((line, index) => {
    if (line !== "") {
      // init data structs

      var lowerSpecials: number[] = [];
      const lowerLine = lines[index - 1];
      var specials: number[] = [];
      var higherSpecials: number[] = [];
      const higherLine = lines[index + 1];

      var foundNums: numberData[] = [];

      pushAllOccurencesInLine(line, wholeNums, foundNums);

      // find all occurences of specials chars and save their positions in the specials Array
      pushAllOccurencesInLine(line, specialChars, specials, gears, index);

      if (lowerLine) {
        pushAllOccurencesInLine(
          lowerLine,
          specialChars,
          lowerSpecials,
          gears,
          index - 1
        );
      }

      if (higherLine) {
        pushAllOccurencesInLine(
          higherLine,
          specialChars,
          higherSpecials,
          gears,
          index + 1
        );
      }

      foundNums.map((number) => {
        for (
          var i = 0;
          i <
          Math.max(
            lowerSpecials.length,
            specials.length,
            higherSpecials.length
          );
          i++
        ) {
          // this could be refactored to avoid code duplication
          if (isInRange(specials[i], number.startPos - 1, number.endPos + 1)) {
            const key = generateKey(index, specials[i]);
            // checks, that it's a star
            if (gears[key]) {
              // it is, so we'll add the number found
              gears[generateKey(index, specials[i])].push(number.value);
            }
          } else if (
            isInRange(lowerSpecials[i], number.startPos - 1, number.endPos + 1)
          ) {
            const key = generateKey(index - 1, lowerSpecials[i]);
            if (gears[key]) {
              gears[generateKey(index - 1, lowerSpecials[i])].push(
                number.value
              );
            }
          } else if (
            isInRange(higherSpecials[i], number.startPos - 1, number.endPos + 1)
          ) {
            const key = generateKey(index + 1, higherSpecials[i]);
            if (gears[key]) {
              gears[generateKey(index + 1, higherSpecials[i])].push(
                number.value
              );
            }
          }

          if (
            specials[i] > number.endPos + 1 &&
            lowerSpecials[i] > number.endPos + 1 &&
            higherSpecials[i] > number.endPos + 1
          )
            break; // no need to check for anything outta after the interesting part
          // but gotta get to it first
        }
      });
    }
  });

  Object.values(gears).map((value: number[]) => {
    if (value.length === 2) {
      sum += value.reduce(
        (accumulator, currentValue) => accumulator * currentValue
      );
    }
  });

  console.log(sum);
}

// task1()
task2();
