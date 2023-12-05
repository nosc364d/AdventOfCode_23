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

function pushAllOccurencesInLine(line: string, regex: RegExp, found: any[]) {
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
      found.push(match.index + lineIndex);
    }

    const splitLine = popRegEx(match);
    lineIndex += match[0].length;
    match = splitLine.match(regex);
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

      console.log(lowerSpecials);
      console.log(specials);
      console.log(higherSpecials);
      console.log(foundNums);

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

      // now got a list of possible special positions
    }
  });

  console.log(sum);
}

task1();
