const wordList = [
  { word: "python", hint: "A popular programming language " },
  { word: "hangman", hint: "Classic word-guessing game" },
  { word: "javascript", hint: "Language of the web " },
  { word: "engineer", hint: "Problem solver with tools and code " },
  { word: "console", hint: "Where devs log things..." },
  { word: "variable", hint: "A container that stores values in code" },
  { word: "laptop", hint: "Dev's favorite machine " },
  { word: "project", hint: "A bundle of files and dreams " }
];

let selectedWord = "";
let displayedWord = [];
let wrongGuesses = [];
let maxAttempts = 6;
let remainingAttempts = maxAttempts;

const wordDisplay = document.getElementById("wordDisplay");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");
const wrongLetters = document.getElementById("wrongLetters");
const attempts = document.getElementById("attempts");

function startGame() {
    const chosen = wordList[Math.floor(Math.random() * wordList.length)];
    selectedWord = chosen.word;
    document.getElementById("hintBox").textContent = chosen.hint;

    displayedWord = Array(selectedWord.length).fill("_");
    wrongGuesses = [];
    remainingAttempts = maxAttempts;
    message.textContent = "";
    updateDisplay();
    createKeyboard();
    drawHangman(maxAttempts - remainingAttempts);
}


const canvas = document.getElementById("hangmanCanvas");
const ctx = canvas.getContext("2d");

function drawAnimatedLine(x1, y1, x2, y2, duration = 300) {
  const startTime = performance.now();

  function drawFrame(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const currentX = x1 + (x2 - x1) * progress;
    const currentY = y1 + (y2 - y1) * progress;

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    if (progress < 1) {
      requestAnimationFrame(drawFrame);
    }
  }

  requestAnimationFrame(drawFrame);
}

function drawAnimatedCircle(cx, cy, r, duration = 300) {
  const startTime = performance.now();

  function drawFrame(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const endAngle = Math.PI * 2 * progress;

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, endAngle);
    ctx.stroke();

    if (progress < 1) {
      requestAnimationFrame(drawFrame);
    }
  }

  requestAnimationFrame(drawFrame);
}

function drawHangman(stage) {
  switch (stage) {
    case 0:
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      break;
    case 1:
      drawAnimatedLine(10, 230, 190, 230); // base
      break;
    case 2:
      drawAnimatedLine(50, 230, 50, 20);   // vertical
      setTimeout(() => drawAnimatedLine(50, 20, 150, 20), 300);   // top
      setTimeout(() => drawAnimatedLine(150, 20, 150, 40), 600);  // short drop
      break;
    case 3:
      drawAnimatedCircle(150, 60, 20);     // head
      break;
    case 4:
      drawAnimatedLine(150, 80, 150, 140); // body
      break;
    case 5:
      drawAnimatedLine(150, 100, 130, 120); // left arm
      setTimeout(() => drawAnimatedLine(150, 100, 170, 120), 300); // right arm
      break;
    case 6:
      drawAnimatedLine(150, 140, 130, 180); // left leg
      setTimeout(() => drawAnimatedLine(150, 140, 170, 180), 300); // right leg
      break;
  }
}

function createKeyboard() {
  keyboard.innerHTML = "";
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i).toLowerCase();
    const button = document.createElement("button");
    button.textContent = letter;
    button.onclick = () => guessLetter(letter);
    keyboard.appendChild(button);
    }
}

function guessLetter(letter) {
    if (displayedWord.includes(letter) || wrongGuesses.includes(letter)) return;

    if (selectedWord.includes(letter)) {
        selectedWord.split("").forEach((char, index) => {
          if (char === letter) displayedWord[index] = letter;
        });
    } else {
        wrongGuesses.push(letter);
        remainingAttempts--;
    }

    updateDisplay();
    checkGameStatus();
}

function updateDisplay() {
  wordDisplay.textContent = displayedWord.join(" ");
  wrongLetters.textContent = wrongGuesses.join(", ");
  attempts.textContent = remainingAttempts;
  drawHangman(maxAttempts - remainingAttempts);
}

function checkGameStatus() {
  if (!displayedWord.includes("_")) {
    message.textContent = "🎉 You won!";
    disableKeyboard();
  } else if (remainingAttempts <= 0) {
    message.textContent = `💀 You lost! The word was: ${selectedWord}`;
    wordDisplay.textContent = selectedWord.split("").join(" ");
    disableKeyboard();
  }
}

function disableKeyboard() {
  const buttons = keyboard.querySelectorAll("button");
  buttons.forEach(btn => btn.disabled = true);
}

startGame();