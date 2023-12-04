const dotenv = require("dotenv");

dotenv.config();

async function getData(): Promise<string> {
  const res = await fetch("https://adventofcode.com/2023/day/1/input", {
    credentials: "include",
    headers: {
      Cookie: process.env["AOC_TOKEN"], // AOC needs verification to fetch safely
    },
  });

  if (!res.ok) {
    console.error(res.status + " " + res.statusText);
    return null;
  }

  return res.text();
}

async function handleDigits() {
  // prepare data
  const data = await getData();
  if (data) {
    const lines = data.split("\n");

    var sum = 0;

    const digit = new RegExp("([0-9])");

    lines.map((el) => {
      const matchFirst = Array.from(el).filter((char) => char.match(digit))[0];
      const matchLast = Array.from(el)
        .toReversed()
        .filter((char) => char.match(digit))[0];

      // edge case: last line is empty, so to not get a NaN
      // we check that there are proper values in there
      // else we add 0

      var concat = "0";
      if (matchFirst && matchLast) {
        concat = matchFirst + matchLast;
      }

      sum += Number(concat);
    });

    console.log(sum);
    return sum;
  } else {
    return "nope";
  }
}

async function handleText() {
  // prepare data
  const data = await getData();
  if (data) {
    const lines = data.split("\n");

    var sum = 0;

    const digits = [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
    ];

    const digitText = new RegExp(`(?=(${digits.join("|")}|[0-9]))`);

    const digitLast = new RegExp(
      `(?=.*(${digits.join("|")}|[0-9]))` // using positive lookahead (?=...) to catch overlapping ones
      // the .* consumes everything but the last match
    );

    lines.map((el) => {
      if (el !== "") {
        // last line will be an empty line, so be wary

        // get the matches
        const matchFirst = el.match(digitText);
        const matchLast = el.match(digitLast);

        // convert found number to numeric expression
        var resultFirst = digits
          .findIndex((el) => el === matchFirst[1])
          .toString();
        var resultLast = digits
          .findIndex((el) => el === matchLast[1])
          .toString();

        // the match was not a numeric value, so go for the string that was actually found
        if (resultFirst === "-1") {
          resultFirst = matchFirst[1];
        }

        if (resultLast === "-1") {
          resultLast = matchLast[1];
        }

        const concat = resultFirst + resultLast;

        sum += Number(concat);
      }
    });

    console.log(sum);
  } else {
    console.log("no data");
  }
}

// handleDigits();

handleText();
