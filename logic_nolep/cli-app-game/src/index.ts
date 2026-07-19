import * as readline from "node:readline";
import * as fs from "node:fs/promises";
import chalk from "chalk";
import { stdin, stdout } from "node:process";
import path from "node:path";

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

interface User {
  username: string;
  password: string;
  highestScore: number;
}

let users: User[] = [];
let currentUser: User | null = null;
const filePath = path.resolve("src", "db", "users.json");

async function loadUsers() {
  try {
    const data = await fs.readFile(filePath, "utf8");
    users = JSON.parse(data);
  } catch (e) {
    console.error("Tidak ada file users.json. Akan dibuat file baru.");
  }
}

async function saveUsers() {
  await fs.writeFile(filePath, JSON.stringify(users, null, 2));
}

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function startMenu() {
  console.log(chalk.yellow("\n--- Guessing Number ---"));
  console.log("1. Login");
  console.log("2. Register");
  console.log("3. Keluar");
  const choice = await question(chalk.blue("Pilih opsi: "));

  switch (choice) {
    case "1":
      await login();
      break;
    case "2":
      await register();
      break;
    case "3":
      rl.close();
      console.log(chalk.green("GoodBye!"));
      break;
    default:
      console.log(chalk.red("Invalid. Choose (1-3)"));
      return startMenu();
  }
}

async function register() {
  console.log(chalk.yellow("\n--- Register ---"));
  const username = await question("Username: ");
  const password = await question("Password: ");

  const isUserExist = users.find((u) => u.username === username);
  if (isUserExist) {
    console.log(chalk.red("Username already exists"));
    return startMenu();
  } else {
    users.push({
      username,
      password,
      highestScore: 0,
    });
    await saveUsers();
    console.log(chalk.green(`Register success. Welcome ${username}`));
    return startMenu();
  }
}

async function login() {
  console.log(chalk.yellow("\n--- Login ---"));
  const username = await question("Username: ");
  const password = await question("Password: ");

  const isMatch = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (!isMatch) {
    console.log(chalk.red("Wrong username or password"));
    return startMenu();
  } else {
    currentUser = isMatch;
    console.log(chalk.green(`Login success. Hello ${username}`));
    return mainMenu();
  }
}

async function mainMenu() {
  console.log(chalk.yellow("\n--- Main Menu ---"));
  console.log("1. Mulai Game");
  console.log("2. Lihat Papan Skor");
  console.log("3. Logout");
  const choice = await question(chalk.blue("Pilih opsi: "));

  switch (choice) {
    case "1":
      await playGame();
      break;
    case "2":
      await showLeaderBoard();
      break;
    case "3":
      currentUser = null;
      console.log(chalk.green("Logout success"));
      return startMenu();
    default:
      console.log(chalk.red("Invalid. Choose (1-3)"));
      return mainMenu();
  }
}

async function playGame() {
  if (!currentUser) {
    console.log(chalk.red("Anda harus login terlebih dahulu"));
    return startMenu();
  }
  const user = currentUser;

  console.log(chalk.yellow("\n--- Tebak Angka ---"));
  console.log("Tebak angka antara 1 dan 100");

  const randomNum = Math.floor(Math.random() * 100) + 1;
  let attempts = 0;

  async function makeGuess() {
    const guessNum = await question("Tebakan Anda: ");
    const num = Number(guessNum);

    if (Number.isNaN(num) || num < 1 || num > 100) {
      console.log(chalk.red("Masukkan angka antara 1 dan 100"));
      return makeGuess();
    }

    attempts++;

    if (num < randomNum) {
      console.log(chalk.red("Terlalu rendah!"));
      return makeGuess();
    } else if (num > randomNum) {
      console.log(chalk.red("Terlalu tinggi!"));
      return makeGuess();
    } else {
      console.log(
        chalk.green(
          `Selamat! Anda menebak dengan benar dalam ${attempts} percobaan`,
        ),
      );
      if (user.highestScore === 0 || attempts < user.highestScore) {
        console.log(chalk.green("Ini adalah skor tertinggi baru Anda!"));
        user.highestScore = attempts;
        await saveUsers();
      }
      return mainMenu();
    }
  }
  return makeGuess();
}

async function showLeaderBoard() {
  console.log(chalk.yellow("\n--- Papan Skor Top (10) ---"));

  const topScores = users
    .filter((u) => u.highestScore > 0)
    .sort((a, b) => a.highestScore - b.highestScore)
    .slice(0, 10);

  if (topScores.length === 0) {
    console.log(chalk.gray("Belum ada skor yang tercatat."));
  } else {
    topScores.forEach((u, i) => {
      console.log(`${i + 1}. ${u.username}: ${u.highestScore} percobaan`);
    });
  }
  return mainMenu();
}

async function main() {
  await loadUsers();
  startMenu();
}

main();
