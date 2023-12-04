import { getData } from "../../lib/data";

export async function task1() {
  const data = await getData("2");
  const lines = data.split("\n");

  // 1 line of data looks like this:
  // game {id}: ({#cubes} {color})+

  // init data i guess
  const colors = {
    red: 0,
    green: 0,
    blue: 0,
  };

  var sum = 0;

  lines.map((game) => {
    if (game !== "") {
      // init data
      const sets = game.split("; ");

      var gameOk = true;
      var id = 0;
      // TODO: refactor cuz a lot of code duplication
      sets.map((set, setIndex) => {
        const tries = set.split(", "); // tries = [ "game 98: n color", "m color" , ... ]
        tries.map((cubes, cubeIndex) => {
          const elements = cubes.split(" "); // elements = [ "game", "id:", "n", "color"] | [ "m", "color"]

          if (setIndex + cubeIndex === 0) {
            id = Number(elements[1].replace(":", ""));
          }
          const number = Number(elements[cubeIndex + setIndex === 0 ? 2 : 0]);
          colors[elements[cubeIndex + setIndex === 0 ? 3 : 1]] += number;
        });

        if (colors.red > 12 || colors.green > 13 || colors.blue > 14) {
          gameOk = false; // entire game is fucked, if those numbers dont align
        }
        // reset object for next set
        colors.red = 0;
        colors.green = 0;
        colors.blue = 0;
      });

      if (gameOk) {
        sum += Number(id);
      }
    }
  });

  console.log(sum);
}

export async function task2() {
  const data = await getData("2");
  const lines = data.split("\n");

  // 1 line of data looks like this:
  // game {id}: ({#cubes} {color})+

  // init data i guess
  const colors = {
    red: 0,
    green: 0,
    blue: 0,
  };

  var sum = 0;

  lines.map((game) => {
    if (game !== "") {
      // init data
      const sets = game.split("; ");

      var gameOk = true;
      var id = 0;

      const minColors = {
        red: 0,
        green: 0,
        blue: 0,
      };

      // TODO: refactor cuz a lot of code duplication
      sets.map((set, setIndex) => {
        const tries = set.split(", "); // tries = [ "game 98: n color", "m color" , ... ]
        tries.map((cubes, cubeIndex) => {
          const elements = cubes.split(" "); // elements = [ "game", "id:", "n", "color"] | [ "m", "color"]

          if (setIndex + cubeIndex === 0) {
            id = Number(elements[1].replace(":", ""));
          }
          const number = Number(elements[cubeIndex + setIndex === 0 ? 2 : 0]);
          colors[elements[cubeIndex + setIndex === 0 ? 3 : 1]] += number;
        });

        // new minimum found?
        Object.keys(colors).map((key) => {
          minColors[key] = Math.max(minColors[key], colors[key]);
        });

        // reset object for next set
        colors.red = 0;
        colors.green = 0;
        colors.blue = 0;
      });

      if (gameOk) {
        sum += minColors.red * minColors.green * minColors.blue;
      }

      // reset colors
      Object.values(minColors).map(() => 0);
    }
  });

  console.log(sum);
}

// task1();

task2();
