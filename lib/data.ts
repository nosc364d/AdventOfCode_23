import dotenv from "dotenv";

dotenv.config();

export async function getData(day: string): Promise<string> {
  const res = await fetch(`https://adventofcode.com/2023/day/${day}/input`, {
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
