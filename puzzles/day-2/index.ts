import { getData } from "../../lib/data";

export async function task1() {
  const data = await getData("2");
  const lines = data.split("\n");

  // 1 line of data looks like this:
  // game {id}: ({#cubes} {color})+

  const digit = new RegExp("([0-9])"); // like this it will just get the first match -> great for gettign the IDs

  lines.map((line) => {
    if (line !== "") {
      const id = digit.exec(line)[0];
    }
  });

  console.log(digit.exec(lines[0]));
}

task1();
