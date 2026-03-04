let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset");
let newGameBtn = document.querySelector("#newGame");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let optionContainer = document.querySelector(".option-container");
let container = document.querySelector(".container");

let turnO = true; // Player O starts
let gameActive = false;
let vsComputer = false;

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// ===== START 2 PLAYER MODE =====
document.querySelector("#twoPlayer").addEventListener("click", () => {
  vsComputer = false;
  optionContainer.classList.add("hide");
  container.classList.remove("hide");
  resetBtn.classList.remove("hide");
  startGame();
});

// ===== START GAME FUNCTION =====
function startGame() {
  turnO = true;
  gameActive = true;

  boxes.forEach((box) => {
    box.innerText = "";
    box.disabled = false;
  });
}

// ===== BOX CLICK =====
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (!gameActive || box.innerText !== "") return;

    if (turnO) {
      box.innerText = "O";
      box.style.color = "orange";
      turnO = false;
    } else {
      box.innerText = "X";
      box.style.color = "blue";
      turnO = true;
    }

    box.disabled = true;
    checkWinner();
    // computrt move
    if (vsComputer && gameActive && !turnO) {
      setTimeout(computerMove, 400);
    }
  });
});

// ===== START VS COMPUTER MODE =====
document.querySelector("#playerComputer").addEventListener("click", () => {
  optionContainer.classList.add("hide");
  container.classList.remove("hide");
  resetBtn.classList.remove("hide");
  vsComputer = true;
  startGame();
});
// ===== FIND WINNING MOVE =====
function findWinningMove(player) {
  for (let pattern of winPatterns) {
    let [pos1, pos2, pos3] = pattern;
    let values = [
      boxes[pos1].innerText,
      boxes[pos2].innerText,
      boxes[pos3].innerText,
    ];
    // Check if two positions are player's and one is empty
    if (
      values.filter((val) => val === player).length === 2 &&
      values.includes("")
    ) {
      let emptyIndex = pattern[values.indexOf("")];
      return boxes[emptyIndex];
    }
  }
  return null;
}

// ===== COMPUTER MOVE =====
function computerMove() {
  // computer tries to win
  let move = findWinningMove("X");
  if (move !== null) {
    placeComputerMove(move);
    return;
  }
  // computer tries to block O
  move = findWinningMove("O");
  if (move !== null) {
    placeComputerMove(move);
    return;
  }
  // random move
  let availableMoves = [...boxes].filter((box) => box.innerText === "");
  if (availableMoves.length === 0) return;
  let randomBox =
    availableMoves[Math.floor(Math.random() * availableMoves.length)];
  placeComputerMove(randomBox);
}
// ===== PLACE COMPUTER MOVE =====
function placeComputerMove(box) {
  box.innerText = "X";
  box.style.color = "blue";
  box.disabled = true;
  turnO = true;

  checkWinner();
}

// ===== CHECK WINNER =====
function checkWinner() {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val !== "" && pos1Val === pos2Val && pos2Val === pos3Val) {
      showWinner(pos1Val);
      return;
    }
  }

  // Draw
  if ([...boxes].every((box) => box.innerText !== "")) {
    showWinner("Draw");
  }
}

// ===== SHOW WINNER =====
function showWinner(winner) {
  gameActive = false;
  container.classList.add("hide");
  resetBtn.classList.add("hide");
  msgContainer.classList.remove("hide");

  if (winner === "Draw") {
    msg.innerText = "It's a Draw!";
    msg.style.color = "#ff9f1c";
  } else {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msg.style.color = winner === "O" ? "orange" : "blue";
  }
}

// ===== NEW GAME BUTTON =====
newGameBtn.addEventListener("click", () => {
  msgContainer.classList.add("hide");
  optionContainer.classList.remove("hide");
});

// ===== RESET BUTTON =====
resetBtn.addEventListener("click", startGame);
// ===== DARK MODE TOGGLE =====
const toggleBtn = document.getElementById("theme-toggle");

//====== Load saved theme ======
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggleBtn.textContent = "☀️";
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    toggleBtn.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    toggleBtn.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
});
