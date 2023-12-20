import { getData } from "../../lib/data";

export async function task1() {
  const data = await getData("6");

  const testdata = "Time:      7  15   30 \nDistance:  9  40  200";
  const lines = data.split("\n");
  let times = lines[0].split(" ");
  let records = lines[1].split(" ");

  // filter whitespaces
  times = times.filter((el) => el !== "");
  records = records.filter((el) => el !== "");

  // remove "label:"
  times.shift();
  records.shift();

  let result = 0;
  for (let i = 0; i < times.length; i++) {
    // go through every round
    let winsThisRound = 0;
    const thisRecord = Number(records[i]);
    for (let j = 0; j < Number(times[i]); j++) {
      if (j * (Number(times[i]) - j) > thisRecord) winsThisRound++;
    }
    if (result === 0) {
      result = winsThisRound;
    } else {
      result *= winsThisRound;
    }
  }
  console.log(result);
}

export async function task2() {
  const data = await getData("6");

  const testdata = "Time:      7  15   30 \nDistance:  9  40  200";
  const lines = data.split("\n");
  let times = lines[0].split(" ");
  let records = lines[1].split(" ");

  // filter whitespaces
  times = times.filter((el) => el !== "");
  records = records.filter((el) => el !== "");

  // remove "label:"
  times.shift();
  records.shift();

  // join together
  const timenum = Number(times.join(""));
  const record = Number(records.join(""));

  let result = 0;
  for (let j = 0; j < timenum; j++) {
    if (j * (timenum - j) > record) result++;
  }
  console.log(result);
}

task2();
