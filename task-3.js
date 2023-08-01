const crypto = require("crypto");

// Class for key generation and HMAC calculation
class HmacCalculator {
  constructor() {
    this.key = crypto.randomBytes(32); // 256-bit key (32 bytes)
  }

  calculateHmac(move) {
    const hmac = crypto.createHmac("sha256", this.key);
    hmac.update(move);
    return hmac.digest("hex");
  }
}

// Class for rule determination
class RuleDeterminer {
  constructor(moves) {
    this.moves = moves;
  }

  determineWinner(userMove, computerMove) {
    const halfMoves = Math.floor(this.moves.length / 2);
    const userIndex = this.moves.indexOf(userMove);
    const computerIndex = this.moves.indexOf(computerMove);

    if (userIndex === computerIndex) {
      return "Draw";
    } else if (
      (userIndex - computerIndex + this.moves.length) % this.moves.length <=
      halfMoves
    ) {
      return "You Win";
    } else {
      return "Computer Wins";
    }
  }
}

// Class for table generation
class TableGenerator {
  constructor(moves) {
    this.moves = moves;
  }

  generateTable() {
    const table = [...Array(this.moves.length + 1)].map(() =>
      Array(this.moves.length + 1)
    );

    for (let i = 0; i <= this.moves.length; i++) {
      for (let j = 0; j <= this.moves.length; j++) {
        if (i === 0 && j === 0) {
          table[i][j] = "Vs.";
        } else if (i === 0) {
          table[i][j] = this.moves[j - 1];
        } else if (j === 0) {
          table[i][j] = this.moves[i - 1];
        } else {
          table[i][j] = this.getWinLoseDraw(
            this.moves[i - 1],
            this.moves[j - 1]
          );
        }
      }
    }

    return table;
  }

  getWinLoseDraw(move1, move2) {
    const halfMoves = Math.floor(this.moves.length / 2);
    const move1Index = this.moves.indexOf(move1);
    const move2Index = this.moves.indexOf(move2);

    if (move1Index === move2Index) {
      return "Draw";
    } else if (
      (move1Index - move2Index + this.moves.length) % this.moves.length <=
      halfMoves
    ) {
      return "Win";
    } else {
      return "Lose";
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  const moves = args.map((arg) => arg.trim());

  if (
    moves.length < 3 ||
    moves.length % 2 === 0 ||
    new Set(moves).size !== moves.length
  ) {
    console.error(
      "Error: Please provide an odd number >= 3 of non-repeating moves."
    );
    console.error("Example: node game.js Rock Paper Scissors");
    return;
  }

  const hmacCalculator = new HmacCalculator();
  const ruleDeterminer = new RuleDeterminer(moves);
  const tableGenerator = new TableGenerator(moves);
  const computerMove = moves[Math.floor(Math.random() * moves.length)];

  console.log("Computer's HMAC:", hmacCalculator.calculateHmac(computerMove));

  const table = tableGenerator.generateTable();
  console.log("Moves Table:");
  for (const row of table) {
    console.log(row.join("\t"));
  }

  console.log("Menu:");
  moves.forEach((move, index) => {
    console.log(`${index + 1} - ${move}`);
  });
  console.log("0 - Exit");

  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.question("Your choice (enter the number): ", (answer) => {
    readline.close();
    const choice = parseInt(answer, 10);
    if (isNaN(choice) || choice < 0 || choice > moves.length) {
      console.error(
        "Error: Invalid input. Please enter a valid number from the menu."
      );
      return;
    }

    if (choice === 0) {
      console.log("Goodbye!");
      return;
    }

    const userMove = moves[choice - 1];
    const result = ruleDeterminer.determineWinner(userMove, computerMove);

    console.log("Your move:", userMove);
    console.log("Computer's move:", computerMove);
    console.log("Result:", result);
    console.log("HMAC key:", hmacCalculator.key.toString("hex"));
  });
}

main();

