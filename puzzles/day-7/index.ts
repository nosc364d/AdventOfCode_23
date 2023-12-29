import { getData } from "../../lib/data";

function sortForElements(a: number[], b: number[]): number {
  for (var i = 0; i < 5; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
}

export async function task1() {
  const data = await getData("7");
  const testdata = "32T3K 765\nT55J5 684\nKK677 28\nKTJJT 220\nQQQJA 483";

  const mapping = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    T: 10,
  };

  const lines = data.split("\n");

  const kindsOfHands = {
    five_of_kind: [],
    four_of_kind: [],
    full_house: [],
    three_of_kind: [],
    two_pair: [],
    one_pair: [],
    high_card: [],
  };

  let numOfHands = lines.length;
  let result = 0;

  lines.map((line) => {
    const occurences = {};
    const handAndBet = line.split(" "); // will remain stored here
    const hand = handAndBet[0].split("");

    let handWithNums = [];

    hand.map((char) => {
      if (occurences[char]) {
        occurences[char]++;
      } else occurences[char] = 1;

      if (mapping[char]) {
        handWithNums.push(mapping[char]);
      } else {
        handWithNums.push(Number(char));
      }
    });

    handWithNums.push(handAndBet[1]);

    if (Object.keys(occurences).length === 5) {
      // can only be 5 distinct charas
      kindsOfHands.high_card.push(handWithNums);
    } else if (Object.keys(occurences).length === 4) {
      // only 1 can be a pair
      kindsOfHands.one_pair.push(handWithNums);
    } else if (Object.keys(occurences).length === 3) {
      // can be two pair or three of a kind
      if (Object.values(occurences).includes(3)) {
        kindsOfHands.three_of_kind.push(handWithNums);
      } else {
        kindsOfHands.two_pair.push(handWithNums);
      }
    } else if (Object.keys(occurences).length === 2) {
      if (Object.values(occurences).includes(4)) {
        kindsOfHands.four_of_kind.push(handWithNums);
      } else {
        kindsOfHands.full_house.push(handWithNums);
      }
    } else if (Object.keys(occurences).length === 1) {
      kindsOfHands.five_of_kind.push(handWithNums);
    }
  });

  // sort object
  Object.values(kindsOfHands).map((listOfHands) => {
    listOfHands.sort((a, b) => sortForElements(a, b));
  });

  var rank = 1;
  const listOfHands = Object.values(kindsOfHands);
  console.log(Object.values(kindsOfHands));

  // make all arrays into 1 and map
  for (var i = 6; i >= 0; i--) {
    // go through every kind, starting with last
    if (listOfHands[i].length > 0) {
      listOfHands[i].map((hand) => {
        result += rank * Number(hand[5]);
        rank++;
      });
    }
  }

  console.log(result);
}

task1();
