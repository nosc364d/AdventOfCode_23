import { getData } from "../../lib/data";

export async function part1() {
  const data = await getData("4");
  const lines = data.split("\n");

  var points = 0;

  lines.map((card) => {
    if (card === "") return;

    const split = card.split("|");
    var winningNums = split[0].split(" ");

    // remove "card" & card id:
    winningNums.shift();
    winningNums.shift();

    // remove whitespaces
    winningNums = winningNums.filter((el) => el !== "");

    // get your nums
    var yourNums = split[1].split(" ");

    // remove whitespaces
    yourNums = yourNums.filter((el) => el !== "");

    var numOfWins = 0;
    yourNums.map((number) => {
      if (winningNums.includes(number)) numOfWins++;
    });

    if (numOfWins > 0) points += Math.pow(2, numOfWins - 1);
  });

  console.log(points);
}

part1();
