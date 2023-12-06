import { getData } from "../../lib/data";

function keyOf(id: number) {
  return id.toString().padStart(3, "0");
}

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

type Card = {
  count: number;
  numOfWins: number;
};

export async function part2() {
  const data = await getData("4");
  //   const data =
  //     "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53\nCard 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19\nCard 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1\nCard 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83\nCard 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36\nCard 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11";
  const lines = data.split("\n");

  lines.pop();

  const cards = {};

  lines.map((card) => {
    if (card === "") return;

    var numOfWinsCard = 0;
    // handle first Element of cards
    const split = card.split("|");

    // get winning numbers +  id
    var winningNums = split[0].split(" ");
    // remove whitespaces
    winningNums = winningNums.filter((el) => el !== "");

    // remove "card"
    winningNums.shift();

    // get id
    var currentId = winningNums[0].split("");
    // remove ':'
    currentId.pop();
    const id = Number(currentId.join(""));

    // remove id from winningNums
    winningNums.shift();

    // get your nums
    var yourNums = split[1].split(" ");
    // remove whitespaces
    yourNums = yourNums.filter((el) => el !== "");

    yourNums.map((number) => {
      if (winningNums.includes(number)) numOfWinsCard++;
    });

    cards[keyOf(id)] = {
      key: id,
      count: 1,
      numOfWins: numOfWinsCard,
    };
  });

  // go through all the cards
  for (var i = 1; i < Object.keys(cards).length; i++) {
    // for each found matches

    for (var win = 1; win <= cards[keyOf(i)].numOfWins; win++) {
      cards[keyOf(cards[keyOf(i)].key + win)].count =
        cards[keyOf(cards[keyOf(i)].key + win)].count + cards[keyOf(i)].count;
    }
  }

  var sum = 0;
  Object.values(cards).map((el: Card) => {
    sum += el.count;
  });
  console.log(sum);
}

part2();
